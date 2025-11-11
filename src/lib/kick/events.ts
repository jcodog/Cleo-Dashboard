import { EventNames } from "kick-api-types/payloads";

export const KICK_SUPPORTED_EVENTS: EventNames[] = [
  "channel.followed",
  "channel.subscription.renewal",
  "channel.subscription.gifts",
  "channel.subscription.new",
  "livestream.status.updated",
  "kicks.gifted",
  "chat.message.sent"
] as const;

export interface KickEventSubscriptionState {
  name: EventNames;
  subscribed: boolean;
  subscriptionId: string | null;
}
