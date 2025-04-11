"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CloudUpload, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { toast } from "sonner";

const WelcomePage = () => {
	const router = useRouter();
	const [user, setUser] = useState<Users | undefined>();
	const [startSync, setStartSync] = useState(true);
	const [showButton, setShowButton] = useState(false);
	const { getToken } = useAuth();

	const { mutate, data, isPending } = useMutation({
		mutationKey: ["sync-user-welcome"],
		mutationFn: async () => {
			const res = await client.auth.sync_user.$post(undefined, {
				headers: {
					Authorization: `Bearer ${await getToken()}`,
				},
			});

			return await res.json();
		},
	});

	useEffect(() => {
		if (startSync) {
			setStartSync(false);
			mutate();
		}
	}, [startSync]);

	useEffect(() => {
		if (data && data.success) {
			toast.success(data.message);
			setUser(data.user);
		}

		if (data && !data.success) {
			toast.error(data.message);
			setStartSync(true);
		}
	}, [data]);

	useEffect(() => {
		setTimeout(() => {
			if (!user && !isPending) {
				if (!startSync) {
					setStartSync(true);
				}

				setShowButton(true);
			}
		}, 15000);
	});

	return (
		<section className="flex flex-1 w-full flex-col items-center justify-center">
			{isPending ? (
				// Syncing
				<div className="flex flex-1 w-full p-4 bg-accent/40 rounded-md flex-col items-center justify-center gap-4">
					<Heading>Syncing</Heading>
					<Loader className="size-8 animate-spin" />
					<p className="tracking-tight text-pretty text-sm text-muted-foreground">
						Please wait just a moment while we sync your user data
						with the database.
					</p>
				</div>
			) : user ? (
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
				// Not started syncing
				<div className="flex flex-1 w-full p-4 bg-accent/40 rounded-md flex-col items-center justify-center gap-4">
					<Heading>Starting sync</Heading>

					{showButton ? (
						<>
							<p>
								If you are seeing this, something went wrong
								starting the sync. Please click the button to
								manually start syncing your user data with the
								database.
							</p>
							<Button
								onClick={() => {
									mutate();
								}}
								disabled={isPending}
							>
								<CloudUpload />
							</Button>
						</>
					) : null}
				</div>
			)}
		</section>
	);
};

export default WelcomePage;
