"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-10 w-full min-w-0 items-center rounded-lg border border-input/80 bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-1 focus-within:ring-offset-background",
        "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:bg-muted/30",
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/30",
        "has-[>textarea]:h-auto dark:bg-input/20",
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-1 px-3 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 pr-1",
        "inline-end": "order-last pr-3 pl-1",
        "block-start": "order-first w-full justify-start px-3 pt-2.5 [.border-b]:pb-2",
        "block-end": "order-last w-full justify-start px-3 pb-2.5 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-1 text-sm shadow-none",
  {
    variants: {
      size: {
        default: "h-8 px-2.5 text-xs",
        xs: "h-6 px-2 text-xs",
        sm: "h-7 px-2 text-xs",
        lg: "h-9 px-3 text-sm",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function InputGroupButton({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof Button> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      data-slot="input-group-button"
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupControl({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-full flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupControl,
  InputGroupTextarea,
};
