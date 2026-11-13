"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  MessageSquareQuote,
  Mail,
  Navigation,
  Settings,
  Search,
  Scale,
  Image,
  History,
  Layers,
  Share2,
  Server,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Portfolio Content",
    items: [
      { name: "Sections Manager", href: "/admin/sections", icon: Layers },
      { name: "Profile", href: "/admin/profile", icon: User },
      { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { name: "Skills & Constellation", href: "/admin/skills", icon: Cpu },
      { name: "Experience Timeline", href: "/admin/experience", icon: Briefcase },
      { name: "Education", href: "/admin/education", icon: GraduationCap },
      { name: "Certifications", href: "/admin/certifications", icon: Award },
    ],
  },
  {
    title: "Services & Social",
    items: [
      { name: "Services", href: "/admin/services", icon: Sparkles },
      { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { name: "Social Links", href: "/admin/social-links", icon: Share2 },
      { name: "Media Assets", href: "/admin/media", icon: Image },
    ],
  },
  {
    title: "Operations & Legal",
    items: [
      { name: "Messages", href: "/admin/messages", icon: Mail },
      { name: "Site Navigation", href: "/admin/navigation", icon: Navigation },
      { name: "SEO & Meta", href: "/admin/seo", icon: Search },
      { name: "Legal & DPDP 2023", href: "/admin/legal", icon: Scale },
      { name: "Site Settings", href: "/admin/settings", icon: Settings },
      { name: "Security & Audit", href: "/admin/audit-log", icon: History },
      { name: "API Management", href: "/admin/api-management", icon: Server },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border/70 bg-sidebar/90 backdrop-blur-xl lg:w-64">
      {/* Brand */}
      <div className="flex h-16 items-center justify-center gap-3 border-b border-border/60 px-2 lg:justify-start lg:px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/15">
          <Layers className="size-4 text-white" />
        </div>
        <div className="hidden min-w-0 lg:block">
          <span className="block truncate text-sm font-extrabold tracking-tight text-foreground">ARUN M</span>
          <span className="block text-[10px] text-sky-500 font-mono tracking-wider font-semibold">CMS NEXUS</span>
        </div>
      </div>

      {/* Nav List */}
      <nav aria-label="Admin navigation" className="flex-1 space-y-5 overflow-y-auto px-2 py-5 lg:px-3 lg:py-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="hidden px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:block">
              {group.title}
            </h4>
            <div className="space-y-1 lg:mt-2 lg:space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Button
                    asChild
                    key={item.name}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "group h-10 w-full justify-center rounded-xl px-0 text-xs font-medium transition-all lg:justify-start lg:gap-3 lg:px-3",
                      isActive
                        ? "border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/5 hover:bg-primary/15"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <Link href={item.href} title={item.name} aria-label={item.name} aria-current={isActive ? "page" : undefined}>
                      <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version badge */}
      <div className="border-t border-border/50 p-3 text-center lg:p-4">
        <div className="hidden text-[10px] font-mono text-muted-foreground lg:block">
          v1.0.0 • Production Ready
        </div>
        <span className="mx-auto block size-1.5 rounded-full bg-emerald-500 lg:hidden" aria-label="Admin online" />
      </div>
    </aside>
  );
}
