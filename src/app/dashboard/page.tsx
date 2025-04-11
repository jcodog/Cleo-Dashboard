"use client";

import { Heading } from "@/components/Heading";
import { ServerList } from "@/components/ServerList";
import { client } from "@/lib/client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
	OAuth2Scopes,
	RESTGetAPICurrentUserGuildsResult,
} from "discord-api-types/v10";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardHomePage = () => {
	const { getToken } = useAuth();
	const [guilds, setGuilds] =
		useState<RESTGetAPICurrentUserGuildsResult | null>(null);
	const [isUserInstalled, setIsUserInstalled] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["get-shared-guilds"],
		queryFn: async () => {
			const token = await getToken();

			const userRes = await client.discord.getUserGuilds.$get(undefined, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const userData = await userRes.json();

			if (!userData.guilds) {
				return userData;
			}

			const botRes = await client.discord.getBotGuilds.$get();

			const botData = await botRes.json();

			if (!botData.guilds) {
				return botData;
			}

			const sharedGuilds = userData.guilds.filter((guild) =>
				botData.guilds.some((botGuild) => botGuild.id === guild.id)
			);

			if (!sharedGuilds || sharedGuilds.length < 1) {
				return {
					guilds: null,
					message: "No guilds shared between the bot and user",
				};
			}

			return {
				guilds: sharedGuilds,
				message: "Retrieved shared guilds",
			};
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
			setGuilds(data.guilds);
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
					// Make this a nice little component that displayes if the user has cleo added to their account as a user installable app instead of just plain text
				)}
			</div>

			<div className="flex flex-col gap-2 w-full items-center justify-center">
				<p className="text-pretty text-md font-semibold">Servers</p>
				{isLoading ? (
					<Loader className="size-6 animate-spin" />
				) : guilds ? (
					<ServerList servers={guilds} />
				) : (
					<p>No shared guilds</p>
				)}
			</div>
		</section>
	);
};

export default DashboardHomePage;
