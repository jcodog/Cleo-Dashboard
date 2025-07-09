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
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";
import { Pen, Save, Trash } from "lucide-react";
import { useState, useEffect } from "react";
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
	const { getToken } = useAuth();
	const [editing, setEditing] = useState<boolean>(false);
	const [channel, setChannel] = useState<{
		name: string | null;
		id: string | null;
	}>({ name: channelName, id: channelId });
	const [saving, setSaving] = useState<boolean>(false);

	const { mutate } = useMutation({
		mutationKey: [`save-${type}-channel`],
		mutationFn: async () => {
			const token = await getToken();
			const res = await client.dash.setChannel.$post(
				{ guildId: guildId, type, channelId: channel.id! },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();

			if (data.success) {
				setSaving(false);
				setEditing(false);
				return;
			}

			toast.error(data.error);
			return;
		},
	});

	// Sync local channel state when props change
	useEffect(() => {
		setChannel({ name: channelName, id: channelId });
	}, [channelName, channelId]);

	return (
		<li className="flex gap-2 p-0 items-center border-2 border-accent rounded-md w-fit">
			<div className="flex w-2xs h-full p-2 items-center">
				<h3 className="text-2xl">{settingName}</h3>
			</div>
			<div className="flex h-full w-xl p-2">
				{editing ? (
					<Select
						onValueChange={(value) => {
							const selectedChannel = allChannels?.filter(
								(c) => c.id === value
							)[0]!;

							setChannel({
								name: selectedChannel.name,
								id: selectedChannel.id,
							});
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
					<p className="flex items-center h-full text-lg gap-1 truncate">
						{channel.name}
						<span className="flex items-end h-full text-xs text-muted-foreground">
							({channel.id})
						</span>
					</p>
				) : (
					<p className="flex items-center h-full text-sm gap-1 truncate text-muted-foreground">
						Set a channel
					</p>
				)}
			</div>
			<div className="flex gap-2 p-2">
				{editing ? (
					<Button
						variant="default"
						size="icon"
						className="cursor-pointer"
						onClick={() => {
							setSaving(true);
							mutate();
						}}
						disabled={saving}
					>
						<Save className="size-4" />
					</Button>
				) : (
					<Button
						variant="outline"
						size="icon"
						className="cursor-pointer"
						onClick={() => setEditing(true)}
					>
						<Pen className="size-4" />
					</Button>
				)}
				<Button
					variant="destructive"
					size="icon"
					className="cursor-pointer"
					disabled={editing || !channel.name || !channel.id}
				>
					<Trash className="size-4" />
				</Button>
			</div>
		</li>
	);
};
