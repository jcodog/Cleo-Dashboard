import { authProcedure, j } from "@/server/jstack";
import { RESTGetAPIUserResult } from "discord-api-types/v10";

// Renamed from authRouter to sessionRouter to avoid collision with Better Auth's /api/auth endpoints
export const sessionRouter = j.router({
  sync_user: authProcedure.query(
    async ({ c, ctx }: { c: any; ctx: { db: any; session: any } }) => {
      const { db, session } = ctx;
      const userId: string = session.user.id;
      try {
        const exists = await db.users.findFirst({ where: { extId: userId } });
        return c.json({ synced: !!exists });
      } catch (err) {
        console.error("Error checking user sync", err);
        return c.json({ synced: false });
      }
    }
  ),

  getDiscordAvatar: authProcedure.query(
    async ({ c, ctx }: { c: any; ctx: { session: any; db: any } }) => {
      const { session, db } = ctx;
      try {
        const userId: string = session.user.id;
        const account = await db.account.findFirst({
          where: { userId, providerId: "discord" },
        });
        if (!account?.accessToken) return c.json({ avatar: null, url: null });
        const accessToken = account.accessToken;
        const res = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return c.json({ avatar: null, url: null });
        const du = (await res.json()) as RESTGetAPIUserResult;
        const id = du.id;
        const avatar = du.avatar;
        if (!id || !avatar) return c.json({ avatar: null, url: null });
        const isGif = avatar.startsWith("a_");
        const url = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
          isGif ? "gif" : "png"
        }?size=256`;
        return c.json({ avatar, url });
      } catch (err) {
        console.error("getDiscordAvatar error", err);
        return c.json({ avatar: null, url: null });
      }
    }
  ),
});
