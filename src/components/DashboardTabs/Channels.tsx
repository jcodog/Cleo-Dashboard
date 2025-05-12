import { TabProps } from "@/app/dashboard/guild/[guildId]/page";
import { Heading } from "@/components/Heading";

export const Channels = ({ guildId }: TabProps) => {
	return (
		<div className="flex flex-col flex-1 w-full overflow-hidden gap-4">
			<section
				id="tab-heading"
				className="w-full flex flex-col border-b border-muted-foreground p-2"
			>
				<Heading>Channels</Heading>
				<p className="text-muted-foreground text-pretty text-sm font-mono">
					See the channels used by Cleo for different notifications
					etc.
				</p>
			</section>
			<section
				id="tab-content"
				className="flex flex-col flex-1 gap-4 p-2"
			>
				{guildId}
			</section>
		</div>
	);
};
