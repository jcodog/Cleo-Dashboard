"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/client";
import { authClient } from "@/lib/authClient";

export const PROVIDER_PATH = {
  discord: "/dashboard/d",
  kick: "/dashboard/k",
} as const;

export type LinkedProvider = keyof typeof PROVIDER_PATH;

export const PROVIDER_LABEL: Record<LinkedProvider, string> = {
  discord: "Discord",
  kick: "Kick",
};

export const PROVIDER_DESCRIPTION: Record<LinkedProvider, string> = {
  discord: "Manage Cleo for Discord servers, automations, and billing.",
  kick: "Control Cleo for Kick creators, chat commands, and channel tools.",
};

export type ProviderStatus = {
  linked: boolean;
  accountId: string | null;
  username: string | null;
  displayName: string | null;
  grantedScopes: string[];
  missingScopes: string[];
  needsRelink: boolean;
  expiresAt: string | null;
  lastLinkedAt: string | null;
};

export type LinkedAccountsData = {
  user: {
    id: string | null;
    extId: string;
    username: string | null;
    email: string | null;
    discordId: string | null;
    discordUsername: string | null;
    kickId: string | null;
    kickUsername: string | null;
    customerId: string | null;
    timezone: string | null;
  };
  providers: {
    discord: ProviderStatus;
    kick: ProviderStatus;
  };
};

export const fetchLinkedAccounts = async (): Promise<LinkedAccountsData> => {
  const res = await client.accounts.linkedProviders.$get();
  if (!res.ok) {
    throw new Error("Failed to load linked accounts");
  }
  return await res.json();
};

export const useLinkedAccounts = () => {
  const queryClient = useQueryClient();
  const [linkingProvider, setLinkingProvider] = useState<LinkedProvider | null>(
    null
  );
  const [unlinkingProvider, setUnlinkingProvider] =
    useState<LinkedProvider | null>(null);

  const query = useQuery({
    queryKey: ["linked-accounts"],
    queryFn: fetchLinkedAccounts,
  });

  const linkedCount = useMemo(() => {
    const providers = query.data?.providers;
    if (!providers) return 0;
    return Number(providers.discord.linked) + Number(providers.kick.linked);
  }, [query.data?.providers]);

  const invalidateLinkedAccounts = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
  }, [queryClient]);

  const handleLink = useCallback(
    async (provider: LinkedProvider) => {
      if (linkingProvider || unlinkingProvider) return;

      setLinkingProvider(provider);
      let timeout: ReturnType<typeof setTimeout> | undefined;

      try {
        timeout = setTimeout(() => {
          setLinkingProvider(null);
          toast.error(
            "Taking longer than expected. Please complete the linking window."
          );
        }, 6000);

        await authClient.linkSocial({
          provider,
          callbackURL: PROVIDER_PATH[provider],
        });

        setTimeout(() => {
          invalidateLinkedAccounts();
          setLinkingProvider(null);
        }, 3500);
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Unable to start linking flow";
        toast.error(message);
        setLinkingProvider(null);
      } finally {
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    },
    [linkingProvider, unlinkingProvider, invalidateLinkedAccounts]
  );

  const handleUnlink = useCallback(
    async (provider: LinkedProvider) => {
      if (unlinkingProvider || linkingProvider) return;

      if (linkedCount <= 1) {
        toast.error("You must keep at least one account linked.");
        return;
      }

      setUnlinkingProvider(provider);
      const label = PROVIDER_LABEL[provider];

      try {
        const res = await client.accounts.unlinkProvider.$post({ provider });
        let json: { success?: boolean; error?: string } | null = null;

        try {
          json = await res.json();
        } catch {
          json = null;
        }

        if (!res.ok || !json?.success) {
          const message =
            json?.error || `Failed to unlink ${label.toLowerCase()} account`;
          throw new Error(message);
        }

        toast.success(`${label} account unlinked`);
        await invalidateLinkedAccounts();
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : `${label} unlink failed`;
        toast.error(message);
      } finally {
        setUnlinkingProvider(null);
      }
    },
    [unlinkingProvider, linkingProvider, linkedCount, invalidateLinkedAccounts]
  );

  return {
    query,
    linkingProvider,
    handleLink,
    unlinkingProvider,
    handleUnlink,
    linkedCount,
  };
};
