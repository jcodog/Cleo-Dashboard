import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const imageUrl = serverImage
    ? `https://cdn.discordapp.com/icons/${serverId}/${serverImage}.${
        serverImage.startsWith("a_") ? "gif" : "png"
      }?size=2048`
    : "https://cdn.cleoai.cloud/site-icons/guild-missing-icon.png";

  return (
    <>
      <Link
        href={`/dashboard/d/guild/${serverId}`}
        className={cn(
          "flex md:hidden group relative w-auto aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 transition-transform hover:-translate-y-0.5 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:z-6 before:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(255,255,255,0.15),transparent_60%)] before:opacity-60 before:transition-opacity before:duration-300 group-hover:before:opacity-80 before:backdrop-blur-[1.5px]",
          isRecent &&
            "ring-2 ring-indigo-400/35 dark:ring-indigo-300/30 ring-offset-2 ring-offset-background shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_0_1px_rgba(99,102,241,0.10)] after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(180deg,rgba(99,102,241,0.28),rgba(168,85,247,0.15)_40%,transparent_100%)] after:opacity-60 after:transition-opacity after:duration-300 group-hover:after:opacity-80"
        )}
      >
        {isRecent && (
          <Badge
            variant="glass"
            className="absolute top-2 left-2 z-20 px-2 py-0.5 text-xs font-semibold border-white/20 before:opacity-45 bg-black/35 dark:bg-black/40 backdrop-brightness-85 shadow-sm"
          >
            Recently viewed
          </Badge>
        )}
        <Image
          src={imageUrl}
          alt={`${serverName}'s icon`}
          fill
          className="absolute inset-0 object-cover z-5"
        />
        <p className="absolute text-pretty truncate overflow-hidden text-md font-semibold bg-background/60 backdrop-blur-sm border-t border-white/10 bottom-0 w-full z-10 text-center p-2">
          {serverName}
        </p>
      </Link>
      <Link
        href={`/dashboard/d/guild/${serverId}`}
        className={cn(
          "hidden md:flex group relative w-full aspect-square h-auto overflow-hidden bg-accent/20 shadow-lg rounded-lg cursor-pointer z-0 transition-transform hover:-translate-y-0.5 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:z-6 before:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(255,255,255,0.15),transparent_60%)] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 before:backdrop-blur-[1.5px]",
          isRecent &&
            "ring-2 ring-indigo-400/35 dark:ring-indigo-300/30 ring-offset-2 ring-offset-background shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_0_1px_rgba(99,102,241,0.10)] after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(180deg,rgba(99,102,241,0.28),rgba(168,85,247,0.15)_40%,transparent_100%)] after:opacity-60 after:transition-opacity after:duration-300 group-hover:after:opacity-80"
        )}
        style={{ maxWidth: 340 }}
      >
        {isRecent && (
          <Badge
            variant="glass"
            className="absolute top-2 left-2 z-20 px-2 py-0.5 text-xs font-semibold border-white/20 before:opacity-45 bg-black/35 dark:bg-black/40 backdrop-brightness-85 shadow-sm"
          >
            Recently viewed
          </Badge>
        )}
        <Image
          src={imageUrl}
          alt={`${serverName}'s icon`}
          fill
          className="absolute inset-0 object-cover z-5"
        />
        <div className="absolute z-10 flex items-center justify-center h-full w-full text-pretty truncate overflow-hidden bg-background/60 backdrop-blur-sm border-t border-white/10 opacity-0 animate-out slide-out-to-bottom group-hover:opacity-100 group-hover:animate-in group-hover:slide-in-from-bottom duration-250 p-4">
          <p className="text-md font-semibold truncate overflow-hidden">
            {serverName}
          </p>
        </div>
      </Link>
    </>
  );
};
