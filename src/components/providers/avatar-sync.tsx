"use client";

import { useEffect, useRef } from "react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { client } from "@/lib/client";

/**
 * AvatarSyncProvider
 * On mount (typically after login), checks the user's Discord avatar
 * and updates the Clerk profile image if it's different. Runs once per session.
 */
export const AvatarSyncProvider = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user || ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        // Fetch current Discord avatar
        const res = await client.session.getDiscordAvatar.$get(undefined, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        const { url } = await res.json();
        if (!url) return;

        const current = user.imageUrl; // Clerk-hosted URL
        // If Clerk image already points to the same Discord CDN URL, skip
        if (
          current &&
          current.includes("cdn.discordapp.com") &&
          current === url
        ) {
          return;
        }

        // If Clerk image is different, try to update to Discord URL.
        // Clerk requires a File/blob for setProfileImage; fetch and convert.
        const imgRes = await fetch(url);
        const blob = await imgRes.blob();
        const file = new File([blob], "discord-avatar", {
          type: blob.type || "image/png",
        });
        await clerkUser?.setProfileImage({ file });
      } catch (e) {
        // Non-fatal: ignore avatar sync errors silently
        console.warn("Avatar sync skipped:", e);
      }
    })();
  }, [isSignedIn, user, clerkUser]);

  return null;
};
