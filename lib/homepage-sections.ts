import type { WebsiteSection } from "@/types";

/**
 * Sections that must exist on the homepage even when an older database was
 * seeded before they were introduced. Rows published from the admin CMS always
 * win — this only fills gaps so newly shipped modules are never invisible.
 */
const CORE_FALLBACKS: Record<string, Omit<WebsiteSection, "id">> = {
  services: {
    sectionKey: "services",
    title: "Services & Expertise",
    subtitle: "Engineering engagements scoped around outcomes",
    badge: "Engagements",
    description:
      "Expandable service cards covering architecture, delivery, and observability engagements.",
    content: null,
    componentType: "builtin",
    sortOrder: 5,
    status: "published",
    styles: null,
    metadata: { canDelete: false, isCore: true, virtual: true },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
};

/** Insert after this section key when present; otherwise append. */
const INSERT_AFTER = "skills";

export function resolveHomepageSections(
  sections: WebsiteSection[] | null | undefined
): WebsiteSection[] {
  const list = Array.isArray(sections) ? [...sections] : [];
  if (list.length === 0) return list;

  for (const [key, fallback] of Object.entries(CORE_FALLBACKS)) {
    if (list.some((section) => section.sectionKey === key)) continue;

    const anchor = list.findIndex((section) => section.sectionKey === INSERT_AFTER);
    const insertAt = anchor >= 0 ? anchor + 1 : list.length;
    list.splice(insertAt, 0, { ...fallback, id: `core-${key}` });
  }

  return list;
}
