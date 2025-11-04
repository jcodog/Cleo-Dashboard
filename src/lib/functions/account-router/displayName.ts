import type { KVNamespace } from "@cloudflare/workers-types";
import type { ProviderKey } from "./scopes";

const PROVIDER_NAME_CACHE_TTL = 60 * 60 * 6; // 6 hours

export type ProviderDisplayNameLoader = () => Promise<string | null>;

export async function getCachedProviderDisplayName(opts: {
  kv?: KVNamespace;
  provider: ProviderKey;
  accountId: string;
  loader: ProviderDisplayNameLoader;
  ttl?: number;
}) {
  const {
    kv,
    provider,
    accountId,
    loader,
    ttl = PROVIDER_NAME_CACHE_TTL,
  } = opts;

  if (!accountId) {
    return null;
  }

  const cacheKey = `provider-display:${provider}:${accountId}`;

  if (kv) {
    try {
      const cached = await kv.get(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn("[accounts.linkedProviders] kv get failed", {
        cacheKey,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const fresh = await loader();

  if (fresh && kv) {
    try {
      await kv.put(cacheKey, fresh, { expirationTtl: ttl });
    } catch (error) {
      console.warn("[accounts.linkedProviders] kv put failed", {
        cacheKey,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return fresh;
}

export const pickString = (...values: unknown[]): string | null => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
};
