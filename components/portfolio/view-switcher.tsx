"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, LayoutGrid, X } from "lucide-react";
import { PUBLIC_VIEW_IDS, getDesign, type DesignId } from "@/config/designs";
import { cn } from "@/lib/utils";

/**
 * Visitor-facing view switcher.
 *
 * Only rendered when the admin enables it. Every entry links to
 * `?view=<id>`, which renders that design once without persisting anything —
 * the published design stays untouched.
 */
export function ViewSwitcher({ current }: { current: DesignId }) {
  const [open, setOpen] = useState(false);
  const views = PUBLIC_VIEW_IDS.map((id) => getDesign(id));

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden">
      {open && (
        <nav
          aria-label="Switch page view"
          className="mb-2 w-60 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl"
        >
          <p className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Preview a view
          </p>
          <ul className="space-y-0.5">
            {views.map((design) => {
              const active = design.id === current;
              return (
                <li key={design.id}>
                  <Link
                    href={design.id === "current" ? "/" : `/?view=${design.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-secondary"
                    )}
                  >
                    <span className="flex gap-0.5" aria-hidden>
                      {design.swatches.map((color) => (
                        <span
                          key={color}
                          className="size-2 rounded-full ring-1 ring-inset ring-white/15"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{design.name}</span>
                    {active && <Check className="size-3.5 shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="px-2 pb-1 pt-2 text-[10px] leading-relaxed text-muted-foreground">
            Preview only — nothing is saved.
          </p>
        </nav>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="view-switcher-panel"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-2 text-[11px] font-semibold text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-primary/40"
      >
        {open ? <X className="size-3.5 text-primary" /> : <LayoutGrid className="size-3.5 text-primary" />}
        {open ? "Close" : "Views"}
      </button>
    </div>
  );
}
