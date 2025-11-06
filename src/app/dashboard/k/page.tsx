"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "@/components/UserButton";
import { client } from "@/lib/client";
import type { KickEventSubscriptionState } from "@/lib/kick/events";
import type { EventNames } from "kick-api-types/payloads";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type KickSubscriptionsResponse = {
  events: KickEventSubscriptionState[];
};

const KickDashboardPage = () => {
  const router = useRouter();
  const [activeEvent, setActiveEvent] = useState<EventNames | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchLinkedProviders,
  } = useQuery({
    queryKey: ["kick-dashboard-status"],
    queryFn: async () => {
      const res = await client.accounts.linkedProviders.$get();
      if (!res.ok) {
        throw new Error("Failed to load Kick account status");
      }
      return res.json() as Promise<{
        providers: { kick: { linked: boolean } };
      }>;
    },
    staleTime: 15_000,
  });

  const eventsQuery = useQuery({
    queryKey: ["kick-event-subscriptions"],
    enabled: Boolean(data?.providers.kick.linked),
    queryFn: async (): Promise<KickSubscriptionsResponse> => {
      const res = await client.kick.subscribedEvents.$get();
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const message =
          (payload && typeof payload === "object" && "message" in payload
            ? String(payload.message)
            : null) ?? "Failed to load Kick subscriptions";
        throw new Error(message);
      }

      return (await res.json()) as KickSubscriptionsResponse;
    },
    staleTime: 15_000,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (eventName: EventNames) => {
      const res = await client.kick.subscribeEvent.$post({ event: eventName });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload
            ? String(payload.message)
            : null) ?? `Failed to subscribe to ${eventName}`;
        throw new Error(message);
      }

      return payload;
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async ({ event, id }: { event: EventNames; id: string }) => {
      const res = await client.kick.unsubscribeEvent.$post({ id });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload
            ? String(payload.message)
            : null) ?? `Failed to unsubscribe from ${event}`;
        throw new Error(message);
      }

      return payload;
    },
  });

  const handleToggleEvent = useCallback(
    async (event: KickEventSubscriptionState) => {
      if (subscribeMutation.isPending || unsubscribeMutation.isPending) {
        return;
      }

      setActiveEvent(event.name);

      try {
        if (event.subscribed) {
          if (!event.subscriptionId) {
            throw new Error("Missing subscription id for Kick event");
          }

          await unsubscribeMutation.mutateAsync({
            event: event.name,
            id: event.subscriptionId,
          });
          toast.success(`Unsubscribed from ${event.name}`);
        } else {
          await subscribeMutation.mutateAsync(event.name);
          toast.success(`Subscribed to ${event.name}`);
        }

        await eventsQuery.refetch();
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Unable to update Kick subscription";
        toast.error(message);
      } finally {
        setActiveEvent(null);
      }
    },
    [eventsQuery, subscribeMutation, unsubscribeMutation]
  );

  const kickSubscriptions = eventsQuery.data?.events ?? [];

  const isMutating =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const subscriptionErrorMessage =
    eventsQuery.error instanceof Error
      ? eventsQuery.error.message
      : "Failed to load Kick subscriptions";

  if (isLoading) {
    return (
      <section className="container mx-auto flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (isError || !data?.providers.kick.linked) {
    return (
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-full flex justify-end">
          <UserButton namePosition="right" showName />
        </div>
        <Heading className="text-2xl">Kick link required</Heading>
        <p className="max-w-md text-sm text-muted-foreground">
          Link your Kick creator account to access the Kick dashboard. You can
          do this from the main dashboard page.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="glass-muted"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button variant="glass" onClick={() => refetchLinkedProviders()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto flex h-full flex-col gap-6 p-6 pb-16 min-h-dvh">
      <Header onBack={() => router.push("/dashboard")} />
      <ScrollArea className="h-full w-full overflow-x-hidden">
        <div className="space-y-6 px-3 py-4">
          <EventSubscriptionsPanel
            events={kickSubscriptions}
            isLoading={eventsQuery.isLoading}
            isError={eventsQuery.isError}
            onRetry={() => eventsQuery.refetch()}
            onToggle={handleToggleEvent}
            activeEvent={activeEvent}
            isMutating={isMutating}
            errorMessage={subscriptionErrorMessage}
          />
          <Placeholder />
        </div>
      </ScrollArea>
    </section>
  );
};

const Header = ({ onBack }: { onBack: () => void }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-2">
      <Heading className="text-3xl sm:text-4xl">Kick Dashboard</Heading>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Kick-specific controls are coming soon. Stay tuned while we finish
        building the dashboards for stream automations, moderation, and
        analytics.
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="glass"
        size="sm"
        onClick={onBack}
        className="inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Main Dashboard</span>
        <span className="sm:hidden">Back</span>
      </Button>
      <UserButton namePosition="right" showName />
    </div>
  </header>
);

const EventSubscriptionsPanel = ({
  events,
  isLoading,
  isError,
  onRetry,
  onToggle,
  activeEvent,
  isMutating,
  errorMessage,
}: {
  events: KickEventSubscriptionState[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => Promise<unknown>;
  onToggle: (event: KickEventSubscriptionState) => Promise<void>;
  activeEvent: EventNames | null;
  isMutating: boolean;
  errorMessage: string;
}) => (
  <Panel className="relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_160%_at_0%_0%,rgba(78,205,255,0.25),transparent_55%)]" />
    <PanelHeader
      title="Kick Event Subscriptions"
      description="Manage webhook subscriptions for supported Kick events."
    />
    {isLoading ? (
      <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    ) : isError ? (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-100">
        <p>{errorMessage}</p>
        <Button
          variant="glass"
          size="sm"
          onClick={() => {
            void onRetry();
          }}
        >
          Retry
        </Button>
      </div>
    ) : events.length === 0 ? (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">
        No Kick events available for subscription yet.
      </div>
    ) : (
      <div className="space-y-3">
        {events.map((event) => (
          <EventRow
            key={event.name}
            event={event}
            onToggle={onToggle}
            isMutating={isMutating}
            isActive={activeEvent === event.name}
          />
        ))}
      </div>
    )}
  </Panel>
);

const formatKickEventName = (name: EventNames) =>
  name
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" · ");

const EventRow = ({
  event,
  onToggle,
  isMutating,
  isActive,
}: {
  event: KickEventSubscriptionState;
  onToggle: (event: KickEventSubscriptionState) => Promise<void>;
  isMutating: boolean;
  isActive: boolean;
}) => {
  const subscribed = event.subscribed;
  const subscriptionId = event.subscriptionId;
  const buttonLabel = subscribed ? "Unsubscribe" : "Subscribe";
  const buttonVariant = subscribed ? "glass-destructive" : "glass";
  const showSpinner = isMutating && isActive;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-lg transition-[border,background,transform]",
        "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,255,255,0.22),transparent_65%)] before:opacity-60",
        "after:absolute after:inset-[-20%] after:-z-20 after:rounded-[inherit] after:bg-[conic-gradient(from_120deg_at_20%_-10%,rgba(76,201,240,0.2),transparent_45%)] after:opacity-40",
        "hover:border-white/20 hover:bg-white/12 hover:-translate-y-0.5",
        !subscribed && "opacity-90"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-white sm:text-base">
              {formatKickEventName(event.name)}
            </span>
            <Badge variant={subscribed ? "glass" : "glass-muted"}>
              {subscribed ? "Subscribed" : "Not subscribed"}
            </Badge>
          </div>
          {subscribed && subscriptionId ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/80">
              <span className="uppercase tracking-[0.2em] text-white/50">
                Subscription
              </span>
              <span className="rounded-md bg-black/40 px-2 py-1 font-mono">
                {subscriptionId}
              </span>
            </div>
          ) : (
            <p className="max-w-sm text-xs text-muted-foreground">
              Enable this event to start receiving Kick webhooks for your
              automations.
            </p>
          )}
        </div>
        <Button
          variant={buttonVariant}
          size="sm"
          className="w-full sm:w-auto"
          disabled={isMutating}
          onClick={() => {
            void onToggle(event);
          }}
        >
          {showSpinner ? (
            <span className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Working...
            </span>
          ) : (
            buttonLabel
          )}
        </Button>
      </div>
    </div>
  );
};

const Placeholder = () => (
  <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center text-sm text-muted-foreground">
    We&apos;re currently building Kick management tools. Once ready, you&apos;ll
    be able to configure alerts, chat automations, and advanced analytics for
    your Kick channel right here.
  </div>
);

export default KickDashboardPage;
