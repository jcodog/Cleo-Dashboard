"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
// import Users type no longer needed
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, CloudUpload, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { toast } from "sonner";

const WelcomePage = () => {
	const router = useRouter();
	const [synced, setSynced] = useState<boolean | undefined>(false);
	const { getToken } = useAuth();

	const { data } = useQuery({
		queryKey: ["sync-user-welcome"],
		queryFn: async () => {
			const res = await client.auth.sync_user.$get(undefined, {
				headers: {
					Authorization: `Bearer ${await getToken()}`,
				},
			});

			return await res.json();
		},
		refetchInterval: (query) => {
			return query.state.data?.synced ? false : 1000;
		},
	});

	useEffect(() => {
		if (data?.synced) {
			setSynced(true);
			toast.success("User account created");
		}
	}, [data]);

	return (
		<section className="flex flex-1 w-full flex-col items-center justify-center">
			{synced ? (
				// Synced
				<div className="flex flex-1 w-full p-4 bg-accent/40 rounded-md flex-col items-center justify-center gap-4">
					<Heading>
						Synced <BsCloudCheck className="ml-2" />
					</Heading>

					<Button
						onClick={() => {
							router.push("/dashboard");
						}}
					>
						Continue to the dashboard{" "}
						<ArrowRight className="size-4" />
					</Button>
				</div>
			) : (
				// Syncing
				<div className="flex flex-1 w-full p-4 bg-accent/40 rounded-md flex-col items-center justify-center gap-4">
					<Heading>Syncing</Heading>
					<Loader className="size-8 animate-spin" />
					<p className="tracking-tight text-pretty text-sm text-muted-foreground">
						Please wait just a moment while we sync your user data
						with the database.
					</p>
				</div>
			)}
		</section>
	);
};

export default WelcomePage;
