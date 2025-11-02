import { getDb } from "@/lib/prisma";
import { loadStripe } from "@/lib/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { lastLoginMethod } from "better-auth/plugins";

/**
 * Environment configuration used to initialize Better Auth and related services.
 *
 * Properties are typically sourced from process env or platform secrets and
 * passed in explicitly to make the factory pure and testable.
 *
 * @property DATABASE_URL - Full connection string for Postgres used by Prisma.
 * @property BETTER_AUTH_SECRET - Secret used by Better Auth for signing/crypto.
 * @property NEXT_PUBLIC_SITE_URL - Absolute base URL of the site (e.g. https://cleoai.cloud).
 * @property COOKIE_DOMAIN - Optional cookie Domain attribute (e.g. "cleoai.cloud"). If omitted,
 *   a value will be derived from NEXT_PUBLIC_SITE_URL when possible.
 * @property DISCORD_CLIENT_ID - Discord OAuth client id.
 * @property DISCORD_CLIENT_SECRET - Discord OAuth client secret.
 * @property STRIPE_SECRET_KEY - Stripe secret API key for Customer creation/backfill.
 */
export type AuthEnv = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  NEXT_PUBLIC_SITE_URL?: string;
  COOKIE_DOMAIN?: string;
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  KICK_CLIENT_ID?: string;
  KICK_CLIENT_SECRET?: string;
};

/**
 * Create and configure a Better Auth instance bound to the provided environment.
 *
 * This function wires up:
 * - Prisma adapter using the provided DATABASE_URL
 * - Discord social provider
 * - Cookie domain normalization for cross-subdomain auth between Next and Workers
 * - Account creation/linking hooks that also synchronize your app's Users table
 *   and backfill Stripe Customers when configured
 * - Sensible security defaults for cookies, trusted origins and cross-subdomain sharing
 *
 * Notes:
 * - In development (localhost), the cookie Domain attribute is omitted intentionally.
 * - If STRIPE_SECRET_KEY is not provided, Stripe customer creation is skipped.
 *
 * @param env - Environment and secret configuration (see AuthEnv)
 * @returns The configured Better Auth instance
 */
export const createAuth = (env: AuthEnv) => {
  const db = getDb(env.DATABASE_URL ?? "");

  // --- Cookie Domain Normalisation ---------------------------------------
  // Goal: share auth cookies between cleoai.cloud (Next) and api.cleoai.cloud (Workers).
  // Requirements for the Set-Cookie header to be accepted & sent cross‑subdomain:
  //  - Domain MUST be the registrable domain (e.g. `cleoai.cloud`) – NOT a subdomain, NOT include protocol, NOT include port.
  //  - Secure MUST be true on production (HTTPS).
  //  - SameSite can stay "lax" because subdomains count as same‑site; do NOT use default host‑only cookie.
  // If COOKIE_DOMAIN is misconfigured we attempt to repair and emit a console.warn once.
  /**
   * Cookie Domain attribute to be used for auth cookies. When defined, it allows
   * cookies to be shared across subdomains (e.g. app.cleoai.cloud and api.cleoai.cloud).
   * Will be derived from COOKIE_DOMAIN or NEXT_PUBLIC_SITE_URL, and will be cleared
   * on localhost to avoid invalid Domain attributes in dev.
   */
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

  if (warned.length) {
    console.warn("[auth:cookies]", warned.join(" "));
  }

  /** Stripe client configured from STRIPE_SECRET_KEY (if present). */
  const stripeSecret = env.STRIPE_SECRET_KEY;
  const stripe = stripeSecret
    ? loadStripe({ secretKey: stripeSecret })
    : undefined;

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
          "guilds.members.read",
        ],
        /**
         * Map the Discord OAuth profile to Better Auth's user record shape.
         *
         * @param profile - Discord profile as returned by the provider
         * @returns Minimal user details used to seed the Better Auth user
         */
        mapProfileToUser: (profile) => {
          return {
            email: profile.email,
            name: profile.global_name || profile.username,
            image: profile.image_url
              ? profile.image_url
              : profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
              : undefined,
            username: profile.username,
            locale: profile.locale,
            emailVerified: profile.verified,
          };
        },
      },

      kick: {
        enabled: Boolean(env.KICK_CLIENT_ID && env.KICK_CLIENT_SECRET),
        clientId: env.KICK_CLIENT_ID ?? "",
        clientSecret: env.KICK_CLIENT_SECRET ?? "",
        scope: [
          "user:read",
          "channel:read",
          "channel:write",
          "chat:write",
          "streamkey:read",
          "events:subscribe",
          "moderation:ban",
        ],
        mapProfileToUser: (profile) => {
          const rawProfile = profile as unknown as Record<string, unknown>;
          const getString = (key: string) => {
            const value = rawProfile[key];
            return typeof value === "string" ? value : undefined;
          };

          const usernameCandidate =
            getString("username") ??
            getString("user_name") ??
            getString("slug") ??
            getString("login") ??
            getString("display_name");

          const nameCandidate =
            getString("display_name") ?? getString("name") ?? usernameCandidate;

          const imageCandidate =
            getString("profile_picture") ??
            getString("avatar") ??
            getString("image") ??
            getString("profileImage");

          return {
            email: getString("email"),
            name: nameCandidate,
            image: imageCandidate,
            username: usernameCandidate,
          };
        },
      },
    },
    user: {
      additionalFields: {
        username: { type: "string", unique: true },
        locale: { type: "string" },
      },
    },
    baseURL: env.NEXT_PUBLIC_SITE_URL ?? "https://cleoai.cloud",
    cookies: {
      domain: normalizedCookieDomain,
      sameSite: "lax",
    },
    databaseHooks: {
      account: {
        create: {
          /**
           * Runs right after a provider account is created/linked for a Better Auth user.
           * This is the safest place to "claim" or create your app-side Users row because
           * the Discord link (providerId/accountId) is guaranteed to exist here.
           *
           * Flow:
           * 0) If Users already has a row linked by extId, backfill Stripe if needed and exit.
           * 1) Try claim by discordId (strongest signal).
           * 2) Try claim by email (covers Clerk-era users).
           * 3) Otherwise create a new Users row (with username collision handling).
           *    - On P2002 (unique) races, convert to UPDATE by email/discordId.
           *
           * @param account The Better Auth Account row that was just created
           * @param ctx     Hook context (not used here, but kept for parity)
           */
          after: async (account) => {
            const prisma = db;
            if (
              account.providerId !== "discord" &&
              account.providerId !== "kick"
            ) {
              return;
            }

            // Pull the Better Auth User so we can read email/name/locale
            const authUser = await prisma.user
              .findUnique({ where: { id: account.userId } })
              .catch(() => null);

            // Helper: generate a collision-safe username shared by all providers
            const createRandomUsername = () =>
              `cleo_${Math.random().toString(36).slice(2, 10)}`;

            const normalizeUsername = (value: string) => {
              const lowered = value.toLowerCase().replace(/[^a-z0-9_]/g, "_");
              const squashed = lowered.replace(/_+/g, "_");
              const trimmed = squashed.replace(/^_+|_+$/g, "");
              return trimmed.slice(0, 30);
            };

            const ensureSafeUsername = (value: string) => {
              const normalized = normalizeUsername(value);
              if (normalized.length) return normalized;
              return normalizeUsername(createRandomUsername());
            };

            const pickUniqueUsername = async (raw: string) => {
              const base = ensureSafeUsername(raw);
              let candidate = base;
              for (let i = 0; i < 5; i++) {
                const hit = await prisma.users
                  .findUnique({ where: { username: candidate } })
                  .catch(() => null);
                if (!hit) return candidate;
                candidate = ensureSafeUsername(
                  `${base}_${Math.random().toString(36).slice(2, 6)}`
                );
              }
              return candidate;
            };

            const preferredProviderUsername =
              typeof authUser?.username === "string"
                ? authUser.username.trim()
                : "";

            const username = await pickUniqueUsername(
              preferredProviderUsername || createRandomUsername()
            );

            const ensureStripeCustomer = async (userRecord: {
              id: string;
              email: string | null;
              username: string | null;
              extId: string | null;
              customerId: string | null;
            }) => {
              if (!stripe) return;
              if (userRecord.customerId) return;
              try {
                const customer = await stripe.customers.create({
                  email: userRecord.email || undefined,
                  name: userRecord.username || undefined,
                  metadata: { extId: userRecord.extId || userRecord.id },
                });
                await prisma.users.update({
                  where: { id: userRecord.id },
                  data: { customerId: customer.id },
                });
              } catch (e) {
                console.error(
                  "[better-auth:account.created] stripe backfill failed",
                  e
                );
              }
            };

            if (account.providerId === "discord") {
              // 0) Already linked by extId? (app user exists and is attached to this BA user)
              const byExt = await prisma.users.findFirst({
                where: { extId: account.userId },
              });
              if (byExt) {
                let target = byExt;
                const needsUpdate =
                  byExt.discordId !== account.accountId ||
                  (authUser?.email && !byExt.email) ||
                  (authUser?.locale && !byExt.timezone) ||
                  !byExt.username;
                if (needsUpdate) {
                  target = await prisma.users.update({
                    where: { id: byExt.id },
                    data: {
                      ...(byExt.username ? {} : { username }),
                      discordId: account.accountId,
                      email: byExt.email ?? authUser?.email ?? null,
                      timezone: byExt.timezone ?? authUser?.locale ?? null,
                    },
                  });
                }
                await ensureStripeCustomer(target);
                return;
              }

              // 1) Claim by discordId (now guaranteed to exist on the Account)
              const byDiscord = await prisma.users
                .findUnique({ where: { discordId: account.accountId } })
                .catch(() => null);

              if (byDiscord && byDiscord.extId !== account.userId) {
                const updated = await prisma.users.update({
                  where: { id: byDiscord.id },
                  data: {
                    ...(byDiscord.username ? {} : { username }),
                    extId: account.userId,
                    email: byDiscord.email ?? authUser?.email ?? null,
                    timezone: authUser?.locale ?? byDiscord.timezone ?? null,
                  },
                });
                await ensureStripeCustomer(updated);
                return;
              }

              // 2) Claim by email (covers existing Clerk users)
              if (authUser?.email) {
                const byEmail = await prisma.users
                  .findUnique({ where: { email: authUser.email } })
                  .catch(() => null);

                if (byEmail && byEmail.extId !== account.userId) {
                  const updated = await prisma.users.update({
                    where: { id: byEmail.id },
                    data: {
                      ...(byEmail.username ? {} : { username }),
                      extId: account.userId,
                      discordId: account.accountId,
                      timezone: authUser?.locale ?? byEmail.timezone ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
              }

              // 3) Nothing to claim — create a fresh app user
              try {
                const created = await prisma.users.create({
                  data: {
                    extId: account.userId,
                    email: authUser?.email ?? null,
                    username,
                    discordId: account.accountId,
                    timezone: authUser?.locale ?? null,
                    limits: { create: { date: new Date() } },
                  },
                });

                if (stripe) {
                  await ensureStripeCustomer(created);
                } else {
                  console.warn(
                    "[better-auth:account.created] STRIPE_SECRET_KEY not configured; skipping customer creation"
                  );
                }
                // NOTE: The type of error that the catch block can catch is unknown but we cannot handle unknown so must declare any so that any errors can be caught.
                // We intentionally suppress the lint rules for this line only.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                // Convert unique collisions into claims (handles races / parallel requests)
                if (
                  e.code === "P2002" &&
                  e.meta?.target?.includes("email") &&
                  authUser?.email
                ) {
                  const updated = await prisma.users.update({
                    where: { email: authUser.email },
                    data: {
                      username,
                      extId: account.userId,
                      discordId: account.accountId,
                      timezone: authUser?.locale ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
                if (
                  e.code === "P2002" &&
                  e.meta?.target?.includes("discordId")
                ) {
                  const updated = await prisma.users.update({
                    where: { discordId: account.accountId },
                    data: {
                      username,
                      extId: account.userId,
                      email: authUser?.email ?? undefined,
                      timezone: authUser?.locale ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
                throw e;
              }
            }

            if (account.providerId === "kick") {
              // 0) Already linked by extId? (app user exists and is attached to this BA user)
              const byExt = await prisma.users.findFirst({
                where: { extId: account.userId },
              });
              if (byExt) {
                let target = byExt;
                const needsUpdate =
                  byExt.kickId !== account.accountId ||
                  (authUser?.email && !byExt.email) ||
                  (authUser?.locale && !byExt.timezone) ||
                  !byExt.username;
                if (needsUpdate) {
                  target = await prisma.users.update({
                    where: { id: byExt.id },
                    data: {
                      ...(byExt.username ? {} : { username }),
                      kickId: account.accountId,
                      email: byExt.email ?? authUser?.email ?? null,
                      timezone: byExt.timezone ?? authUser?.locale ?? null,
                    },
                  });
                }
                await ensureStripeCustomer(target);
                return;
              }

              // 1) Claim by kickId (if a user was pre-provisioned)
              const byKick = await prisma.users
                .findUnique({ where: { kickId: account.accountId } })
                .catch(() => null);

              if (byKick && byKick.extId !== account.userId) {
                const updated = await prisma.users.update({
                  where: { id: byKick.id },
                  data: {
                    ...(byKick.username ? {} : { username }),
                    extId: account.userId,
                    email: byKick.email ?? authUser?.email ?? null,
                    timezone: authUser?.locale ?? byKick.timezone ?? null,
                  },
                });
                await ensureStripeCustomer(updated);
                return;
              }

              // 2) Claim by email (covers existing users that signed up through Discord first)
              if (authUser?.email) {
                const byEmail = await prisma.users
                  .findUnique({ where: { email: authUser.email } })
                  .catch(() => null);

                if (byEmail && byEmail.extId !== account.userId) {
                  const updated = await prisma.users.update({
                    where: { id: byEmail.id },
                    data: {
                      ...(byEmail.username ? {} : { username }),
                      extId: account.userId,
                      kickId: account.accountId,
                      timezone: authUser?.locale ?? byEmail.timezone ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
              }

              // 3) Nothing to claim — create a fresh app user (Kick-first flow)
              try {
                const created = await prisma.users.create({
                  data: {
                    extId: account.userId,
                    email: authUser?.email ?? null,
                    username,
                    kickId: account.accountId,
                    timezone: authUser?.locale ?? null,
                    limits: { create: { date: new Date() } },
                  },
                });

                if (stripe) {
                  await ensureStripeCustomer(created);
                } else {
                  console.warn(
                    "[better-auth:account.created] STRIPE_SECRET_KEY not configured; skipping customer creation"
                  );
                }
                // NOTE: The type of error that the catch block can catch is unknown but we cannot handle unknown so must declare any so that any errors can be caught.
                // We intentionally suppress the lint rules for this line only.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                if (
                  e.code === "P2002" &&
                  e.meta?.target?.includes("email") &&
                  authUser?.email
                ) {
                  const updated = await prisma.users.update({
                    where: { email: authUser.email },
                    data: {
                      username,
                      extId: account.userId,
                      kickId: account.accountId,
                      timezone: authUser?.locale ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
                if (e.code === "P2002" && e.meta?.target?.includes("kickId")) {
                  const updated = await prisma.users.update({
                    where: { kickId: account.accountId },
                    data: {
                      username,
                      extId: account.userId,
                      email: authUser?.email ?? undefined,
                      timezone: authUser?.locale ?? null,
                    },
                  });
                  await ensureStripeCustomer(updated);
                  return;
                }
                throw e;
              }
            }
          },
        },
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: normalizedCookieDomain,
      },
    },
    trustedOrigins: [
      "https://cleoai.cloud",
      "https://api.cleoai.cloud",
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    plugins: [
      lastLoginMethod({
        cookieName: "better-auth.last_used_login_method",
        maxAge: 60 * 60 * 24 * 90,
        storeInDatabase: true,
      }),
    ],
    account: {
      accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
        trustedProviders: ["discord", "kick"],
      },
    },
  });
};
