import {
  ProfileRepository,
  ProjectRepository,
  SkillRepository,
  ExperienceRepository,
  EducationRepository,
  CertificationRepository,
  ServiceRepository,
  TestimonialRepository,
  MessageRepository,
  SettingsRepository,
  LegalRepository,
  MediaRepository,
  AuditRepository,
} from "../repositories";
import { revalidatePath } from "next/cache";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Safe no-op outside Next server context (CLI / unit tests)
  }
}
import { ActionResult } from "../constants";
import type { MessageStatus } from "@/types";

function toSafeDate(val: unknown): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}


// --- Profile Service -------------------------------------
export const ProfileService = {
  async getProfile() {
    return ProfileRepository.getFirst();
  },
  async getPublicProfile() {
    return ProfileRepository.getPublished();
  },
  async updateProfile(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await ProfileRepository.upsert(data);
      await AuditRepository.log({ userId, action: "update", entity: "profile" });
      safeRevalidate("/");
      safeRevalidate("/admin/profile");
      return { success: true };
    } catch (err: unknown) {
      console.error("[ProfileService.updateProfile] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update profile" };
    }
  },
};

// --- Project Service -------------------------------------
export const ProjectService = {
  async getProjects(opts?: { search?: string; status?: string; page?: number; limit?: number; folder?: string; entity?: string }) {
    return ProjectRepository.findMany(opts);
  },
  async getPublicProjects() {
    return ProjectRepository.findPublished();
  },
  async getProjectById(id: string) {
    return ProjectRepository.findById(id);
  },
  async createProject(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const item = await ProjectRepository.create({
        ...data,
        startDate: toSafeDate(data.startDate),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "create", entity: "project", entityId: item?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/projects");
      return { success: true, data: item };
    } catch (err: unknown) {
      console.error("[ProjectService.createProject] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create project" };
    }
  },
  async updateProject(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await ProjectRepository.update(id, {
        ...data,
        startDate: toSafeDate(data.startDate),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "update", entity: "project", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/projects");
      safeRevalidate(`/admin/projects/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[ProjectService.updateProject] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update project" };
    }
  },
  async deleteProject(userId: string, id: string): Promise<ActionResult> {
    try {
      await ProjectRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "project", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/projects");
      return { success: true };
    } catch (err: unknown) {
      console.error("[ProjectService.deleteProject] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete project" };
    }
  },
};

// --- Skill Service ---------------------------------------
export const SkillService = {
  async getCategories() {
    return SkillRepository.getCategories();
  },
  async createCategory(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const cat = await SkillRepository.createCategory(data);
      await AuditRepository.log({ userId, action: "create", entity: "skill_category", entityId: cat?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true, data: cat };
    } catch (err: unknown) {
      console.error("[SkillService.createCategory] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create category" };
    }
  },
  async updateCategory(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const cat = await SkillRepository.updateCategory(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "skill_category", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true, data: cat };
    } catch (err: unknown) {
      console.error("[SkillService.updateCategory] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update category" };
    }
  },
  async deleteCategory(userId: string, id: string): Promise<ActionResult> {
    try {
      await SkillRepository.deleteCategory(id);
      await AuditRepository.log({ userId, action: "delete", entity: "skill_category", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true };
    } catch (err: unknown) {
      console.error("[SkillService.deleteCategory] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete category" };
    }
  },
  async getSkills(opts?: { search?: string; status?: string; page?: number; limit?: number; folder?: string; entity?: string }) {
    return SkillRepository.getSkills(opts);
  },
  async getPublicSkills() {
    return SkillRepository.getPublishedCategoriesWithSkills();
  },
  async createSkill(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const skill = await SkillRepository.createSkill(data);
      await AuditRepository.log({ userId, action: "create", entity: "skill", entityId: skill?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true, data: skill };
    } catch (err: unknown) {
      console.error("[SkillService.createSkill] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create skill" };
    }
  },
  async updateSkill(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const skill = await SkillRepository.updateSkill(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "skill", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true, data: skill };
    } catch (err: unknown) {
      console.error("[SkillService.updateSkill] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update skill" };
    }
  },
  async deleteSkill(userId: string, id: string): Promise<ActionResult> {
    try {
      await SkillRepository.deleteSkill(id);
      await AuditRepository.log({ userId, action: "delete", entity: "skill", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/skills");
      return { success: true };
    } catch (err: unknown) {
      console.error("[SkillService.deleteSkill] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete skill" };
    }
  },
};

// --- Experience Service ----------------------------------
export const ExperienceService = {
  async getExperiences() {
    return ExperienceRepository.findMany();
  },
  async getPublicExperience() {
    return ExperienceRepository.findPublished();
  },
  async createExperience(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const exp = await ExperienceRepository.create({
        ...data,
        startDate: toSafeDate(data.startDate) || new Date(),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "create", entity: "experience", entityId: exp?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/experience");
      return { success: true, data: exp };
    } catch (err: unknown) {
      console.error("[ExperienceService.createExperience] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create experience" };
    }
  },
  async updateExperience(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await ExperienceRepository.update(id, {
        ...data,
        startDate: toSafeDate(data.startDate) || new Date(),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "update", entity: "experience", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/experience");
      safeRevalidate(`/admin/experience/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[ExperienceService.updateExperience] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update experience" };
    }
  },
  async deleteExperience(userId: string, id: string): Promise<ActionResult> {
    try {
      await ExperienceRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "experience", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/experience");
      return { success: true };
    } catch (err: unknown) {
      console.error("[ExperienceService.deleteExperience] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete experience" };
    }
  },
};

// --- Education Service -----------------------------------
export const EducationService = {
  async getEducation() {
    return EducationRepository.findMany();
  },
  async getPublicEducation() {
    return EducationRepository.findPublished();
  },
  async createEducation(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const edu = await EducationRepository.create({
        ...data,
        startDate: toSafeDate(data.startDate) || new Date(),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "create", entity: "education", entityId: edu?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/education");
      return { success: true, data: edu };
    } catch (err: unknown) {
      console.error("[EducationService.createEducation] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create education" };
    }
  },
  async updateEducation(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await EducationRepository.update(id, {
        ...data,
        startDate: toSafeDate(data.startDate) || new Date(),
        endDate: toSafeDate(data.endDate),
      });
      await AuditRepository.log({ userId, action: "update", entity: "education", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/education");
      safeRevalidate(`/admin/education/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[EducationService.updateEducation] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update education" };
    }
  },
  async deleteEducation(userId: string, id: string): Promise<ActionResult> {
    try {
      await EducationRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "education", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/education");
      return { success: true };
    } catch (err: unknown) {
      console.error("[EducationService.deleteEducation] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete education" };
    }
  },
};

// --- Certification Service -------------------------------
export const CertificationService = {
  async getCertifications() {
    return CertificationRepository.findMany();
  },
  async getPublicCertifications() {
    return CertificationRepository.findPublished();
  },
  async createCertification(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const cert = await CertificationRepository.create({
        ...data,
        issueDate: toSafeDate(data.issueDate),
        expiryDate: toSafeDate(data.expiryDate),
      });
      await AuditRepository.log({ userId, action: "create", entity: "certification", entityId: cert?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/certifications");
      return { success: true, data: cert };
    } catch (err: unknown) {
      console.error("[CertificationService.createCertification] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create certification" };
    }
  },
  async updateCertification(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await CertificationRepository.update(id, {
        ...data,
        issueDate: toSafeDate(data.issueDate),
        expiryDate: toSafeDate(data.expiryDate),
      });
      await AuditRepository.log({ userId, action: "update", entity: "certification", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/certifications");
      safeRevalidate(`/admin/certifications/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[CertificationService.updateCertification] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update certification" };
    }
  },
  async deleteCertification(userId: string, id: string): Promise<ActionResult> {
    try {
      await CertificationRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "certification", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/certifications");
      return { success: true };
    } catch (err: unknown) {
      console.error("[CertificationService.deleteCertification] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete certification" };
    }
  },
};

// --- Service Service -------------------------------------
export const ServiceOfferingService = {
  async getServices() {
    return ServiceRepository.findMany();
  },
  async getPublicServices() {
    return ServiceRepository.findPublished();
  },
  async createService(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const svc = await ServiceRepository.create(data);
      await AuditRepository.log({ userId, action: "create", entity: "service", entityId: svc?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/services");
      return { success: true, data: svc };
    } catch (err: unknown) {
      console.error("[ServiceOfferingService.createService] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create service" };
    }
  },
  async updateService(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await ServiceRepository.update(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "service", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/services");
      safeRevalidate(`/admin/services/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[ServiceOfferingService.updateService] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update service" };
    }
  },
  async deleteService(userId: string, id: string): Promise<ActionResult> {
    try {
      await ServiceRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "service", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/services");
      return { success: true };
    } catch (err: unknown) {
      console.error("[ServiceOfferingService.deleteService] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete service" };
    }
  },
};

// --- Testimonial Service ---------------------------------
export const TestimonialService = {
  async getTestimonials() {
    return TestimonialRepository.findMany();
  },
  async getPublicTestimonials() {
    return TestimonialRepository.findPublished();
  },
  async createTestimonial(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const t = await TestimonialRepository.create(data);
      await AuditRepository.log({ userId, action: "create", entity: "testimonial", entityId: t?.id });
      safeRevalidate("/");
      safeRevalidate("/admin/testimonials");
      return { success: true, data: t };
    } catch (err: unknown) {
      console.error("[TestimonialService.createTestimonial] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to create testimonial" };
    }
  },
  async updateTestimonial(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await TestimonialRepository.update(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "testimonial", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/testimonials");
      safeRevalidate(`/admin/testimonials/${id}/edit`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[TestimonialService.updateTestimonial] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update testimonial" };
    }
  },
  async deleteTestimonial(userId: string, id: string): Promise<ActionResult> {
    try {
      await TestimonialRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "testimonial", entityId: id });
      safeRevalidate("/");
      safeRevalidate("/admin/testimonials");
      return { success: true };
    } catch (err: unknown) {
      console.error("[TestimonialService.deleteTestimonial] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete testimonial" };
    }
  },
};

// --- Message & DPDP Service ------------------------------
export const MessageService = {
  async getMessages(opts?: { search?: string; status?: string; page?: number; limit?: number; folder?: string; entity?: string }) {
    return MessageRepository.findMany(opts);
  },
  async submitContact(data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await MessageRepository.create(data);
      await MessageRepository.recordConsent({
        type: "contact_form",
        consentGiven: true,
        preferences: { email: data.email, timestamp: new Date().toISOString() },
      });
      safeRevalidate("/admin/messages");
      return { success: true };
    } catch (err: unknown) {
      console.error("[MessageService.submitContact] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to submit message" };
    }
  },
  async updateStatus(userId: string, id: string, status: MessageStatus): Promise<ActionResult> {
    try {
      await MessageRepository.updateStatus(id, status);
      await AuditRepository.log({ userId, action: "update_status", entity: "contact_message", entityId: id, details: { status } });
      safeRevalidate("/admin/messages");
      return { success: true };
    } catch (err: unknown) {
      console.error("[MessageService.updateStatus] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update status" };
    }
  },
  async deleteMessage(userId: string, id: string): Promise<ActionResult> {
    try {
      await MessageRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "contact_message", entityId: id });
      safeRevalidate("/admin/messages");
      return { success: true };
    } catch (err: unknown) {
      console.error("[MessageService.deleteMessage] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete message" };
    }
  },
};

// --- Settings Service ------------------------------------
export const SettingsService = {
  async getSettings() {
    return SettingsRepository.findMany();
  },
  async updateSetting(userId: string, key: string, value: unknown): Promise<ActionResult> {
    try {
      await SettingsRepository.upsert(key, value);
      await AuditRepository.log({ userId, action: "update", entity: "site_setting", entityId: key });
      safeRevalidate("/");
      safeRevalidate("/admin/settings");
      return { success: true };
    } catch (err: unknown) {
      console.error("[SettingsService.updateSetting] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update setting" };
    }
  },
};

// --- Legal Service ---------------------------------------
export const LegalService = {
  async getDocuments() {
    return LegalRepository.findMany();
  },
  async getDocumentBySlug(slug: string) {
    return LegalRepository.findBySlug(slug);
  },
  async updateDocument(userId: string, id: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      await LegalRepository.update(id, {
        ...data,
        effectiveDate: toSafeDate(data.effectiveDate),
      });
      await LegalRepository.addVersionHistory({
        documentId: id,
        version: data.version,
        content: data.content,
        changedBy: userId,
        changeNote: "Version revision update",
      });
      await AuditRepository.log({ userId, action: "update", entity: "legal_document", entityId: id });
      safeRevalidate("/admin/legal");
      safeRevalidate(`/admin/legal/${id}/edit`);
      safeRevalidate(`/legal/${data.slug}`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[LegalService.updateDocument] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to update document" };
    }
  },
  async deleteDocument(userId: string, id: string): Promise<ActionResult> {
    try {
      await LegalRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "legal_document", entityId: id });
      safeRevalidate("/admin/legal");
      return { success: true };
    } catch (err: unknown) {
      console.error("[LegalService.deleteDocument] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete document" };
    }
  },
};

// --- Media Service ---------------------------------------
export const MediaService = {
  async getMedia(opts?: { search?: string; status?: string; page?: number; limit?: number; folder?: string; entity?: string }) {
    return MediaRepository.findMany(opts);
  },
  async createMedia(userId: string, data: Record<string, unknown>): Promise<ActionResult> {
    try {
      const item = await MediaRepository.create({ ...data, uploadedBy: userId });
      await AuditRepository.log({ userId, action: "create", entity: "media_asset", entityId: item?.id });
      safeRevalidate("/admin/media");
      return { success: true, data: item };
    } catch (err: unknown) {
      console.error("[MediaService.createMedia] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to upload media" };
    }
  },
  async deleteMedia(userId: string, id: string): Promise<ActionResult> {
    try {
      await MediaRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "media_asset", entityId: id });
      safeRevalidate("/admin/media");
      return { success: true };
    } catch (err: unknown) {
      console.error("[MediaService.deleteMedia] Error:", err);
      return { success: false, error: (err instanceof Error ? err.message : String(err)) || "Failed to delete media" };
    }
  },
};

// --- Audit Service ---------------------------------------
export const AuditService = {
  async getLogs(opts?: { search?: string; status?: string; page?: number; limit?: number; folder?: string; entity?: string }) {
    return AuditRepository.findMany(opts);
  },
};

// --- Neon Cloud Services Integration ---------------------
export {
  NEON_CONFIG,
  neonDb,
  getNeonPool,
  checkNeonPostgres,
  verifyNeonAuthToken,
  checkNeonAuth,
  uploadAsset as uploadNeonAsset,
  listAssets as listNeonAssets,
  deleteAsset as deleteNeonAsset,
  checkNeonObjectStorage,
  checkNeonRealtime,
  checkAllNeonServices,
} from "../../lib/neon";
