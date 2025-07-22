import { clerkProcedure, j } from "@/server/jstack";

export const authRouter = j.router({
	sync_user: clerkProcedure.mutation(async ({ c, ctx }) => {
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
});
