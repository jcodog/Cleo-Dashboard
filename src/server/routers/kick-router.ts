import { j, kickProcedure } from "@/server/jstack";
import {
  KICK_SUPPORTED_EVENTS,
  type KickEventName,
  type KickEventSubscriptionState,
} from "@/lib/kick/events";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { RESTError, RESTResult } from "kick-api-types/rest/v1";
import z from "zod";

const isSupportedKickEvent = (value: string): value is KickEventName =>
  KICK_SUPPORTED_EVENTS.includes(value as KickEventName);

export interface EventSubscription {
  app_id: string;
  broadcaster_user_id: number;
  created_at: string;
  event: KickEventName;
  id: string;
  method: string;
  updated_at: string;
  version: number;
}

export type EventSubscriptions = EventSubscription[];

export interface EventSubscriptionResult {
  error?: string;
  name: KickEventName;
  subscription_id?: string;
  version: number;
}

export type EventSubscriptionResults = EventSubscriptionResult[];

/**
 * @see {@link https://docs.kick.com/events/subscribe-to-events#get-events-subscriptions}
 */
export type RESTGetEventSubscriptionsResult = RESTResult<EventSubscriptions>;

/**
 * @see {@link https://docs.kick.com/events/subscribe-to-events#post-events-subscriptions}
 */
export interface RESTPostEventSubscriptionsBody {
  /**
   * The ID of the broadcaster whose events you want to listen to.
   */
  broadcaster_user_id?: number;

  /**
   * An array of specific events to subscribe to.
   *
   * @see {@link https://docs.kick.com/events/event-types}
   */
  events: Array<{
    /**
     * The name of the event
     */
    name: KickEventName;

    /**
     * The version of the event
     */
    version: string;
  }>;

  /**
   * The subscription method. Currently, only 'webhook' is supported.
   */
  method: "webhook";
}

/**
 * @see {@link https://docs.kick.com/events/subscribe-to-events#post-events-subscriptions}
 */
export type RESTPostEventSubscriptionsResult =
  RESTResult<EventSubscriptionResults>;

/**
 * OK result returns 204
 *
 * @see {@link https://docs.kick.com/events/subscribe-to-events#delete-events-subscriptions}
 */
export type RESTDeleteEventSubscriptionsResult = never;

export const kickRouter = j.router({
  subscribedEvents: kickProcedure.query(async ({ c, ctx }) => {
    let res: Response;

    try {
      res = await fetch("https://api.kick.com/public/v1/events/subscriptions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.accessToken}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reach Kick API";
      return c.json({ message }, { status: 502 });
    }

    if (!res.ok) {
      let errored: RESTError | null = null;
      try {
        errored = (await res.json()) as RESTError;
      } catch {
        errored = null;
      }

      return c.json(
        { message: errored?.message ?? "Failed to load Kick subscriptions" },
        { status: res.status as ContentfulStatusCode }
      );
    }

    const events = (await res.json()) as RESTGetEventSubscriptionsResult;

    const lookups = new Map<string, EventSubscription>();
    for (const subscription of events.data ?? []) {
      if (!subscription?.event) continue;
      if (!isSupportedKickEvent(subscription.event)) continue;
      lookups.set(subscription.event, subscription);
    }

    const payload: KickEventSubscriptionState[] = KICK_SUPPORTED_EVENTS.map(
      (eventName) => {
        const subscription = lookups.get(eventName) ?? null;
        return {
          name: eventName,
          subscribed: Boolean(subscription),
          subscriptionId: subscription?.id ?? null,
        } satisfies KickEventSubscriptionState;
      }
    );

    return c.json({ events: payload }, { status: 200 });
  }),

  subscribeEvent: kickProcedure
    .input(
      z.object({
        event: z
          .string()
          .refine(
            (value): value is KickEventName => isSupportedKickEvent(value),
            {
              message: "Unsupported Kick event",
            }
          ),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const broadcasterId = Number.parseInt(ctx.accountId ?? "", 10);
      const body: RESTPostEventSubscriptionsBody = {
        events: [
          {
            name: input.event as KickEventName,
            version: "1",
          },
        ],
        method: "webhook",
      };

      if (Number.isFinite(broadcasterId)) {
        body.broadcaster_user_id = broadcasterId;
      }

      let res: Response;

      try {
        res = await fetch(
          "https://api.kick.com/public/v1/events/subscriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ctx.accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to reach Kick API";
        return c.json({ message }, { status: 502 });
      }

      let payload: RESTPostEventSubscriptionsResult | null = null;

      if (!res.ok) {
        try {
          const errored = (await res.json()) as RESTError;
          return c.json(
            { message: errored.message },
            { status: res.status as ContentfulStatusCode }
          );
        } catch {
          return c.json(
            { message: "Failed to subscribe to Kick event" },
            { status: res.status as ContentfulStatusCode }
          );
        }
      }

      try {
        payload = (await res.json()) as RESTPostEventSubscriptionsResult;
      } catch {
        payload = null;
      }

      const event = payload?.data?.find(
        (item) => item.name === input.event
      ) ?? {
        name: input.event,
        subscription_id: undefined,
        version: 1,
      };

      return c.json(
        {
          message: payload?.message ?? "Subscribed to Kick event",
          event,
        },
        { status: 200 }
      );
    }),

  unsubscribeEvent: kickProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      let res: Response;

      try {
        res = await fetch(
          `https://api.kick.com/public/v1/events/subscriptions?id=${input.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${ctx.accessToken}`,
              Accept: "application/json",
            },
          }
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to reach Kick API";
        return c.json({ message }, { status: 502 });
      }

      if (!res.ok) {
        let errored: RESTError | null = null;
        try {
          errored = (await res.json()) as RESTError;
        } catch {
          errored = null;
        }

        return c.json(
          { message: errored?.message ?? "Failed to unsubscribe from event" },
          { status: res.status as ContentfulStatusCode }
        );
      }

      return c.json({ message: "Event unsubscribed" }, { status: 200 });
    }),
});
