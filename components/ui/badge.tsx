import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 px-2 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "h-6 rounded-full border border-red-200 bg-red-50 text-red-700 dark:border-red-950 dark:bg-[color-mix(in_oklab,var(--color-red-950)_50%,transparent)] dark:text-red-600",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        pending: "h-6 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-950 dark:bg-[color-mix(in_oklab,var(--color-yellow-950)_50%,transparent)] dark:text-yellow-600",
        approved: "h-6 rounded-full border border-green-200 bg-green-50 text-green-700 dark:border-green-950 dark:bg-[color-mix(in_oklab,var(--color-green-950)_50%,transparent)] dark:text-green-600",
        processing: "h-6 rounded-full border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-950 dark:bg-[color-mix(in_oklab,var(--color-blue-950)_50%,transparent)] dark:text-blue-600",
        inActive: "h-6 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-950 dark:bg-[color-mix(in_oklab,var(--color-cyan-950)_50%,transparent)] dark:text-cyan-600",
        rejected: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        underReview: "h-6 rounded-full border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-950 dark:bg-[color-mix(in_oklab,var(--color-orange-950)_50%,transparent)] dark:text-orange-600",
        submitted: "h-6 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-950 dark:bg-[color-mix(in_oklab,var(--color-indigo-950)_50%,transparent)] dark:text-indigo-600",
        assigned: "h-6 rounded-full border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-950 dark:bg-[color-mix(in_oklab,var(--color-violet-950)_50%,transparent)] dark:text-violet-600",
        success: "bg-green-600/10 text-green-700",
        info: "bg-blue-50/70 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        warning: "bg-yellow-50/70 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        sky: "bg-sky-50/60 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
        purple: "bg-purple-50/70 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
        primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
