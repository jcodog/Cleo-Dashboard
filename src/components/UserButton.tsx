"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/authClient";
import { useCallback, useMemo } from "react";
import { LogOut, User2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type UserButtonProps = {
  namePosition?: "left" | "right";
  className?: string;
  showName?: boolean;
  size?: number; // avatar size in px
};

/**
 * UserButton – Reusable authenticated user dropdown.
 * - Shows avatar + (optional) name
 * - Dropdown provides quick navigation to Account page and Sign out
 */
export function UserButton({
  namePosition = "right",
  className,
  showName = true,
  size = 32,
}: UserButtonProps) {
  const { useSession, signOut } = authClient;
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const initials = useMemo(() => {
    if (!user) return "?";
    const base = user.name || user.email || "?";
    return base
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [user]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      // Hard navigation ensures any cached state resets
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out failed", e);
    }
  }, [signOut]);

  const avatarNode = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-border/60 bg-card overflow-hidden text-xs font-semibold",
        isPending && "animate-pulse"
      )}
      style={{ width: size, height: size }}
    >
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "User avatar"}
          width={size}
          height={size}
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  const label = user?.name || user?.email || "Account";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-2.5 py-1.5 text-sm hover:bg-card/80 transition-colors",
            className
          )}
        >
          {namePosition === "left" && showName && (
            <span className="truncate max-w-[120px] font-medium text-sm">
              {label}
            </span>
          )}
          {avatarNode}
          {namePosition === "right" && showName && (
            <span className="truncate max-w-[120px] font-medium text-sm">
              {label}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex gap-2 items-center">
          <User2 className="h-4 w-4" />
          <span className="truncate" title={label}>
            {label}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
