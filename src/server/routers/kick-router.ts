import { j, kickProcedure } from "@/server/jstack";
import {
  KICK_SUPPORTED_EVENTS,
  KickEventSubscriptionState,
} from "@/lib/kick/events";
import { ContentfulStatusCode } from "hono/utils/http-status";
import {
  RESTError,
  RESTGetEventSubscriptionsResult,
  RESTPostEventSubscriptionsBody,
  RESTPostEventSubscriptionsResult,
} from "kick-api-types/rest";
import type { EventNames, EventSubscription } from "kick-api-types/payloads";
import z from "zod";

const KICK_API_BASE_URL = "https://api.kick.com/public/v1";
const KICK_EVENTS_SUBSCRIPTIONS_URL =
  KICK_API_BASE_URL + "/events/subscriptions";
const KICK_EVENT_VERSION = 1;

const isSupportedKickEvent = (value: EventNames): value is EventNames =>
  KICK_SUPPORTED_EVENTS.includes(value);

const eventNameSchema = z.enum(
  KICK_SUPPORTED_EVENTS as [EventNames, ...EventNames[]]
);

const parseKickErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as Partial<RESTError> | null;
    return payload?.message ?? `Kick API responded with ${response.status}`;
  } catch {
    return response.statusText || `Kick API responded with ${response.status}`;
  }
};

export const kickRouter = j.router({
  subscribedEvents: kickProcedure.query(async ({ c, ctx }) => {
    let res: Response;

    try {
      res = await fetch(KICK_EVENTS_SUBSCRIPTIONS_URL, {
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
      return c.json(
        { message: await parseKickErrorMessage(res) },
        { status: res.status as ContentfulStatusCode }
      );
    }

    const events = (await res.json()) as RESTGetEventSubscriptionsResult;

    const lookups = new Map<EventNames, EventSubscription>();
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
        event: eventNameSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const body: RESTPostEventSubscriptionsBody = {
        events: [
          {
            name: input.event,
            version: KICK_EVENT_VERSION,
          },
        ],
        method: "webhook",
      };

      const broadcasterId = ctx.accountId
        ? Number.parseInt(ctx.accountId, 10)
        : Number.NaN;
      if (Number.isInteger(broadcasterId) && broadcasterId > 0) {
        body.broadcaster_user_id = broadcasterId;
      }

      let res: Response;

      try {
        res = await fetch(KICK_EVENTS_SUBSCRIPTIONS_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to reach Kick API";
        return c.json({ message }, { status: 502 });
      }

      let payload: RESTPostEventSubscriptionsResult | null = null;

      if (!res.ok) {
        return c.json(
          { message: await parseKickErrorMessage(res) },
          { status: res.status as ContentfulStatusCode }
        );
      }

      try {
        payload = (await res.json()) as RESTPostEventSubscriptionsResult;
      } catch {
        payload = null;
      }

      const event = payload?.data?.find((item) => item.name === input.event);

      return c.json(
        {
          message: payload?.message ?? "Subscribed to Kick event",
          event: event ?? {
            name: input.event,
            subscription_id: undefined,
            version: KICK_EVENT_VERSION,
          },
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
        const url = new URL(KICK_EVENTS_SUBSCRIPTIONS_URL);
        url.searchParams.set("id", input.id);

        res = await fetch(url.toString(), {
          method: "DELETE",
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
        return c.json(
          { message: await parseKickErrorMessage(res) },
          { status: res.status as ContentfulStatusCode }
        );
      }

      return c.json({ message: "Event unsubscribed" }, { status: 200 });
    }),
});
