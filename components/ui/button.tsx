import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm aria-expanded:bg-primary/90",
        outline:
          "border-border/80 bg-background/60 hover:bg-muted hover:text-foreground backdrop-blur-sm shadow-sm dark:border-input dark:bg-input/20 dark:hover:bg-input/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost:
          "hover:bg-muted/70 hover:text-foreground dark:hover:bg-muted/40",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground shadow-sm",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
        back:
          "border border-border/80 bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        carousel:
          "border border-primary/40 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground",
        primary:
          "border border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        primaryOutline:
          "border border-primary text-primary bg-transparent hover:bg-primary/10",
        primaryGhost:
          "text-primary bg-transparent hover:bg-primary/10",
        closeicon:
          "bg-primary/80 hover:bg-primary text-primary-foreground rounded-full size-8 p-0",
      },
      size: {
        default: "h-10 gap-2 px-4 py-2 cursor-pointer",
        xs: "h-7 gap-1 px-2.5 text-xs rounded-md",
        sm: "h-8 gap-1.5 px-3 text-xs rounded-md",
        lg: "h-11 gap-2 px-6 text-base md:text-sm rounded-lg",
        icon: "size-10 rounded-lg",
        "icons-xs": "size-7 rounded-md",
        "icons-sm": "size-8 rounded-md",
        "icons-lg": "size-11 rounded-lg",
        action: "size-10",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
