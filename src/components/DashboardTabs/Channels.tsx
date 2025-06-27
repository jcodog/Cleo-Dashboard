import { TabProps } from "@/app/dashboard/guild/[guildId]/page";
import { Heading } from "@/components/Heading";
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
		<div className="flex flex-col flex-1 w-full overflow-hidden gap-4">
			<section
				id="tab-heading"
				className="w-full flex flex-col border-b border-muted-foreground p-2"
			>
				<Heading>Channels</Heading>
				<p className="text-muted-foreground text-pretty text-sm font-mono">
					See the channels used by Cleo for different notifications
					etc.
				</p>
			</section>
			<section
				id="tab-content"
				className="flex flex-col flex-1 gap-4 p-2"
			>
				{isLoading ? (
					<p>Loading channels...</p>
				) : (
					<ul className="flex flex-col gap-2">
						<li className="p-2 border rounded flex justify-between items-center">
							<div className="flex gap-2">
								<h4 className="font-semibold text-lg">
									{channelLabels["welcomeChannel"]}
								</h4>
								{welcomeChannel.name ? (
									<div className="flex gap-1.5 items-center">
										<p className="text-md">
											{welcomeChannel.name}
										</p>
										<p className="text-muted-foreground text-xs">
											({welcomeChannel.id})
										</p>
									</div>
								) : (
									<span className="text-muted-foreground italic">
										{" "}
										Set a channel
									</span>
								)}
							</div>
						</li>
						<li className="p-2 border rounded flex justify-between items-center">
							<div className="flex gap-2">
								<h4 className="font-semibold text-lg">
									{channelLabels["announcementChannel"]}
								</h4>
								{announcementChannel.name ? (
									<div className="flex gap-1.5 items-center">
										<p className="text-md">
											{announcementChannel.name}
										</p>
										<p className="text-muted-foreground text-xs">
											({announcementChannel.id})
										</p>
									</div>
								) : (
									<span className="text-muted-foreground italic">
										{" "}
										Set a channel
									</span>
								)}
							</div>
						</li>
						<li className="p-2 border rounded flex justify-between items-center">
							<div className="flex gap-2">
								<h4 className="font-semibold text-lg">
									{channelLabels["updatesChannel"]}
								</h4>
								{updatesChannel.name ? (
									<div className="flex gap-1.5 items-center">
										<p className="text-md">
											{updatesChannel.name}
										</p>
										<p className="text-muted-foreground text-xs">
											({updatesChannel.id})
										</p>
									</div>
								) : (
									<span className="text-muted-foreground italic">
										{" "}
										Set a channel
									</span>
								)}
							</div>
						</li>
						<li className="p-2 border rounded flex justify-between items-center">
							<div className="flex gap-2">
								<h4 className="font-semibold text-lg">
									{channelLabels["logsChannel"]}
								</h4>
								{logsChannel.name ? (
									<div className="flex gap-1.5 items-center">
										<p className="text-md">
											{logsChannel.name}
										</p>
										<p className="text-muted-foreground text-xs">
											({logsChannel.id})
										</p>
									</div>
								) : (
									<span className="text-muted-foreground italic">
										{" "}
										Set a channel
									</span>
								)}
							</div>
						</li>
					</ul>
				)}
			</section>
		</div>
	);
};
