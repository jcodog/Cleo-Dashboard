import { pickString } from "@/lib/functions/account-router/displayName";
import type {
  RESTGetChannelsResult,
  RESTGetUsersResult,
} from "kick-api-types/rest/v1";

const KICK_PUBLIC_API_BASE = "https://api.kick.com/public/v1";
const ROUTES = {
  Channels: () => "/channels",
  Users: () => "/users",
} as const;

type ChannelPayload = RESTGetChannelsResult | { data?: unknown };
type ChannelEntity = RESTGetChannelsResult["data"] extends Array<infer T>
  ? T
  : never;

type UsersPayload = RESTGetUsersResult | { data?: unknown };
type UserEntity = RESTGetUsersResult["data"] extends Array<infer T> ? T : never;

export type KickIdentity = {
  username: string | null;
  displayName: string | null;
  userId: number | null;
};

export type FetchKickIdentityOptions = {
  candidate: string;
  token: string | null | undefined;
};

const buildHeaders = (token: string) => ({
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

const parseChannelResult = (payload: ChannelPayload) => {
  const data = Array.isArray(payload.data) ? payload.data : [];
  const first = data[0] as ChannelEntity | undefined;

  if (!first || typeof first !== "object") {
    return { slug: null as string | null, userId: null as number | null };
  }

  const slug = pickString((first as { slug?: unknown }).slug);
  const broadcasterId = (first as { broadcaster_user_id?: unknown })
    .broadcaster_user_id;

  return {
    slug: slug ? slug.toLowerCase() : null,
    userId:
      typeof broadcasterId === "number"
        ? broadcasterId
        : typeof broadcasterId === "string" && /^\d+$/.test(broadcasterId)
        ? Number.parseInt(broadcasterId, 10)
        : null,
  };
};

const parseUserResult = (payload: UsersPayload, userId: number | null) => {
  const data = Array.isArray(payload.data) ? payload.data : [];
  const first = data[0] as UserEntity | undefined;

  if (!first || typeof first !== "object") {
    return {
      displayName: null as string | null,
      userId,
    };
  }

  const resolvedId = (first as { user_id?: unknown }).user_id;
  const normalizedId =
    typeof resolvedId === "number"
      ? resolvedId
      : typeof resolvedId === "string" && /^\d+$/.test(resolvedId)
      ? Number.parseInt(resolvedId, 10)
      : null;

  return {
    displayName: pickString((first as { name?: unknown }).name),
    userId: normalizedId ?? userId,
  };
};

export async function fetchKickIdentity(
  options: FetchKickIdentityOptions
): Promise<KickIdentity> {
  const { candidate, token } = options;
  const trimmed = candidate.trim();

  if (!trimmed) {
    return { username: null, displayName: null, userId: null };
  }

  if (!token) {
    console.warn("[accounts.linkedProviders] missing kick access token");
    return { username: null, displayName: null, userId: null };
  }

  const isNumeric = /^\d+$/.test(trimmed);
  let slugCandidate = isNumeric ? null : trimmed.toLowerCase();
  let userIdCandidate = isNumeric ? Number.parseInt(trimmed, 10) : null;
  let displayName: string | null = null;

  const headers = buildHeaders(token);

  // Resolve slug -> user id
  if (slugCandidate) {
    try {
      const channelUrl = new URL(`${KICK_PUBLIC_API_BASE}${ROUTES.Channels()}`);
      channelUrl.searchParams.append("slug", slugCandidate);
      const response = await fetch(channelUrl.toString(), { headers });

      if (response.ok) {
        const payload = (await response.json()) as ChannelPayload;
        const { slug, userId } = parseChannelResult(payload);
        slugCandidate = slug ?? slugCandidate;
        userIdCandidate = userId ?? userIdCandidate;
      } else if (response.status !== 404) {
        const body = await response.text().catch(() => "<unavailable>");
        console.warn("[accounts.linkedProviders] kick channel lookup failed", {
          status: response.status,
          body: body?.slice(0, 300),
        });
      }
    } catch (error) {
      console.warn("[accounts.linkedProviders] kick channel lookup error", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Resolve user id -> slug
  if (!slugCandidate && userIdCandidate !== null) {
    try {
      const channelUrl = new URL(`${KICK_PUBLIC_API_BASE}${ROUTES.Channels()}`);
      channelUrl.searchParams.append(
        "broadcaster_user_id",
        String(userIdCandidate)
      );
      const response = await fetch(channelUrl.toString(), { headers });

      if (response.ok) {
        const payload = (await response.json()) as ChannelPayload;
        const { slug } = parseChannelResult(payload);
        slugCandidate = slug ?? slugCandidate;
      } else if (response.status !== 404) {
        const body = await response.text().catch(() => "<unavailable>");
        console.warn("[accounts.linkedProviders] kick channel-by-id failed", {
          status: response.status,
          body: body?.slice(0, 300),
        });
      }
    } catch (error) {
      console.warn("[accounts.linkedProviders] kick channel-by-id error", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Resolve display name from user endpoint if we have an ID
  if (userIdCandidate !== null) {
    try {
      const usersUrl = new URL(`${KICK_PUBLIC_API_BASE}${ROUTES.Users()}`);
      usersUrl.searchParams.append("id", String(userIdCandidate));
      const response = await fetch(usersUrl.toString(), { headers });

      if (response.ok) {
        const payload = (await response.json()) as UsersPayload;
        const { displayName: resolvedDisplayName, userId } = parseUserResult(
          payload,
          userIdCandidate
        );
        displayName = resolvedDisplayName ?? displayName;
        userIdCandidate = userId ?? userIdCandidate;
      } else if (response.status !== 404) {
        const body = await response.text().catch(() => "<unavailable>");
        console.warn("[accounts.linkedProviders] kick users lookup failed", {
          status: response.status,
          body: body?.slice(0, 300),
        });
      }
    } catch (error) {
      console.warn("[accounts.linkedProviders] kick users lookup error", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const normalizedUsername = slugCandidate ? slugCandidate.toLowerCase() : null;

  return {
    username: normalizedUsername,
    displayName: displayName ?? normalizedUsername,
    userId: userIdCandidate,
  };
}
