import { Heading } from "@/components/Heading";
import { UserButton } from "@clerk/nextjs";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { forbidden } from "next/navigation";

const DashboardHomePage = async () => {
	const user = await currentUser();

	if (!user) return forbidden();

	const client = await clerkClient();

	const accessToken = await client.users.getUserOauthAccessToken(
		user.id,
		"discord"
	);

	const data = await fetch("https://discord.com/api/v10/users/@me/guilds", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken.data[0]?.token}`,
		},
	});

	return (
		<section className="flex flex-1 flex-col items-center justify-center">
			<Heading>Dashboard Home</Heading>
			<UserButton />
			<p>{JSON.stringify(await data.json())}</p>
		</section>
	);
};

export default DashboardHomePage;
