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
        <div id="stats-overview" className="flex flex-wrap gap-4 mt-2">
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
      <div id="server-info" className="flex flex-col gap-6 items-center pb-8">
        {isLoading ? null : !data ? (
          <Panel className="w-full max-w-2xl">
            <EmptyState
              variant="subtle"
              heading="No data available"
              description="We couldn't load this guild's data. Try refreshing or check your permissions."
            />
          </Panel>
        ) : (
          <>
            <Panel className="w-full max-w-2xl">
              <ServerInfo
                apiGuild={data?.guild!}
                isDirty={isDirty}
                setDirtyAction={setDirtyAction}
              />
            </Panel>
            <Panel className="w-full max-w-2xl">
              <InviteLink
                guild={data?.dbGuild!}
                isDirty={isDirty}
                setDirtyAction={setDirtyAction}
              />
            </Panel>
            <Panel variant="danger" className="w-full max-w-2xl">
              <DeleteGuild
                isOwner={data!.isOwner}
                guildId={data!.dbGuild!.id!}
              />
            </Panel>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) => (
  <div className="group relative flex min-w-40 flex-col gap-2 rounded-lg border border-border/50 bg-gradient-to-b from-card/80 to-card/60 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] backdrop-blur-sm">
    <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
      <span className="flex size-6 items-center justify-center rounded-md bg-accent/70 ring-1 ring-border/70 shadow-sm group-hover:bg-accent transition-colors">
        <Icon className="size-3.5" />
      </span>
      {label}
    </div>
    <p className="text-2xl font-semibold font-mono tabular-nums leading-none">
      {value ?? "-"}
    </p>
    <div className="absolute inset-0 -z-10 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,oklch(0.985_0_0)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,oklch(0.205_0_0)_0%,transparent_60%)]" />
  </div>
);
