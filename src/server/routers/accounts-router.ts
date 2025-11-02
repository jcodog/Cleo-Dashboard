import { authProcedure, j } from "@/server/jstack";

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
    const kickAccount = accounts.find((account) => account.providerId === "kick");

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
      lastLinkedAt: (account?.updatedAt ?? account?.createdAt)?.toISOString() ?? null,
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
});
