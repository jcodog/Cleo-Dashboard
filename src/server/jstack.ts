import { getDb } from "@/lib/prisma";
import { env } from "hono/adapter";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { InferMiddlewareOutput, jstack } from "jstack";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { RESTGetAPIUserResult } from "discord-api-types/v10";

interface Env {
	Bindings: {
		DATABASE_URL: string;
		CLERK_SECRET_KEY: string;
		CLERK_PUBLISHABLE_KEY: string;
		CLERK_JWT_KEY: string;
		DISCORD_BOT_TOKEN: string;
		CLEO_API_KEY: string;
		CLEO_KV: KVNamespace;
	};
}

export const j = jstack.init<Env>();

const dbMiddleware = j.middleware(async ({ c, next }) => {
	const { DATABASE_URL, CLEO_KV } = env(c);

	const db = getDb(DATABASE_URL);

	return await next({ db, kv: CLEO_KV });
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
	const { db } = ctx as InferMiddlewareOutput<typeof dbMiddleware>;
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

	let user = await db.users.findUnique({ where: { discordId } });

	if (!user) {
		const discordUser = (await (
			await fetch("https://discord.com/api/v10/users/" + discordId, {
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
			},
		});
	}

	return await next({ user });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(dbMiddleware);

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
