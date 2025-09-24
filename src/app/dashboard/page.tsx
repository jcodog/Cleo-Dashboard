"use client";

import { Heading } from "@/components/Heading";
import { ServerList } from "@/components/ServerList";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
// import { authClient } from "@/lib/authClient";
import UserButton from "@/components/UserButton";
import { useQuery } from "@tanstack/react-query";
import { OAuth2Scopes } from "discord-api-types/v10";
import { CircleCheck, CircleX, Loader, Plus } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const DashboardHomePage = () => {
  const router = useRouter();
  // const { useSession } = authClient;
  // Session currently unused for dashboard list; remove to satisfy lint. Re-add if conditional UI needed.
  // const { data: session } = useSession();
  // derive guild list & install status from queries instead of useEffect state churn

  const { data, isLoading } = useQuery({
    queryKey: ["get-guild-list"],
    queryFn: async () => {
      const res = await client.dash.getGuildList.$get();

      return res.json();
    },
  });

  const { data: oauth2Data, isLoading: isOauth2DataLoading } = useQuery({
    queryKey: ["get-oauth2-data"],
    queryFn: async () => {
      const res = await client.discord.getOauth2Data.$get();

      return await res.json();
    },
  });

  const guilds = useMemo(() => {
    if (!data?.guilds) return null;
    return data.guilds.map((server) => ({
      ...server,
      lastOpened: server.lastOpened ? new Date(server.lastOpened) : null,
    }));
  }, [data]);

  const isUserInstalled = useMemo(() => {
    return !!oauth2Data?.currentOauth2Data?.scopes?.includes(
      OAuth2Scopes.ApplicationsCommands
    );
  }, [oauth2Data]);

  return (
    <section className="container mx-auto p-6 flex flex-1 min-h-0 flex-col items-center gap-8">
      <header className="w-full max-w-6xl shrink-0 flex items-center justify-between mb-4 rounded-xl border border-border/60 bg-card/70 backdrop-blur px-3 py-2 sm:px-4 sm:py-3">
        <Heading className="text-2xl sm:text-3xl">Dashboard</Heading>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compact status on mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="sm:hidden inline-flex items-center justify-center size-8 rounded-full border border-border/60 bg-background/60 cursor-pointer">
                {isOauth2DataLoading ? (
                  <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : isUserInstalled ? (
                  <CircleCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Link href="/add">
                    <CircleX className="h-4 w-4 text-red-500" />
                  </Link>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isOauth2DataLoading
                ? "Checking installation status..."
                : isUserInstalled
                ? "Cleo is installed on your account and usable in any server or DM that supports external apps"
                : "Cleo is not installed on your account. Tap to install Cleo on your account."}
            </TooltipContent>
          </Tooltip>
          {/* Full pill on larger screens */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden sm:flex px-3 py-1.5 gap-2 items-center justify-center rounded-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] border border-border/60 cursor-pointer">
                <p className="text-pretty text-sm font-medium">
                  User installed:
                </p>
                {isOauth2DataLoading ? (
                  <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : isUserInstalled ? (
                  <CircleCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Link href="/add">
                    <CircleX className="h-5 w-5 text-red-500" />
                  </Link>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isOauth2DataLoading
                ? "Checking installation status..."
                : isUserInstalled
                ? "Cleo is installed on your account and usable in any server or DM that supports external apps"
                : "Cleo is not installed on your account. Click to install Cleo on your account."}
            </TooltipContent>
          </Tooltip>
          <UserButton namePosition="right" showName={true} />
        </div>
      </header>

      <section className="w-full max-w-6xl flex flex-1 min-h-0 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">Your Servers</h2>
          <Button variant="gradient" onClick={() => router.push("/add/server")}>
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Server</span>
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border border-border/60 bg-card/60 animate-pulse"
              />
            ))}
          </div>
        ) : guilds && guilds.length > 0 ? (
          <ServerList servers={guilds} />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 gap-4 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
            <p className="text-muted-foreground">
              You have no servers yet. Let&apos;s add your first one!
            </p>
            <Button
              variant="gradient"
              className="h-10 px-5"
              onClick={(e) => {
                e.preventDefault();
                router.push("/add/server");
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}
      </section>
    </section>
  );
};

export default DashboardHomePage;
