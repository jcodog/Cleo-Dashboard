"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteGuildProps {
  isOwner: boolean;
  // guildId intentionally omitted until delete endpoint implemented
}

export const DeleteGuild = ({ isOwner }: DeleteGuildProps) => {
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2 max-w-3xl">
          <h2 className="text-base font-semibold tracking-wide uppercase text-destructive/90">
            Delete this server
          </h2>
          <p className="text-xs leading-relaxed text-destructive/80">
            This action <span className="font-semibold">cannot be undone</span>{" "}
            and will remove all Cleo data for this server and detach the bot.
          </p>
          <p className="text-xs text-destructive/70">
            Only the <span className="font-semibold">server owner</span> can
            perform this.
          </p>
        </div>
        <div className="pt-1">
          <Button
            onClick={() => toast.info("[placeholder event] Deleted")}
            className={cn(
              isOwner ? "hover:cursor-pointer" : "hover:cursor-not-allowed"
            )}
            variant="glass-destructive"
            disabled={!isOwner}
          >
            <Trash className="size-4" /> Delete server
          </Button>
        </div>
      </div>
    </div>
  );
};
