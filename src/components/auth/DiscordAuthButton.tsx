"use client";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

export interface DiscordAuthButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode; // override label if desired
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
  variant?: React.ComponentProps<typeof Button>["variant"];
  ariaLabel?: string;
  lastUsed?: string;
}

export const DiscordAuthButton: React.FC<DiscordAuthButtonProps> = ({
  loading,
  disabled,
  children,
  onClick,
  className,
  size = "sm",
  variant = "glass",
  ariaLabel,
  lastUsed,
}) => {
  return (
    <div className="relative w-full">
      <Button
        size={size}
        variant={variant}
        className={cn("w-full", className)}
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={
          ariaLabel || (children ? undefined : "Continue with Discord")
        }
      >
        <SiDiscord className="size-4" />
        {children || (loading ? "Redirecting..." : "Continue with Discord")}
      </Button>
      {lastUsed === "discord" && (
        <Badge
          variant="glass"
          className="pointer-events-none absolute -top-1 -right-1 translate-x-1 -translate-y-1 rounded-full px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-sm z-20"
          aria-label="Last used"
        >
          Last used
        </Badge>
      )}
    </div>
  );
};

export default DiscordAuthButton;
