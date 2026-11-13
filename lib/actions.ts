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
  MessageRepository,
} from "@/server/repositories";
import { fallbackSocialLinks } from "@/server/repositories/fallback-data";
import { db } from "@/server/config/database";
import * as schema from "@/server/models/schema";
import { count, eq } from "drizzle-orm";
import { isUUID } from "@/lib/utils";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { revalidatePath } from "next/cache";
import type {
  Profile,
  Project,
  Skill,
  SkillCategory,
  SkillCategoryWithSkills,
  Experience,
  Education,
  Certification,
  ServiceOffering,
  Testimonial,
  SocialLink,
  SocialLinkInsert,
  ContactMessage,
  SiteSetting,
  NavigationItem,
  NavigationItemInsert,
  SeoMetadata,
  SeoMetadataInsert,
  LegalDocument,
  MediaAsset,
  MediaAssetInsert,
  AuditLogEntry,
  PaginationParams,
  PaginatedResponse,
  ActionResult,
  ConsentRecordInsert,
  DashboardStats,
} from "@/types";

// ─── Profile ──────────────────────────────────────────────
export async function getProfile(): Promise<Profile | null> {
  return ProfileController.getProfile();
}
export async function getPublicProfile(): Promise<Profile | null> {
  return ProfileController.getPublicProfile();
}
export async function updateProfile(data: unknown): Promise<ActionResult> {
  return ProfileController.updateProfile(data);
}

// ─── Projects ─────────────────────────────────────────────
export async function getProjects(opts?: PaginationParams): Promise<PaginatedResponse<Project>> {
  return ProjectController.getProjects(opts);
}
export async function getPublicProjects(): Promise<Project[]> {
  return ProjectController.getPublicProjects();
}
export async function getProjectById(id: string): Promise<Project | null> {
  return ProjectController.getProjectById(id);
}
export async function createProject(data: unknown): Promise<ActionResult> {
  return ProjectController.createProject(data);
}
export async function updateProject(id: string, data: unknown): Promise<ActionResult> {
  return ProjectController.updateProject(id, data);
}
export async function deleteProject(id: string): Promise<ActionResult> {
  return ProjectController.deleteProject(id);
}

// ─── Skills ───────────────────────────────────────────────
export async function getSkillCategories(): Promise<SkillCategory[]> {
  return SkillController.getCategories();
}
export async function createSkillCategory(data: unknown): Promise<ActionResult> {
  return SkillController.createCategory(data);
}
export async function deleteSkillCategory(id: string): Promise<ActionResult> {
  return SkillController.deleteCategory(id);
}
export async function getSkills(opts?: PaginationParams): Promise<Skill[]> {
  return SkillController.getSkills(opts);
}
export async function getPublicSkills(): Promise<SkillCategoryWithSkills[]> {
  return SkillController.getPublicSkills();
}
export async function createSkill(data: unknown): Promise<ActionResult> {
  return SkillController.createSkill(data);
}
export async function deleteSkill(id: string): Promise<ActionResult> {
  return SkillController.deleteSkill(id);
}

// ─── Experience ───────────────────────────────────────────
export async function getExperiences(): Promise<Experience[]> {
  return ExperienceController.getExperiences();
}
export async function getPublicExperience(): Promise<Experience[]> {
  return ExperienceController.getPublicExperience();
}
export async function createExperience(data: unknown): Promise<ActionResult> {
  return ExperienceController.createExperience(data);
}
export async function updateExperience(id: string, data: unknown): Promise<ActionResult> {
  return ExperienceController.updateExperience(id, data);
}
export async function deleteExperience(id: string): Promise<ActionResult> {
  return ExperienceController.deleteExperience(id);
}

// ─── Education ────────────────────────────────────────────
export async function getEducation(): Promise<Education[]> {
  return EducationController.getEducation();
}
export async function getPublicEducation(): Promise<Education[]> {
  return EducationController.getPublicEducation();
}
export async function createEducation(data: unknown): Promise<ActionResult> {
  return EducationController.createEducation(data);
}
export async function updateEducation(id: string, data: unknown): Promise<ActionResult> {
  return EducationController.updateEducation(id, data);
}
export async function deleteEducation(id: string): Promise<ActionResult> {
  return EducationController.deleteEducation(id);
}

// ─── Certifications ───────────────────────────────────────
export async function getCertifications(): Promise<Certification[]> {
  return CertificationController.getCertifications();
}
export async function getPublicCertifications(): Promise<Certification[]> {
  return CertificationController.getPublicCertifications();
}
export async function createCertification(data: unknown): Promise<ActionResult> {
  return CertificationController.createCertification(data);
}
export async function updateCertification(id: string, data: unknown): Promise<ActionResult> {
  return CertificationController.updateCertification(id, data);
}
export async function deleteCertification(id: string): Promise<ActionResult> {
  return CertificationController.deleteCertification(id);
}

// ─── Services ─────────────────────────────────────────────
export async function getServices(): Promise<ServiceOffering[]> {
  return ServiceController.getServices();
}
export async function getPublicServices(): Promise<ServiceOffering[]> {
  return ServiceController.getPublicServices();
}
export async function createService(data: unknown): Promise<ActionResult> {
  return ServiceController.createService(data);
}
export async function updateService(id: string, data: unknown): Promise<ActionResult> {
  return ServiceController.updateService(id, data);
}
export async function deleteService(id: string): Promise<ActionResult> {
  return ServiceController.deleteService(id);
}

// ─── Testimonials ─────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  return TestimonialController.getTestimonials();
}
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  return TestimonialController.getPublicTestimonials();
}
export async function createTestimonial(data: unknown): Promise<ActionResult> {
  return TestimonialController.createTestimonial(data);
}
export async function updateTestimonial(id: string, data: unknown): Promise<ActionResult> {
  return TestimonialController.updateTestimonial(id, data);
}
export async function deleteTestimonial(id: string): Promise<ActionResult> {
  return TestimonialController.deleteTestimonial(id);
}

// ─── Messages & Consent ───────────────────────────────────
export async function getContactMessages(opts?: PaginationParams): Promise<PaginatedResponse<ContactMessage>> {
  return MessageController.getContactMessages(opts);
}
export async function submitContactForm(data: unknown): Promise<ActionResult> {
  return MessageController.submitContactForm(data);
}
export async function updateMessageStatus(id: string, status: string): Promise<ActionResult> {
  return MessageController.updateMessageStatus(id, status);
}
export async function deleteMessage(id: string): Promise<ActionResult> {
  return MessageController.deleteMessage(id);
}
export async function recordConsent(data: ConsentRecordInsert): Promise<ActionResult> {
  const res = await MessageRepository.recordConsent(data);
  return { success: !!res };
}

// ─── Social Links ─────────────────────────────────────────
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const items = await db.select().from(schema.socialLinks);
    return items && items.length > 0 ? items : fallbackSocialLinks;
  } catch (err) {
    console.warn("[actions.getSocialLinks] DB query failed, using fallback:", err);
    return fallbackSocialLinks;
  }
}
export async function getPublicSocialLinks(): Promise<SocialLink[]> {
  try {
    const items = await db.select().from(schema.socialLinks).where(eq(schema.socialLinks.isActive, true));
    return items && items.length > 0 ? items : fallbackSocialLinks;
  } catch (err) {
    console.warn("[actions.getPublicSocialLinks] DB query failed, using fallback:", err);
    return fallbackSocialLinks;
  }
}
export async function createSocialLink(data: SocialLinkInsert): Promise<ActionResult<SocialLink>> {
  await requireAdmin();
  try {
    const [item] = await db.insert(schema.socialLinks).values(data).returning();
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: item };
  } catch (err) {
    console.warn("[actions.createSocialLink] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create social link" };
  }
}
export async function deleteSocialLink(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    if (isUUID(id)) {
      await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
    }
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true };
  } catch (err) {
    console.warn("[actions.deleteSocialLink] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete social link" };
  }
}

// ─── Navigation ───────────────────────────────────────────
export async function getNavigation(): Promise<NavigationItem[]> {
  return NavigationRepository.findMany();
}
export async function createNavigation(data: NavigationItemInsert): Promise<ActionResult> {
  await requireAdmin();
  try {
    const item = await NavigationRepository.create(data);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true, data: item };
  } catch (err) {
    console.warn("[actions.createNavigation] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create navigation" };
  }
}
export async function deleteNavigation(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await NavigationRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return { success: true };
  } catch (err) {
    console.warn("[actions.deleteNavigation] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete navigation" };
  }
}

// ─── Settings ────────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSetting[]> {
  return SettingsController.getSiteSettings();
}
export async function updateSiteSetting(key: string, value: unknown): Promise<ActionResult> {
  return SettingsController.updateSiteSetting(key, value);
}

// ─── SEO Metadata ─────────────────────────────────────────
export async function getSeoMetadata(page?: string): Promise<SeoMetadata | SeoMetadata[] | null> {
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
export async function upsertSeoMetadata(data: SeoMetadataInsert): Promise<ActionResult> {
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
  } catch (err) {
    console.warn("[actions.upsertSeoMetadata] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to upsert SEO metadata" };
  }
}

// ─── Legal Documents ──────────────────────────────────────
export async function getLegalDocuments(): Promise<LegalDocument[]> {
  return LegalController.getLegalDocuments();
}
export async function getLegalDocumentBySlug(slug: string): Promise<LegalDocument | null> {
  return LegalController.getLegalDocumentBySlug(slug);
}
export async function updateLegalDocument(id: string, data: unknown): Promise<ActionResult> {
  return LegalController.updateLegalDocument(id, data);
}
export async function deleteLegalDocument(id: string): Promise<ActionResult> {
  return LegalController.deleteLegalDocument(id);
}

// ─── Media Assets ─────────────────────────────────────────
export async function getMediaAssets(opts?: PaginationParams): Promise<PaginatedResponse<MediaAsset>> {
  return MediaController.getMediaAssets(opts);
}
export async function createMediaAsset(data: MediaAssetInsert): Promise<ActionResult> {
  return MediaController.createMediaAsset(data);
}
export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  return MediaController.deleteMediaAsset(id);
}

// ─── Audit Log ────────────────────────────────────
export async function getAuditLogs(opts?: PaginationParams): Promise<PaginatedResponse<AuditLogEntry>> {
  return AuditController.getAuditLogs(opts);
}

// ─── Dashboard Stats ──────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  try {
    const [
      projectCount,
      skillCount,
      experienceCount,
      educationCount,
      certCount,
      messageCount,
      testimonialCount,
      serviceCount,
    ] = await Promise.all([
      db.select({ total: count() }).from(schema.projects).catch(() => [{ total: 12 }]),
      db.select({ total: count() }).from(schema.skills).catch(() => [{ total: 24 }]),
      db.select({ total: count() }).from(schema.experience).catch(() => [{ total: 4 }]),
      db.select({ total: count() }).from(schema.education).catch(() => [{ total: 2 }]),
      db.select({ total: count() }).from(schema.certifications).catch(() => [{ total: 6 }]),
      db.select({ total: count() }).from(schema.contactMessages).where(eq(schema.contactMessages.messageStatus, "unread")).catch(() => [{ total: 0 }]),
      db.select({ total: count() }).from(schema.testimonials).catch(() => [{ total: 3 }]),
      db.select({ total: count() }).from(schema.services).catch(() => [{ total: 6 }]),
    ]);

    return {
      projects: Number(projectCount?.[0]?.total ?? 12),
      skills: Number(skillCount?.[0]?.total ?? 24),
      experience: Number(experienceCount?.[0]?.total ?? 4),
      education: Number(educationCount?.[0]?.total ?? 2),
      certifications: Number(certCount?.[0]?.total ?? 6),
      messages: Number(messageCount?.[0]?.total ?? 0),
      unreadMessages: Number(messageCount?.[0]?.total ?? 0),
      testimonials: Number(testimonialCount?.[0]?.total ?? 3),
      services: Number(serviceCount?.[0]?.total ?? 6),
      views: 1240,
    };
  } catch (err) {
    console.warn("[actions.getDashboardStats] DB error, using fallback counts:", err);
    return {
      projects: 12,
      skills: 24,
      experience: 4,
      education: 2,
      certifications: 6,
      messages: 0,
      unreadMessages: 0,
      testimonials: 3,
      services: 6,
      views: 1240,
    };
  }
}

// ─── API Management (https://api.arun-m.in) ───────────────
export async function checkApiManagementHealth() {
  await requireAdmin();
  const { apiManagement } = await import("@/server/services/api-management-client");
  return apiManagement.checkHealth();
}

export async function getApiManagementDetails() {
  await requireAdmin();
  const baseUrl = process.env.API_MANAGEMENT_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.arun-m.in";
  const hasKey = Boolean(process.env.API_MANAGEMENT_KEY);
  return {
    baseUrl,
    hasKey,
    testerUrl: `${baseUrl}/tester`,
    dashboardUrl: `${baseUrl}/dashboard`,
  };
}
