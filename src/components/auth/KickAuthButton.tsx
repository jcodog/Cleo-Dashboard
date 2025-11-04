"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { SiKick } from "react-icons/si";
import { AuthButtonProps } from "@/components/auth/DiscordAuthButton";

export const KickAuthButton: React.FC<AuthButtonProps> = ({
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
        aria-label={ariaLabel || (children ? undefined : "Continue with Kick")}
      >
        <SiKick className="size-4" />
        {children || (loading ? "Redirecting..." : "Continue with Kick")}
      </Button>
      {lastUsed === "kick" && (
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

export default KickAuthButton;
