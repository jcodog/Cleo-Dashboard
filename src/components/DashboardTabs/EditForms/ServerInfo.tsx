"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIGuild } from "discord-api-types/v10";
import { useState } from "react";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface ServerInfoProps {
	apiGuild: APIGuild;
	isDirty: boolean;
	setDirtyAction: Dispatch<SetStateAction<boolean>>;
}
export const ServerInfo = ({
	apiGuild,
	isDirty,
	setDirtyAction,
}: ServerInfoProps) => {
	const { getToken } = useAuth();
	const initialName = apiGuild.name || "";
	const initialDescription = apiGuild.description ?? "";
	const [name, setName] = useState<string>(initialName);
	const [description, setDescription] = useState<string>(initialDescription);
	const [invite, setInvite] = useState<string | undefined>();
	const queryClient = useQueryClient();

	const { data, isPending, error, mutate } = useMutation({
		mutationKey: ["modify-guild-info"],
		mutationFn: async () => {
			const token = getToken();
			const req = await client.dash.setGuildInfo.$post(
				{
					guildId: apiGuild.id,
					name,
					description,
					initialName,
					initialDescription,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			return await req.json();
		},
	});

	useEffect(() => {
		if (data) {
			if (data.success) {
				toast.success("Changes saved");
				setDirtyAction(false);
				queryClient.invalidateQueries({ queryKey: ["get-guild-info"] });
				queryClient.invalidateQueries({
					queryKey: ["get-header-info"],
				});
			} else if (!data.success) {
				toast.error(data.error);
			}
		}

		if (error) {
			toast.error(error.message);
		}
	}, [data, error]);

	const isDisabled =
		isPending ||
		(name === initialName && description === initialDescription);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				mutate();
			}}
			className="flex flex-1 flex-col gap-6 max-w-2xl items-center justify-center w-full"
		>
			<Input
				value={name}
				onChange={(e) => {
					setName(e.target.value);
					if (e.target.value !== initialName) {
						setDirtyAction(true);
					} else {
						setDirtyAction(false);
					}
				}}
			/>
			<Input
				value={description}
				onChange={(e) => {
					setDescription(e.target.value);
					if (e.target.value !== initialDescription) {
						setDirtyAction(true);
					} else {
						setDirtyAction(false);
					}
				}}
			/>
			<div className="flex w-full items-center justify-end">
				<Button type="submit" disabled={isDisabled}>
					{isDisabled ? "No changes" : "Save changes"}
				</Button>
			</div>
		</form>
	);
};
