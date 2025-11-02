"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { SiKick } from "react-icons/si";

export interface KickAuthButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export const KickAuthButton: React.FC<KickAuthButtonProps> = ({
  loading,
  disabled,
  children,
  onClick,
  className,
  ariaLabel,
}) => {
  return (
    <div className="relative w-full">
      <Button
        size="sm"
        variant="glass"
        className={cn("w-full", className)}
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={ariaLabel || (children ? undefined : "Continue with Kick")}
      >
        <SiKick className="size-4" />
        {children || (loading ? "Redirecting..." : "Continue with Kick")}
      </Button>
      <Badge
        variant="outline"
        className="pointer-events-none absolute -top-1 -right-1 translate-x-1 -translate-y-1 rounded-full px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-sm z-20"
        aria-hidden
      >
        Beta
      </Badge>
    </div>
  );
};

export default KickAuthButton;
