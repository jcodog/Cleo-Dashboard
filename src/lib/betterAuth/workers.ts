import { createAuth } from "@/lib/betterAuth/factory";
import { env } from "hono/adapter";
import { Env } from "@/server/jstack";
import { ContextWithSuperJSON } from "jstack";

let _auth: ReturnType<typeof createAuth> | undefined;

// NOTE: jstack currently emits the generic signature <Env, any, {}> which we cannot change here.
// We intentionally suppress the lint rules for this line only.
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export const getWorkerAuth = (c: ContextWithSuperJSON<Env, any, {}>) => {
  if (!_auth) {
    const e = env(c);

    _auth = createAuth({
      DATABASE_URL: e.DATABASE_URL ?? "",
      BETTER_AUTH_SECRET: e.BETTER_AUTH_SECRET ?? "",
      NEXT_PUBLIC_SITE_URL: e.NEXT_PUBLIC_SITE_URL ?? "",
      COOKIE_DOMAIN: e.COOKIE_DOMAIN,
      DISCORD_CLIENT_ID: e.DISCORD_CLIENT_ID ?? "",
      DISCORD_CLIENT_SECRET: e.DISCORD_CLIENT_SECRET ?? "",
    });
  }

  return _auth;
};
