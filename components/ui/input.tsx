import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-10 w-full min-w-0 rounded-lg border border-input/80 bg-background/60 px-3.5 py-2 text-base shadow-sm backdrop-blur-sm transition-all duration-200 outline-none",
          "placeholder:text-muted-foreground/70",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
          "md:text-sm dark:bg-input/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
