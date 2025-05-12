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
import { Servers } from "@/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
	const initialInviteLink = guild.inviteLink || undefined;
	const [inviteLink, setInviteLink] = useState<string | undefined>(
		guild.inviteLink || undefined
	);

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
						<TooltipTrigger>
							<Button
								onClick={(e) => {
									e.preventDefault();
									console.log("Making invite link");
								}}
								variant="outline"
								disabled={!canCreateInvite}
							>
								Create Invite Link
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{canCreateInvite ? (
								<p>
									Create an invite to your server welcome
									channel.
								</p>
							) : (
								<p>
									You need to set the server welcome channel
									before Cleo can make a server invite.
								</p>
							)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};
