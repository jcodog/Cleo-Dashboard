import Image from "next/image";
import Link from "next/link";

interface ServerCardProps {
	serverName: string;
	serverId: string;
	serverImage: string | null;
	isRecent?: boolean;
}

export const ServerCard = ({
	serverName,
	serverId,
	serverImage,
	isRecent = false,
}: ServerCardProps) => {
	// highlight recent server
	const recentClass = isRecent
		? "ring-4 ring-indigo-500 ring-offset-2 ring-offset-background"
		: "";
	const imageUrl = serverImage
		? `https://cdn.discordapp.com/icons/${serverId}/${serverImage}.${
				serverImage.startsWith("a_") ? "gif" : "png"
		  }`
		: "https://archive.org/download/discordprofilepictures/discordblue.png";

	return (
		<>
			<Link
				href={`/dashboard/guild/${serverId}`}
				className={`flex md:hidden group relative w-auto aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 mx-10 ${recentClass}`}
			>
				{isRecent && (
					<span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md z-20">
						Recently viewed
					</span>
				)}
				<Image
					src={imageUrl}
					alt={`${serverName}'s icon`}
					fill
					className="absolute inset-0 cobject-cover z-5"
				/>
				<p className="absolute text-pretty truncate overflow-hidden text-md font-semibold bg-background/75 bottom-0 w-full z-10 text-center p-2">
					{serverName}
				</p>
			</Link>
			<Link
				href={`/dashboard/guild/${serverId}`}
				className={`hidden md:flex group relative w-full aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 ${recentClass}`}
			>
				{isRecent && (
					<span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md z-20">
						Recently viewed
					</span>
				)}
				<Image
					src={imageUrl}
					alt={`${serverName}'s icon`}
					fill
					className="absolute inset-0 cobject-cover z-5"
				/>
				<div className="absolute z-10 flex items-center justify-center h-full w-full text-pretty truncate overflow-hidden bg-background/75 opacity-0 animate-out slide-out-to-bottom group-hover:opacity-100 group-hover:animate-in group-hover:slide-in-from-bottom duration-250 p-4">
					<p className="text-md font-semibold truncate overflow-hidden">
						{serverName}
					</p>
				</div>
			</Link>
		</>
	);
};
