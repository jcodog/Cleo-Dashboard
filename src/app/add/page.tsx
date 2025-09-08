"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { Server, User } from "lucide-react";
import { useRouter } from "next/navigation";

const AddPage = () => {
	const { getToken } = useAuth();
	const router = useRouter();

	const { mutate, data: generatedUrl } = useMutation({
		mutationKey: ["start-cleo-add"],
		mutationFn: async (mode: "user" | "server") => {
			const token = await getToken();

			const res = await client.discord.addCleo.$post(
				{ mode },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(res);
			return await res.json()
		},
	});

	useEffect(() => {
		if (generatedUrl && generatedUrl.url) {
			router.push("/dashboard");
			window.open(generatedUrl.url, "_blank")!.focus();
		}
	}, [generatedUrl]);

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-8 max-w-3xl">
			<div className="flex flex-col items-center justify-center gap-2 text-pretty text-center">
				<Heading className="text-6xl">Add Cleo</Heading>
				<p>
					Cleo is an amazing tool that works as either a server bot or
					a bot that can be used in group DMs with your friends (user
					install). We want to help make the setup of Cleo super
					enjoyable and easy for you.
				</p>
			</div>

			<Separator orientation="horizontal" />

			<div className="flex flex-col items-center justify-center text-pretty gap-2">
				<p className="text-muted-foreground">
					Please select where you want to install cleo
				</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => mutate("user")}>
						<User /> User
					</Button>
					<Button
						variant="outline"
						onClick={() => router.push("/add/server")}
					>
						<Server /> Server
					</Button>
				</div>
			</div>
		</section>
	);
};

export default AddPage;
