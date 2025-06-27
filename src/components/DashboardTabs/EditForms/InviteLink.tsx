"use client";

import { Heading } from "@/components/Heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { client } from "@/lib/client";
import { Servers } from "@/prisma/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

interface InviteLinkProps {
	guild: Servers;
	isDirty: boolean;
	setDirtyAction: Dispatch<SetStateAction<boolean>>;
}

export const InviteLink = ({
	guild,
	isDirty,
	setDirtyAction,
}: InviteLinkProps) => {
	const { getToken } = useAuth();
	const initialInviteLink = guild.inviteLink || undefined;
	const [inviteLink, setInviteLink] = useState<string | undefined>(
		guild.inviteLink || undefined
	);

	const {} = useMutation({
		mutationKey: ["set-invite-link"],
		mutationFn: async () => {
			const token = await getToken();
			const res = await client.dash.setGuildInvite.$post(
				{ guildId: guild.id, inviteLink: inviteLink! },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
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
		setInviteLink(guild.inviteLink || undefined);
	}, [guild.inviteLink]);

	const isDisabled = inviteLink === initialInviteLink;
	const canCreateInvite = !!guild.welcomeChannel;

	return (
		<div className="flex flex-col flex-1 w-full max-w-2xl gap-4">
			<Heading className="text-lg">Invite link</Heading>
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
				<Button disabled={isDisabled} type="submit">
					Save
				</Button>
			</form>
			<div className="flex gap-2 w-full items-center justify-between">
				<p>
					Or let Cleo make an invite link for your server on your
					behalf.
				</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span tabIndex={0}>
								<Button
									variant="outline"
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
