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

		const discordId = user.externalAccounts.find(
			(account) => account.provider === "discord"
		)?.externalId;

		if (!discordId) {
			return c.json({
				success: false,
				message:
					"Discord id is required to sync the user with the database",
			});
		}

		try {
			const existingUser = await db.users.findUnique({
				where: { discordId },
				include: { limits: true },
			});

			let syncedUser;

			if (existingUser) {
				// update
				syncedUser = await db.users.update({
					where: { discordId },
					data: {
						username: user.username || "anonymous",
						email:
							user.primaryEmailAddress?.emailAddress ||
							"no@email.com",
						extId: existingUser.extId
							? existingUser.extId
							: user.id,
						limits: existingUser.limits
							? { update: { date: new Date() } }
							: { create: { date: new Date() } },
					},
					include: {
						limits: true,
					},
				});
			} else {
				// create
				syncedUser = await db.users.create({
					data: {
						username: user.username || "anonymous",
						email:
							user.primaryEmailAddress?.emailAddress ||
							"no@email.com",
						extId: user.id,
						discordId,
						limits: {
							create: {
								date: new Date(),
							},
						},
					},
					include: { limits: true },
				});
			}

			return c.json({
				success: true,
				message: "User synced successfully",
				syncedUser,
			});
		} catch (err) {
			console.error(err);

			return c.json({
				success: false,
				message:
					"Something went wrong syncing the user with the database",
			});
		}
	}),
});
