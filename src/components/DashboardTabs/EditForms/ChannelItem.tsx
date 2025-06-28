import { Input } from "@/components/ui/input";
import { useState } from "react";

export const ChannelItem = ({
	settingName,
	channelName,
	channelId,
}: {
	settingName: string;
	channelName: string | null;
	channelId: string | null;
}) => {
	const [editing, setEditing] = useState<boolean>(false);

	return (
		<div>
			<div>
				<h3>{settingName}</h3>
			</div>
			<div>{editing ? <Input /> : <div></div>}</div>
		</div>
	);
};
