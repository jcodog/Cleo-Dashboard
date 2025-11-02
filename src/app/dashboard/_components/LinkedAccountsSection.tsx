"use client";

import DiscordAuthButton from "@/components/auth/DiscordAuthButton";
import KickAuthButton from "@/components/auth/KickAuthButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { authClient } from "@/lib/authClient";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleOff, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const PROVIDER_PATH: Record<"discord" | "kick", string> = {
  discord: "/dashboard/d",
  kick: "/dashboard/k",
};

export const LinkedAccountsSection = () => {
  const [linkingProvider, setLinkingProvider] = useState<
    "discord" | "kick" | null
  >(null);

  const accountsQuery = useQuery({
    queryKey: ["linked-accounts"],
    queryFn: async () => {
      const res = await client.accounts.linkedProviders.$get();
      if (!res.ok) {
        throw new Error("Failed to load linked accounts");
      }
      return res.json() as Promise<{
        user: {
          username: string | null;
          email: string | null;
        };
        providers: {
          discord: { linked: boolean; accountId: string | null };
          kick: { linked: boolean; accountId: string | null };
        };
      }>;
    },
  });

  const data = accountsQuery.data;

  const hasDiscord = data?.providers.discord.linked ?? false;
  const hasKick = data?.providers.kick.linked ?? false;

  const handleLink = useCallback(
    async (provider: "discord" | "kick") => {
      if (linkingProvider) return;
      setLinkingProvider(provider);
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        timeout = setTimeout(() => {
          setLinkingProvider(null);
          toast.error(
            "Taking longer than expected. Please complete the linking window."
          );
        }, 6000);
        await authClient.linkSocial({ provider });
        setTimeout(() => {
          accountsQuery.refetch();
          setLinkingProvider(null);
        }, 3500);
      } catch (error) {
        setLinkingProvider(null);
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Unable to start linking flow";
        toast.error(message);
      } finally {
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    },
    [accountsQuery, linkingProvider]
  );

  const cards = useMemo(
    () => [
      {
        provider: "discord" as const,
        heading: "Discord",
        description:
          "Manage Cleo for Discord servers, automations, and billing.",
        status: data?.providers.discord,
        linked: hasDiscord,
        button: (
          <DiscordAuthButton
            onClick={() => handleLink("discord")}
            loading={linkingProvider === "discord"}
            disabled={accountsQuery.isFetching}
            className="w-full"
            size="default"
            variant="glass"
          >
            {linkingProvider === "discord" ? "Linking..." : "Link Discord"}
          </DiscordAuthButton>
        ),
      },
      {
        provider: "kick" as const,
        heading: "Kick",
        description:
          "Control Cleo for Kick creators, chat commands, and channel tools.",
        status: data?.providers.kick,
        linked: hasKick,
        button: (
          <KickAuthButton
            onClick={() => handleLink("kick")}
            loading={linkingProvider === "kick"}
            disabled={accountsQuery.isFetching}
            className="w-full"
          >
            {linkingProvider === "kick" ? "Linking..." : "Link Kick"}
          </KickAuthButton>
        ),
      },
    ],
    [
      accountsQuery.isFetching,
      data?.providers.discord,
      data?.providers.kick,
      handleLink,
      hasDiscord,
      hasKick,
      linkingProvider,
    ]
  );

  if (accountsQuery.isLoading) {
    return (
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[220px] rounded-2xl border border-border/50 bg-card/60 backdrop-blur animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (accountsQuery.isError) {
    return (
      <div className="w-full max-w-3xl rounded-xl border border-border/60 bg-destructive/10 p-6 text-sm text-destructive-foreground">
        <p>
          We couldn&apos;t load your linked accounts. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <article
          key={card.provider}
          className="flex min-h-[220px] flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur"
        >
          <header className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{card.heading}</h3>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
            <Badge
              variant={card.linked ? "secondary" : "outline"}
              className="gap-1"
            >
              {accountsQuery.isFetching && card.provider === linkingProvider ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : card.linked ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <CircleOff className="h-3 w-3" />
              )}
              {card.linked ? "Linked" : "Not linked"}
            </Badge>
          </header>

          <div className="flex-1 text-sm text-muted-foreground">
            {card.status?.accountId ? (
              <p className="break-all text-xs text-muted-foreground/80">
                Account ID: {card.status.accountId}
              </p>
            ) : (
              <p>Connect your account to unlock this dashboard.</p>
            )}
          </div>

          {card.linked ? (
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="gradient" className="w-full sm:w-auto">
                <Link
                  href={PROVIDER_PATH[card.provider]}
                  className="inline-flex items-center gap-2"
                >
                  Manage
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleLink(card.provider)}
                disabled={linkingProvider === card.provider}
              >
                {linkingProvider === card.provider ? "Relinking..." : "Relink"}
              </Button>
            </div>
          ) : (
            <div className="mt-auto">{card.button}</div>
          )}
        </article>
      ))}
    </div>
  );
};
