"use client";

import { TabProps } from "@/app/dashboard/guild/[guildId]/page";
import { InviteLink } from "@/components/DashboardTabs/EditForms/InviteLink";
import { ServerInfo } from "@/components/DashboardTabs/EditForms/ServerInfo";
import { Heading } from "@/components/Heading";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { Gem, SmilePlus, Sticker, User, Users } from "lucide-react";

export const General = ({
	guildId,
	isDirty,
	setDirtyAction,
	getTokenAction,
}: TabProps) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["get-guild-info"],
		queryFn: async () => {
			const token = await getTokenAction();
			const res = await client.dash.getGuildInfo.$get(
				{ guildId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const json = await res.json();
			console.log(json);
			if (!json.success) {
				return;
			}
			const { guild, dbGuild } = json.data;
			return {
				guild,
				dbGuild: {
					...dbGuild,
					lastOpened: dbGuild.lastOpened
						? new Date(dbGuild.lastOpened)
						: null,
				},
			};
		},
	});

	return (
		<div className="flex flex-col flex-1 w-full overflow-hidden gap-4">
			<section
				id="tab-heading"
				className="w-full flex flex-col border-b border-muted-foreground p-2"
			>
				<Heading>Overview</Heading>
				<p className="text-muted-foreground text-pretty text-sm font-mono">
					The overview of the server selected. Showing user count,
					channel count.
				</p>
			</section>
			<section
				id="tab-content"
				className="flex flex-col flex-1 gap-4 p-2"
			>
				<div
					id="stats-overview"
					className="flex flex-col gap-4 items-center"
				>
					<div className="flex gap-4">
						<div className="flex flex-col gap-2 min-w-32 p-4 border border-muted-foreground rounded-md shadow-md">
							<div className="flex gap-2 items-center justify-center">
								<User className="size-4" />
								<p className="text-pretty font-semibold text-md">
									Members
								</p>
							</div>
							<p className="text-xl font-bold text-pretty font-mono text-center">
								{data?.guild.approximate_member_count}
							</p>
						</div>

						<div className="flex flex-col gap-2 min-w-32 p-4 border border-muted-foreground rounded-md shadow-md">
							<div className="flex gap-2 items-center justify-center">
								<Users className="size-4" />
								<p className="text-pretty font-semibold text-md">
									Roles
								</p>
							</div>
							<p className="text-xl font-bold text-pretty font-mono text-center">
								{data?.guild.roles.length}
							</p>
						</div>

						<div className="flex flex-col gap-2 min-w-32 p-4 border border-muted-foreground rounded-md shadow-md">
							<div className="flex gap-2 items-center justify-center">
								<SmilePlus className="size-4" />
								<p className="text-pretty font-semibold text-md">
									Emojis
								</p>
							</div>
							<p className="text-xl font-bold text-pretty font-mono text-center">
								{data?.guild.emojis?.length}
							</p>
						</div>

						<div className="flex flex-col gap-2 min-w-32 p-4 border border-muted-foreground rounded-md shadow-md">
							<div className="flex gap-2 items-center justify-center">
								<Sticker className="size-4" />
								<p className="text-pretty font-semibold text-md">
									Stickers
								</p>
							</div>
							<p className="text-xl font-bold text-pretty font-mono text-center">
								{data?.guild.stickers?.length}
							</p>
						</div>

						<div className="flex flex-col gap-2 min-w-32 p-4 border border-muted-foreground rounded-md shadow-md">
							<div className="flex gap-2 items-center justify-center">
								<Gem className="size-4" />
								<p className="text-pretty font-semibold text-md">
									Tier
								</p>
							</div>
							<p className="text-xl font-bold text-pretty font-mono text-center">
								{data?.dbGuild?.isPremium ? "Premium" : "Free"}
							</p>
						</div>
					</div>
				</div>
				<div
					id="server-info"
					className="flex flex-1 flex-col gap-4 items-center justify-center"
				>
					{isLoading ? null : (
						<>
							<ServerInfo
								apiGuild={data?.guild!}
								isDirty={isDirty}
								setDirtyAction={setDirtyAction}
							/>
							<InviteLink
								guild={data?.dbGuild!}
								isDirty={isDirty}
								setDirtyAction={setDirtyAction}
							/>
						</>
					)}
				</div>
			</section>
		</div>
	);
};
