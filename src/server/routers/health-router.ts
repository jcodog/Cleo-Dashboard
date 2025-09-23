import { j, authProcedure, dashProcedure } from "@/server/jstack";
import { getDiscordAccessToken } from "@/lib/betterAuth/discordToken";
import { env } from "hono/adapter";
import type { RESTGetAPIUserResult } from "discord-api-types/v10";

/**
 * Health router providing diagnostic endpoints for auth + discord linkage.
 * Not intended for public exposure beyond internal debugging.
 */
export const healthRouter = j.router({
  /**
   * Lightweight session probe (no discord fetch) – validates Better Auth session only.
   */
  session: authProcedure.query(async ({ c, ctx }) => {
    const { session } = ctx;
    return c.json({
      ok: true,
      user: { id: session.user.id, email: session.user.email },
      at: new Date().toISOString(),
    });
  }),

  /**
   * Deep linkage probe – requires dash auth (domain user) and validates discord token & id sync.
   */
  discord: dashProcedure.query(async ({ c, ctx }) => {
    const { db, user, session } = ctx;
    const betterAuthUserId: string = session.user.id;

    // Acquire (refresh if needed) discord access token
    let accessToken: string | null = null;
    let tokenStatus: string = "unknown";
    try {
      accessToken = await getDiscordAccessToken({
        db,
        userId: betterAuthUserId,
        clientId: env(c).DISCORD_CLIENT_ID,
        clientSecret: env(c).DISCORD_CLIENT_SECRET,
      });
      tokenStatus = "valid";
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: unknown }).message)
          : "token failure";
      tokenStatus = "error:" + message;
    }

    let discordUser: RESTGetAPIUserResult | null = null;
    let discordFetchOk = false;
    if (accessToken) {
      const res = await fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      discordFetchOk = res.ok;
      if (res.ok) {
        try {
          discordUser = (await res.json()) as RESTGetAPIUserResult;
        } catch {}
      }
    }

    return c.json({
      ok: true,
      at: new Date().toISOString(),
      betterAuthUserId,
      domainUser: {
        id: user.id,
        extId: user.extId,
        discordId: user.discordId,
      },
      discord: {
        fetchOk: discordFetchOk,
        tokenStatus,
        resolvedId: discordUser?.id || null,
        username: discordUser?.username || null,
        mismatch:
          discordUser?.id && discordUser.id !== user.discordId ? true : false,
      },
    });
  }),
});
