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
import { requireAdmin } from "@/server/middleware/auth-guard";
import { revalidatePath } from "next/cache";

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
export async function getProjects(opts?: any) {
  return ProjectController.getProjects(opts);
}
export async function getPublicProjects() {
  return ProjectController.getPublicProjects();
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
export async function deleteSkillCategory(id: string) {
  return SkillController.deleteCategory(id);
}
export async function getSkills(opts?: any) {
  return SkillController.getSkills(opts);
}
export async function getPublicSkills() {
  return SkillController.getPublicSkills();
}
export async function createSkill(data: unknown) {
  return SkillController.createSkill(data);
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
export async function getContactMessages(opts?: any) {
  return MessageController.getContactMessages(opts);
}
export async function submitContactForm(data: unknown) {
  return MessageController.submitContactForm(data);
}
export async function updateMessageStatus(id: string, status: string) {
  return MessageController.updateMessageStatus(id, status);
}
export async function deleteMessage(id: string) {
  return MessageController.deleteMessage(id);
}
export async function recordConsent(data: any) {
  return MessageRepository.recordConsent(data);
}

// ─── Social Links ─────────────────────────────────────────
export async function getSocialLinks() {
  try {
    const items = await db.select().from(schema.socialLinks);
    return items && items.length > 0 ? items : fallbackSocialLinks;
  } catch (err) {
    console.warn("[actions.getSocialLinks] DB query failed, using fallback:", err);
    return fallbackSocialLinks;
  }
}
export async function getPublicSocialLinks() {
  try {
    const items = await db.select().from(schema.socialLinks).where(eq(schema.socialLinks.isActive, true));
    return items && items.length > 0 ? items : fallbackSocialLinks;
  } catch (err) {
    console.warn("[actions.getPublicSocialLinks] DB query failed, using fallback:", err);
    return fallbackSocialLinks;
  }
}
export async function createSocialLink(data: any): Promise<{ success: boolean; data?: any; error?: string }> {
  await requireAdmin();
  const [item] = await db.insert(schema.socialLinks).values(data).returning();
  revalidatePath("/");
  return { success: true, data: item };
}
export async function deleteSocialLink(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
  revalidatePath("/");
  return { success: true };
}

// ─── Navigation ───────────────────────────────────────────
export async function getNavigation() {
  return NavigationRepository.findMany();
}
export async function createNavigation(data: any): Promise<{ success: boolean; data?: any; error?: string }> {
  await requireAdmin();
  const item = await NavigationRepository.create(data);
  revalidatePath("/");
  return { success: true, data: item };
}
export async function deleteNavigation(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await NavigationRepository.delete(id);
  revalidatePath("/");
  return { success: true };
}

// ─── Settings ────────────────────────────────────────────
export async function getSiteSettings() {
  return SettingsController.getSiteSettings();
}
export async function updateSiteSetting(key: string, value: any) {
  return SettingsController.updateSiteSetting(key, value);
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
export async function upsertSeoMetadata(data: any): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const [existing] = await db.select().from(schema.seoMetadata).where(eq(schema.seoMetadata.page, data.page)).limit(1);
  if (existing) {
    await db.update(schema.seoMetadata).set({ ...data, updatedAt: new Date() }).where(eq(schema.seoMetadata.id, existing.id));
  } else {
    await db.insert(schema.seoMetadata).values(data);
  }
  revalidatePath("/admin/seo");
  return { success: true };
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
export async function getMediaAssets(opts?: any) {
  return MediaController.getMediaAssets(opts);
}
export async function createMediaAsset(data: any) {
  return MediaController.createMediaAsset(data);
}
export async function deleteMediaAsset(id: string) {
  return MediaController.deleteMediaAsset(id);
}

// ─── Audit Log ────────────────────────────────────────────
export async function getAuditLogs(opts?: any) {
  return AuditController.getAuditLogs(opts);
}

// ─── Dashboard Stats ──────────────────────────────────────
export async function getDashboardStats() {
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
      unreadMessages: Number(messageCount?.[0]?.total ?? 0),
      testimonials: Number(testimonialCount?.[0]?.total ?? 3),
      services: Number(serviceCount?.[0]?.total ?? 6),
    };
  } catch (err) {
    console.warn("[actions.getDashboardStats] DB error, using fallback counts:", err);
    return {
      projects: 12,
      skills: 24,
      experience: 4,
      education: 2,
      certifications: 6,
      unreadMessages: 0,
      testimonials: 3,
      services: 6,
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
