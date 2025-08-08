import { clerkProcedure, j } from "@/server/jstack";
import { RESTGetAPIUserResult } from "discord-api-types/v10";

export const authRouter = j.router({
  sync_user: clerkProcedure.query(async ({ c, ctx }) => {
    const { client, token, db } = ctx;
    // get clerk session and user
    const session = await client.sessions.getSession(token.sid);
    if (!session) return c.json({ synced: false });
    const user = await client.users.getUser(session.userId);
    if (!user) return c.json({ synced: false });
    // extract discordId
    const discordId = user.externalAccounts.find(
      (account) => account.provider === "oauth_discord"
    )?.externalId;
    if (!discordId) return c.json({ synced: false });
    // check if user is synced by webhook
    try {
      const exists = await db.users.findUnique({ where: { discordId } });
      return c.json({ synced: !!exists });
    } catch (err: any) {
      console.error("Error checking user sync", err);
      return c.json({ synced: false });
    }
  }),

  // Returns the user's current Discord avatar hash and a CDN URL (if any)
  getDiscordAvatar: clerkProcedure.query(async ({ c, ctx }) => {
    const { client, token } = ctx;
    try {
      const session = await client.sessions.getSession(token.sid);
      if (!session) return c.json({ avatar: null, url: null });

      // Get Discord OAuth token for the user
      const tokens = (
        await client.users.getUserOauthAccessToken(session.userId, "discord")
      ).data;
      if (!tokens || !tokens[0]?.token)
        return c.json({ avatar: null, url: null });

      const accessToken = tokens[0].token;
      const res = await fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return c.json({ avatar: null, url: null });
      const du = (await res.json()) as RESTGetAPIUserResult;

      const id = du.id;
      const avatar = du.avatar; // may be null
      if (!id || !avatar) {
        return c.json({ avatar: null, url: null });
      }
      const isGif = avatar.startsWith("a_");
      const url = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
        isGif ? "gif" : "png"
      }?size=256`;
      return c.json({ avatar, url });
    } catch (err) {
      console.error("getDiscordAvatar error", err);
      return c.json({ avatar: null, url: null });
    }
  }),
});
