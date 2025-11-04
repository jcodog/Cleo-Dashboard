"use client";

import DiscordAuthButton from "@/components/auth/DiscordAuthButton";
import KickAuthButton from "@/components/auth/KickAuthButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PROVIDER_PATH,
  ProviderStatus,
  useLinkedAccounts,
} from "@/hooks/useLinkedAccounts";
import {
  CheckCircle2,
  CircleOff,
  ExternalLink,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export const LinkedAccountsSection = () => {
  const {
    query: accountsQuery,
    handleLink,
    linkingProvider,
    handleUnlink,
    unlinkingProvider,
    linkedCount,
  } = useLinkedAccounts();

  const data = accountsQuery.data;

  const hasDiscord = data?.providers.discord.linked ?? false;
  const hasKick = data?.providers.kick.linked ?? false;

  const cards = useMemo(
    () => [
      {
        provider: "discord" as const,
        heading: "Discord",
        description:
          "Manage Cleo for Discord servers, automations, and billing.",
        status: data?.providers.discord,
        linked: hasDiscord,
        needsRelink: data?.providers.discord.needsRelink ?? false,
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
        needsRelink: data?.providers.kick.needsRelink ?? false,
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
              variant={
                card.linked
                  ? card.needsRelink
                    ? "destructive"
                    : "glass"
                  : "glass-muted"
              }
              className="gap-1"
            >
              {unlinkingProvider === card.provider ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : accountsQuery.isFetching &&
                (card.provider === linkingProvider ||
                  card.provider === unlinkingProvider) ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : card.linked ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <CircleOff className="h-3 w-3" />
              )}
              {card.linked
                ? card.needsRelink
                  ? "Action needed"
                  : "Linked"
                : "Not linked"}
            </Badge>
          </header>

          <div className="flex-1 text-sm text-muted-foreground">
            {card.linked && card.status ? (
              <AccountStatusDetails status={card.status} />
            ) : (
              <p>Connect your account to unlock this dashboard.</p>
            )}
          </div>

          {card.linked ? (
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="glass" className="w-full sm:w-auto">
                <Link
                  href={PROVIDER_PATH[card.provider]}
                  className="inline-flex items-center gap-2"
                >
                  Manage
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant={card.needsRelink ? "glass-destructive" : "glass-muted"}
                className="w-full sm:w-auto"
                onClick={() => handleLink(card.provider)}
                disabled={linkingProvider === card.provider}
              >
                {linkingProvider === card.provider
                  ? "Relinking..."
                  : card.needsRelink
                  ? "Fix permissions"
                  : "Relink"}
              </Button>
              <Button
                variant="glass-destructive"
                className="w-full sm:w-auto"
                onClick={() => handleUnlink(card.provider)}
                disabled={
                  unlinkingProvider === card.provider || linkedCount <= 1
                }
                title={
                  linkedCount <= 1
                    ? "Link another account before unlinking."
                    : undefined
                }
              >
                {unlinkingProvider === card.provider ? "Removing..." : "Unlink"}
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

const AccountStatusDetails = ({ status }: { status: ProviderStatus }) => {
  const granted = status.grantedScopes.join(", ");
  const missing = status.missingScopes.join(", ");

  return (
    <div className="flex flex-col gap-2 text-xs text-muted-foreground/80">
      <p>
        Signed in as{" "}
        <span className="font-medium text-foreground">
          {status.displayName ?? status.accountId ?? "Unknown user"}
        </span>
      </p>
      <p>Granted scopes: {granted.length ? granted : "None"}</p>
      {status.missingScopes.length > 0 ? (
        <p className="flex items-center gap-1 text-amber-400">
          <TriangleAlert className="h-3.5 w-3.5" />
          Missing scopes: {missing}. Please relink to restore full access.
        </p>
      ) : (
        <p className="text-emerald-400">All required permissions granted.</p>
      )}
    </div>
  );
};
