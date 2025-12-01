"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const ServerAddNextPage = () => {
  const router = useRouter();
  const [channelId, setChannelId] = useState<string>();

  const { data, isLoading } = useQuery({
    queryKey: ["finalise-guild-onboarding"],
    queryFn: async () => {
      const res = await client.discord.getOnboardingGuildChannels.$get(
        undefined,
        undefined
      );

      return await res.json();
    },
    refetchInterval: (query) => {
      return query.state.data?.channels ? false : 10000;
    },
  });

  const { mutate, data: configuredGuild } = useMutation({
    mutationKey: ["configure-onboarding-guild"],
    mutationFn: async () => {
      const res = await client.discord.configureGuild.$post(
        {
          channelId: channelId!,
          guildId: guildId!,
        },
        undefined
      );

      return await res.json();
    },
  });

  useEffect(() => {
    if (data && !data.channels) {
      toast.error(data.message);
    }
  }, [data]);

  const channels = data?.channels ?? null;
  const guildId = data?.guildId;

  useEffect(() => {
    if (configuredGuild && configuredGuild.configured) {
      toast.success(configuredGuild.message);
      router.push("/dashboard");
    } else if (configuredGuild && !configuredGuild.configured) {
      toast.error(configuredGuild.message);
    }
  }, [configuredGuild, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 max-w-3xl">
      <div className="flex flex-col items-center justify-center gap-2 text-pretty text-center">
        <Heading>Configure Cleo</Heading>
        <p>
          But wait... before you can add Cleo you need to select a channel for
          updates from Cleo, this is used to send you information about new
          features and changes to commands. This shouldn&apos;t be more than
          once a month.
        </p>
        <p>
          You will need to complete adding Cleo to your server first before you
          can select a channel. Don&apos;t worry, the channels will
          automatically appear once you have added Cleo to your server.
        </p>
      </div>

      <form
        className="flex flex-col flex-1 max-h-[33vh] items-center justify-center gap-2 max-w-lg w-full text-pretty"
        onSubmit={handleSubmit}
      >
        <Label className="w-full text-start items-start">
          Cleo Updates Channel
        </Label>
        <div className="flex gap-4 w-full">
          <Select
            disabled={!channels || !guildId || isLoading}
            onValueChange={(value) => {
              setChannelId(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a channel..." />
            </SelectTrigger>
            <SelectContent>
              {channels ? (
                channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="none">
                  No channels to select
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={!channels || !guildId || isLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ServerAddNextPage;
