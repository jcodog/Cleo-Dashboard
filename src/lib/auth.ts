import { createAuth } from "@/lib/betterAuth/factory";

let _auth: ReturnType<typeof createAuth> | undefined;

export const auth = (() => {
  if (!_auth) {
    _auth = createAuth({
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? "",
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ?? "",
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
      KICK_CLIENT_ID: process.env.KICK_CLIENT_ID ?? "",
      KICK_CLIENT_SECRET: process.env.KICK_CLIENT_SECRET ?? "",
    });
  }

  return _auth;
})();
