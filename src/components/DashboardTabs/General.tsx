"use client";

import { TabProps } from "@/app/dashboard/guild/[guildId]/page";
import { InviteLink } from "@/components/DashboardTabs/EditForms/InviteLink";
import { ServerInfo } from "@/components/DashboardTabs/EditForms/ServerInfo";
import { Heading } from "@/components/Heading";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { Gem, SmilePlus, Sticker, User, Users } from "lucide-react";
import { DeleteGuild } from "./EditForms/DeleteGuild";

export const General = ({
  guildId,
  isDirty,
  setDirtyAction,
  getTokenAction,
}: TabProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-guild-info"],
    queryFn: async () => {
      const token = await getTokenAction();
      const res = await client.dash.getGuildInfo.$get(
        { guildId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      console.log(json);
      if (!json.success) {
        return;
      }
      const { guild, dbGuild, isOwner } = json.data;
      return {
        guild,
        dbGuild: {
          ...dbGuild,
          lastOpened: dbGuild.lastOpened ? new Date(dbGuild.lastOpened) : null,
        },
        isOwner,
      };
    },
  });

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto gap-6 py-2 px-1 md:px-2">
      <Panel variant="subtle" className="border-none shadow-none p-3 md:p-4">
        <PanelHeader
          title={<Heading className="text-2xl">Overview</Heading>}
          description="High level server stats and configuration panels."
        />
        <div
          id="stats-overview"
          className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2"
        >
          {[
            {
              icon: User,
              label: "Members",
              value: data?.guild.approximate_member_count,
            },
            { icon: Users, label: "Roles", value: data?.guild.roles.length },
            {
              icon: SmilePlus,
              label: "Emojis",
              value: data?.guild.emojis?.length,
            },
            {
              icon: Sticker,
              label: "Stickers",
              value: data?.guild.stickers?.length,
            },
            {
              icon: Gem,
              label: "Tier",
              value: data?.dbGuild?.isPremium ? "Premium" : "Free",
            },
          ].map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </Panel>
      <div id="server-info" className="flex flex-col gap-6 pb-8 w-full">
        {isLoading ? null : !data ? (
          <Panel className="w-full">
            <EmptyState
              variant="subtle"
              heading="No data available"
              description="We couldn't load this guild's data. Try refreshing or check your permissions."
            />
          </Panel>
        ) : (
          <>
            <Panel className="w-full">
              <ServerInfo
                apiGuild={data?.guild as NonNullable<typeof data>["guild"]}
                isDirty={isDirty}
                setDirtyAction={setDirtyAction}
              />
            </Panel>
            <Panel className="w-full">
              <InviteLink
                guild={data?.dbGuild as NonNullable<typeof data>["dbGuild"]}
                isDirty={isDirty}
                setDirtyAction={setDirtyAction}
              />
            </Panel>
            <Panel variant="danger" className="w-full">
              {data && data.dbGuild && (
                // <DeleteGuild isOwner={data.isOwner} guildId={data.dbGuild.id} />
                <DeleteGuild isOwner={data.isOwner} />
              )}
            </Panel>
          </>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null | undefined;
}
const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div
    className="group relative flex w-full flex-col gap-2 rounded-md border border-border/50 bg-gradient-to-b from-card/75 via-card/60 to-card/50 p-3 md:p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_2px_-1px_rgba(0,0,0,0.4),0_2px_8px_-4px_rgba(0,0,0,0.45)] backdrop-blur-sm overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-0 transition-colors"
    tabIndex={0}
  >
    <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/70 ring-1 ring-border/70 shadow-sm transition-colors group-hover:bg-accent">
        <Icon className="size-3.5" />
      </span>
      <span className="truncate">{label}</span>
    </div>
    <p className="text-2xl font-semibold font-mono tabular-nums leading-none">
      {value ?? "-"}
    </p>
    {/* Hover / sheen layers */}
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,oklch(0.98_0_0)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_30%_25%,oklch(0.24_0_0)_0%,transparent_60%)]" />
    </div>
    <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_top,rgba(255,255,255,0.06),transparent)] dark:bg-[linear-gradient(to_top,rgba(255,255,255,0.04),transparent)]" />
  </div>
);
