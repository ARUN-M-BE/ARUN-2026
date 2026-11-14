import {
  Activity,
  Briefcase,
  Cpu,
  FolderGit2,
  GraduationCap,
  Mail,
  Sparkles,
  User,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for the portfolio shell navigation.
 *
 * Every section is treated as an independently owned module: it publishes a
 * small manifest (anchor id, i18n key, icon, presentation hints) and the shell
 * (navbar, command palette, scroll tour) renders whatever is registered here.
 * Adding a section therefore means adding one entry — not editing three files.
 */
export type SectionTone = "primary" | "accent" | "success" | "warning";

export interface SiteSectionModule {
  /** DOM anchor id used by `scrollIntoView` and in-page links. */
  key: string;
  /** i18n key resolved through the language context. */
  labelKey: string;
  /** English fallback label. */
  label: string;
  href: string;
  icon: LucideIcon;
  /** Visual emphasis inside the navbar. */
  style?: "default" | "glow" | "pill";
  /** Icon accent used by the command palette. */
  tone?: SectionTone;
  badge?: string;
  /** Register in the desktop/mobile navbar (defaults to true). */
  showInNavbar?: boolean;
  /** Register in the command palette (defaults to true). */
  showInPalette?: boolean;
}

export const SECTION_TONE_CLASS: Record<SectionTone, string> = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

export const SITE_SECTIONS: readonly SiteSectionModule[] = [
  {
    key: "hero",
    labelKey: "nav.universe",
    label: "Universe",
    href: "#hero",
    icon: Sparkles,
    tone: "primary",
  },
  {
    key: "about",
    labelKey: "nav.about",
    label: "About",
    href: "#about",
    icon: User,
    tone: "accent",
    showInNavbar: false,
  },
  {
    key: "projects",
    labelKey: "nav.projects",
    label: "Projects",
    href: "#projects",
    icon: FolderGit2,
    tone: "primary",
  },
  {
    key: "skills",
    labelKey: "nav.skills",
    label: "Skills",
    href: "#skills",
    icon: Cpu,
    tone: "accent",
  },
  {
    key: "services",
    labelKey: "nav.services",
    label: "Services",
    href: "#services",
    icon: Workflow,
    tone: "warning",
    showInNavbar: false,
  },
  {
    key: "analytics",
    labelKey: "nav.analytics",
    label: "Live Telemetry",
    href: "#analytics",
    icon: Activity,
    style: "glow",
    tone: "success",
    badge: "LIVE",
  },
  {
    key: "experience",
    labelKey: "nav.experience",
    label: "Experience",
    href: "#experience",
    icon: Briefcase,
    tone: "primary",
  },
  {
    key: "education",
    labelKey: "nav.credentials",
    label: "Credentials",
    href: "#education",
    icon: GraduationCap,
    tone: "accent",
  },
  {
    key: "contact",
    labelKey: "nav.contact",
    label: "Contact",
    href: "#contact",
    icon: Mail,
    style: "pill",
    tone: "warning",
  },
];

/** Sections rendered in the navbar (desktop pills + mobile sheet). */
export const NAVBAR_SECTIONS = SITE_SECTIONS.filter(
  (section) => section.showInNavbar !== false
);

/** Sections exposed through the ⌘K command palette. */
export const PALETTE_SECTIONS = SITE_SECTIONS.filter(
  (section) => section.showInPalette !== false
);

/** Sections surfaced by the guided scroll tour, in order. */
export const TOUR_SECTIONS = ["hero", "projects", "skills", "analytics", "experience", "contact"] as const;
