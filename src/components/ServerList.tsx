import { ServerCard } from "@/components/ServerCard";
import { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Servers } from "@/prisma/client";

interface ServerListProps {
	servers: Array<Servers>;
}

export const ServerList = ({ servers }: ServerListProps) => {
	return (
		<div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-4 gap-6">
			{/* mobile version: always show plus, with label at bottom */}
			<Link
				href="/add/server"
				className="flex md:hidden group relative w-auto aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 mx-10"
			>
				<Plus className="size-16 m-auto text-muted-foreground" />
				<p className="absolute text-pretty truncate overflow-hidden text-md font-semibold bg-background/75 bottom-0 w-full z-10 text-center p-2">
					Add new server
				</p>
			</Link>
			{/* desktop version: plus icon with hover overlay */}
			<Link
				href="/add/server"
				className="hidden md:flex group relative w-full aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0"
			>
				<Plus className="size-16 m-auto text-muted-foreground" />
				<div className="absolute z-10 flex items-center justify-center h-full w-full text-pretty truncate overflow-hidden bg-background/75 opacity-0 animate-out slide-out-to-bottom group-hover:opacity-100 group-hover:animate-in group-hover:slide-in-from-bottom duration-250 p-4">
					<p className="text-md font-semibold">Add new Server</p>
				</div>
			</Link>

			{servers.map((server) => (
				<ServerCard
					key={server.id}
					serverName={server.name}
					serverId={server.id}
					serverImage={server.icon}
				/>
			))}
		</div>
	);
};
