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
  Palette,
} from "lucide-react";

/**
 * Single source of truth for admin navigation. The desktop rail and the mobile
 * drawer both render this list so the two can never drift apart.
 */
export interface AdminNavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Appearance", href: "/admin/appearance", icon: Palette },
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

/** Active state shared by both navigation surfaces. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
