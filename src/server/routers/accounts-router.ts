import { authProcedure, j } from "@/server/jstack";
import { env } from "hono/adapter";
import { z } from "zod";
import { getDiscordAccessToken } from "@/lib/betterAuth/discordToken";
import { getKickAccessToken } from "@/lib/betterAuth/kickToken";
import { getCachedProviderDisplayName } from "@/lib/functions/account-router/displayName";
import { fetchKickIdentity } from "@/lib/functions/account-router/kick";
import {
  REQUIRED_PROVIDER_SCOPES,
  parseScopes,
  type ProviderKey,
} from "@/lib/functions/account-router/scopes";
import type { KVNamespace } from "@cloudflare/workers-types";

export const accountsRouter = j.router({
  linkedProviders: authProcedure.query(async ({ c, ctx }) => {
    const { db, session } = ctx;
    const kv = (ctx as { kv?: KVNamespace }).kv;
    const userId = session.user.id;

    const [accounts, domainUser] = await Promise.all([
      db.account.findMany({
        where: { userId },
        select: {
          providerId: true,
          accountId: true,
          accessToken: true,
          refreshToken: true,
          accessTokenExpiresAt: true,
          createdAt: true,
          updatedAt: true,
          scope: true,
        },
      }),
      db.users.findFirst({
        where: { extId: userId },
        select: {
          id: true,
          username: true,
          email: true,
          discordId: true,
          discordUsername: true,
          kickId: true,
          kickUsername: true,
          timezone: true,
          customerId: true,
        },
      }),
    ]);

    const discordAccount = accounts.find(
      (account) => account.providerId === "discord"
    );
    const kickAccount = accounts.find(
      (account) => account.providerId === "kick"
    );

    const fallbackDisplayNames: Record<ProviderKey, string | null> = {
      discord:
        domainUser?.discordUsername ??
        domainUser?.username ??
        session.user.name ??
        (session.user.email ? session.user.email.split("@")[0] : null) ??
        null,
      kick:
        domainUser?.kickUsername ??
        domainUser?.username ??
        session.user.name ??
        (session.user.email ? session.user.email.split("@")[0] : null) ??
        null,
    };

    const providerDisplayNames: Record<ProviderKey, string | null> = {
      discord: null,
      kick: null,
    };

    const {
      DISCORD_CLIENT_ID = "",
      DISCORD_CLIENT_SECRET = "",
      KICK_CLIENT_ID = "",
      KICK_CLIENT_SECRET = "",
    } = env(c);

    if (discordAccount?.accountId) {
      providerDisplayNames.discord = await getCachedProviderDisplayName({
        kv,
        provider: "discord",
        accountId: discordAccount.accountId,
        loader: async () => {
          if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
            return null;
          }

          try {
            const token = await getDiscordAccessToken({
              db,
              userId,
              clientId: DISCORD_CLIENT_ID,
              clientSecret: DISCORD_CLIENT_SECRET,
            });

            const response = await fetch(
              "https://discord.com/api/v10/users/@me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              console.warn(
                "[accounts.linkedProviders] discord profile request failed",
                {
                  userId,
                  status: response.status,
                }
              );
              return null;
            }

            const profile = (await response.json()) as {
              global_name?: string | null;
              username?: string | null;
            };

            const resolvedUsername = profile.username ?? null;
            if (resolvedUsername && domainUser?.id) {
              if (domainUser.discordUsername !== resolvedUsername) {
                try {
                  await db.users.update({
                    where: { id: domainUser.id },
                    data: { discordUsername: resolvedUsername },
                  });
                  domainUser.discordUsername = resolvedUsername;
                } catch (error) {
                  console.warn(
                    "[accounts.linkedProviders] failed to persist discord username",
                    {
                      userId,
                      error:
                        error instanceof Error ? error.message : String(error),
                    }
                  );
                }
              }
            }

            return profile.global_name ?? profile.username ?? null;
          } catch (error) {
            console.warn(
              "[accounts.linkedProviders] failed to resolve discord profile",
              {
                userId,
                error:
                  error instanceof Error
                    ? error.message
                    : "unknown discord profile error",
              }
            );
            return null;
          }
        },
      });
    }

    const kickCacheKey =
      domainUser?.kickUsername ??
      domainUser?.kickId ??
      kickAccount?.accountId ??
      null;

    if (kickCacheKey && kickAccount?.accountId) {
      providerDisplayNames.kick = await getCachedProviderDisplayName({
        kv,
        provider: "kick",
        accountId: kickCacheKey,
        loader: async () => {
          if (!KICK_CLIENT_ID || !KICK_CLIENT_SECRET) {
            return null;
          }

          let token: string | null = null;

          try {
            token = await getKickAccessToken({
              db,
              userId,
              clientId: KICK_CLIENT_ID,
              clientSecret: KICK_CLIENT_SECRET,
            });
          } catch (error) {
            console.warn(
              "[accounts.linkedProviders] failed to resolve kick token",
              {
                userId,
                error: error instanceof Error ? error.message : String(error),
              }
            );
            return null;
          }

          if (!token) {
            return null;
          }

          const candidates = Array.from(
            new Set(
              [
                domainUser?.kickUsername,
                domainUser?.kickId,
                kickAccount.accountId,
                fallbackDisplayNames.kick,
              ]
                .filter((value): value is string => Boolean(value))
                .map((value) => value.trim())
                .filter(Boolean)
            )
          );

          for (const candidate of candidates) {
            const identity = await fetchKickIdentity({
              candidate,
              token,
            });

            if (!identity.username && !identity.displayName) {
              continue;
            }

            if (domainUser?.id) {
              if (
                identity.username &&
                domainUser.kickUsername !== identity.username
              ) {
                try {
                  await db.users.update({
                    where: { id: domainUser.id },
                    data: { kickUsername: identity.username },
                  });
                  domainUser.kickUsername = identity.username;
                } catch (error) {
                  console.warn(
                    "[accounts.linkedProviders] failed to persist kick username",
                    {
                      userId,
                      error:
                        error instanceof Error ? error.message : String(error),
                    }
                  );
                }
              }

              if (
                identity.userId !== null &&
                domainUser.kickId !== String(identity.userId)
              ) {
                try {
                  await db.users.update({
                    where: { id: domainUser.id },
                    data: { kickId: String(identity.userId) },
                  });
                  domainUser.kickId = String(identity.userId);
                } catch (error) {
                  console.warn(
                    "[accounts.linkedProviders] failed to persist kick id",
                    {
                      userId,
                      error:
                        error instanceof Error ? error.message : String(error),
                    }
                  );
                }
              }
            }

            const resolvedDisplayName =
              identity.displayName ?? identity.username;
            if (resolvedDisplayName) {
              return resolvedDisplayName;
            }
          }

          return null;
        },
      });
    }

    const normalizeProvider = (
      provider: ProviderKey,
      account:
        | {
            accountId: string;
            accessToken: string | null;
            refreshToken: string | null;
            accessTokenExpiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            scope: string | null;
          }
        | undefined,
      fallbackId: string | null | undefined
    ) => {
      const grantedScopes = account
        ? Array.from(new Set(parseScopes(account.scope)))
        : [];
      const requiredScopes = [...REQUIRED_PROVIDER_SCOPES[provider]];
      const missingScopes = account
        ? requiredScopes.filter((scope) => !grantedScopes.includes(scope))
        : [...requiredScopes];

      const fallbackCandidates: Array<string | null | undefined> =
        provider === "kick"
          ? [
              providerDisplayNames.kick,
              fallbackDisplayNames.kick,
              domainUser?.kickUsername,
              fallbackId,
              account?.accountId,
            ]
          : [
              providerDisplayNames.discord,
              fallbackDisplayNames.discord,
              domainUser?.discordUsername,
              fallbackId,
              account?.accountId,
            ];

      const fallbackDisplayName =
        fallbackCandidates.find((candidate): candidate is string =>
          Boolean(candidate)
        ) ?? null;

      const providerUsername =
        provider === "kick"
          ? domainUser?.kickUsername ?? fallbackDisplayNames.kick
          : domainUser?.discordUsername ?? fallbackDisplayNames.discord;

      const accountIdentifier = account?.accountId ?? fallbackId ?? null;

      return {
        linked: Boolean(account),
        accountId: accountIdentifier,
        username: providerUsername ?? null,
        displayName: providerDisplayNames[provider] ?? fallbackDisplayName,
        grantedScopes,
        missingScopes,
        needsRelink: Boolean(account) && missingScopes.length > 0,
        expiresAt: account?.accessTokenExpiresAt
          ? account.accessTokenExpiresAt.toISOString()
          : null,
        lastLinkedAt:
          (account?.updatedAt ?? account?.createdAt)?.toISOString() ?? null,
      };
    };

    return c.json({
      user: {
        id: domainUser?.id ?? null,
        extId: userId,
        email: domainUser?.email ?? session.user.email ?? null,
        username:
          domainUser?.username ??
          session.user.name ??
          (session.user.email ? session.user.email.split("@")[0] : null),
        discordId: domainUser?.discordId ?? null,
        discordUsername: domainUser?.discordUsername ?? null,
        kickId: domainUser?.kickId ?? null,
        kickUsername: domainUser?.kickUsername ?? null,
        customerId: domainUser?.customerId ?? null,
        timezone: domainUser?.timezone ?? null,
      },
      providers: {
        discord: normalizeProvider(
          "discord",
          discordAccount,
          domainUser?.discordId
        ),
        kick: normalizeProvider("kick", kickAccount, domainUser?.kickId),
      },
    });
  }),
  unlinkProvider: authProcedure
    .input(z.object({ provider: z.enum(["discord", "kick"]) }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;
      const provider = input.provider;

      try {
        const [accounts, targetAccount] = await Promise.all([
          db.account.findMany({
            where: { userId, providerId: { in: ["discord", "kick"] } },
            select: { providerId: true },
          }),
          db.account.findFirst({
            where: { userId, providerId: provider },
            select: { accountId: true },
          }),
        ]);

        if (!targetAccount) {
          return c.json({
            success: false,
            error: "Provider not linked",
          });
        }

        const linkedProviders = new Set(accounts.map((acc) => acc.providerId));

        if (linkedProviders.size <= 1) {
          return c.json({
            success: false,
            error: "You must keep at least one account linked.",
          });
        }

        await db.account.deleteMany({
          where: { userId, providerId: provider },
        });

        const updateData =
          provider === "discord" ? { discordId: null } : { kickId: null };

        await db.users.updateMany({
          where:
            provider === "discord"
              ? { extId: userId, discordId: targetAccount.accountId }
              : { extId: userId, kickId: targetAccount.accountId },
          data: updateData,
        });

        return c.json({ success: true });
      } catch (err: unknown) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: unknown }).message)
            : "Failed to unlink account";
        console.error("[accounts.unlinkProvider] error", err);
        return c.json({ success: false, error: message });
      }
    }),
});
