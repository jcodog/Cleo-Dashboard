import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background,opacity] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        glass:
          "border-white/12 bg-white/6 text-white backdrop-blur-sm dark:border-white/10 dark:bg-white/5 shadow-xs relative before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(255,255,255,0.35),transparent_60%)] before:opacity-35",
        // Higher-contrast glass variant for busy/image backgrounds
        "glass-contrast":
          "text-white border-white/20 bg-black/55 shadow-md backdrop-blur-md backdrop-saturate-150 backdrop-brightness-[.85] ring-1 ring-black/40 relative before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(255,255,255,0.25),transparent_60%)] before:opacity-40 dark:ring-black/50",
        // Muted glass badge for inactive/unlinked states
        "glass-muted":
          "text-white/75 border-white/16 bg-[linear-gradient(135deg,rgba(17,24,39,0.65),rgba(39,39,42,0.45))] backdrop-blur-md shadow-sm transition-colors relative before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_20%_0%,rgba(255,255,255,0.2),transparent_65%)] before:opacity-30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
