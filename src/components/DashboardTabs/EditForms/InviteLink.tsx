import { Servers } from "@/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface InviteLinkProps {
	guild: Servers;
	isDirty: boolean;
	setDirtyAction: Dispatch<SetStateAction<boolean>>;
}

export const InviteLink = ({}: InviteLinkProps) => {
	const [inviteLink, setInviteLink] = useState<string | undefined>();

	return <div>Invite link here</div>;
};
