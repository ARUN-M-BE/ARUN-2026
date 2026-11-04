import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function EmptyState({
  title = "No items found",
  description = "Get started by creating your first entry.",
  icon,
  children,
}: EmptyStateProps) {
  return (
    <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center shadow-sm sm:px-12">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary shadow-sm">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
