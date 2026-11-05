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
  NavigationRepository,
  SettingsRepository,
  LegalRepository,
  MediaRepository,
  AuditRepository,
} from "../repositories";
import { revalidatePath } from "next/cache";
import { ActionResult } from "../constants";

// ─── Profile Service ─────────────────────────────────────
export const ProfileService = {
  async getProfile() {
    return ProfileRepository.getFirst();
  },
  async getPublicProfile() {
    return ProfileRepository.getPublished();
  },
  async updateProfile(userId: string, data: any): Promise<ActionResult> {
    try {
      await ProfileRepository.upsert(data);
      await AuditRepository.log({ userId, action: "update", entity: "profile" });
      revalidatePath("/");
      revalidatePath("/admin/profile");
      return { success: true };
    } catch (err: any) {
      console.error("[ProfileService.updateProfile] Error:", err);
      return { success: false, error: err.message || "Failed to update profile" };
    }
  },
};

// ─── Project Service ─────────────────────────────────────
export const ProjectService = {
  async getProjects(opts?: any) {
    return ProjectRepository.findMany(opts);
  },
  async getPublicProjects() {
    return ProjectRepository.findPublished();
  },
  async getProjectById(id: string) {
    return ProjectRepository.findById(id);
  },
  async createProject(userId: string, data: any): Promise<ActionResult> {
    try {
      const item = await ProjectRepository.create({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "create", entity: "project", entityId: item?.id });
      revalidatePath("/");
      revalidatePath("/admin/projects");
      return { success: true, data: item };
    } catch (err: any) {
      console.error("[ProjectService.createProject] Error:", err);
      return { success: false, error: err.message || "Failed to create project" };
    }
  },
  async updateProject(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await ProjectRepository.update(id, {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "update", entity: "project", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/projects");
      return { success: true };
    } catch (err: any) {
      console.error("[ProjectService.updateProject] Error:", err);
      return { success: false, error: err.message || "Failed to update project" };
    }
  },
  async deleteProject(userId: string, id: string): Promise<ActionResult> {
    try {
      await ProjectRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "project", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/projects");
      return { success: true };
    } catch (err: any) {
      console.error("[ProjectService.deleteProject] Error:", err);
      return { success: false, error: err.message || "Failed to delete project" };
    }
  },
};

// ─── Skill Service ───────────────────────────────────────
export const SkillService = {
  async getCategories() {
    return SkillRepository.getCategories();
  },
  async createCategory(userId: string, data: any): Promise<ActionResult> {
    try {
      const cat = await SkillRepository.createCategory(data);
      await AuditRepository.log({ userId, action: "create", entity: "skill_category", entityId: cat?.id });
      revalidatePath("/");
      revalidatePath("/admin/skills");
      return { success: true, data: cat };
    } catch (err: any) {
      console.error("[SkillService.createCategory] Error:", err);
      return { success: false, error: err.message || "Failed to create category" };
    }
  },
  async deleteCategory(userId: string, id: string): Promise<ActionResult> {
    try {
      await SkillRepository.deleteCategory(id);
      await AuditRepository.log({ userId, action: "delete", entity: "skill_category", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/skills");
      return { success: true };
    } catch (err: any) {
      console.error("[SkillService.deleteCategory] Error:", err);
      return { success: false, error: err.message || "Failed to delete category" };
    }
  },
  async getSkills(opts?: any) {
    return SkillRepository.getSkills(opts);
  },
  async getPublicSkills() {
    return SkillRepository.getPublishedCategoriesWithSkills();
  },
  async createSkill(userId: string, data: any): Promise<ActionResult> {
    try {
      const skill = await SkillRepository.createSkill(data);
      await AuditRepository.log({ userId, action: "create", entity: "skill", entityId: skill?.id });
      revalidatePath("/");
      revalidatePath("/admin/skills");
      return { success: true, data: skill };
    } catch (err: any) {
      console.error("[SkillService.createSkill] Error:", err);
      return { success: false, error: err.message || "Failed to create skill" };
    }
  },
  async deleteSkill(userId: string, id: string): Promise<ActionResult> {
    try {
      await SkillRepository.deleteSkill(id);
      await AuditRepository.log({ userId, action: "delete", entity: "skill", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/skills");
      return { success: true };
    } catch (err: any) {
      console.error("[SkillService.deleteSkill] Error:", err);
      return { success: false, error: err.message || "Failed to delete skill" };
    }
  },
};

// ─── Experience Service ──────────────────────────────────
export const ExperienceService = {
  async getExperiences() {
    return ExperienceRepository.findMany();
  },
  async getPublicExperience() {
    return ExperienceRepository.findPublished();
  },
  async createExperience(userId: string, data: any): Promise<ActionResult> {
    try {
      const exp = await ExperienceRepository.create({
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "create", entity: "experience", entityId: exp?.id });
      revalidatePath("/");
      revalidatePath("/admin/experience");
      return { success: true, data: exp };
    } catch (err: any) {
      console.error("[ExperienceService.createExperience] Error:", err);
      return { success: false, error: err.message || "Failed to create experience" };
    }
  },
  async updateExperience(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await ExperienceRepository.update(id, {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "update", entity: "experience", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/experience");
      return { success: true };
    } catch (err: any) {
      console.error("[ExperienceService.updateExperience] Error:", err);
      return { success: false, error: err.message || "Failed to update experience" };
    }
  },
  async deleteExperience(userId: string, id: string): Promise<ActionResult> {
    try {
      await ExperienceRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "experience", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/experience");
      return { success: true };
    } catch (err: any) {
      console.error("[ExperienceService.deleteExperience] Error:", err);
      return { success: false, error: err.message || "Failed to delete experience" };
    }
  },
};

// ─── Education Service ───────────────────────────────────
export const EducationService = {
  async getEducation() {
    return EducationRepository.findMany();
  },
  async getPublicEducation() {
    return EducationRepository.findPublished();
  },
  async createEducation(userId: string, data: any): Promise<ActionResult> {
    try {
      const edu = await EducationRepository.create({
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "create", entity: "education", entityId: edu?.id });
      revalidatePath("/");
      revalidatePath("/admin/education");
      return { success: true, data: edu };
    } catch (err: any) {
      console.error("[EducationService.createEducation] Error:", err);
      return { success: false, error: err.message || "Failed to create education" };
    }
  },
  async updateEducation(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await EducationRepository.update(id, {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "update", entity: "education", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/education");
      return { success: true };
    } catch (err: any) {
      console.error("[EducationService.updateEducation] Error:", err);
      return { success: false, error: err.message || "Failed to update education" };
    }
  },
  async deleteEducation(userId: string, id: string): Promise<ActionResult> {
    try {
      await EducationRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "education", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/education");
      return { success: true };
    } catch (err: any) {
      console.error("[EducationService.deleteEducation] Error:", err);
      return { success: false, error: err.message || "Failed to delete education" };
    }
  },
};

// ─── Certification Service ───────────────────────────────
export const CertificationService = {
  async getCertifications() {
    return CertificationRepository.findMany();
  },
  async getPublicCertifications() {
    return CertificationRepository.findPublished();
  },
  async createCertification(userId: string, data: any): Promise<ActionResult> {
    try {
      const cert = await CertificationRepository.create({
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "create", entity: "certification", entityId: cert?.id });
      revalidatePath("/");
      revalidatePath("/admin/certifications");
      return { success: true, data: cert };
    } catch (err: any) {
      console.error("[CertificationService.createCertification] Error:", err);
      return { success: false, error: err.message || "Failed to create certification" };
    }
  },
  async updateCertification(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await CertificationRepository.update(id, {
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      });
      await AuditRepository.log({ userId, action: "update", entity: "certification", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/certifications");
      return { success: true };
    } catch (err: any) {
      console.error("[CertificationService.updateCertification] Error:", err);
      return { success: false, error: err.message || "Failed to update certification" };
    }
  },
  async deleteCertification(userId: string, id: string): Promise<ActionResult> {
    try {
      await CertificationRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "certification", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/certifications");
      return { success: true };
    } catch (err: any) {
      console.error("[CertificationService.deleteCertification] Error:", err);
      return { success: false, error: err.message || "Failed to delete certification" };
    }
  },
};

// ─── Service Service ─────────────────────────────────────
export const ServiceOfferingService = {
  async getServices() {
    return ServiceRepository.findMany();
  },
  async getPublicServices() {
    return ServiceRepository.findPublished();
  },
  async createService(userId: string, data: any): Promise<ActionResult> {
    try {
      const svc = await ServiceRepository.create(data);
      await AuditRepository.log({ userId, action: "create", entity: "service", entityId: svc?.id });
      revalidatePath("/");
      revalidatePath("/admin/services");
      return { success: true, data: svc };
    } catch (err: any) {
      console.error("[ServiceOfferingService.createService] Error:", err);
      return { success: false, error: err.message || "Failed to create service" };
    }
  },
  async updateService(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await ServiceRepository.update(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "service", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/services");
      return { success: true };
    } catch (err: any) {
      console.error("[ServiceOfferingService.updateService] Error:", err);
      return { success: false, error: err.message || "Failed to update service" };
    }
  },
  async deleteService(userId: string, id: string): Promise<ActionResult> {
    try {
      await ServiceRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "service", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/services");
      return { success: true };
    } catch (err: any) {
      console.error("[ServiceOfferingService.deleteService] Error:", err);
      return { success: false, error: err.message || "Failed to delete service" };
    }
  },
};

// ─── Testimonial Service ─────────────────────────────────
export const TestimonialService = {
  async getTestimonials() {
    return TestimonialRepository.findMany();
  },
  async getPublicTestimonials() {
    return TestimonialRepository.findPublished();
  },
  async createTestimonial(userId: string, data: any): Promise<ActionResult> {
    try {
      const t = await TestimonialRepository.create(data);
      await AuditRepository.log({ userId, action: "create", entity: "testimonial", entityId: t?.id });
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
      return { success: true, data: t };
    } catch (err: any) {
      console.error("[TestimonialService.createTestimonial] Error:", err);
      return { success: false, error: err.message || "Failed to create testimonial" };
    }
  },
  async updateTestimonial(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await TestimonialRepository.update(id, data);
      await AuditRepository.log({ userId, action: "update", entity: "testimonial", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
      return { success: true };
    } catch (err: any) {
      console.error("[TestimonialService.updateTestimonial] Error:", err);
      return { success: false, error: err.message || "Failed to update testimonial" };
    }
  },
  async deleteTestimonial(userId: string, id: string): Promise<ActionResult> {
    try {
      await TestimonialRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "testimonial", entityId: id });
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
      return { success: true };
    } catch (err: any) {
      console.error("[TestimonialService.deleteTestimonial] Error:", err);
      return { success: false, error: err.message || "Failed to delete testimonial" };
    }
  },
};

// ─── Message & DPDP Service ──────────────────────────────
export const MessageService = {
  async getMessages(opts?: any) {
    return MessageRepository.findMany(opts);
  },
  async submitContact(data: any): Promise<ActionResult> {
    try {
      await MessageRepository.create(data);
      await MessageRepository.recordConsent({
        type: "contact_form",
        consentGiven: true,
        preferences: { email: data.email, timestamp: new Date().toISOString() },
      });
      revalidatePath("/admin/messages");
      return { success: true };
    } catch (err: any) {
      console.error("[MessageService.submitContact] Error:", err);
      return { success: false, error: err.message || "Failed to submit message" };
    }
  },
  async updateStatus(userId: string, id: string, status: any): Promise<ActionResult> {
    try {
      await MessageRepository.updateStatus(id, status);
      await AuditRepository.log({ userId, action: "update_status", entity: "contact_message", entityId: id, details: { status } });
      revalidatePath("/admin/messages");
      return { success: true };
    } catch (err: any) {
      console.error("[MessageService.updateStatus] Error:", err);
      return { success: false, error: err.message || "Failed to update status" };
    }
  },
  async deleteMessage(userId: string, id: string): Promise<ActionResult> {
    try {
      await MessageRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "contact_message", entityId: id });
      revalidatePath("/admin/messages");
      return { success: true };
    } catch (err: any) {
      console.error("[MessageService.deleteMessage] Error:", err);
      return { success: false, error: err.message || "Failed to delete message" };
    }
  },
};

// ─── Settings Service ────────────────────────────────────
export const SettingsService = {
  async getSettings() {
    return SettingsRepository.findMany();
  },
  async updateSetting(userId: string, key: string, value: any): Promise<ActionResult> {
    try {
      await SettingsRepository.upsert(key, value);
      await AuditRepository.log({ userId, action: "update", entity: "site_setting", entityId: key });
      revalidatePath("/");
      revalidatePath("/admin/settings");
      return { success: true };
    } catch (err: any) {
      console.error("[SettingsService.updateSetting] Error:", err);
      return { success: false, error: err.message || "Failed to update setting" };
    }
  },
};

// ─── Legal Service ───────────────────────────────────────
export const LegalService = {
  async getDocuments() {
    return LegalRepository.findMany();
  },
  async getDocumentBySlug(slug: string) {
    return LegalRepository.findBySlug(slug);
  },
  async updateDocument(userId: string, id: string, data: any): Promise<ActionResult> {
    try {
      await LegalRepository.update(id, {
        ...data,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
      });
      await LegalRepository.addVersionHistory({
        documentId: id,
        version: data.version,
        content: data.content,
        changedBy: userId,
        changeNote: "Version revision update",
      });
      await AuditRepository.log({ userId, action: "update", entity: "legal_document", entityId: id });
      revalidatePath("/admin/legal");
      revalidatePath(`/legal/${data.slug}`);
      return { success: true };
    } catch (err: any) {
      console.error("[LegalService.updateDocument] Error:", err);
      return { success: false, error: err.message || "Failed to update document" };
    }
  },
  async deleteDocument(userId: string, id: string): Promise<ActionResult> {
    try {
      await LegalRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "legal_document", entityId: id });
      revalidatePath("/admin/legal");
      return { success: true };
    } catch (err: any) {
      console.error("[LegalService.deleteDocument] Error:", err);
      return { success: false, error: err.message || "Failed to delete document" };
    }
  },
};

// ─── Media Service ───────────────────────────────────────
export const MediaService = {
  async getMedia(opts?: any) {
    return MediaRepository.findMany(opts);
  },
  async createMedia(userId: string, data: any): Promise<ActionResult> {
    try {
      const item = await MediaRepository.create({ ...data, uploadedBy: userId });
      await AuditRepository.log({ userId, action: "create", entity: "media_asset", entityId: item?.id });
      revalidatePath("/admin/media");
      return { success: true, data: item };
    } catch (err: any) {
      console.error("[MediaService.createMedia] Error:", err);
      return { success: false, error: err.message || "Failed to upload media" };
    }
  },
  async deleteMedia(userId: string, id: string): Promise<ActionResult> {
    try {
      await MediaRepository.delete(id);
      await AuditRepository.log({ userId, action: "delete", entity: "media_asset", entityId: id });
      revalidatePath("/admin/media");
      return { success: true };
    } catch (err: any) {
      console.error("[MediaService.deleteMedia] Error:", err);
      return { success: false, error: err.message || "Failed to delete media" };
    }
  },
};

// ─── Audit Service ───────────────────────────────────────
export const AuditService = {
  async getLogs(opts?: any) {
    return AuditRepository.findMany(opts);
  },
};

// ─── Neon Cloud Services Integration ─────────────────────
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
