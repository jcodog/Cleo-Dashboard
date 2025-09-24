import { j } from "@/server/jstack";
import { cors } from "hono/cors";
import { sessionRouter } from "@/server/routers/session-router";
import { discordRouter } from "@/server/routers/discord-router";
import { cleoRouter } from "@/server/routers/cleo-router";
import { dashRouter } from "@/server/routers/dash-router";
import { paymentRouter } from "@/server/routers/payment-router";
import { healthRouter } from "@/server/routers/health-router";

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
      origin: (origin) => {
    if (!origin) return 'https://cleoai.cloud';
    if (/^https:\\/\\/(api\\.)?cleoai\\.cloud$/.test(origin)) return origin;
    return 'https://cleoai.cloud'; // fallback allow primary
  },
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
  session: sessionRouter,
  discord: discordRouter,
  cleo: cleoRouter,
  dash: dashRouter,
  payment: paymentRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
