import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/80 text-white aria-expanded:bg-primary/80 aria-expanded:text-white active:not-aria-[haspopup]:translate-y-px",
        outline:"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 active:not-aria-[haspopup]:translate-y-px ",
        secondary: "bg-[#6c757d] text-white hover:bg-[#5c636a] aria-expanded:bg-[#5c636a] aria-expanded:text-white active:not-aria-[haspopup]:translate-y-px ",
        ghost:"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 active:not-aria-[haspopup]:translate-y-px ",
        destructive:"bg-destructive/10 text-destructive border-red-200 hover:text-white hover:bg-red-700 active:not-aria-[haspopup]:translate-y-px ",
        link: "text-primary underline-offset-4 hover:underline active:not-aria-[haspopup]:translate-y-px ",
        success : "bg-[#78c091] text-white aria-expanded:text-white aria-expanded:bg-[#78c091] hover:bg-[#5eb47c] active:not-aria-[haspopup]:translate-y-px",
        back : "border border-transparent bg-secondary text-secondary-foreground hover:shadow-xl dark:bg-input dark:text-secondary-foreground dark:hover:bg-input/90 active:not-aria-[haspopup]:translate-y-px ",
        carousel: "border border-primary bg-primary/80 text-primary-foreground hover:bg-primary hover:text-white hover:border-primary aria-expanded:bg-transparent",
        primary: "border border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary hover:border-primary aria-expanded:bg-transparent aria-expanded:text-primary aria-expanded:border-primary active:not-aria-[haspopup]:translate-y-px ",
        primaryOutline: "hover:bg-primary hover:text-white bg-transparent text-primary border-primary aria-expanded:bg-transparent aria-expanded:text-primary aria-expanded:border-primary active:not-aria-[haspopup]:translate-y-px",
        primaryGhost: "border-primary text-primary bg-transparent hover:bg-primary/10",
        closeicon: "bg-primary hover:bg-primary/80 text-white aria-expanded:bg-primary/80 aria-expanded:text-white",
        
      },
      size: {
        default:
          "h-12 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 cursor-pointer [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icons-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icons-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icons-lg": "size-9",
        action:"h-10 w-10"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
