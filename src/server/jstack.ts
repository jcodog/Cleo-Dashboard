import { getDb } from "@/lib/prisma";
import { env } from "hono/adapter";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { InferMiddlewareOutput, jstack } from "jstack";
import { createClerkClient, verifyToken } from "@clerk/backend";
import {
	RESTGetAPIOAuth2CurrentAuthorizationResult,
	RESTGetAPIUserResult,
} from "discord-api-types/v10";
import { loadStripe } from "@/lib/stripe";

interface Env {
	Bindings: {
		DATABASE_URL: string;
		CLERK_SECRET_KEY: string;
		CLERK_PUBLISHABLE_KEY: string;
		CLERK_JWT_KEY: string;
		DISCORD_BOT_TOKEN: string;
		CLEO_API_KEY: string;
		CLEO_KV: KVNamespace;
		STRIPE_PUBLIC_KEY: string;
		STRIPE_SECRET_KEY: string;
	};
}

export const j = jstack.init<Env>();

const baseMiddleware = j.middleware(async ({ c, next }) => {
	const { DATABASE_URL, CLEO_KV, STRIPE_SECRET_KEY } = env(c);

	const db = getDb(DATABASE_URL);
	const stripe = loadStripe({ secretKey: STRIPE_SECRET_KEY });

	return await next({ db, kv: CLEO_KV, stripe });
});

const clerkMiddleware = j.middleware(async ({ c, next }) => {
	const { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, CLERK_JWT_KEY } = env(c);
	const cookies = getCookie(c);
	const sessionCookie = cookies["__session"];
	const authorizationHeader = c.req.header("Authorization");

	let token = "";

	if (!sessionCookie) {
		if (
			!authorizationHeader ||
			!authorizationHeader.startsWith("Bearer ")
		) {
			throw new HTTPException(401, {
				message:
					"Unauthorized: No session cookie and missing or invalid authorization header.",
			});
		}

		token = authorizationHeader.replace("Bearer ", "");
	} else {
		token = sessionCookie;
	}

	const client = createClerkClient({
		secretKey: CLERK_SECRET_KEY,
		publishableKey: CLERK_PUBLISHABLE_KEY,
	});

	if (!token || token === "") {
		throw new HTTPException(401, {
			message: "Unauthorized: No session token, please sign in.",
		});
	}

	try {
		const verifiedToken = await verifyToken(token, {
			jwtKey: CLERK_JWT_KEY,
			secretKey: CLERK_SECRET_KEY,
			clockSkewInMs: 120000,
			authorizedParties: [
				"http://localhost:3000",
				"http://localhost:8080",
				"https://cleoai.cloud",
				"https://api.cleoai.cloud",
			],
		});

		return await next({ client, token: verifiedToken });
	} catch (err) {
		console.error(err);

		throw new HTTPException(500, {
			message:
				"Something went wrong validating session token. Please try again.",
		});
	}
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

const dashMiddleware = j.middleware(async ({ ctx, next }) => {
	const { db, client, token } = ctx as InferMiddlewareOutput<
		typeof baseMiddleware
	> &
		InferMiddlewareOutput<typeof clerkMiddleware>;

	const auth = await client.sessions.getSession(token.sid);
	const userId = auth.userId;

	const tokens = (
		await client.users.getUserOauthAccessToken(userId, "discord")
	).data;

	if (!tokens || !tokens[0] || !tokens[0].token)
		throw new HTTPException(401, {
			message: "Unauthorized: No access token",
		});

	const accessToken = tokens[0].token;

	const response = await fetch("https://discord.com/api/v10/oauth2/@me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok)
		throw new HTTPException(401, {
			message: "Unauthorized: Error getting current OAuth2 authorization",
		});

	const data =
		(await response.json()) as RESTGetAPIOAuth2CurrentAuthorizationResult;

	if (!data)
		throw new HTTPException(401, {
			message: "Unauthorized: No valid OAuth2 Authorization data",
		});

	const discordId = data.user?.id;

	if (!discordId)
		throw new HTTPException(401, {
			message:
				"Unauthorized: No valid discord ID retrieved from OAuth2 Authorization data",
		});

	const user = await db.users.findUnique({ where: { discordId } });

	if (!user)
		throw new HTTPException(401, {
			message: "Unauthorized: Invalid user or no user in database",
		});

	return await next({ user, accessToken });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(baseMiddleware);

/**
 * Clerk (semi-authenticated) procedures
 *
 * This is used as a base for authenticating api calls against clerk, applying the client and token to requests for when checking against a valid user is not required.
 */
export const clerkProcedure = publicProcedure.use(clerkMiddleware);

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
export const dashProcedure = clerkProcedure.use(dashMiddleware);
