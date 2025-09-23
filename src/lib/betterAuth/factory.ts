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

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET ?? "",
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      discord: {
        enabled: true,
        clientId: env.DISCORD_CLIENT_ID ?? "",
        clientSecret: env.DISCORD_CLIENT_SECRET ?? "",
        // requesting identify + guilds so later API calls can work similarly to Clerk flow
        scope: [
          "identify",
          "email",
          "guilds",
          "connections",
          "guilds.join",
          "guilds.members.read",
        ],
        mapProfile: (profile: any) => {
          // Standardize the profile mapping so we can later create/sync user records.
          // better-auth expects { id, email, name, image } at minimum.
          return {
            id: profile.id,
            email: profile.email,
            name: profile.global_name || profile.username,
            image: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
              : undefined,
            username: profile.username,
            raw: profile,
          };
        },
      },
    },
    // baseURL should match the origin the app is served from (no trailing slash)
    baseURL: env.NEXT_PUBLIC_SITE_URL ?? "https://cleoai.cloud",
    // IMPORTANT: For cookies do NOT include protocol. Only set a domain when you need
    // cross-subdomain sharing in production. In local dev you typically omit domain so
    // the browser uses the current host (localhost). A wrong domain (or including https://)
    // prevents the cookie from being set, leading to infinite redirect-to-sign-in loops.
    cookies: {
      domain:
        process.env.NODE_ENV === "production"
          ? env.COOKIE_DOMAIN ||
            (env.NEXT_PUBLIC_SITE_URL
              ? safeHostname(env.NEXT_PUBLIC_SITE_URL)
              : undefined)
          : undefined,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    events: {
      user: {
        // Runs after a Better Auth User + Account rows are persisted.
        created: async ({ user, context }: { user: any; context: any }) => {
          try {
            // 'db' here is the prisma client passed through the adapter.
            const prisma = (context as any).db ?? db;

            // If already provisioned (re-entrancy / retries), exit early.
            const existing = await prisma.users.findFirst({
              where: { extId: user.id },
            });
            if (existing) return;

            // Fetch discord account (all sign-ups are via Discord per requirements)
            const discordAccount = await prisma.account.findFirst({
              where: { userId: user.id, providerId: "discord" },
            });

            // Claim scenario: user previously existed (Clerk era) with discordId but extId referencing Clerk user.
            if (discordAccount?.accountId) {
              const claimant = await prisma.users
                .findUnique({ where: { discordId: discordAccount.accountId } })
                .catch(() => null);
              if (claimant && claimant.extId !== user.id) {
                await prisma.users.update({
                  where: { discordId: discordAccount.accountId },
                  data: { extId: user.id, email: claimant.email || user.email },
                });
                return; // Claimed; no new row needed.
              }
            }

            // Prepare initial username: prefer mapped username (mapProfile sets username in raw?) or fallback.
            const baseUsername =
              (user as any).username ||
              user.name ||
              (user.email
                ? user.email.split("@")[0]
                : `user_${user.id.slice(0, 6)}`);

            // Ensure uniqueness for username if collisions possible.
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

            // Create Stripe customer later (defer heavy operations) – placeholder.
            // If you need it immediately, inject a stripe instance and create here.

            await prisma.users.create({
              data: {
                extId: user.id,
                username,
                email: user.email,
                discordId: discordAccount?.accountId || `pending-${user.id}`,
                limits: { create: { date: new Date() } },
              },
            });
          } catch (err) {
            console.error("[better-auth:user.created] provisioning error", err);
          }
        },
      },
    },
  });
};
