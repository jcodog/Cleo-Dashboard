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
  lastMethod?: string;
}

export const DiscordAuthButton: React.FC<DiscordAuthButtonProps> = ({
  loading,
  disabled,
  children,
  onClick,
  className,
  size = "sm",
  variant = "default",
  ariaLabel,
  lastMethod,
}) => {
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("w-full", className)}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel || (children ? undefined : "Continue with Discord")}
    >
      <SiDiscord className="size-4" />
      {children || (loading ? "Redirecting..." : "Continue with Discord")}
      {lastMethod === "discord" && <Badge className="ml-2">Last</Badge>}
    </Button>
  );
};

export default DiscordAuthButton;
