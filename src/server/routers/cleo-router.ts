import { botProcedure, j } from "@/server/jstack";

export const cleoRouter = j.router({
	validatePremium: botProcedure.query(async ({ c, ctx }) => {
		const { user, db } = ctx;

		const premiumSub = await db.premiumSubscriptions.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!premiumSub) {
			return c.json({
				valid: false,
				reason: "No subscription found",
			});
		}
	}),
});
