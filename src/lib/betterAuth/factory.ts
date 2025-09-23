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
  if (process.env.NODE_ENV === "production") {
    const warned: string[] = [];
    const raw = (env.COOKIE_DOMAIN || "").trim();

    if (raw) {
      // Strip protocol
      let d: string = raw.replace(/^https?:\/\//i, "");
      // Remove path/query if accidentally provided (avoid array indexing to satisfy noUncheckedIndexedAccess)
      const firstSlash = d.indexOf("/");
      if (firstSlash !== -1) d = d.slice(0, firstSlash);
      // Remove port if present
      const firstColon = d.indexOf(":");
      if (firstColon !== -1) d = d.slice(0, firstColon);
      // Convert leading dot variants to plain
      d = d.replace(/^\.+/, "");
      // Validate basic shape – must contain a dot and only allowed characters
      if (!/^[A-Za-z0-9.-]+$/.test(d) || !d.includes(".")) {
        warned.push(
          `Provided COOKIE_DOMAIN '${raw}' is invalid; expected e.g. 'cleoai.cloud'.`
        );
      } else {
        normalizedCookieDomain = d;
      }
    }

    // Derive from NEXT_PUBLIC_SITE_URL if still undefined
    if (!normalizedCookieDomain && env.NEXT_PUBLIC_SITE_URL) {
      try {
        const u = new URL(env.NEXT_PUBLIC_SITE_URL);
        const host = u.hostname; // already no protocol
        // If host is a bare domain (e.g. cleoai.cloud) keep it, else strip first label (api., www.)
        const parts = host.split(".");
        if (parts.length > 2) {
          normalizedCookieDomain = parts.slice(-2).join(".");
        } else {
          normalizedCookieDomain = host;
        }
      } catch (e) {
        warned.push("Could not derive cookie domain from NEXT_PUBLIC_SITE_URL");
      }
    }

    if (
      normalizedCookieDomain &&
      normalizedCookieDomain.startsWith("localhost")
    ) {
      // Never set a Domain attribute for localhost – browsers reject/ignore it and host-only behaviour is desired.
      warned.push(
        `Omitting Domain attribute for localhost ('${normalizedCookieDomain}'); cross-subdomain sharing is not needed in local dev.`
      );
      normalizedCookieDomain = undefined;
    }

    if (warned.length) {
      // Log once (Better Auth creates singleton) – aids debugging mis-config quickly in Cloudflare/Vercel logs.
      console.warn("[auth:cookies]", warned.join(" "));
    }
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
      secure: process.env.NODE_ENV === "production",
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
