import { ServerCard } from "@/components/ServerCard";
import { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";

interface ServerListProps {
	servers: RESTGetAPICurrentUserGuildsResult;
}

export const ServerList = ({ servers }: ServerListProps) => {
	return (
		<div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-4 gap-6">
			{servers.map(
				(server) => (
						<ServerCard
							key={server.id}
							serverName={server.name}
							serverId={server.id}
							serverImage={server.icon}
						/>
					)
			)}
		</div>
	);
};
