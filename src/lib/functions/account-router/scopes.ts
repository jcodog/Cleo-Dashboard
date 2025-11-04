export const REQUIRED_PROVIDER_SCOPES = {
  discord: [
    "identify",
    "email",
    "guilds",
    "connections",
    "guilds.members.read",
  ],
  kick: [
    "user:read",
    "channel:read",
    "channel:write",
    "chat:write",
    "streamkey:read",
    "events:subscribe",
    "moderation:ban",
  ],
} as const;

export type ProviderKey = keyof typeof REQUIRED_PROVIDER_SCOPES;

export const parseScopes = (scope?: string | null) =>
  scope
    ? scope
        .split(/[\,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
