import { getDb } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

function safeHostname(url?: string) {
  if (!url) return undefined;
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return undefined;
  }
}

export type AuthEnv = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  NEXT_PUBLIC_SITE_URL?: string;
  COOKIE_DOMAIN?: string;
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
};

export const createAuth = (env: AuthEnv) => {
  const db = getDb(env.DATABASE_URL ?? "");

  // --- Cookie Domain Normalisation ---------------------------------------
  // Goal: share auth cookies between cleoai.cloud (Next) and api.cleoai.cloud (Workers).
  // Requirements for the Set-Cookie header to be accepted & sent cross‑subdomain:
  //  - Domain MUST be the registrable domain (e.g. `cleoai.cloud`) – NOT a subdomain, NOT include protocol, NOT include port.
  //  - Secure MUST be true on production (HTTPS).
  //  - SameSite can stay "lax" because subdomains count as same‑site; do NOT use default host‑only cookie.
  // If COOKIE_DOMAIN is misconfigured we attempt to repair and emit a console.warn once.
  let normalizedCookieDomain: string | undefined;
  const warned: string[] = [];
  const raw = (env.COOKIE_DOMAIN || "").trim();

  if (raw) {
    let d: string = raw.replace(/^https?:\/\//i, "");
    const firstSlash = d.indexOf("/");
    if (firstSlash !== -1) d = d.slice(0, firstSlash);
    const firstColon = d.indexOf(":");
    if (firstColon !== -1) d = d.slice(0, firstColon);
    d = d.replace(/^\.+/, "");
    if (!/^[A-Za-z0-9.-]+$/.test(d) || !d.includes(".")) {
      warned.push(
        `Provided COOKIE_DOMAIN '${raw}' is invalid; expected e.g. 'cleoai.cloud'.`
      );
    } else {
      normalizedCookieDomain = d;
    }
  }

  if (!normalizedCookieDomain && env.NEXT_PUBLIC_SITE_URL) {
    try {
      const u = new URL(env.NEXT_PUBLIC_SITE_URL);
      const host = u.hostname;
      const parts = host.split(".");
      normalizedCookieDomain =
        parts.length > 2 ? parts.slice(-2).join(".") : host;
    } catch {
      warned.push("Could not derive cookie domain from NEXT_PUBLIC_SITE_URL");
    }
  }

  if (
    normalizedCookieDomain &&
    normalizedCookieDomain.startsWith("localhost")
  ) {
    warned.push(
      `Omitting Domain attribute for localhost ('${normalizedCookieDomain}'); cross-subdomain sharing is not needed in local dev.`
    );
    normalizedCookieDomain = undefined;
  }

  if (warned.length) {
    console.warn("[auth:cookies]", warned.join(" "));
  }

  const secureFlag = (() => {
    if (typeof env.NEXT_PUBLIC_SITE_URL === "string") {
      try {
        return new URL(env.NEXT_PUBLIC_SITE_URL).protocol === "https:";
      } catch {
        /* ignore */
      }
    }
    return process.env.NODE_ENV === "production"; // fallback
  })();

  if (process.env.BETTER_AUTH_DEBUG_COOKIES === "1") {
    console.log("[auth:cookies:config]", {
      normalizedCookieDomain,
      secureFlag,
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
      rawCookieDomain: raw || null,
    });
  }

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET ?? "",
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: { enabled: false },
    socialProviders: {
      discord: {
        enabled: true,
        clientId: env.DISCORD_CLIENT_ID ?? "",
        clientSecret: env.DISCORD_CLIENT_SECRET ?? "",
        scope: [
          "identify",
          "email",
          "guilds",
          "connections",
          "guilds.join",
          "guilds.members.read",
        ],
        mapProfile: (profile: {
          id: string;
          email?: string;
          global_name?: string;
          username?: string;
          avatar?: string | null;
        }) => ({
          id: profile.id,
          email: profile.email,
          name: profile.global_name || profile.username,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
            : undefined,
          username: profile.username,
          raw: profile,
        }),
      },
    },
    baseURL: env.NEXT_PUBLIC_SITE_URL ?? "https://cleoai.cloud",
    cookies: {
      domain: normalizedCookieDomain,
      sameSite: "lax",
      secure: secureFlag,
    },
    events: {
      user: {
        created: async ({
          user,
        }: {
          user: {
            id: string;
            email?: string | null;
            name?: string | null;
            username?: string | null;
          };
        }) => {
          try {
            const prisma = db;
            const existing = await prisma.users.findFirst({
              where: { extId: user.id },
            });
            if (existing) return;
            const discordAccount = await prisma.account.findFirst({
              where: { userId: user.id, providerId: "discord" },
            });
            if (discordAccount?.accountId) {
              const claimant = await prisma.users
                .findUnique({ where: { discordId: discordAccount.accountId } })
                .catch(() => null);
              if (claimant && claimant.extId !== user.id) {
                await prisma.users.update({
                  where: { discordId: discordAccount.accountId },
                  data: { extId: user.id, email: claimant.email || user.email },
                });
                return;
              }
            }
            const baseUsername =
              user.username ||
              user.name ||
              (user.email
                ? user.email.split("@")[0]
                : `user_${user.id.slice(0, 6)}`);
            let username = baseUsername;
            let collision = await prisma.users
              .findUnique({ where: { username } })
              .catch(() => null);
            let attempt = 0;
            while (collision && attempt < 5) {
              username = `${baseUsername}_${Math.random()
                .toString(36)
                .slice(2, 6)}`;
              collision = await prisma.users
                .findUnique({ where: { username } })
                .catch(() => null);
              attempt++;
            }
            await prisma.users.create({
              data: {
                extId: user.id,
                username: username as string,
                email: user.email,
                discordId: discordAccount?.accountId || `pending-${user.id}`,
                limits: { create: { date: new Date() } },
              },
            });
          } catch (err: unknown) {
            console.error("[better-auth:user.created] provisioning error", err);
          }
        },
      },
    },
  });
};
