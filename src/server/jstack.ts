import { getDb } from "@/lib/prisma";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { InferMiddlewareOutput, jstack } from "jstack";
import {
  RESTGetAPIOAuth2CurrentAuthorizationResult,
  RESTGetAPIUserResult,
} from "discord-api-types/v10";
import { loadStripe } from "@/lib/stripe";
import { getWorkerAuth } from "@/lib/betterAuth/workers";

export interface Env {
  Bindings: {
    DATABASE_URL: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    // Removed Clerk keys after migration
    DISCORD_BOT_TOKEN: string;
    CLEO_API_KEY: string;
    CLEO_KV: KVNamespace;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
    BETTER_AUTH_SECRET: string;
    NEXT_PUBLIC_SITE_URL: string;
    COOKIE_DOMAIN: string;
  };
}

export const j = jstack.init<Env>();

const baseMiddleware = j.middleware(async ({ c, next }) => {
  const { DATABASE_URL, CLEO_KV, STRIPE_SECRET_KEY } = env(c);

  const db = getDb(DATABASE_URL);
  const stripe = loadStripe({ secretKey: STRIPE_SECRET_KEY });

  return await next({ db, kv: CLEO_KV, stripe });
});

// Authentication middleware using Better Auth.
// Extracts the session from headers (supports cookie or Authorization bearer) and
// attaches { auth, session, authUser } to the context.
const authMiddleware = j.middleware(async ({ c, next }) => {
  const auth = getWorkerAuth(c);
  // Use Better Auth helper to read session from the incoming request headers.
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized: No valid session" });
  }

  return next({ auth, session, authUser: session.user });
});

const botMiddleware = j.middleware(async ({ c, ctx, next }) => {
  const { CLEO_API_KEY, DISCORD_BOT_TOKEN } = env(c);
  const { db } = ctx as InferMiddlewareOutput<typeof baseMiddleware>;
  const authorizationHeader = c.req.header("Authorization");
  const discordId = c.req.header("X-Discord-ID");

  if (!authorizationHeader) {
    throw new HTTPException(401, {
      message: "Unauthorized: No authorization header",
    });
  }

  const apiKey = authorizationHeader.replace("Bearer ", "");

  if (!apiKey || apiKey !== CLEO_API_KEY) {
    throw new HTTPException(401, {
      message: "Unauthorized: Missing or invalid API Key",
    });
  }

  if (!discordId) {
    throw new HTTPException(400, {
      message: "Missing discord id header",
    });
  }

  let user = await db.users.findUnique({
    where: { discordId },
    include: { limits: true, premiumSubscriptions: true },
  });

  if (!user) {
    const discordUser = (await (
      await fetch("https://discord.com/api/v10/users/" + discordId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + DISCORD_BOT_TOKEN,
        },
      })
    ).json()) as RESTGetAPIUserResult;

    user = await db.users.create({
      data: {
        discordId,
        username: discordUser.username,
        limits: {
          create: {
            date: new Date(),
          },
        },
      },
      include: {
        limits: true,
        premiumSubscriptions: true,
      },
    });
  }

  return await next({ user });
});

// Dashboard middleware: maps Better Auth user -> internal Users record and builds discord access token.
// Users.extId always stores Better Auth user.id (set at provisioning/claim time).
const dashMiddleware = j.middleware(async ({ ctx, next }) => {
  const { db, session, auth } = ctx as InferMiddlewareOutput<
    typeof baseMiddleware
  > & {
    session: any;
    auth: ReturnType<typeof getWorkerAuth>;
  };

  const authUserId: string = session.user.id;

  // Find the internal app user via extId (Better Auth user id)
  const appUser = await db.users.findFirst({ where: { extId: authUserId } });
  if (!appUser) {
    throw new HTTPException(401, {
      message: "Unauthorized: App user not provisioned",
    });
  }

  // Retrieve the Discord account from Better Auth Account table
  // providerId for our discord provider is typically "discord"
  const discordAccount = await db.account.findFirst({
    where: { userId: authUserId, providerId: "discord" },
  });

  if (!discordAccount || !discordAccount.accessToken) {
    throw new HTTPException(401, {
      message: "Unauthorized: Missing Discord linkage",
    });
  }

  const accessToken = discordAccount.accessToken;

  // Optionally verify the token still yields discord user id
  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new HTTPException(401, {
      message: "Unauthorized: Discord token invalid",
    });
  }

  const discordUser = (await response.json()) as RESTGetAPIUserResult;
  const discordId = discordUser.id;

  if (!discordId || appUser.discordId !== discordId) {
    // Optionally auto-sync discordId if missing on app user
    if (!appUser.discordId && discordId) {
      await db.users.update({ where: { id: appUser.id }, data: { discordId } });
    } else {
      throw new HTTPException(401, {
        message: "Unauthorized: Discord ID mismatch",
      });
    }
  }

  return next({ user: appUser, accessToken });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(baseMiddleware);

/**
 * Auth (semi-authenticated) procedures
 * Base for attaching session/auth objects when full user resolution isn't required.
 */
export const authProcedure = publicProcedure.use(authMiddleware);

/**
 * Discord bot procedures
 *
 * These are used only by the Cleo discord bot and pre-load a user object including limits to the request for faster processing
 */
export const botProcedure = publicProcedure.use(botMiddleware);

/**
 * Authenticated procedures
 *
 * This is used as the method to accurately link the request to a user record in the database.
 */
export const dashProcedure = authProcedure.use(dashMiddleware);
