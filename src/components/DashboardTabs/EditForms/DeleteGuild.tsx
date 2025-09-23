"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteGuildProps {
  isOwner: boolean;
  guildId: string;
}

export const DeleteGuild = ({ isOwner, guildId }: DeleteGuildProps) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <h2 className="text-base font-semibold tracking-wide uppercase text-destructive/90">
        Delete this server
      </h2>
      <p className="text-xs leading-relaxed text-destructive/80">
        This action <span className="font-semibold">cannot be undone</span> and
        will remove all Cleo data for this server and detach the bot.
      </p>
      <p className="text-xs text-destructive/70">
        Only the <span className="font-semibold">server owner</span> can perform
        this.
      </p>
      <div className="pt-2">
        <Button
          onClick={() => toast.info("[placeholder event] Deleted")}
          className={cn(
            isOwner ? "hover:cursor-pointer" : "hover:cursor-not-allowed"
          )}
          variant="destructive"
          disabled={!isOwner}
        >
          <Trash className="size-4" /> Delete server
        </Button>
      </div>
    </div>
  );
};
