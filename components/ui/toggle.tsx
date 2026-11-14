"use client";

import * as React from "react";
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-muted/70 hover:text-foreground text-muted-foreground data-[state=on]:bg-secondary data-[state=on]:text-foreground data-[state=on]:shadow-xs",
        outline:
          "border border-border/80 bg-background/50 hover:bg-muted hover:text-foreground text-muted-foreground backdrop-blur-xs data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:shadow-xs",
        primary:
          "border border-primary/20 bg-primary/5 hover:bg-primary/15 text-primary data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-md data-[state=on]:shadow-primary/25",
        secondary:
          "bg-secondary/60 hover:bg-secondary text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        ghost:
          "hover:bg-muted/60 hover:text-foreground text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground",
        sky:
          "border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/15 text-sky-600 dark:text-sky-400 data-[state=on]:border-sky-500 data-[state=on]:bg-sky-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-sky-500/25",
        indigo:
          "border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 data-[state=on]:border-indigo-500 data-[state=on]:bg-indigo-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-indigo-500/25",
        emerald:
          "border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 data-[state=on]:border-emerald-500 data-[state=on]:bg-emerald-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-emerald-500/25",
        amber:
          "border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 data-[state=on]:border-amber-500 data-[state=on]:bg-amber-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-amber-500/25",
        purple:
          "border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15 text-purple-600 dark:text-purple-400 data-[state=on]:border-purple-500 data-[state=on]:bg-purple-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-purple-500/25",
        destructive:
          "border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive data-[state=on]:border-destructive data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground",
        glass:
          "border border-border/60 bg-card/60 backdrop-blur-md hover:bg-card/90 text-foreground data-[state=on]:border-primary/50 data-[state=on]:bg-primary/15 data-[state=on]:text-primary shadow-xs",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2.5 min-w-8 text-xs",
        lg: "h-10 px-4 min-w-10 text-base",
        xs: "h-7 px-2 min-w-7 text-xs rounded-lg",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-slot="toggle"
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    data-slot="toggle-group"
    className={cn("inline-flex items-center justify-center gap-1 p-1 rounded-2xl bg-muted/40 border border-border/50", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { Toggle, ToggleGroup, ToggleGroupItem, toggleVariants };
