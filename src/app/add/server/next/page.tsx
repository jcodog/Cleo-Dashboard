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
import { useQuery } from "@tanstack/react-query";
import { RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const ServerAddNextPage = () => {
	const router = useRouter();
	const [channelId, setChannelId] = useState<string>();
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

	useEffect(() => {
		if (data && data.channels) {
			setChannels(data.channels);
		} else if (data && !data.channels) {
			console.error(data.message);
		}
	}, [data]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log(channelId);
	};

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-8 max-w-3xl">
			<div className="flex flex-col items-center justify-center gap-2 text-pretty text-center">
				<Heading>Clea successfully added</Heading>
				<p>
					But wait... before you can use Cleo you need to select a
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
						disabled={!channels || isLoading}
						onValueChange={(value) => {
							setChannelId(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a channel..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="general">General</SelectItem>
						</SelectContent>
					</Select>

					<Button type="submit" className="cursor-pointer">
						Submit
					</Button>
				</div>
			</form>
		</section>
	);
};

export default ServerAddNextPage;
