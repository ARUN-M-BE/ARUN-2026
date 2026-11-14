"use server";

import {
  ProfileController,
  ProjectController,
  SkillController,
  ExperienceController,
  EducationController,
  CertificationController,
  ServiceController,
  TestimonialController,
  MessageController,
  SettingsController,
  LegalController,
  MediaController,
  AuditController,
} from "@/server/controllers";
import {
  NavigationRepository,
  SectionRepository,
  MessageRepository,
} from "@/server/repositories";
import { AnalyticsService } from "@/server/services";
import { fallbackSocialLinks, fallbackWebsiteSections, fallbackProjects } from "@/server/repositories/fallback-data";
import { db } from "@/server/config/database";
import * as schema from "@/server/models/schema";
import { count, eq, and, ilike } from "drizzle-orm";
import { isUUID } from "@/lib/utils";
import { normalizeThemeId, THEMES, THEME_SETTING_KEY } from "@/config/themes";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { revalidatePath } from "next/cache";
import type {
  SocialLinkFormData,
  NavigationFormData,
  SectionFormData,
  SeoMetadataFormData,
} from "@/lib/validations";
import type { SocialLink, NavigationItem, WebsiteSection, MessageStatus, Project } from "@/types";

// ─── Profile ──────────────────────────────────────────────
export async function getProfile() {
  return ProfileController.getProfile();
}
export async function getPublicProfile() {
  return ProfileController.getPublicProfile();
}
export async function updateProfile(data: unknown) {
  return ProfileController.updateProfile(data);
}

// ─── Projects ─────────────────────────────────────────────
export async function getProjects(opts?: { search?: string; status?: string; page?: number; limit?: number }) {
  return ProjectController.getProjects(opts);
}
export async function getPublicProjects() {
  return ProjectController.getPublicProjects();
}

/**
 * Single published project resolved by slug. Used by the immersive case-study
 * route. Falls back to the bundled demo catalogue when the database is cold so
 * the route still renders in offline previews.
 */
export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(and(eq(schema.projects.slug, slug), eq(schema.projects.status, "published")))
      .limit(1);
    if (project) return project as Project;
  } catch (err) {
    console.warn("[actions.getPublicProjectBySlug] DB query failed, using fallback:", err);
  }

  return (fallbackProjects as Project[]).find((project) => project.slug === slug) ?? null;
}
export async function getProjectById(id: string) {
  return ProjectController.getProjectById(id);
}
export async function createProject(data: unknown) {
  return ProjectController.createProject(data);
}
export async function updateProject(id: string, data: unknown) {
  return ProjectController.updateProject(id, data);
}
export async function deleteProject(id: string) {
  return ProjectController.deleteProject(id);
}

// ─── Skills ───────────────────────────────────────────────
export async function getSkillCategories() {
  return SkillController.getCategories();
}
export async function createSkillCategory(data: unknown) {
  return SkillController.createCategory(data);
}
export async function updateSkillCategory(id: string, data: unknown) {
  return SkillController.updateCategory(id, data);
}
export async function deleteSkillCategory(id: string) {
  return SkillController.deleteCategory(id);
}
export async function getSkills(opts?: { categoryId?: string; search?: string }) {
  return SkillController.getSkills(opts);
}
export async function getPublicSkills() {
  return SkillController.getPublicSkills();
}
export async function createSkill(data: unknown) {
  return SkillController.createSkill(data);
}
export async function updateSkill(id: string, data: unknown) {
  return SkillController.updateSkill(id, data);
}
export async function deleteSkill(id: string) {
  return SkillController.deleteSkill(id);
}

// ─── Experience ───────────────────────────────────────────
export async function getExperiences() {
  return ExperienceController.getExperiences();
}
export async function getPublicExperience() {
  return ExperienceController.getPublicExperience();
}
export async function createExperience(data: unknown) {
  return ExperienceController.createExperience(data);
}
export async function updateExperience(id: string, data: unknown) {
  return ExperienceController.updateExperience(id, data);
}
export async function deleteExperience(id: string) {
  return ExperienceController.deleteExperience(id);
}

// ─── Education ────────────────────────────────────────────
export async function getEducation() {
  return EducationController.getEducation();
}
export async function getPublicEducation() {
  return EducationController.getPublicEducation();
}
export async function createEducation(data: unknown) {
  return EducationController.createEducation(data);
}
export async function updateEducation(id: string, data: unknown) {
  return EducationController.updateEducation(id, data);
}
export async function deleteEducation(id: string) {
  return EducationController.deleteEducation(id);
}

// ─── Certifications ───────────────────────────────────────
export async function getCertifications() {
  return CertificationController.getCertifications();
}
export async function getPublicCertifications() {
  return CertificationController.getPublicCertifications();
}
export async function createCertification(data: unknown) {
  return CertificationController.createCertification(data);
}
export async function updateCertification(id: string, data: unknown) {
  return CertificationController.updateCertification(id, data);
}
export async function deleteCertification(id: string) {
  return CertificationController.deleteCertification(id);
}

// ─── Services ─────────────────────────────────────────────
export async function getServices() {
  return ServiceController.getServices();
}
export async function getPublicServices() {
  return ServiceController.getPublicServices();
}
export async function createService(data: unknown) {
  return ServiceController.createService(data);
}
export async function updateService(id: string, data: unknown) {
  return ServiceController.updateService(id, data);
}
export async function deleteService(id: string) {
  return ServiceController.deleteService(id);
}

// ─── Testimonials ─────────────────────────────────────────
export async function getTestimonials() {
  return TestimonialController.getTestimonials();
}
export async function getPublicTestimonials() {
  return TestimonialController.getPublicTestimonials();
}
export async function createTestimonial(data: unknown) {
  return TestimonialController.createTestimonial(data);
}
export async function updateTestimonial(id: string, data: unknown) {
  return TestimonialController.updateTestimonial(id, data);
}
export async function deleteTestimonial(id: string) {
  return TestimonialController.deleteTestimonial(id);
}

// ─── Messages & Consent ───────────────────────────────────
export async function getContactMessages(opts?: { search?: string; status?: string; page?: number; limit?: number }) {
  return MessageController.getContactMessages(opts);
}
export async function submitContactForm(data: unknown) {
  return MessageController.submitContactForm(data);
}
export async function updateMessageStatus(id: string, status: MessageStatus) {
  return MessageController.updateMessageStatus(id, status);
}
export async function deleteMessage(id: string) {
  return MessageController.deleteMessage(id);
}
export async function recordConsent(data: {
  type: string;
  consentGiven: boolean;
  preferences?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: Date;
}) {
  try {
    await MessageRepository.recordConsent(data);
    return { success: true };
  } catch (err: unknown) {
    // Consent preferences are already stored in the browser by the banner, so a
    // DB failure must not throw into the UI — but it must be visible in logs.
    console.error("[actions.recordConsent] Failed to persist consent record:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to record consent" };
  }
}

// ─── Social Links ─────────────────────────────────────────
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const items = await db.select().from(schema.socialLinks).orderBy(schema.socialLinks.sortOrder);
    return items && items.length > 0 ? (items as SocialLink[]) : fallbackSocialLinks;
  } catch (err) {
    console.warn("[actions.getSocialLinks] DB query failed, using fallback:", err);
    return fallbackSocialLinks;
  }
}
export async function getPublicSocialLinks(placement?: string): Promise<SocialLink[]> {
  try {
    const items = await db
      .select()
      .from(schema.socialLinks)
      .where(and(eq(schema.socialLinks.isActive, true), eq(schema.socialLinks.status, "published")))
      .orderBy(schema.socialLinks.sortOrder);
    const source = items && items.length > 0 ? (items as SocialLink[]) : fallbackSocialLinks.filter((l) => l.isActive && l.status === "published");
    if (!placement) return source;
    return source.filter((item) => {
      if (!item.placements || !Array.isArray(item.placements)) return true;
      return (item.placements as string[]).includes(placement);
    });
  } catch (err) {
    console.warn("[actions.getPublicSocialLinks] DB query failed, using fallback:", err);
    const source = fallbackSocialLinks.filter((l) => l.isActive && l.status === "published");
    if (!placement) return source;
    return source.filter((item) => (item.placements as string[] | undefined)?.includes(placement));
  }
}
export async function createSocialLink(data: SocialLinkFormData): Promise<{ success: boolean; data?: SocialLink; error?: string }> {
  await requireAdmin();
  try {
    const { id: _ignored, ...cleanData } = data as Record<string, unknown>;
    const [item] = await db
      .insert(schema.socialLinks)
      .values({
        ...cleanData,
        size: data.size || "md",
        style: data.style || "default",
        placements: data.placements || ["footer", "contact"],
        status: data.status || "published",
        updatedAt: new Date(),
      } as typeof schema.socialLinks.$inferInsert)
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: item as SocialLink };
  } catch (err: unknown) {
    console.error("[actions.createSocialLink] DB insert failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create social link" };
  }
}
export async function updateSocialLink(id: string, data: Partial<SocialLinkFormData>): Promise<{ success: boolean; data?: SocialLink; error?: string }> {
  await requireAdmin();
  try {
    const { id: _ignored, ...cleanData } = data as Record<string, unknown>;
    const updateData = { ...cleanData, updatedAt: new Date() };

    const [item] = isUUID(id)
      ? await db.update(schema.socialLinks).set(updateData as Partial<typeof schema.socialLinks.$inferInsert>).where(eq(schema.socialLinks.id, id)).returning()
      : await db
          .update(schema.socialLinks)
          .set(updateData as Partial<typeof schema.socialLinks.$inferInsert>)
          .where(ilike(schema.socialLinks.platform, data.platform || id.replace(/^soc-/, "")))
          .returning();

    if (item) {
      revalidatePath("/");
      revalidatePath("/admin/social-links");
      return { success: true, data: item as SocialLink };
    }

    // Promote the edited row into a real database row instead of mutating memory.
    const [inserted] = await db
      .insert(schema.socialLinks)
      .values({
        platform: data.platform || "Custom",
        url: data.url || "https://arun-m.in",
        label: data.label || data.platform || "Link",
        icon: data.icon ?? null,
        color: data.color ?? null,
        size: data.size || "md",
        style: data.style || "default",
        placements: data.placements || ["footer", "contact"],
        sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
        isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        status: data.status || "published",
        updatedAt: new Date(),
      } as typeof schema.socialLinks.$inferInsert)
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: inserted as SocialLink };
  } catch (err: unknown) {
    console.error("[actions.updateSocialLink] DB update failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update social link" };
  }
}
export async function deleteSocialLink(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    if (isUUID(id)) {
      await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
    } else {
      await db.delete(schema.socialLinks).where(ilike(schema.socialLinks.platform, id.replace(/^soc-/, "")));
    }
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true };
  } catch (err: unknown) {
    console.error("[actions.deleteSocialLink] DB delete failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete social link" };
  }
}
export async function reorderSocialLinks(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        isUUID(id)
          ? db.update(schema.socialLinks).set({ sortOrder: index + 1, updatedAt: new Date() }).where(eq(schema.socialLinks.id, id))
          : Promise.resolve()
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true };
  } catch (err: unknown) {
    console.error("[actions.reorderSocialLinks] DB update failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to reorder social links" };
  }
}
// ─── Navigation ───────────────────────────────────────────
export async function getNavigation(): Promise<NavigationItem[]> {
  return NavigationRepository.findMany();
}
export async function getPublicNavigation(): Promise<NavigationItem[]> {
  return NavigationRepository.findActive();
}
export async function createNavigation(data: NavigationFormData): Promise<{ success: boolean; data?: NavigationItem; error?: string }> {
  await requireAdmin();
  try {
    const item = await NavigationRepository.create(data);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true, data: item as unknown as NavigationItem };
  } catch (err: unknown) {
    console.warn("[actions.createNavigation] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create navigation" };
  }
}
export async function updateNavigation(id: string, data: Partial<NavigationFormData>): Promise<{ success: boolean; data?: NavigationItem; error?: string }> {
  await requireAdmin();
  try {
    const item = await NavigationRepository.update(id, data);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true, data: item as unknown as NavigationItem };
  } catch (err: unknown) {
    console.warn("[actions.updateNavigation] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update navigation" };
  }
}
export async function deleteNavigation(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await NavigationRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.deleteNavigation] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete navigation" };
  }
}
export async function reorderNavigation(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await NavigationRepository.reorder(orderedIds);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.reorderNavigation] Error:", err);
    return { success: true };
  }
}

// ─── Website Sections Management ──────────────────────────
export async function getSections(): Promise<WebsiteSection[]> {
  const items = await SectionRepository.findMany();
  return items as unknown as WebsiteSection[];
}
export async function getPublicSections(): Promise<WebsiteSection[]> {
  const items = await SectionRepository.findPublished();
  return items as unknown as WebsiteSection[];
}
export async function createSection(data: SectionFormData): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> {
  await requireAdmin();
  try {
    const sec = await SectionRepository.create(data);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true, data: sec as unknown as WebsiteSection };
  } catch (err: unknown) {
    console.warn("[actions.createSection] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create section" };
  }
}
export async function updateSection(id: string, data: Partial<SectionFormData>): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> {
  await requireAdmin();
  try {
    const updated = await SectionRepository.update(id, data);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true, data: updated as unknown as WebsiteSection };
  } catch (err: unknown) {
    console.warn("[actions.updateSection] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update section" };
  }
}
export async function duplicateSection(id: string): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> {
  await requireAdmin();
  try {
    const duplicated = await SectionRepository.duplicate(id);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true, data: (duplicated as unknown as WebsiteSection) || undefined };
  } catch (err: unknown) {
    console.warn("[actions.duplicateSection] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to duplicate section" };
  }
}
export async function deleteSection(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await SectionRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.deleteSection] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete section" };
  }
}
export async function reorderSections(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await SectionRepository.reorder(orderedIds);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.reorderSections] Error:", err);
    return { success: true };
  }
}
export async function toggleSectionStatus(id: string, status: "draft" | "published" | "unpublished"): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await SectionRepository.update(id, { status });
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.toggleSectionStatus] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle section status" };
  }
}

// ─── Settings ────────────────────────────────────────────
export async function getSiteSettings() {
  return SettingsController.getSiteSettings();
}
export async function updateSiteSetting(key: string, value: unknown) {
  return SettingsController.updateSiteSetting(key, value);
}

/**
 * Publishes a visual universe globally. The public layout reads this value on
 * every request, so the showcased theme flips for all visitors immediately.
 */
export async function setActiveTheme(themeId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const theme = THEMES.find((item) => item.id === normalizeThemeId(themeId));
  if (!theme) {
    return { success: false, error: "Unknown visual universe" };
  }

  const result = await SettingsController.updateSiteSetting(THEME_SETTING_KEY, theme.id);
  if (result.success) {
    try {
      // Clear the per-visitor override so the freshly published universe is the
      // one this admin (and every uncookied visitor) sees immediately.
      const { cookies } = await import("next/headers");
      const store = await cookies();
      store.delete("pf_theme");
    } catch {
      // Cookie store is read-only in some render contexts — safe to ignore.
    }
    revalidatePath("/", "layout");
  }
  return result;
}

// ─── SEO Metadata ─────────────────────────────────────────
export async function getSeoMetadata(page?: string) {
  try {
    if (page) {
      const [meta] = await db.select().from(schema.seoMetadata).where(eq(schema.seoMetadata.page, page)).limit(1);
      return meta || null;
    }
    return await db.select().from(schema.seoMetadata);
  } catch (err) {
    console.warn("[actions.getSeoMetadata] DB query failed:", err);
    return page ? null : [];
  }
}
export async function upsertSeoMetadata(data: SeoMetadataFormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    const [existing] = await db.select().from(schema.seoMetadata).where(eq(schema.seoMetadata.page, data.page)).limit(1);
    if (existing) {
      await db.update(schema.seoMetadata).set({ ...data, updatedAt: new Date() }).where(eq(schema.seoMetadata.id, existing.id));
    } else {
      await db.insert(schema.seoMetadata).values(data);
    }
    revalidatePath("/admin/seo");
    return { success: true };
  } catch (err: unknown) {
    console.warn("[actions.upsertSeoMetadata] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to upsert SEO metadata" };
  }
}

// ─── Legal Documents ──────────────────────────────────────
export async function getLegalDocuments() {
  return LegalController.getLegalDocuments();
}
export async function getLegalDocumentBySlug(slug: string) {
  return LegalController.getLegalDocumentBySlug(slug);
}
export async function updateLegalDocument(id: string, data: unknown) {
  return LegalController.updateLegalDocument(id, data);
}
export async function deleteLegalDocument(id: string) {
  return LegalController.deleteLegalDocument(id);
}

// ─── Media Assets ─────────────────────────────────────────
export async function getMediaAssets(opts?: { page?: number; limit?: number; folder?: string; search?: string; type?: string }) {
  return MediaController.getMediaAssets(opts);
}
export async function createMediaAsset(data: {
  filename?: string;
  fileName?: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  fileSize?: number;
  url?: string;
  fileUrl?: string;
  altText?: string;
  copyright?: string;
  folder?: string;
  metadata?: Record<string, unknown>;
}) {
  return MediaController.createMediaAsset({
    filename: data.filename || data.fileName || "asset",
    originalFilename: data.originalFilename || data.filename || data.fileName || "asset",
    mimeType: data.mimeType || "application/octet-stream",
    size: data.size || data.fileSize || 0,
    url: data.url || data.fileUrl || "",
    altText: data.altText,
    copyright: data.copyright,
    folder: data.folder || "general",
    metadata: data.metadata,
  });
}
export async function deleteMediaAsset(id: string) {
  return MediaController.deleteMediaAsset(id);
}

// ─── Audit Log ────────────────────────────────────────────
export async function getAuditLogs(opts?: { page?: number; limit?: number; entity?: string; action?: string; search?: string }) {
  return AuditController.getAuditLogs(opts);
}

// ─── Dashboard Stats ──────────────────────────────────────
export async function getDashboardStats() {
  await requireAdmin();
  try {
    const [
      projectCount,
      pubProjectCount,
      draftProjectCount,
      skillCount,
      experienceCount,
      educationCount,
      certCount,
      messageCount,
      testimonialCount,
      serviceCount,
      allSections,
      analytics,
    ] = await Promise.all([
      db.select({ total: count() }).from(schema.projects).catch(() => [{ total: 12 }]),
      db.select({ total: count() }).from(schema.projects).where(eq(schema.projects.status, "published")).catch(() => [{ total: 10 }]),
      db.select({ total: count() }).from(schema.projects).where(eq(schema.projects.status, "draft")).catch(() => [{ total: 2 }]),
      db.select({ total: count() }).from(schema.skills).catch(() => [{ total: 24 }]),
      db.select({ total: count() }).from(schema.experience).catch(() => [{ total: 4 }]),
      db.select({ total: count() }).from(schema.education).catch(() => [{ total: 2 }]),
      db.select({ total: count() }).from(schema.certifications).catch(() => [{ total: 6 }]),
      db.select({ total: count() }).from(schema.contactMessages).where(eq(schema.contactMessages.messageStatus, "unread")).catch(() => [{ total: 0 }]),
      db.select({ total: count() }).from(schema.testimonials).catch(() => [{ total: 3 }]),
      db.select({ total: count() }).from(schema.services).catch(() => [{ total: 6 }]),
      SectionRepository.findMany().catch(() => fallbackWebsiteSections),
      AnalyticsService.getSummary(),
    ]);

    const sectionsList = allSections && allSections.length > 0 ? allSections : fallbackWebsiteSections;
    const publishedSec = sectionsList.filter((s) => s.status === "published").length;
    const draftSec = sectionsList.filter((s) => s.status === "draft").length;
    const unpubSec = sectionsList.filter((s) => s.status === "unpublished").length;

    return {
      projects: Number(projectCount?.[0]?.total ?? 12),
      publishedProjects: Number(pubProjectCount?.[0]?.total ?? 10),
      draftProjects: Number(draftProjectCount?.[0]?.total ?? 2),
      skills: Number(skillCount?.[0]?.total ?? 24),
      experience: Number(experienceCount?.[0]?.total ?? 4),
      education: Number(educationCount?.[0]?.total ?? 2),
      certifications: Number(certCount?.[0]?.total ?? 6),
      unreadMessages: Number(messageCount?.[0]?.total ?? 0),
      testimonials: Number(testimonialCount?.[0]?.total ?? 3),
      services: Number(serviceCount?.[0]?.total ?? 6),
      views: analytics.total,
      viewsToday: analytics.today,
      uniqueVisitors: analytics.uniqueVisitors,
      topCountry: analytics.topCountries[0]?.country || null,
      topCountries: analytics.topCountries,
      topPages: analytics.topPaths,
      dailyViews: analytics.daily,
      sections: sectionsList.length,
      publishedSections: publishedSec,
      draftSections: draftSec,
      unpublishedSections: unpubSec,
    };
  } catch (err) {
    console.warn("[actions.getDashboardStats] DB error, using fallback counts:", err);
    return {
      projects: 12,
      publishedProjects: 10,
      draftProjects: 2,
      skills: 24,
      experience: 4,
      education: 2,
      certifications: 6,
      unreadMessages: 0,
      testimonials: 3,
      services: 6,
      views: 0,
      viewsToday: 0,
      uniqueVisitors: 0,
      topCountry: null,
      topCountries: [] as Array<{ country: string | null; total: number }>,
      topPages: [] as Array<{ path: string; total: number }>,
      dailyViews: [] as Array<{ day: string; total: number }>,
      sections: 9,
      publishedSections: 9,
      draftSections: 0,
      unpublishedSections: 0,
    };
  }
}
