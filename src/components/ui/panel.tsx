import * as React from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean; // reduce padding for nested usage
  variant?: "default" | "danger" | "subtle";
  interactive?: boolean; // adds hover ring / translate
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      children,
      inset = false,
      variant = "default",
      interactive = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border border-border/60 bg-card/65 backdrop-blur-sm supports-[backdrop-filter]:bg-card/55 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.25),0_8px_24px_-12px_rgba(0,0,0,0.25)] transition-colors",
          "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-gradient-to-tr before:from-accent/40 before:to-transparent before:opacity-0 before:transition-opacity",
          interactive &&
            "hover:before:opacity-100 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.35),0_10px_32px_-8px_rgba(0,0,0,0.35)] hover:border-border/80",
          inset ? "p-3" : "p-5",
          variant === "danger" &&
            "border-destructive/40 before:from-destructive/30 text-destructive dark:text-destructive before:to-transparent",
          variant === "subtle" &&
            "border-border/40 bg-card/50 shadow-none before:hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = "Panel";

export const PanelHeader = ({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between",
      className
    )}
  >
    <div className="min-w-0">
      <h3 className="text-base font-semibold tracking-tight sm:text-lg truncate">
        {title}
      </h3>
      {description ? (
        <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">
          {description}
        </p>
      ) : null}
    </div>
    {actions ? (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    ) : null}
  </div>
);
