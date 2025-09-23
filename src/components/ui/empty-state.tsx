"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type EmptyVariant = "default" | "subtle" | "danger" | "info" | "success";
type EmptySize = "sm" | "md" | "lg";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode; // renamed from title to avoid collision with native title attribute
  description?: React.ReactNode;
  icon?: React.ReactNode; // a lucide icon or emoji
  action?: React.ReactNode; // button(s)
  variant?: EmptyVariant;
  size?: EmptySize;
  decorative?: boolean; // if icon purely decorative
  illustration?: React.ReactNode; // optional custom illustration instead of icon blob
}

const variantStyles: Record<EmptyVariant, string> = {
  default:
    "bg-gradient-to-br from-accent/50 to-accent/20 dark:from-accent/30 dark:to-accent/10 border-border/60",
  subtle: "bg-card/40 border-border/40",
  danger:
    "bg-gradient-to-br from-destructive/25 to-destructive/5 border-destructive/40 text-destructive dark:from-destructive/20 dark:to-destructive/10",
  info: "bg-gradient-to-br from-chart-2/30 to-chart-3/15 border-chart-2/40",
  success:
    "bg-gradient-to-br from-chart-5/30 to-chart-1/10 border-chart-5/40 dark:from-chart-5/20 dark:to-chart-1/10",
};

const sizeStyles: Record<
  EmptySize,
  { wrapper: string; icon: string; title: string; desc: string }
> = {
  sm: {
    wrapper: "p-4 gap-2",
    icon: "size-8",
    title: "text-sm",
    desc: "text-xs",
  },
  md: {
    wrapper: "p-6 gap-3",
    icon: "size-10",
    title: "text-base",
    desc: "text-sm",
  },
  lg: {
    wrapper: "p-8 gap-4",
    icon: "size-14",
    title: "text-lg",
    desc: "text-sm md:text-base",
  },
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      heading = "Nothing here yet",
      description,
      icon,
      action,
      variant = "default",
      size = "md",
      decorative = false,
      illustration,
      ...props
    },
    ref
  ) => {
    const sizeDef = sizeStyles[size];
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "relative isolate flex flex-col items-center justify-center rounded-xl border text-center backdrop-blur-sm shadow-[0_4px_18px_-8px_rgba(0,0,0,0.3)] overflow-hidden",
          variantStyles[variant],
          sizeDef.wrapper,
          "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_70%)] dark:before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]",
          className
        )}
        {...props}
      >
        {illustration ? (
          <div className="mb-2" aria-hidden>
            {illustration}
          </div>
        ) : icon ? (
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full bg-background/60 ring-1 ring-border/70 shadow-inner",
              sizeDef.icon
            )}
            aria-hidden={decorative || undefined}
          >
            <div className="[&_svg]:size-1/2 text-foreground/80 opacity-90">
              {icon}
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-primary)_0%,transparent_70%)] opacity-[0.07]" />
          </div>
        ) : null}
        {heading ? (
          <h2
            className={cn(
              "font-semibold tracking-tight text-foreground/90",
              sizeDef.title
            )}
          >
            {heading}
          </h2>
        ) : null}
        {description ? (
          <p
            className={cn(
              "mx-auto max-w-prose text-muted-foreground leading-relaxed",
              sizeDef.desc
            )}
          >
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {action}
          </div>
        ) : null}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

// Convenience inline example (can be removed or kept for docs use later)
export const ExampleEmpty = () => (
  <EmptyState
    heading="Coming soon"
    description="We're polishing this feature. Check back later or join the waitlist to get notified."
    variant="info"
  />
);
