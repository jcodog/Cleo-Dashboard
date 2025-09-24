"use client";

import { Channels } from "@/components/DashboardTabs/Channels";
import { General } from "@/components/DashboardTabs/General";
import { Heading } from "@/components/Heading";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, House, Loader, FileWarning, Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "@/components/UserButton";

interface GuildDashPageProps {
  params: Promise<{
    guildId: string;
  }>;
}

export interface TabProps {
  guildId: string;
  isDirty: boolean;
  setDirtyAction: React.Dispatch<React.SetStateAction<boolean>>;
  getTokenAction: (options?: {
    template?: string;
    organizationId?: string;
    leewayInSeconds?: number;
    skipCache?: boolean;
  }) => Promise<string | null>;
}

type Tabs = {
  name: string;
  value: string;
  disabled: boolean;
  component: React.FC<TabProps>;
};

const LoggingTab = () => (
  <div className="flex flex-1 w-full items-center justify-center p-4">
    <EmptyState
      size="lg"
      variant="info"
      icon={<FileWarning className="size-full" />}
      heading="Logging coming soon"
      description="We're building powerful audit & moderation log visibility. Add your channels now so you can enable it the moment it launches."
    />
  </div>
);

const IncidentsTab = () => (
  <div className="flex flex-1 w-full items-center justify-center p-4">
    <EmptyState
      size="lg"
      variant="default"
      icon={<Activity className="size-full" />}
      heading="Incident center not enabled yet"
      description="Real-time incident triage & escalation workflows will live here. Stay tuned."
    />
  </div>
);

const tabs: Tabs[] = [
  {
    name: "Overview",
    value: "overview",
    disabled: false,
    component: General,
  },
  {
    name: "Channels",
    value: "channels",
    disabled: false,
    component: Channels,
  },

  {
    name: "Logging",
    value: "logging",
    disabled: true,
    component: LoggingTab,
  },
  {
    name: "Incidents",
    value: "incidents",
    disabled: true,
    component: IncidentsTab,
  },
];

const GuildDashPage = ({ params }: GuildDashPageProps) => {
  const router = useRouter();
  const { guildId } = use(params);
  const { useSession } = authClient;
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  // take tab directly from URL (default to 'overview')
  const activeTabValue = searchParams.get("tab") || "overview";
  // always pick a tab, falls back to first
  const currentTab = tabs.find((t) => t.value === activeTabValue) || tabs[0];
  const ActiveComponent = currentTab!.component;

  // redirect if the active tab is disabled
  useEffect(() => {
    if (currentTab!.disabled) {
      router.replace(`/dashboard/guild/${guildId}`);
    }
  }, [currentTab, guildId, router]);

  // global dirty-state guard
  const [isDirty, setIsDirty] = useState(false);
  // block browser reload/navigation
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
  // wrapped router push
  const confirmLeave = useCallback(
    (url: string) => {
      if (
        isDirty &&
        !window.confirm("You have unsaved changes. Leave anyway?")
      ) {
        return;
      }
      router.push(url);
    },
    [isDirty, router]
  );

  // use typed JStack client for header info
  const { data: headerInfo, isLoading: headerLoading } = useQuery({
    queryKey: ["get-header-info", guildId],
    queryFn: async () => {
      const res = await client.dash.getHeaderInfo.$get({ guildId });
      const json = await res.json();
      // narrow union for noPerm response
      if ("noPerm" in json) {
        const { toast } = await import("sonner");
        toast.error(json.error || "Permissions check failed");
        router.push("/dashboard");
        return;
      }
      // narrow union for success flag
      if ("success" in json && !json.success) {
        const { toast } = await import("sonner");
        toast.error(json.error || "Failed to fetch guild info");
        return;
      }
      return json.data;
    },
  });

  // dynamically update document title with server name
  useEffect(() => {
    if (headerInfo && headerInfo.name) {
      document.title = `${headerInfo.name} | Cleo`;
    }
  }, [headerInfo]);

  return headerLoading || !headerInfo ? (
    <section className="relative flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <Loader className="size-10 animate-spin" />
      <p>Loading server info...</p>
    </section>
  ) : (
    <section className="relative flex flex-1 min-h-0 flex-col items-center p-6">
      <div className="flex h-full max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border/60 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)]">
        <div className="flex w-full gap-4 p-5 items-center justify-between rounded-t-xl bg-gradient-to-b from-accent/60 to-accent/30 border-b border-border/60 shrink-0">
          <div className="flex gap-4 items-center justify-start min-w-0">
            <div className="relative h-11 w-11 shrink-0">
              <Image
                src={headerInfo.icon}
                fill
                className="rounded-full object-cover ring-1 ring-border/60 shadow-sm"
                alt={`${headerInfo.name || "Server"}'s icon`}
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <Heading className="truncate">{headerInfo.name}</Heading>
              <p className="text-muted-foreground font-mono text-xs sm:text-sm truncate max-w-[80ch]">
                {headerInfo.description || "No description"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="gradient"
              className="cursor-pointer"
            >
              <House className="size-4" />
              Home
            </Button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col w-60 min-w-60 max-w-60 py-4 gap-2 bg-accent/20 rounded-bl-xl justify-between border-r border-border/60 shrink-0">
            <ul className="flex flex-col gap-1.5 px-2 select-none">
              {tabs.map((tab) => (
                <li
                  key={tab.value}
                  onClick={() => {
                    if (!tab.disabled) {
                      const url =
                        tab.value === "overview"
                          ? `/dashboard/guild/${guildId}`
                          : `/dashboard/guild/${guildId}?tab=${tab.value}`;
                      confirmLeave(url);
                    }
                  }}
                  className={cn(
                    "group relative flex items-center gap-2 justify-between p-2.5 rounded-md transition-colors",
                    {
                      "cursor-pointer hover:bg-accent/60":
                        !tab.disabled && tab.value !== activeTabValue,
                      "cursor-not-allowed text-muted-foreground": tab.disabled,
                      "bg-accent shadow-xs ring-1 ring-border/60":
                        tab.value === activeTabValue,
                    }
                  )}
                >
                  {tab.value === activeTabValue && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[linear-gradient(180deg,var(--color-chart-2),var(--color-chart-5))]" />
                  )}
                  <span
                    className={cn("truncate", {
                      "font-medium": tab.value === activeTabValue,
                    })}
                  >
                    {tab.name}
                  </span>
                  <ArrowRight
                    className={cn("size-4 transition-transform", {
                      "group-hover:translate-x-0.5":
                        !tab.disabled && tab.value !== activeTabValue,
                    })}
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-between px-4 pt-4 border-t border-border/60">
              {session ? (
                <UserButton namePosition="right" showName={true} />
              ) : null}
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-1 min-h-0 w-full items-stretch p-4 overflow-hidden">
            <ScrollArea className="w-full h-full overflow-x-hidden">
              <ActiveComponent
                guildId={guildId}
                setDirtyAction={setIsDirty}
                isDirty={isDirty}
                getTokenAction={async () => null}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuildDashPage;
