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
			// fetch sorted guilds from our dashRouter
			const res = await client.dash.getGuildList.$get();
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
		<section className="flex flex-1 flex-col items-center justify-center gap-4">
			<Heading>Dashboard Home</Heading>

			<UserButton showName />

			<div className="flex gap-2 text-pretty text-md items-center justify-center">
				<p>User installed:</p>
				{isOauth2DataLoading ? (
					<Loader className="size-6 animate-spin" />
				) : (
					<div className="flex gap-2 text-pretty text-md items-center justify-center">
						{isUserInstalled ? (
							<>
								<CircleCheck className="size-6 text-green-500" />
								<span>You can use Cleo anywhere.</span>
							</>
						) : (
							<>
								<CircleX className="size-6 text-red-500" />
								<Link href="/add">
									Add Cleo to your account.
								</Link>
							</>
						)}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2 w-full items-center justify-center">
				<p className="text-pretty text-md font-semibold">Servers</p>
				{isLoading ? (
					<Loader className="size-6 animate-spin" />
				) : guilds ? (
					<ServerList servers={guilds} />
				) : (
					<div className="flex flex-1 flex-col items-center justify-center p-2 gap-2">
						<p>
							You have no servers, how about we add your first
							one?
						</p>
						<div className="flex flex-1 items-center justify-center p-6">
							<Button
								variant="secondary"
								className="size-20"
								onClick={(e) => {
									e.preventDefault();
									router.push("/add/server");
								}}
							>
								<Plus className="size-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default DashboardHomePage;
