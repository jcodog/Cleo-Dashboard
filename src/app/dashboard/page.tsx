"use client";

import { Heading } from "@/components/Heading";
import { ServerList } from "@/components/ServerList";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { Servers } from "@/prisma/client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
	OAuth2Scopes,
	RESTGetAPICurrentUserGuildsResult,
} from "discord-api-types/v10";
import { CircleCheck, CircleX, Loader, Plus } from "lucide-react";
import Link from "next/link";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardHomePage = () => {
	const router = useRouter();
	const { getToken } = useAuth();
	const [guilds, setGuilds] = useState<Array<Servers> | null>(null);
	const [isUserInstalled, setIsUserInstalled] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["get-guild-list"],
		queryFn: async () => {
			const token = await getToken();

			// fetch sorted guilds from our dashRouter
			const res = await client.dash.getGuildList.$get(undefined, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return res.json();
		},
	});

	const { data: oauth2Data, isLoading: isOauth2DataLoading } = useQuery({
		queryKey: ["get-oauth2-data"],
		queryFn: async () => {
			const token = await getToken();

			const res = await client.discord.getOauth2Data.$get(undefined, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return await res.json();
		},
	});

	useEffect(() => {
		if (data && data.guilds) {
			setGuilds(
				data.guilds.map((server) => ({
					...server,
					lastOpened: server.lastOpened
						? new Date(server.lastOpened)
						: null,
				}))
			);
		}
	}, [data]);

	useEffect(() => {
		if (oauth2Data && oauth2Data.currentOauth2Data) {
			if (
				oauth2Data.currentOauth2Data.scopes.includes(
					OAuth2Scopes.ApplicationsCommands
				)
			) {
				setIsUserInstalled(true);
			}
		}
	}, [oauth2Data]);

	return (
		<section className="container mx-auto p-6 flex flex-col items-center gap-8">
			<header className="w-full flex items-center justify-between mb-8">
				<Heading>Dashboard</Heading>
				<div className="flex items-center gap-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="p-1 flex gap-2 items-center justify-center rounded-full hover:bg-gray-200/10 cursor-pointer">
								<p className="text-pretty text-sm font-medium">
									User installed:
								</p>
								{isOauth2DataLoading ? (
									<Loader className="h-5 w-5 animate-spin text-muted-foreground" />
								) : isUserInstalled ? (
									<CircleCheck className="h-5 w-5 text-green-400" />
								) : (
									<Link href="/add">
										<CircleX className="h-5 w-5 text-red-400" />
									</Link>
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							{isOauth2DataLoading
								? "Checking installation status..."
								: isUserInstalled
								? "Cleo is installed on your account and usable in any server or DM that supports external apps"
								: "Cleo is not installed on your account. Click to install Cleo on your account."}
						</TooltipContent>
					</Tooltip>
					<UserButton showName />
				</div>
			</header>

			<section className="w-full max-w-4xl flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Your Servers</h2>
					<Button
						variant="ghost"
						className="flex items-center gap-2 cursor-pointer"
						onClick={() => router.push("/add/server")}
					>
						<Plus className="h-5 w-5" />
						Add Server
					</Button>
				</div>
				{isLoading ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="aspect-square bg-gray-700 rounded-lg animate-pulse"
							/>
						))}
					</div>
				) : guilds && guilds.length > 0 ? (
					<ServerList servers={guilds} />
				) : (
					<div className="flex flex-col items-center justify-center p-4 gap-4">
						<p>
							You have no servers yet. Let's add your first one!
						</p>
						<Button
							variant="secondary"
							className="h-20 w-20"
							onClick={(e) => {
								e.preventDefault();
								router.push("/add/server");
							}}
						>
							<Plus className="h-6 w-6" />
						</Button>
					</div>
				)}
			</section>
		</section>
	);
};

export default DashboardHomePage;
