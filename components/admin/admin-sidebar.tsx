"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { ADMIN_NAV_GROUPS, isNavItemActive } from "./admin-nav";

/**
 * Desktop admin rail. Below 768px it is removed from the flow entirely — the
 * header's menu button opens <AdminMobileNav /> instead.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-16 shrink-0 flex-col border-r border-border/70 bg-sidebar/90 backdrop-blur-xl md:flex lg:w-64">
      {/* Brand */}
      <div className="flex h-16 items-center justify-center gap-3 border-b border-border/60 px-2 lg:justify-start lg:px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/15">
          <Layers className="size-4 text-white" />
        </div>
        <div className="hidden min-w-0 lg:block">
          <span className="block truncate text-sm font-extrabold tracking-tight text-foreground">ARUN M</span>
          <span className="block font-mono text-[10px] font-semibold tracking-wider text-sky-500">CMS NEXUS</span>
        </div>
      </div>

      {/* Nav list */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 space-y-5 overflow-y-auto px-2 py-5 lg:px-3 lg:py-6"
      >
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="hidden px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:block">
              {group.title}
            </h4>
            <div className="space-y-1 lg:mt-2 lg:space-y-0.5">
              {group.items.map((item) => {
                const isActive = isNavItemActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.name}
                    aria-label={item.name}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-10 w-full items-center justify-center gap-0 rounded-xl px-0 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:justify-start lg:gap-3 lg:px-3",
                      isActive
                        ? "border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/5 hover:bg-primary/15"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version badge */}
      <div className="border-t border-border/50 p-3 text-center lg:p-4">
        <div className="hidden font-mono text-[10px] text-muted-foreground lg:block">
          v1.0.0 • Production Ready
        </div>
        <span
          className="mx-auto block size-1.5 rounded-full bg-emerald-500 lg:hidden"
          aria-label="Admin online"
        />
      </div>
    </aside>
  );
}
