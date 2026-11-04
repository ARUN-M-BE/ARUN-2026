import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-[96px] w-full rounded-lg border border-input/80 bg-background/60 px-3.5 py-2.5 text-base shadow-sm backdrop-blur-sm transition-all duration-200 outline-none",
          "placeholder:text-muted-foreground/70",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
          "md:text-sm resize-y dark:bg-input/20",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
