import { TabProps } from "@/app/dashboard/guild/[guildId]/page";
import { ChannelItem } from "@/components/DashboardTabs/EditForms/ChannelItem";
import { Heading } from "@/components/Heading";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const Channels = ({ guildId, getTokenAction }: TabProps) => {
  // individual state for each channel setting
  const [welcomeChannel, setWelcomeChannel] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });
  const [announcementChannel, setAnnouncementChannel] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });
  const [updatesChannel, setUpdatesChannel] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });
  const [logsChannel, setLogsChannel] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });

  // human-readable labels for each setting key
  const channelLabels: Record<string, string> = {
    welcomeChannel: "Welcome Channel",
    announcementChannel: "Announcement Channel",
    updatesChannel: "Updates Channel",
    logsChannel: "Logs Channel",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-guild-channels", guildId],
    queryFn: async () => {
      const token = await getTokenAction();
      const res = await client.dash.getGuildChannels.$get(
        { guildId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return await res.json();
    },
  });

  useEffect(() => {
    if (data?.success && data.data?.channels) {
      // transform channels object into array
      const entries = data.data.channels as Record<
        string,
        { id: string; name: string }
      >;
      Object.entries(entries).forEach(([key, ch]) => {
        if (ch) {
          switch (key) {
            case "welcomeChannel":
              setWelcomeChannel({ id: ch.id, name: ch.name });
              break;
            case "announcementChannel":
              setAnnouncementChannel({
                id: ch.id,
                name: ch.name,
              });
              break;
            case "updatesChannel":
              setUpdatesChannel({ id: ch.id, name: ch.name });
              break;
            case "logsChannel":
              setLogsChannel({ id: ch.id, name: ch.name });
              break;
          }
        }
      });
    }
  }, [data]);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto gap-6 py-2 px-1 md:px-2">
      <Panel variant="subtle" className="border-none shadow-none p-3 md:p-4">
        <PanelHeader
          title={<Heading className="text-2xl">Channels</Heading>}
          description="Assign dedicated channels Cleo uses for key events and automation."
        />
      </Panel>
      <Panel className="w-full max-w-3xl">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading channels...</p>
        ) : (
          <ul className="flex flex-col gap-3">
            <ChannelItem
              settingName={channelLabels.welcomeChannel!}
              channelName={welcomeChannel.name}
              channelId={welcomeChannel.id}
              type="welcome"
              allChannels={data?.success ? data.data.allChannels : null}
              guildId={guildId}
            />
            <ChannelItem
              settingName={channelLabels.announcementChannel!}
              channelName={announcementChannel.name}
              channelId={announcementChannel.id}
              type="announcement"
              allChannels={data?.success ? data.data.allChannels : null}
              guildId={guildId}
            />
            <ChannelItem
              settingName={channelLabels.updatesChannel!}
              channelName={updatesChannel.name}
              channelId={updatesChannel.id}
              type="updates"
              allChannels={data?.success ? data.data.allChannels : null}
              guildId={guildId}
            />
            <ChannelItem
              settingName={channelLabels.logsChannel!}
              channelName={logsChannel.name}
              channelId={logsChannel.id}
              type="logs"
              allChannels={data?.success ? data.data.allChannels : null}
              guildId={guildId}
            />
          </ul>
        )}
      </Panel>
    </div>
  );
};
