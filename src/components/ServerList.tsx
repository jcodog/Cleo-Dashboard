import { ServerCard } from "@/components/ServerCard";
import { Servers } from "@/prisma/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ServerListProps {
  servers: Array<Servers>;
}

export const ServerList = ({ servers }: ServerListProps) => {
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
    <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
      {/* stable gutter prevents layout shift when the scrollbar appears */}
      <ScrollArea className="h-full w-full overflow-x-hidden">
        {/* pr-2 keeps the bar off the cards; no extra left padding so layout stays identical */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 p-2">
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
