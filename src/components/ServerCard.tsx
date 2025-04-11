import Image from "next/image";
import Link from "next/link";

interface ServerCardProps {
	serverName: string;
	serverId: string;
	serverImage: string | null;
}

export const ServerCard = ({
	serverName,
	serverId,
	serverImage,
}: ServerCardProps) => {
	const imageUrl = serverImage
		? `https://cdn.discordapp.com/icons/${serverId}/${serverImage}.${
				serverImage.startsWith("a_") ? "gif" : "png"
		  }`
		: "https://archive.org/download/discordprofilepictures/discordblue.png";

	return (
		<>
			<Link
				className="flex md:hidden group relative w-auto aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 mx-10"
				href={`/guild/${serverId}`}
			>
				<Image
					src={imageUrl}
					alt={`${serverName}'s icon`}
					fill
					className="absolute inset-0 cobject-cover z-5"
				/>
				<p className="absolute text-pretty truncate text-md font-semibold bg-background/75 bottom-0 w-full z-10 text-center p-2">
					{serverName}
				</p>
			</Link>
			<Link
				className="hidden md:flex group relative w-full aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0"
				href={`/guild/${serverId}`}
			>
				<Image
					src={imageUrl}
					alt={`${serverName}'s icon`}
					fill
					className="absolute inset-0 cobject-cover z-5"
				/>
				<div className="absolute z-10 flex items-center justify-center h-full w-full text-pretty truncate bg-background/75 opacity-0 animate-out slide-out-to-bottom group-hover:opacity-100 group-hover:animate-in group-hover:slide-in-from-bottom duration-250">
					<p className="text-md font-semibold">{serverName}</p>
				</div>
			</Link>
		</>
	);
};
