"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Permissions, Snowflake } from "discord-api-types/globals";
import { GuildFeature } from "discord-api-types/v10";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AddServerPage = () => {
	const { getToken } = useAuth();
	const router = useRouter();
	const [guilds, setGuilds] = useState<
		{
			id: Snowflake;
			name: string;
			icon: string | null;
			banner: string | null;
			owner: boolean;
			features: GuildFeature[];
			permissions: Permissions;
			approximate_member_count?: number | undefined;
			approximate_presence_count?: number | undefined;
		}[]
	>();
	const [guildId, setGuildId] = useState<string>();

	const { data, isLoading } = useQuery({
		queryKey: ["get-servers-to-add-cleo-to"],
		queryFn: async () => {
			const token = await getToken();

			const res = await client.discord.getUserGuilds.$get(undefined, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();

			if (!data || !data.guilds) {
				return data;
			}

			const botRes = await client.discord.getBotGuilds.$get();

			const botData = await botRes.json();

			if (!botData || !botData.guilds) {
				return botData;
			}

			const notAddedToYet = data.guilds.filter(
				(guild) =>
					(BigInt(guild.permissions) & (BigInt(8) | BigInt(32))) !==
						BigInt(0) &&
					!botData.guilds.some((botGuild) => botGuild.id === guild.id)
			);

			return {
				guilds: notAddedToYet,
				message:
					"Retrieved guilds the bot is not in and the user is an admin in or has manage server permission in",
			};
		},
	});

	const { mutate: generateUrl, data: generatedUrl } = useMutation({
		mutationKey: ["generate-add-url"],
		mutationFn: async () => {
			const token = await getToken();

			const userRes = await client.discord.getOauth2Data.$get(undefined, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const user = await userRes.json();

			if (!user.currentOauth2Data || !user.currentOauth2Data.user) {
				return {
					success: false,
					message: "Cannot obtain discord ID for user",
					url: null,
				};
			}

			const res = await client.discord.addCleo.$post(
				{
					mode: "server",
					guildId,
					discordId: user.currentOauth2Data.user.id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return await res.json();
		},
	});

	useEffect(() => {
		if (data && data.guilds) {
			setGuilds(data.guilds);
		}
	}, [data]);

	useEffect(() => {
		if (generatedUrl && generatedUrl.url) {
			router.push("/add/server/next");
			window.open(generatedUrl.url, "_blank")!.focus();
		}
	}, [generatedUrl]);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-8 max-w-3xl">
			<div className="flex flex-col items-center justify-center gap-2 text-pretty text-center">
				<Heading className="text-6xl">Add Cleo to your server</Heading>
				<p>
					Let's get started adding cleo to your server, this will be
					the start of your amazing journey with cleo.
				</p>
			</div>

			<Separator orientation="horizontal" />

			<div className="flex flex-col items-center justify-center text-pretty gap-2">
				<p className="text-muted-foreground">
					Please select the server to add Cleo to
				</p>
				<div className="flex flex-col gap-2">
					<form
						className="flex flex-col items-center justify-center gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							generateUrl();
						}}
					>
						<Select
							disabled={!guilds || isLoading}
							onValueChange={(value) => {
								setGuildId(value);
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a server..." />
							</SelectTrigger>
							<SelectContent align="center">
								{guilds ? (
									guilds.map((guild) => (
										<SelectItem
											key={guild.id}
											value={guild.id}
										>
											{guild.name}
										</SelectItem>
									))
								) : (
									<SelectItem value="none" disabled>
										No server to add to
									</SelectItem>
								)}
							</SelectContent>
						</Select>

						<Button type="submit">Add to server</Button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default AddServerPage;
