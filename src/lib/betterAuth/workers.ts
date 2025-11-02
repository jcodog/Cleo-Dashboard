import { createAuth } from "@/lib/betterAuth/factory";
import { env } from "hono/adapter";
import { Env } from "@/server/jstack";
import { ContextWithSuperJSON } from "jstack";

let _auth: ReturnType<typeof createAuth> | undefined;

type WorkerVariables = Record<string, unknown>;

export const getWorkerAuth = (
  c: ContextWithSuperJSON<Env, WorkerVariables, Record<string, never>>
) => {
  if (!_auth) {
    const e = env(c);

    _auth = createAuth({
      DATABASE_URL: e.DATABASE_URL ?? "",
      BETTER_AUTH_SECRET: e.BETTER_AUTH_SECRET ?? "",
      NEXT_PUBLIC_SITE_URL: e.NEXT_PUBLIC_SITE_URL ?? "",
      COOKIE_DOMAIN: e.COOKIE_DOMAIN,
      DISCORD_CLIENT_ID: e.DISCORD_CLIENT_ID ?? "",
      DISCORD_CLIENT_SECRET: e.DISCORD_CLIENT_SECRET ?? "",
      STRIPE_SECRET_KEY: e.STRIPE_SECRET_KEY ?? "",
      KICK_CLIENT_ID: e.KICK_CLIENT_ID ?? "",
      KICK_CLIENT_SECRET: e.KICK_CLIENT_SECRET ?? "",
    });
  }

  return _auth;
};
