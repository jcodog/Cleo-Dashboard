"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";
import { Pen, Save, Trash } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

export const ChannelItem = ({
  settingName,
  channelName,
  channelId,
  type,
  allChannels,
  guildId,
}: {
  settingName: string;
  channelName: string | null;
  channelId: string | null;
  type: "welcome" | "announcement" | "updates" | "logs";
  allChannels?: RESTGetAPIGuildChannelsResult | null;
  guildId: string;
}) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<boolean>(false);
  const [channel, setChannel] = useState<{
    name: string | null;
    id: string | null;
  }>({ name: channelName, id: channelId });
  const [saving, setSaving] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationKey: [`save-${type}-channel`],
    mutationFn: async () => {
      const res = await client.dash.setChannel.$post(
        { guildId: guildId, type, channelId: channel.id! },
        undefined
      );

      const data = await res.json();

      if (data.success) {
        setSaving(false);
        setEditing(false);

        queryClient.invalidateQueries({
          queryKey: ["fetch-guild-channels"],
        });

        return;
      }

      toast.error(data.error);
      return;
    },
  });

  // Sync local channel state when props change
  useEffect(() => {
    if (editing) return;
    startTransition(() => {
      setChannel({ name: channelName, id: channelId });
    });
  }, [channelName, channelId, editing]);

  return (
    <li className="group grid grid-cols-[190px_1fr_auto] gap-4 items-center w-full rounded-lg border border-border/55 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-colors hover:bg-card/70">
      <div className="flex h-full items-center">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors uppercase leading-tight">
          {settingName}
        </h3>
      </div>
      <div className="flex h-full flex-1 min-w-40 items-center">
        {editing ? (
          <Select
            onValueChange={(value) => {
              const selectedChannel = allChannels?.find((c) => c.id === value);
              if (selectedChannel) {
                setChannel({
                  name: selectedChannel.name,
                  id: selectedChannel.id,
                });
              }
            }}
            disabled={!allChannels}
          >
            <SelectTrigger>
              <SelectValue placeholder="Set a channel" />
            </SelectTrigger>
            <SelectContent>
              {allChannels ? (
                allChannels.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="null" disabled>
                  No channels to select
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        ) : channel.name && channel.id ? (
          <div className="flex flex-col gap-0.5 leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {channel.name}
            </span>
            <span className="text-[11px] text-muted-foreground/80 tracking-wide uppercase">
              {channel.id}
            </span>
          </div>
        ) : (
          <p className="flex items-center h-full text-xs gap-1 truncate text-muted-foreground italic">
            Set a channel
          </p>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        {editing ? (
          <Button
            variant="glass"
            size="icon"
            onClick={() => {
              setSaving(true);
              mutate();
            }}
            disabled={saving}
          >
            <Save className="size-4" />
          </Button>
        ) : (
          <Button variant="glass" size="icon" onClick={() => setEditing(true)}>
            <Pen className="size-4" />
          </Button>
        )}
        <Button
          variant="glass-destructive"
          size="icon"
          disabled={editing || !channel.name || !channel.id}
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </li>
  );
};
