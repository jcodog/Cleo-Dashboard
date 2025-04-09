import { getDb } from "@/lib/prisma";
import { env } from "hono/adapter";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { jstack } from "jstack";
import { createClerkClient, verifyToken } from "@clerk/backend";

interface Env {
	Bindings: {
		DATABASE_URL: string;
		CLERK_SECRET_KEY: string;
		CLERK_PUBLISHABLE_KEY: string;
		CLERK_JWT_KEY: string;
	};
}

export const j = jstack.init<Env>();

const dbMiddleware = j.middleware(async ({ c, next }) => {
	const { DATABASE_URL } = env(c);

	const db = getDb(DATABASE_URL);

	return await next({ db });
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
