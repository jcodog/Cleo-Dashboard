import { j } from "@/server/jstack";
import { cors } from "hono/cors";
import { sessionRouter } from "@/server/routers/session-router";
import { discordRouter } from "@/server/routers/discord-router";
import { cleoRouter } from "@/server/routers/cleo-router";
import { dashRouter } from "@/server/routers/dash-router";
import { paymentRouter } from "@/server/routers/payment-router";
import { healthRouter } from "@/server/routers/health-router";
import { accountsRouter } from "@/server/routers/accounts-router";
import { kickRouter } from "@/server/routers/kick-router";
import { overlayRouter } from "@/server/routers/overlay-router";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  // Block known bots and crawlers at the edge of the API to reduce probing
  .use(async (c, next) => {
    const ua = (c.req.header("user-agent") || "").toLowerCase();
    const blocked = [
      "googlebot",
      "bingbot",
      "slurp",
      "duckduckbot",
      "baiduspider",
      "yandex",
      "sogou",
      "exabot",
      "ia_archiver",
      "facebot",
      "facebookexternalhit",
      "twitterbot",
      "applebot",
      "redditbot",
      "linkedinbot",
      "pinterestbot",
      "gptbot",
      "chatgpt-user",
      "google-extended",
      "ccbot",
      "perplexitybot",
      "anthropic-ai",
      "claudebot",
      "claude-web",
      "oai-searchbot",
      "bytespider",
      "cohere-ai",
      "mazekai",
      "diffbot",
      "dataforseo",
      "serpapi",
      "scrapy",
    ];
    if (blocked.some((sig) => ua.includes(sig))) {
      return c.text("Forbidden", 403);
    }
    return next();
  })
  .use(
    cors({
      origin: (origin) => origin ?? "https://cleoai.cloud",
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
  accounts: accountsRouter,
  kick: kickRouter,
  overlays: overlayRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
