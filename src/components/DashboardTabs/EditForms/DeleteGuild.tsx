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
		<div className="flex flex-col w-full max-w-2xl gap-4 py-8">
			<div className="border-2 border-red-600 rounded-md p-4 flex items-center justify-center gap-2">
				<div className="flex flex-col flex-1 text-red-500">
					<h2 className="text-lg font-semibold mb-1">
						Delete this server
					</h2>
					<p className="text-sm mb-2">
						This action{" "}
						<span className="font-bold">cannot be undone</span> and
						will erase all settings and data about this server from
						Cleo, as well as remove her from your server.
					</p>
					<p className="text-sm mb-2">
						<span className="font-bold">Only the server owner</span>{" "}
						can perform this action.
					</p>
				</div>
				<div className="flex items-center justify-center">
					<Button
						onClick={() =>
							toast.info("[placeholder event] Deleted")
						}
						className={cn(
							isOwner
								? "hover:cursor-pointer"
								: "hover:cursor-not-allowed"
						)}
						variant="destructive"
						disabled={!isOwner}
					>
						<Trash className="size-4" /> Delete server
					</Button>
				</div>
			</div>
		</div>
	);
};
