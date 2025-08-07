"use client";

import { Channels } from "@/components/DashboardTabs/Channels";
import { General } from "@/components/DashboardTabs/General";
import { Heading } from "@/components/Heading";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, House, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

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

const LoggingTab = () => {
  return (
    <div className="flex flex-1 items-center justify-center text-center">
      <p>Nothing here, we aren't ready to give you this tab.</p>
    </div>
  );
};

const IncidentsTab = () => {
  return (
    <div className="flex flex-1 items-center justify-center text-center">
      <p>Nothing here, we aren't ready to give you this tab.</p>
    </div>
  );
};

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
  const { getToken } = useAuth();
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
      const token = await getToken();
      const res = await client.dash.getHeaderInfo.$get(
        { guildId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    <section className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Loader className="size-10 animate-spin" />
      <p>Loading server info...</p>
    </section>
  ) : (
    <section className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex flex-1 flex-col w-full bg-accent/20 rounded-md shadow-lg">
        <div className="flex w-full gap-4 p-4 items-end justify-between rounded-t-md bg-accent/40 shadow-lg border-b border-background">
          <div className="flex gap-4 items-end justify-start">
            <div className="relative h-10 w-10">
              <Image
                src={headerInfo.icon}
                fill
                className="rounded-full object-cover"
                alt={`${headerInfo.name || "Server"}'s icon`}
              />
            </div>
            <Heading>{headerInfo.name}</Heading>
            <p className="text-muted-foreground font-mono text-sm">
              {headerInfo.description || "No description"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer"
            >
              <House className="size-4" />
              Home
            </Button>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex flex-col flex-1 w-56 min-w-56 max-w-56 py-4 gap-2 bg-accent/30 rounded-bl-md justify-between">
            <ul className="flex flex-col gap-2 px-2 select-none">
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
                  className={cn("flex items-center gap-2 justify-between p-2", {
                    "cursor-pointer hover:bg-accent/60 rounded-md":
                      !tab.disabled && tab.value !== activeTabValue,
                    "cursor-not-allowed text-muted-foreground": tab.disabled,
                    "bg-accent": tab.value === activeTabValue,
                  })}
                >
                  {tab.name}
                  <ArrowRight className="size-4" />
                </li>
              ))}
            </ul>
            <div className="flex justify-between px-4 pt-4 border-t border-background">
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: {
                      flexDirection: "row-reverse",
                    },
                  },
                }}
                showName
                userProfileMode="navigation"
                userProfileUrl="/dashboard/account"
              />
              <ThemeToggle />
            </div>
          </div>
          <div className="flex flex-1 flex-col w-full items-center justify-center gap-4 p-4">
            <ActiveComponent
              guildId={guildId}
              setDirtyAction={setIsDirty}
              isDirty={isDirty}
              getTokenAction={getToken}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuildDashPage;
