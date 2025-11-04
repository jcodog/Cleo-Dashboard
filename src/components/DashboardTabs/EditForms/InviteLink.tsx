"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { client } from "@/lib/client";
import { Servers } from "@/prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface InviteLinkProps {
  guild: Servers;
  isDirty: boolean;
  setDirtyAction: Dispatch<SetStateAction<boolean>>;
}

export const InviteLink = ({
  guild,
}: // isDirty, setDirtyAction intentionally unused for now (link editor WIP)
InviteLinkProps) => {
  const initialInviteLink = guild.inviteLink || undefined;
  const [inviteLink, setInviteLink] = useState<string | undefined>(
    guild.inviteLink || undefined
  );

  const {} = useMutation({
    mutationKey: ["set-invite-link"],
    mutationFn: async () => {
      const res = await client.dash.setGuildInvite.$post(
        { guildId: guild.id, inviteLink: inviteLink! },
        undefined
      );
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || "Error setting invite link");
        return;
      }

      toast.success(json.message);
      return json.data;
    },
  });

  useEffect(() => {
    startTransition(() => {
      setInviteLink(guild.inviteLink || undefined);
    });
  }, [guild.inviteLink]);

  const isDisabled = inviteLink === initialInviteLink;
  const canCreateInvite = !!guild.welcomeChannel;

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <Heading className="text-base font-semibold tracking-wide uppercase text-muted-foreground">
        Invite link
      </Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex items-center w-full gap-2"
      >
        <Input
          value={inviteLink}
          placeholder="https://discord.com/invite/example"
          onChange={(e) => setInviteLink(e.target.value)}
        />
        <Button disabled={isDisabled} type="submit" variant="glass">
          Save
        </Button>
      </form>
      <div className="flex gap-4 w-full items-center justify-between text-xs text-muted-foreground">
        <p className="leading-relaxed">
          Or generate a fresh invite via Cleo (requires a configured welcome
          channel).
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button
                  variant="glass"
                  disabled={!canCreateInvite}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Making invite");
                  }}
                >
                  Create invite
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {canCreateInvite
                ? "Create and invite to your server welcome channel."
                : "You need to set up the welcome channel before Cleo can make an invite to your server."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
