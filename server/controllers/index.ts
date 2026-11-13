import {
  ProfileService,
  ProjectService,
  SkillService,
  ExperienceService,
  EducationService,
  CertificationService,
  ServiceOfferingService,
  TestimonialService,
  MessageService,
  SettingsService,
  LegalService,
  MediaService,
  AuditService,
} from "../services";
import { requireAdmin } from "../middleware/auth-guard";
import {
  profileSchema,
  projectSchema,
  skillSchema,
  skillCategorySchema,
  experienceSchema,
  educationSchema,
  certificationSchema,
  serviceSchema,
  testimonialSchema,
  contactFormSchema,
  legalDocumentSchema,
} from "../validators";
import { ActionResult } from "../constants";

async function requireUser() {
  const session = await requireAdmin();
  return session.user;
}

// ─── Profile Controller ──────────────────────────────────
export const ProfileController = {
  async getProfile() {
    return ProfileService.getProfile();
  },
  async getPublicProfile() {
    return ProfileService.getPublicProfile();
  },
  async updateProfile(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = profileSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ProfileService.updateProfile(user.id, parsed.data);
  },
};

// ─── Project Controller ──────────────────────────────────
export const ProjectController = {
  async getProjects(opts?: { search?: string; status?: string; page?: number; limit?: number }) {
    return ProjectService.getProjects(opts);
  },
  async getPublicProjects() {
    return ProjectService.getPublicProjects();
  },
  async getProjectById(id: string) {
    return ProjectService.getProjectById(id);
  },
  async createProject(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = projectSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ProjectService.createProject(user.id, parsed.data);
  },
  async updateProject(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = projectSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ProjectService.updateProject(user.id, id, parsed.data);
  },
  async deleteProject(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return ProjectService.deleteProject(user.id, id);
  },
};

// ─── Skill Controller ────────────────────────────────────
export const SkillController = {
  async getCategories() {
    return SkillService.getCategories();
  },
  async createCategory(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = skillCategorySchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return SkillService.createCategory(user.id, parsed.data);
  },
  async updateCategory(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = skillCategorySchema.partial().safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return SkillService.updateCategory(user.id, id, parsed.data);
  },
  async deleteCategory(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return SkillService.deleteCategory(user.id, id);
  },
  async getSkills(opts?: { categoryId?: string; search?: string }) {
    return SkillService.getSkills(opts);
  },
  async getPublicSkills() {
    return SkillService.getPublicSkills();
  },
  async createSkill(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = skillSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return SkillService.createSkill(user.id, parsed.data);
  },
  async updateSkill(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = skillSchema.partial().safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return SkillService.updateSkill(user.id, id, parsed.data);
  },
  async deleteSkill(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return SkillService.deleteSkill(user.id, id);
  },
};

// ─── Experience Controller ───────────────────────────────
export const ExperienceController = {
  async getExperiences() {
    return ExperienceService.getExperiences();
  },
  async getPublicExperience() {
    return ExperienceService.getPublicExperience();
  },
  async createExperience(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = experienceSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ExperienceService.createExperience(user.id, parsed.data);
  },
  async updateExperience(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = experienceSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ExperienceService.updateExperience(user.id, id, parsed.data);
  },
  async deleteExperience(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return ExperienceService.deleteExperience(user.id, id);
  },
};

// ─── Education Controller ────────────────────────────────
export const EducationController = {
  async getEducation() {
    return EducationService.getEducation();
  },
  async getPublicEducation() {
    return EducationService.getPublicEducation();
  },
  async createEducation(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = educationSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return EducationService.createEducation(user.id, parsed.data);
  },
  async updateEducation(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = educationSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return EducationService.updateEducation(user.id, id, parsed.data);
  },
  async deleteEducation(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return EducationService.deleteEducation(user.id, id);
  },
};

// ─── Certification Controller ────────────────────────────
export const CertificationController = {
  async getCertifications() {
    return CertificationService.getCertifications();
  },
  async getPublicCertifications() {
    return CertificationService.getPublicCertifications();
  },
  async createCertification(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = certificationSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return CertificationService.createCertification(user.id, parsed.data);
  },
  async updateCertification(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = certificationSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return CertificationService.updateCertification(user.id, id, parsed.data);
  },
  async deleteCertification(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return CertificationService.deleteCertification(user.id, id);
  },
};

// ─── Service Controller ──────────────────────────────────
export const ServiceController = {
  async getServices() {
    return ServiceOfferingService.getServices();
  },
  async getPublicServices() {
    return ServiceOfferingService.getPublicServices();
  },
  async createService(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = serviceSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ServiceOfferingService.createService(user.id, parsed.data);
  },
  async updateService(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = serviceSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return ServiceOfferingService.updateService(user.id, id, parsed.data);
  },
  async deleteService(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return ServiceOfferingService.deleteService(user.id, id);
  },
};

// ─── Testimonial Controller ──────────────────────────────
export const TestimonialController = {
  async getTestimonials() {
    return TestimonialService.getTestimonials();
  },
  async getPublicTestimonials() {
    return TestimonialService.getPublicTestimonials();
  },
  async createTestimonial(formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = testimonialSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return TestimonialService.createTestimonial(user.id, parsed.data);
  },
  async updateTestimonial(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = testimonialSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return TestimonialService.updateTestimonial(user.id, id, parsed.data);
  },
  async deleteTestimonial(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return TestimonialService.deleteTestimonial(user.id, id);
  },
};

// ─── Message Controller ──────────────────────────────────
export const MessageController = {
  async getContactMessages(opts?: { search?: string; status?: string; page?: number; limit?: number }) {
    await requireUser();
    return MessageService.getMessages(opts);
  },
  async submitContactForm(formData: unknown): Promise<ActionResult> {
    const parsed = contactFormSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return MessageService.submitContact(parsed.data);
  },
  async updateMessageStatus(id: string, status: string): Promise<ActionResult> {
    const user = await requireUser();
    return MessageService.updateStatus(user.id, id, status);
  },
  async deleteMessage(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return MessageService.deleteMessage(user.id, id);
  },
};

// ─── Settings Controller ─────────────────────────────────
export const SettingsController = {
  async getSiteSettings() {
    return SettingsService.getSettings();
  },
  async updateSiteSetting(key: string, value: unknown): Promise<ActionResult> {
    const user = await requireUser();
    return SettingsService.updateSetting(user.id, key, value);
  },
};

// ─── Legal Controller ────────────────────────────────────
export const LegalController = {
  async getLegalDocuments() {
    return LegalService.getDocuments();
  },
  async getLegalDocumentBySlug(slug: string) {
    return LegalService.getDocumentBySlug(slug);
  },
  async updateLegalDocument(id: string, formData: unknown): Promise<ActionResult> {
    const user = await requireUser();
    const parsed = legalDocumentSchema.safeParse(formData);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
    return LegalService.updateDocument(user.id, id, parsed.data);
  },
  async deleteLegalDocument(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return LegalService.deleteDocument(user.id, id);
  },
};

// ─── Media Controller ────────────────────────────────────
export const MediaController = {
  async getMediaAssets(opts?: { page?: number; limit?: number; folder?: string; search?: string; type?: string }) {
    return MediaService.getMedia(opts);
  },
  async createMediaAsset(data: {
    filename?: string;
    fileName?: string;
    originalFilename?: string;
    mimeType?: string;
    size?: number;
    url?: string;
    altText?: string;
    copyright?: string;
    folder?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActionResult> {
    const user = await requireUser();
    return MediaService.createMedia(user.id, data);
  },
  async deleteMediaAsset(id: string): Promise<ActionResult> {
    const user = await requireUser();
    return MediaService.deleteMedia(user.id, id);
  },
};

// ─── Audit Controller ────────────────────────────────────
export const AuditController = {
  async getAuditLogs(opts?: { page?: number; limit?: number; entity?: string; action?: string; search?: string }) {
    await requireUser();
    return AuditService.getLogs(opts);
  },
};
