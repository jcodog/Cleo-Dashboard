import { botProcedure, j } from "@/server/jstack";

export const cleoRouter = j.router({
	validatePremium: botProcedure.query(async ({ c, ctx }) => {
		const { user } = ctx;

		const { premiumSubscriptions } = user;
		if (!premiumSubscriptions) {
			return c.json({
				valid: false,
				reason: "No subscription found",
			});
		}

		const now = Date.now();
		const subscriptionTs = new Date(premiumSubscriptions.endDate).getTime();

		if (subscriptionTs < now) {
			return c.json({
				valid: false,
				reason: "Subscription expired",
			});
		}

		return c.json({
			valid: true,
			reason: "Subscription valid",
		});
	}),

	validateLimits: botProcedure.query(async ({ c, ctx }) => {
		const { user } = ctx;

		const { limits } = user;

		if (!limits) {
			return c.json({
				valid: false,
				reason: "No limits found",
			});
		}

		// Compare timestamps instead of Date objects
		const now = Date.now();
		// Normalize to midnight for day comparison
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const limitDayTs = new Date(limits.date).setHours(0, 0, 0, 0);

		if (limitDayTs === today.getTime()) {
			if (limits.aiUsed + 1 > limits.aiLimit) {
				return c.json({ valid: false, reason: "AI limit reached" });
			}
			return c.json({ valid: true, reason: "AI limit not reached" });
		}

		return c.json({
			valid: true,
			reason: "New day so limits reset",
		});
	}),

	subscriptionTier: botProcedure.query(async ({ c, ctx }) => {
		const { user } = ctx;
		const { premiumSubscriptions } = user;

		if (!premiumSubscriptions) {
			return c.json({
				tier: "FREE",
				reason: "No subscription found",
			});
		}

		const now = Date.now();
		const subscriptionTs = new Date(premiumSubscriptions.endDate).getTime();

		if (subscriptionTs < now) {
			return c.json({
				tier: "EXPIRED",
				reason: "Subscription expired",
			});
		}

		return c.json({
			tier: premiumSubscriptions.tier,
			reason: "Subscription valid",
		});
	}),
});
