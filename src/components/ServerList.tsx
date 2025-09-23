import { ServerCard } from "@/components/ServerCard";
import { Servers } from "@/prisma/client";

interface ServerListProps {
  servers: Array<Servers>;
}

export const ServerList = ({ servers }: ServerListProps) => {
  // Determine most recently viewed/edited server by lastOpened timestamp
  const recentServers = servers
    .filter((s) => Boolean((s as Servers & { lastOpened?: Date }).lastOpened))
    .sort((a, b) => {
      const aTime =
        (a as Servers & { lastOpened?: Date }).lastOpened?.getTime() || 0;
      const bTime =
        (b as Servers & { lastOpened?: Date }).lastOpened?.getTime() || 0;
      return bTime - aTime;
    });
  const recentId = recentServers[0]?.id;
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
