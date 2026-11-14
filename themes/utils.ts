import type { AchievementEntry, PortfolioContent } from "@/themes/types";
import type { Education, Experience, Project, SocialLink } from "@/types";

/** Formatting + derivation helpers shared by every design (no hooks). */

export function monthYear(value?: Date | string | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

export function yearOf(value?: Date | string | null): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return String(date.getFullYear());
}

export function formatRange(
  start?: Date | string | null,
  end?: Date | string | null,
  isCurrent?: boolean
): string {
  const from = monthYear(start);
  const to = isCurrent ? "Present" : monthYear(end) ?? "Present";
  if (!from) return to;
  return `${from} — ${to}`;
}

export function educationRange(item: Education): string {
  return formatRange(item.startDate, item.endDate, item.isCurrent);
}

export function experienceRange(item: Experience): string {
  return formatRange(item.startDate, item.endDate, item.isCurrent);
}

export function initials(name?: string | null): string {
  if (!name) return "AM";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function projectImage(project: Project): string | null {
  return (
    project.thumbnail ||
    project.thumbnailUrl ||
    project.images?.[0] ||
    project.galleryImages?.[0] ||
    null
  );
}

export function projectStack(project: Project): string[] {
  return ((project.techStack as string[] | null) ?? []).filter(Boolean);
}

export function hasLiveDemo(project: Project): boolean {
  return typeof project.liveUrl === "string" && project.liveUrl.length > 0;
}

export function hasRepo(project: Project): boolean {
  return typeof project.githubUrl === "string" && project.githubUrl.length > 0;
}

export function socialHandle(link: SocialLink): string {
  const raw = link.label || link.platform;
  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function socialInitial(link: SocialLink): string {
  return (link.label || link.platform || "?").slice(0, 1).toUpperCase();
}

export function flattenSkills(content: PortfolioContent): {
  name: string;
  level: number;
  category: string;
}[] {
  return content.skillCategories.flatMap((category) =>
    (category.skills ?? []).map((skill) => ({
      name: skill.name,
      level: skill.level,
      category: category.name,
    }))
  );
}

/**
 * Achievements are stored on experience rows. We surface them as first-class
 * content so every design can render an achievements band without a new table.
 */
export function collectAchievements(content: PortfolioContent): AchievementEntry[] {
  const fromExperience = content.experiences.flatMap((exp, expIndex) =>
    ((exp.achievements as string[] | null) ?? []).filter(Boolean).map((detail, index) => ({
      id: `${exp.id}-ach-${index}`,
      title: detail,
      detail: `${exp.position} · ${exp.company}`,
      source: exp.company,
      order: expIndex,
    }))
  );

  const fromCertifications = content.certifications.slice(0, 3).map((cert) => ({
    id: `${cert.id}-cert`,
    title: `Certified in ${cert.name}`,
    detail: cert.issuer,
    source: cert.issuer,
    order: 100,
  }));

  return [...fromExperience, ...fromCertifications]
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...entry }) => entry);
}

export function contactChannels(content: PortfolioContent): {
  label: string;
  value: string;
  href: string;
}[] {
  const profile = content.profile;
  const channels: { label: string; value: string; href: string }[] = [];

  if (profile?.email) {
    channels.push({ label: "Email", value: profile.email, href: `mailto:${profile.email}` });
  }
  if (profile?.phone) {
    channels.push({ label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` });
  }
  if (profile?.location) {
    channels.push({
      label: "Based in",
      value: profile.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(profile.location)}`,
    });
  }
  if (profile?.resumeUrl && profile.resumeUrl !== "#") {
    channels.push({ label: "Resume", value: "Download CV", href: profile.resumeUrl });
  }

  return channels;
}

export function displayName(content: PortfolioContent): string {
  return content.profile?.fullName || "Arun M";
}

export function displayTitle(content: PortfolioContent): string {
  return content.profile?.title || "Full-Stack Architect & 3D Engineer";
}

export function displayBio(content: PortfolioContent): string {
  return (
    content.profile?.shortBio ||
    content.profile?.bio ||
    "Full-stack architect building resilient distributed systems and immersive web experiences."
  );
}

/** Section labels come from the CMS so copy edits propagate to every design. */
export function sectionCopy(
  content: PortfolioContent,
  key: string,
  fallback: { title: string; subtitle?: string; badge?: string }
): { title: string; subtitle: string; badge: string } {
  const section = content.sections.find((item) => item.sectionKey === key);
  return {
    title: section?.title || fallback.title,
    subtitle: section?.subtitle || fallback.subtitle || "",
    badge: section?.badge || fallback.badge || "",
  };
}
