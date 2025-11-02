"use client";

import { Heading } from "@/components/Heading";
import { ServerList } from "@/components/ServerList";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
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

const DashboardDiscordPage = () => {
  const router = useRouter();

  const guildQuery = useQuery({
    queryKey: ["get-guild-list"],
    queryFn: async () => {
      const res = await client.dash.getGuildList.$get();
      if (res.status === 401) {
        throw Object.assign(new Error("discord-unlinked"), { status: 401 });
      }
      if (!res.ok) {
        throw new Error("Failed to load guilds");
      }
      return res.json();
    },
  });

  const oauthQuery = useQuery({
    queryKey: ["get-oauth2-data"],
    queryFn: async () => {
      const res = await client.discord.getOauth2Data.$get();
      if (res.status === 401) {
        throw Object.assign(new Error("discord-unlinked"), { status: 401 });
      }
      if (!res.ok) {
        throw new Error("Failed to load Discord installation state");
      }
      return res.json();
    },
  });

  const guilds = useMemo(() => {
    if (!guildQuery.data?.guilds) return null;
    return guildQuery.data.guilds.map(
      (server: (typeof guildQuery.data.guilds)[number]) => ({
        ...server,
        lastOpened: server.lastOpened ? new Date(server.lastOpened) : null,
      })
    );
  }, [guildQuery.data]);

  const isUserInstalled = useMemo(() => {
    return oauthQuery.data?.currentOauth2Data?.scopes?.includes(
      OAuth2Scopes.ApplicationsCommands
    );
  }, [oauthQuery.data]);

  const unauthorized =
    guildQuery.error instanceof Error &&
    guildQuery.error.message === "discord-unlinked";

  return (
    <section className="container mx-auto p-6 flex flex-1 min-h-0 flex-col items-center gap-8">
      <header className="w-full max-w-7xl shrink-0 flex items-center justify-between mb-4 rounded-xl border border-border/60 bg-card/70 backdrop-blur px-3 py-2 sm:px-4 sm:py-3">
        <Heading className="text-2xl sm:text-3xl">Discord Dashboard</Heading>
        <div className="flex items-center gap-2 sm:gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="sm:hidden inline-flex items-center justify-center size-8 rounded-full border border-white/12 bg-white/5 backdrop-blur-sm cursor-pointer">
                {oauthQuery.isLoading ? (
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
              {oauthQuery.isLoading
                ? "Checking installation status..."
                : isUserInstalled
                ? "Cleo is installed on your account and usable in any server or DM that supports external apps"
                : "Cleo is not installed on your account. Tap to install Cleo on your account."}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden sm:flex group relative h-11 px-3 gap-2 items-center justify-center rounded-full border border-white/12 bg-white/5 backdrop-blur-md cursor-pointer overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.35),transparent_60%)] before:opacity-35 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] after:translate-x-[-120%] group-hover:after:translate-x-[120%] after:transition-transform after:duration-700">
                <p className="relative z-10 text-pretty text-sm font-medium">
                  User installed:
                </p>
                {oauthQuery.isLoading ? (
                  <Loader className="relative z-10 h-5 w-5 animate-spin text-muted-foreground" />
                ) : isUserInstalled ? (
                  <CircleCheck className="relative z-10 h-5 w-5 text-green-500" />
                ) : (
                  <Link href="/add">
                    <CircleX className="relative z-10 h-5 w-5 text-red-500" />
                  </Link>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {oauthQuery.isLoading
                ? "Checking installation status..."
                : isUserInstalled
                ? "Cleo is installed on your account and usable in any server or DM that supports external apps"
                : "Cleo is not installed on your account. Click to install Cleo on your account."}
            </TooltipContent>
          </Tooltip>
          <UserButton namePosition="right" showName={true} />
        </div>
      </header>

      {unauthorized ? (
        <section className="w-full max-w-xl flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card/70 p-8 text-center">
          <Heading className="text-xl">Discord link required</Heading>
          <p className="text-sm text-muted-foreground">
            Link your Discord account to continue managing Cleo for Discord. You
            can do this from the main dashboard.
          </p>
          <Button variant="gradient" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </section>
      ) : (
        <section className="w-full max-w-7xl flex flex-1 min-h-0 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Your Servers</h2>
            <Button
              variant="gradient"
              onClick={() => router.push("/add/server")}
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Server</span>
            </Button>
          </div>
          {guildQuery.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-2">
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
      )}
    </section>
  );
};

export default DashboardDiscordPage;
