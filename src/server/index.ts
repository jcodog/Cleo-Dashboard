import { j } from "./jstack";
import { cors } from "hono/cors";
import { authRouter } from "@/server/routers/auth-router";
import { discordRouter } from "@/server/routers/discord-router";
import { cleoRouter } from "@/server/routers/cleo-router";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
	.router()
	.basePath("/api")
	.use(
		cors({
			origin: (origin) => origin,
			credentials: true,
			allowHeaders: [
				"x-is-superjson",
				"Authorization",
				"content-type",
				"Content-Type",
			],
			exposeHeaders: ["x-is-superjson"],
		})
	)
	.onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
	auth: authRouter,
	discord: discordRouter,
	cleo: cleoRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
