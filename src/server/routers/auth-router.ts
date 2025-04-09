import { clerkProcedure, j } from "@/server/jstack";

export const authRouter = j.router({
	sync_user: clerkProcedure.mutation(async ({ c, ctx }) => {
		const { db, client, token } = ctx;

		const session = await client.sessions.getSession(token.sid);

		if (!session) {
			return c.json({
				success: false,
				message: "Failed to sync user with the database. (no user)",
			});
		}

		const user = await client.users.getUser(session.userId);

		if (!user) {
			return c.json({
				success: false,
				message: "Failed to sync user with the database. (no user)",
			});
		}

		try {
			const syncedUser = await db.users.upsert({
				where: {
					extId: user.id,
				},
				update: {
					username: user.username!,
					email: user.primaryEmailAddress!.emailAddress,
					forename: user.firstName!,
					surname: user.lastName!,
				},
				create: {
					extId: user.id!,
					email: user.primaryEmailAddress!.emailAddress,
					username: user.username!,
					forename: user.firstName!,
					surname: user.lastName!,
				},
			});

			return c.json({
				success: true,
				message: "User synced with the database",
				user: syncedUser,
			});
		} catch (err) {
			console.error(err);

			return c.json({
				success: false,
				message: "Failed to sync user with the database",
			});
		}
	}),
});
