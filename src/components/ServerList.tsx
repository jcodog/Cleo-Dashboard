import { ServerCard } from "@/components/ServerCard";
import { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Servers } from "@/prisma/client";

interface ServerListProps {
	servers: Array<Servers>;
}

export const ServerList = ({ servers }: ServerListProps) => {
	// Determine most recently viewed/edited server by lastOpened timestamp
	const recentServers = servers
		.filter((s) => (s as any).lastOpened)
		.sort(
			(a, b) =>
				(b as any).lastOpened!.getTime() -
				(a as any).lastOpened!.getTime()
		);
	const recentId = recentServers[0]?.id;
	return (
		<div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-4 gap-6">
			{servers.map((server) => (
				<ServerCard
					key={server.id}
					serverName={server.name}
					serverId={server.id}
					serverImage={server.icon}
					isRecent={server.id === recentId}
				/>
			))}
		</div>
	);
};
