"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const ServerAddNextPage = () => {
	const router = useRouter();
	const [channelId, setChannelId] = useState<string>();
	const [guildId, setGuildId] = useState<string>();
	const [channels, setChannels] = useState<RESTGetAPIGuildChannelsResult>();
	const { getToken } = useAuth();

	const { data, isLoading } = useQuery({
		queryKey: ["finalise-guild-onboarding"],
		queryFn: async () => {
			const token = await getToken();

			const res = await client.discord.getOnboardingGuildChannels.$get(
				undefined,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return await res.json();
		},
	});

	const { mutate, data: configuredGuild } = useMutation({
		mutationKey: ["configure-onboarding-guild"],
		mutationFn: async () => {
			const token = await getToken();

			const res = await client.discord.configureGuild.$post(
				{
					channelId: channelId!,
					guildId: guildId!,
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
		if (data && data.channels && data.guildId) {
			setChannels(data.channels);
			setGuildId(data.guildId);
		} else if (data && !data.channels) {
			console.error(data.message);
		}
	}, [data]);

	useEffect(() => {
		if (configuredGuild && configuredGuild.configured) {
			toast.success(configuredGuild.message);
			generateUrl();
		} else if (configuredGuild && !configuredGuild.configured) {
			toast.error(configuredGuild.message);
		}
	}, [configuredGuild]);

	useEffect(() => {
		if (generatedUrl && generatedUrl.url) {
			router.push(generatedUrl.url);
		}
	}, [generatedUrl]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutate();
	};

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-8 max-w-3xl">
			<div className="flex flex-col items-center justify-center gap-2 text-pretty text-center">
				<Heading>Configure Cleo</Heading>
				<p>
					But wait... before you can add Cleo you need to select a
					channel for updates from Cleo, this is used to send you
					information about new features and changes to commands. This
					shouldn't be more than once a month.
				</p>
			</div>

			<form
				className="flex flex-col flex-1 max-h-[33vh] items-center justify-center gap-2 max-w-lg w-full text-pretty"
				onSubmit={handleSubmit}
			>
				<Label className="w-full text-start items-start">
					Cleo Updates Channel
				</Label>
				<div className="flex gap-4 w-full">
					<Select
						disabled={!channels || !guildId || isLoading}
						onValueChange={(value) => {
							setChannelId(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a channel..." />
						</SelectTrigger>
						<SelectContent>
							{channels ? (
								channels.map((channel) => (
									<SelectItem
										key={channel.id}
										value={channel.id}
									>
										{channel.name}
									</SelectItem>
								))
							) : (
								<SelectItem disabled value="none">
									No channels to select
								</SelectItem>
							)}
						</SelectContent>
					</Select>

					<Button
						type="submit"
						className="cursor-pointer"
						disabled={!channels || !guildId || isLoading}
					>
						Submit
					</Button>
				</div>
			</form>
		</section>
	);
};

export default ServerAddNextPage;
