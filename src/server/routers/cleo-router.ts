import { botProcedure, j } from "@/server/jstack";
import z from "zod";

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

    // Use UTC start-of-day timestamps for day comparison
    const startOfUtcDay = (d: Date) => {
      const x = new Date(d);
      x.setUTCHours(0, 0, 0, 0);
      return x.getTime();
    };

    const todayUtcStart = startOfUtcDay(new Date());
    const limitUtcStart = startOfUtcDay(new Date(limits.date));

    if (limitUtcStart === todayUtcStart) {
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

  incrementUsage: botProcedure.mutation(async ({ c, ctx }) => {
    const { user, db } = ctx;

    if (!user.limits)
      return c.json({
        success: false,
        message: "User has no limits to increment",
      });

    // Use UTC start-of-day timestamps for day comparison
    const startOfUtcDay = (d: Date) => {
      const x = new Date(d);
      x.setUTCHours(0, 0, 0, 0);
      return x.getTime();
    };

    const todayUtcStart = startOfUtcDay(new Date());
    const limitUtcStart = startOfUtcDay(new Date(user.limits.date));
    const isSameUtcDay = limitUtcStart === todayUtcStart;

    if (isSameUtcDay) {
      await db.limits.update({
        where: {
          id: user.id,
        },
        data: {
          aiUsed: user.limits.aiUsed + 1,
        },
      });
    } else {
      await db.limits.update({
        where: {
          id: user.id,
        },
        data: {
          aiUsed: 1,
          date: new Date(),
        },
      });
    }

    return c.json({
      success: true,
      message: isSameUtcDay
        ? "Usage incremented by 1"
        : "Limits reset and usage incremented by 1",
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

  moderateMessage: botProcedure
    .input(
      z.object({
        guildId: z.string(),
        message: z.object({
          id: z.string(),
          content: z.string(),
          channelId: z.string(),
          nsfwChannel: z.boolean(),
        }),
        user: {
          id: z.string(),
          username: z.string(),
        },
      })
    )
    .mutation(async ({ c, ctx: { db }, input: { guildId, message, user } }) => {
      const config = await db.automodConfig.findUnique({
        where: {
          guildId,
        },
      });

      if (!config || !config.active) {
        return c.json({
          success: false,
          error: "Missing config or config set to disabled.",
        });
      }

      if (
        Array.isArray(config.ignoredChannels) &&
        config.ignoredChannels.includes(message.channelId)
      ) {
        return c.json({
          success: true,
          approved: true,
          message: "Channel is ignored for screening",
        });
      }

      if (config.profanity) {
        // profanity.dev check for profanity
      }

      if (config.matureContent) {
        // Use ai to assess if the content is mature content in a channel that isnt nsfw
      }

      if (config.links) {
        // extract all urls from the message
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex) || [];

        for (const url of urls) {
          // allow discord gif urls
          const isDiscordGif =
            /https?:\/\/(?:media\.)?tenor\.com\/[^\s]+\.gif(?:\?.*)?$/i.test(
              url
            );
          // allow any URL that matches one of your approved links in config.approvedLinks
          const isApprovedLink =
            Array.isArray(config.approvedLinks) &&
            config.approvedLinks.some((allowed) => url.includes(allowed));

          if (!isDiscordGif && !isApprovedLink) {
            return c.json({
              success: false,
              approved: false,
              message: "Links are not allowed in this channel.",
            });
          }
        }
      }

      return c.json({
        success: true,
        approved: true,
        message:
          "Message was not violating any of the filters enabled for this guild.",
      });
    }),
});
