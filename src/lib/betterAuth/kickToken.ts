import { DbClient } from "@/lib/prisma";

/**
 * Retrieves a valid Kick access token for the Better Auth user, refreshing when required.
 */
export async function getKickAccessToken(opts: {
  db: DbClient;
  userId: string;
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  const { db, userId, clientId, clientSecret } = opts;

  const account = await db.account.findFirst({
    where: { userId, providerId: "kick" },
    cacheStrategy: {
      ttl: 60,
    },
  });

  if (!account || !account.accessToken) {
    console.warn("[kickToken] missing account/accessToken", { userId });
    throw new Error("No Kick account or access token linked for user");
  }

  const now = Date.now();
  const expiresAt = account.accessTokenExpiresAt
    ? new Date(account.accessTokenExpiresAt).getTime()
    : undefined;

  const isExpired = expiresAt ? expiresAt - now < 60_000 : false;

  if (!isExpired) {
    const remaining = expiresAt ? expiresAt - now : undefined;
    if (remaining && remaining < 5 * 60_000) {
      console.info("[kickToken] token valid but near expiry", {
        userId,
        remainingMs: remaining,
      });
    }
    return account.accessToken;
  }

  if (!account.refreshToken) {
    console.error("[kickToken] expired token without refresh token", {
      userId,
      accountId: account.id,
    });
    throw new Error("Kick token expired and no refresh token available");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
  });

  console.info("[kickToken] refreshing kick token", { userId });
  const response = await fetch("https://id.kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "<no-body>");
    console.error("[kickToken] refresh failed", {
      userId,
      status: response.status,
      body: text?.slice(0, 300),
    });
    throw new Error("Failed to refresh Kick access token");
  }

  const json = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  };

  const newAccessToken = json.access_token;
  const newRefresh = json.refresh_token ?? account.refreshToken;
  const expiresInMs = (json.expires_in ?? 3600) * 1000;
  const newExpiry = new Date(Date.now() + expiresInMs);

  await db.account.update({
    where: { id: account.id },
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefresh,
      accessTokenExpiresAt: newExpiry,
      scope: json.scope ?? account.scope,
      updatedAt: new Date(),
    },
  });

  console.info("[kickToken] refresh success", {
    userId,
    expiresAt: newExpiry.toISOString(),
  });

  return newAccessToken;
}
