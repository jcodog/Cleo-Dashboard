import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        gradient:
          "relative overflow-hidden text-white shadow-xs bg-[linear-gradient(135deg,var(--color-chart-2),var(--color-chart-3),var(--color-chart-5))] bg-[length:200%_200%] transition-[background-position,box-shadow,transform] hover:bg-[position:100%_0] hover:shadow-sm active:shadow-xs will-change-transform hover:-translate-y-0.5 active:translate-y-0 before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)] before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/70 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          // Liquid glass: highly transparent, minimal blur, thin border, specular highlight sweep
          "relative overflow-hidden border border-white/12 bg-white/5 text-white backdrop-blur-md transition-[background,box-shadow,transform] hover:bg-white/7 focus-visible:ring-white/30 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.35),transparent_60%)] before:opacity-35 after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] after:translate-x-[-120%] after:transition-transform after:duration-700 hover:after:translate-x-[120%] will-change-[transform]",
        "glass-muted":
          "relative overflow-hidden border border-white/16 bg-[linear-gradient(140deg,rgba(17,24,39,0.55),rgba(39,39,42,0.38))] text-white/80 backdrop-blur-lg transition-[background,box-shadow,transform,color] hover:text-white hover:bg-[linear-gradient(140deg,rgba(24,32,45,0.6),rgba(45,45,50,0.45))] focus-visible:ring-white/20 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_90%_at_15%_0%,rgba(255,255,255,0.28),transparent_65%)] before:opacity-30 after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] after:translate-x-[-120%] after:transition-transform after:duration-700 hover:after:translate-x-[120%]",
        "glass-destructive":
          // Liquid glass (destructive): red tint with same transparency/blur and specular sweep
          "relative overflow-hidden border text-white backdrop-blur-md border-red-300/25 bg-red-500/12 hover:bg-red-500/18 focus-visible:ring-red-400/30 before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.35),transparent_60%)] before:opacity-30 after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] after:translate-x-[-120%] after:transition-transform after:duration-700 hover:after:translate-x-[120%] will-change-[transform]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
