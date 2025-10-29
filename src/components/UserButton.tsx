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
import { useCallback, useMemo, useState } from "react";
import { LogOut, User2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type UserButtonProps = {
  namePosition?: "left" | "right";
  className?: string;
  showName?: boolean;
  size?: number; // avatar size in px
  align?: "start" | "end";
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
  align = "end",
}: UserButtonProps) {
  const [open, setOpen] = useState(false);
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
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className={cn(
            // Glassmorphism trigger: same height as the 'User installed' pill
            "group inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/5 backdrop-blur-md px-3 text-sm transition-all cursor-pointer relative overflow-hidden",
            // specular highlight sweep + subtle inner glow
            "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.35),transparent_60%)] before:opacity-35 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] after:translate-x-[-120%] group-hover:after:translate-x-[120%] after:transition-transform after:duration-700",
            isPending && "animate-pulse",
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
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
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
