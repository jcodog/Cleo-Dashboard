export const KICK_SUPPORTED_EVENTS = [
  "channel.followed",
  "channel.subscription.renewal",
  "channel.subscription.gifts",
  "channel.subscription.new",
  "livestream.status.updated",
  "kicks.gifted",
  "chat.message.sent",
] as const;

export type KickEventName = (typeof KICK_SUPPORTED_EVENTS)[number];

export interface KickEventSubscriptionState {
  name: KickEventName;
  subscribed: boolean;
  subscriptionId: string | null;
}
