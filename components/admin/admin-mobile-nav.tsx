"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Layers, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ADMIN_NAV_GROUPS, isNavItemActive } from "./admin-nav";

/**
 * Mobile admin navigation.
 *
 * Radix's Sheet supplies the focus trap, Escape handling, scroll lock and the
 * overlay click. This component adds the two things the brief asks for on top:
 * an explicit aria-expanded/aria-controls pair on the trigger, and closing the
 * drawer whenever the route changes (including browser back/forward).
 */
export function AdminMobileNav() {
  const pathname = usePathname();
  // The drawer is open only for the path it was opened on, so any navigation —
  // link, back button or programmatic — closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  return (
    <Sheet open={open} onOpenChange={(next) => setOpenPath(next ? pathname : null)}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close admin navigation" : "Open admin navigation"}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="size-10 rounded-xl text-foreground hover:bg-muted md:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        id="admin-mobile-nav"
        side="left"
        className="w-[min(19rem,86vw)] gap-0 border-border bg-sidebar p-0"
      >
        <SheetTitle className="sr-only">Admin navigation</SheetTitle>

        <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/15">
            <Layers className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-foreground">ARUN M</span>
            <span className="block font-mono text-[10px] font-semibold tracking-wider text-sky-500">CMS NEXUS</span>
          </div>
        </div>

        <nav aria-label="Admin navigation (mobile)" className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {group.title}
              </h4>
              <div className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = isNavItemActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpenPath(null)}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isActive
                          ? "border border-primary/20 bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border/60 p-3">
          <Button asChild variant="outline" className="h-11 w-full justify-between rounded-xl text-xs">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <span className="flex items-center gap-2">
                <ExternalLink className="size-4 text-primary" />
                View portfolio
              </span>
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
