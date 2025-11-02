import { authProcedure, j } from "@/server/jstack";
import { z } from "zod";

export const accountsRouter = j.router({
  linkedProviders: authProcedure.query(async ({ c, ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    const [accounts, domainUser] = await Promise.all([
      db.account.findMany({
        where: { userId },
        select: {
          providerId: true,
          accountId: true,
          accessTokenExpiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.users.findFirst({
        where: { extId: userId },
        select: {
          id: true,
          username: true,
          email: true,
          discordId: true,
          kickId: true,
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

    const normalizeProvider = (
      account:
        | {
            accountId: string;
            accessTokenExpiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
          }
        | undefined,
      fallbackId: string | null | undefined
    ) => ({
      linked: Boolean(account),
      accountId: account?.accountId ?? fallbackId ?? null,
      expiresAt: account?.accessTokenExpiresAt
        ? account.accessTokenExpiresAt.toISOString()
        : null,
      lastLinkedAt:
        (account?.updatedAt ?? account?.createdAt)?.toISOString() ?? null,
    });

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
        kickId: domainUser?.kickId ?? null,
        customerId: domainUser?.customerId ?? null,
        timezone: domainUser?.timezone ?? null,
      },
      providers: {
        discord: normalizeProvider(discordAccount, domainUser?.discordId),
        kick: normalizeProvider(kickAccount, domainUser?.kickId),
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
