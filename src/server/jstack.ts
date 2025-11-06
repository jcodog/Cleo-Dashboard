import { getDb } from "@/lib/prisma";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { InferMiddlewareOutput, jstack } from "jstack";
import { RESTGetAPIUserResult } from "discord-api-types/v10";
import { loadStripe } from "@/lib/stripe";
import { getWorkerAuth } from "@/lib/betterAuth/workers";
import { getDiscordAccessToken } from "@/lib/betterAuth/discordToken";

export interface Env {
  Bindings: {
    DATABASE_URL: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_BOT_TOKEN: string;
    CLEO_API_KEY: string;
    CLEO_KV: KVNamespace;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
    BETTER_AUTH_SECRET: string;
    NEXT_PUBLIC_SITE_URL: string;
    COOKIE_DOMAIN: string;
    KICK_CLIENT_ID: string;
    KICK_CLIENT_SECRET: string;
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
    cacheStrategy: {
      ttl: 60,
    },
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
const dashMiddleware = j.middleware(async ({ c, ctx, next }) => {
  const { db, session } = ctx as InferMiddlewareOutput<typeof baseMiddleware> &
    InferMiddlewareOutput<typeof authMiddleware>;

  const authUserId: string | undefined = session?.user?.id;
  if (!authUserId) {
    throw new HTTPException(401, {
      message: "Unauthorized: No valid session user id",
    });
  }

  // Find / ensure domain user. If missing attempt claim or creation.
  let appUser = await db.users.findFirst({ where: { extId: authUserId } });
  if (!appUser) {
    try {
      const discordAccount = await db.account.findFirst({
        where: { userId: authUserId, providerId: "discord" },
        cacheStrategy: {
          ttl: 60,
        },
      });
      if (discordAccount?.accountId) {
        // Attempt claim: existing user with same discordId from pre-migration
        const legacy = await db.users.findUnique({
          where: { discordId: discordAccount.accountId },
        });
        if (legacy) {
          appUser = await db.users.update({
            where: { id: legacy.id },
            data: { extId: authUserId },
          });
        } else {
          // Create fresh domain user (late provisioning scenario)
          appUser = await db.users.create({
            data: {
              extId: authUserId,
              username: `user_${authUserId.slice(0, 6)}`,
              email: session.user.email,
              discordId: discordAccount.accountId || `pending-${authUserId}`,
              limits: { create: { date: new Date() } },
            },
          });
        }
      }
    } catch (e: unknown) {
      const message =
        typeof e === "object" && e && "message" in e
          ? String((e as { message?: unknown }).message)
          : "claim/create failure";
      console.error("[dashMiddleware] claim/create failure", {
        authUserId,
        error: message,
      });
    }
  }
  if (!appUser) {
    console.error("[dashMiddleware] unauthorized: domain user still missing", {
      authUserId,
    });
    throw new HTTPException(401, {
      message: "Unauthorized: App user not provisioned",
    });
  }

  // Always obtain a (possibly refreshed) Discord access token using helper to avoid stale/expired tokens
  let accessToken: string;
  try {
    accessToken = await getDiscordAccessToken({
      db,
      userId: authUserId,
      clientId: env(c).DISCORD_CLIENT_ID || "",
      clientSecret: env(c).DISCORD_CLIENT_SECRET || "",
    });
  } catch (e: unknown) {
    // Fallback to legacy accessToken field if helper failed (e.g. missing refresh token yet)
    const discordAccount = await db.account.findFirst({
      where: { userId: authUserId, providerId: "discord" },
      cacheStrategy: {
        ttl: 60,
      },
    });
    if (!discordAccount?.accessToken) {
      console.error("[dashMiddleware] missing discord linkage", {
        authUserId,
        error:
          typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message)
            : undefined,
      });
      throw new HTTPException(401, {
        message: `Unauthorized: Missing Discord linkage (${
          typeof e === "object" && e && "message" in e
            ? (e as { message?: unknown }).message || "no token"
            : "no token"
        })`,
      });
    }
    accessToken = discordAccount.accessToken;
  }

  // Validate/derive discord user id
  const meRes = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!meRes.ok) {
    console.error("[dashMiddleware] discord /users/@me failed", {
      authUserId,
      status: meRes.status,
    });
    throw new HTTPException(401, {
      message: "Unauthorized: Discord token invalid",
    });
  }
  const discordUser = (await meRes.json()) as RESTGetAPIUserResult;
  const discordId = discordUser?.id;
  if (!discordId) {
    console.error("[dashMiddleware] missing discord id in /me", { authUserId });
    throw new HTTPException(401, {
      message: "Unauthorized: Could not resolve Discord ID",
    });
  }

  // Auto-heal: if appUser.discordId is a provisional value (starts with 'pending-') or mismatched but empty, sync it.
  const needsDiscordSync =
    (appUser.discordId?.startsWith("pending-") ?? false) ||
    appUser.discordId !== discordId;

  if (needsDiscordSync) {
    try {
      appUser = await db.users.update({
        where: { id: appUser.id },
        data: { discordId },
      });
    } catch (err) {
      // Only throw if still mismatched after attempted sync (avoid noisy failures on concurrency)
      const refreshed = await db.users.findUnique({
        where: { id: appUser.id },
        cacheStrategy: {
          ttl: 60,
        },
      });
      if (!refreshed || refreshed.discordId !== discordId) {
        console.error("[dashMiddleware] discord id sync error", err);
        console.error("[dashMiddleware] discord id mismatch after sync", {
          authUserId,
          dbDiscordId: refreshed?.discordId,
          apiDiscordId: discordId,
        });
        throw new HTTPException(401, {
          message: "Unauthorized: Discord ID mismatch",
        });
      } else {
        appUser = refreshed;
      }
    }
  }

  return next({ user: appUser, accessToken });
});

const kickMiddleware = j.middleware(async ({ c, ctx, next }) => {
  const { db, session } = ctx as InferMiddlewareOutput<typeof baseMiddleware> &
    InferMiddlewareOutput<typeof authMiddleware>;

  const account = await db.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "kick",
    },
  });

  if (!account) {
    throw new HTTPException(401, {
      message: "Unauthorized: No auth user account for kick",
    });
  }

  if (!account.accessToken) {
    throw new HTTPException(401, {
      message: "Unauthorized: Kick access token missing",
    });
  }

  return next({
    accessToken: account.accessToken,
    accountId: account.accountId ?? null,
  });
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

export const kickProcedure = authProcedure.use(kickMiddleware);
