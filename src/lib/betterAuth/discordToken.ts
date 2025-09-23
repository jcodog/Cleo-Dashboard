import { PrismaClient } from "@prisma/client";

/**
 * Ensures we always return a valid Discord access token for the Better Auth user.
 * Strategy:
 * 1. Look up the discord Account row by (userId, providerId = 'discord').
 * 2. If accessTokenExpiresAt is in the future (or null -> treat as valid), return accessToken.
 * 3. If expired and refreshToken exists, attempt refresh via Discord OAuth token endpoint.
 * 4. Persist updated tokens back into Account row and return new accessToken.
 * 5. If refresh fails, throw so caller can prompt re-link.
 */
export async function getDiscordAccessToken(opts: {
  db: PrismaClient;
  userId: string; // Better Auth user.id (NOT your Users.id)
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  const { db, userId, clientId, clientSecret } = opts;

  const account = await (db as any).account.findFirst({
    where: { userId, providerId: "discord" },
  });

  if (!account || !account.accessToken) {
    throw new Error("No Discord account or access token linked for user");
  }

  const now = Date.now();
  const expiresAt = account.accessTokenExpiresAt
    ? new Date(account.accessTokenExpiresAt).getTime()
    : undefined;

  const isExpired = expiresAt
    ? expiresAt - now < 60_000 /* 1 min grace */
    : false;

  if (!isExpired) return account.accessToken as string;

  if (!account.refreshToken) {
    throw new Error("Discord token expired and no refresh token available");
  }

  // Attempt refresh
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
  });

  const response = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Discord access token");
  }

  const json = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number; // seconds
    scope?: string;
    token_type?: string;
  };

  const newAccessToken = json.access_token;
  const newRefresh = json.refresh_token ?? account.refreshToken;
  const expiresInMs = (json.expires_in ?? 3600) * 1000;
  const newExpiry = new Date(Date.now() + expiresInMs);

  await (db as any).account.update({
    where: { id: account.id },
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefresh,
      accessTokenExpiresAt: newExpiry,
      scope: json.scope ?? account.scope,
      updatedAt: new Date(),
    },
  });

  return newAccessToken;
}
