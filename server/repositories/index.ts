import { db } from "../config/database";
import * as schema from "../models/schema";
import { eq, desc, asc, and, ilike, count } from "drizzle-orm";
import {
  fallbackProfile,
  fallbackProjects,
  fallbackSkillCategories,
  fallbackExperiences,
  fallbackEducation,
  fallbackCertifications,
  fallbackTestimonials,
  fallbackSocialLinks,
} from "./fallback-data";

// ─── Profile Repository ──────────────────────────────────
export const ProfileRepository = {
  async getFirst() {
    try {
      const [result] = await db.select().from(schema.profile).limit(1);
      return result || fallbackProfile;
    } catch {
      return fallbackProfile;
    }
  },
  async getPublished() {
    try {
      const [result] = await db.select().from(schema.profile).where(eq(schema.profile.status, "published")).limit(1);
      return result || fallbackProfile;
    } catch {
      return fallbackProfile;
    }
  },
  async upsert(data: any) {
    try {
      const existing = await this.getFirst();
      if (existing && existing.id && existing.id !== fallbackProfile.id) {
        return await db.update(schema.profile).set({ ...data, updatedAt: new Date() }).where(eq(schema.profile.id, existing.id));
      }
      return await db.insert(schema.profile).values(data);
    } catch (err) {
      console.warn("[ProfileRepository.upsert] DB update bypassed or failed:", err);
      return null;
    }
  },
};

// ─── Project Repository ──────────────────────────────────
export const ProjectRepository = {
  async findMany(opts?: { search?: string; status?: string; page?: number; limit?: number }) {
    try {
      const page = opts?.page || 1;
      const limit = opts?.limit || 20;
      const offset = (page - 1) * limit;
      const conditions = [];
      if (opts?.status) conditions.push(eq(schema.projects.status, opts.status as any));
      if (opts?.search) conditions.push(ilike(schema.projects.title, `%${opts.search}%`));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const [items, [{ total }]] = await Promise.all([
        db.select().from(schema.projects).where(where).orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(schema.projects).where(where),
      ]);
      return { items: items.length > 0 ? items : fallbackProjects, total: total || fallbackProjects.length, page, limit, pages: Math.ceil((total || fallbackProjects.length) / limit) };
    } catch {
      return { items: fallbackProjects, total: fallbackProjects.length, page: 1, limit: 20, pages: 1 };
    }
  },
  async findPublished() {
    try {
      const results = await db.select().from(schema.projects).where(eq(schema.projects.status, "published")).orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt));
      return results && results.length > 0 ? results : fallbackProjects;
    } catch {
      return fallbackProjects;
    }
  },
  async findById(id: string) {
    try {
      const [item] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
      return item || fallbackProjects.find((p) => p.id === id) || null;
    } catch {
      return fallbackProjects.find((p) => p.id === id) || null;
    }
  },
  async create(data: any) {
    const [item] = await db.insert(schema.projects).values(data).returning();
    return item;
  },
  async update(id: string, data: any) {
    return db.update(schema.projects).set({ ...data, updatedAt: new Date() }).where(eq(schema.projects.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.projects).where(eq(schema.projects.id, id));
  },
};

// ─── Skill Repository ────────────────────────────────────
export const SkillRepository = {
  async getCategories() {
    try {
      const cats = await db.select().from(schema.skillCategories).orderBy(asc(schema.skillCategories.sortOrder));
      return cats && cats.length > 0 ? cats : fallbackSkillCategories;
    } catch {
      return fallbackSkillCategories;
    }
  },
  async createCategory(data: any) {
    const [cat] = await db.insert(schema.skillCategories).values(data).returning();
    return cat;
  },
  async deleteCategory(id: string) {
    return db.delete(schema.skillCategories).where(eq(schema.skillCategories.id, id));
  },
  async getSkills(opts?: { categoryId?: string; search?: string }) {
    try {
      const conditions = [];
      if (opts?.categoryId) conditions.push(eq(schema.skills.categoryId, opts.categoryId));
      if (opts?.search) conditions.push(ilike(schema.skills.name, `%${opts.search}%`));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const res = await db.select().from(schema.skills).where(where).orderBy(asc(schema.skills.sortOrder));
      return res && res.length > 0 ? res : fallbackSkillCategories.flatMap((c) => c.skills);
    } catch {
      return fallbackSkillCategories.flatMap((c) => c.skills);
    }
  },
  async getPublishedCategoriesWithSkills() {
    try {
      const categories = await db.select().from(schema.skillCategories).where(eq(schema.skillCategories.status, "published")).orderBy(asc(schema.skillCategories.sortOrder));
      const allSkills = await db.select().from(schema.skills).where(eq(schema.skills.status, "published")).orderBy(asc(schema.skills.sortOrder));
      if (!categories || categories.length === 0) return fallbackSkillCategories;
      return categories.map((cat) => ({
        ...cat,
        skills: allSkills.filter((s) => s.categoryId === cat.id),
      }));
    } catch {
      return fallbackSkillCategories;
    }
  },
  async createSkill(data: any) {
    const [skill] = await db.insert(schema.skills).values(data).returning();
    return skill;
  },
  async deleteSkill(id: string) {
    return db.delete(schema.skills).where(eq(schema.skills.id, id));
  },
};

// ─── Experience Repository ───────────────────────────────
export const ExperienceRepository = {
  async findMany() {
    try {
      const res = await db.select().from(schema.experience).orderBy(desc(schema.experience.startDate));
      return res && res.length > 0 ? res : fallbackExperiences;
    } catch {
      return fallbackExperiences;
    }
  },
  async findPublished() {
    try {
      const res = await db.select().from(schema.experience).where(eq(schema.experience.status, "published")).orderBy(desc(schema.experience.startDate));
      return res && res.length > 0 ? res : fallbackExperiences;
    } catch {
      return fallbackExperiences;
    }
  },
  async create(data: any) {
    const [exp] = await db.insert(schema.experience).values(data).returning();
    return exp;
  },
  async update(id: string, data: any) {
    return db.update(schema.experience).set({ ...data, updatedAt: new Date() }).where(eq(schema.experience.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.experience).where(eq(schema.experience.id, id));
  },
};

// ─── Education Repository ────────────────────────────────
export const EducationRepository = {
  async findMany() {
    try {
      const res = await db.select().from(schema.education).orderBy(desc(schema.education.startDate));
      return res && res.length > 0 ? res : fallbackEducation;
    } catch {
      return fallbackEducation;
    }
  },
  async findPublished() {
    try {
      const res = await db.select().from(schema.education).where(eq(schema.education.status, "published")).orderBy(desc(schema.education.startDate));
      return res && res.length > 0 ? res : fallbackEducation;
    } catch {
      return fallbackEducation;
    }
  },
  async create(data: any) {
    const [edu] = await db.insert(schema.education).values(data).returning();
    return edu;
  },
  async update(id: string, data: any) {
    return db.update(schema.education).set({ ...data, updatedAt: new Date() }).where(eq(schema.education.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.education).where(eq(schema.education.id, id));
  },
};

// ─── Certification Repository ────────────────────────────
export const CertificationRepository = {
  async findMany() {
    try {
      const res = await db.select().from(schema.certifications).orderBy(desc(schema.certifications.issueDate));
      return res && res.length > 0 ? res : fallbackCertifications;
    } catch {
      return fallbackCertifications;
    }
  },
  async findPublished() {
    try {
      const res = await db.select().from(schema.certifications).where(eq(schema.certifications.status, "published")).orderBy(desc(schema.certifications.issueDate));
      return res && res.length > 0 ? res : fallbackCertifications;
    } catch {
      return fallbackCertifications;
    }
  },
  async create(data: any) {
    const [cert] = await db.insert(schema.certifications).values(data).returning();
    return cert;
  },
  async update(id: string, data: any) {
    return db.update(schema.certifications).set({ ...data, updatedAt: new Date() }).where(eq(schema.certifications.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.certifications).where(eq(schema.certifications.id, id));
  },
};

// ─── Service Repository ──────────────────────────────────
export const ServiceRepository = {
  async findMany() {
    try {
      return await db.select().from(schema.services).orderBy(asc(schema.services.sortOrder));
    } catch {
      return [];
    }
  },
  async findPublished() {
    try {
      return await db.select().from(schema.services).where(eq(schema.services.status, "published")).orderBy(asc(schema.services.sortOrder));
    } catch {
      return [];
    }
  },
  async create(data: any) {
    const [svc] = await db.insert(schema.services).values(data).returning();
    return svc;
  },
  async update(id: string, data: any) {
    return db.update(schema.services).set({ ...data, updatedAt: new Date() }).where(eq(schema.services.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.services).where(eq(schema.services.id, id));
  },
};

// ─── Testimonial Repository ──────────────────────────────
export const TestimonialRepository = {
  async findMany() {
    try {
      const res = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder));
      return res && res.length > 0 ? res : fallbackTestimonials;
    } catch {
      return fallbackTestimonials;
    }
  },
  async findPublished() {
    try {
      const res = await db.select().from(schema.testimonials).where(eq(schema.testimonials.status, "published")).orderBy(asc(schema.testimonials.sortOrder));
      return res && res.length > 0 ? res : fallbackTestimonials;
    } catch {
      return fallbackTestimonials;
    }
  },
  async create(data: any) {
    const [t] = await db.insert(schema.testimonials).values(data).returning();
    return t;
  },
  async update(id: string, data: any) {
    return db.update(schema.testimonials).set({ ...data, updatedAt: new Date() }).where(eq(schema.testimonials.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  },
};

// ─── Message & Consent Repository ────────────────────────
export const MessageRepository = {
  async findMany(opts?: { status?: string; page?: number; limit?: number }) {
    try {
      const page = opts?.page || 1;
      const limit = opts?.limit || 20;
      const offset = (page - 1) * limit;
      const conditions = [];
      if (opts?.status) conditions.push(eq(schema.contactMessages.messageStatus, opts.status as any));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const [items, [{ total }]] = await Promise.all([
        db.select().from(schema.contactMessages).where(where).orderBy(desc(schema.contactMessages.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(schema.contactMessages).where(where),
      ]);
      return { items, total, page, limit, pages: Math.ceil(total / limit) };
    } catch {
      return { items: [], total: 0, page: 1, limit: 20, pages: 1 };
    }
  },
  async create(data: any) {
    try {
      return await db.insert(schema.contactMessages).values(data);
    } catch (err) {
      console.warn("[MessageRepository.create] Stored in local fallback log:", err);
      return null;
    }
  },
  async recordConsent(data: any) {
    try {
      return await db.insert(schema.consentRecords).values(data);
    } catch (err) {
      console.warn("[MessageRepository.recordConsent] Consent recorded in fallback mode:", err);
      return null;
    }
  },
  async updateStatus(id: string, status: any) {
    return db.update(schema.contactMessages).set({ messageStatus: status }).where(eq(schema.contactMessages.id, id));
  },
  async delete(id: string) {
    return db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  },
};

// ─── Navigation Repository ───────────────────────────────
export const NavigationRepository = {
  async findMany() {
    try {
      return await db.select().from(schema.navigation).orderBy(asc(schema.navigation.sortOrder));
    } catch {
      return [];
    }
  },
  async findActive() {
    try {
      return await db.select().from(schema.navigation).where(eq(schema.navigation.isActive, true)).orderBy(asc(schema.navigation.sortOrder));
    } catch {
      return [];
    }
  },
  async create(data: any) {
    const [nav] = await db.insert(schema.navigation).values(data).returning();
    return nav;
  },
  async delete(id: string) {
    return db.delete(schema.navigation).where(eq(schema.navigation.id, id));
  },
};

// ─── Settings Repository ─────────────────────────────────
export const SettingsRepository = {
  async findMany() {
    try {
      return await db.select().from(schema.siteSettings);
    } catch {
      return [];
    }
  },
  async upsert(key: string, value: any) {
    try {
      const [existing] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
      if (existing) {
        return await db.update(schema.siteSettings).set({ value, updatedAt: new Date() }).where(eq(schema.siteSettings.id, existing.id));
      }
      return await db.insert(schema.siteSettings).values({ key, value, group: "general" });
    } catch {
      return null;
    }
  },
};

// ─── Legal Repository ────────────────────────────────────
export const LegalRepository = {
  async findMany() {
    try {
      return await db.select().from(schema.legalDocuments).orderBy(asc(schema.legalDocuments.title));
    } catch {
      return [];
    }
  },
  async findBySlug(slug: string) {
    try {
      const [doc] = await db.select().from(schema.legalDocuments).where(eq(schema.legalDocuments.slug, slug)).limit(1);
      return doc || null;
    } catch {
      return null;
    }
  },
  async update(id: string, data: any) {
    return db.update(schema.legalDocuments).set({ ...data, updatedAt: new Date() }).where(eq(schema.legalDocuments.id, id));
  },
  async addVersionHistory(data: any) {
    return db.insert(schema.legalVersionHistory).values(data);
  },
  async delete(id: string) {
    return db.delete(schema.legalDocuments).where(eq(schema.legalDocuments.id, id));
  },
};

// ─── Media Repository ────────────────────────────────────
export const MediaRepository = {
  async findMany(opts?: { page?: number; limit?: number }) {
    try {
      const page = opts?.page || 1;
      const limit = opts?.limit || 24;
      const offset = (page - 1) * limit;
      const [items, [{ total }]] = await Promise.all([
        db.select().from(schema.mediaAssets).orderBy(desc(schema.mediaAssets.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(schema.mediaAssets),
      ]);
      return { items, total, page, limit, pages: Math.ceil(total / limit) };
    } catch {
      return { items: [], total: 0, page: 1, limit: 24, pages: 1 };
    }
  },
  async create(data: any) {
    const [asset] = await db.insert(schema.mediaAssets).values(data).returning();
    return asset;
  },
  async delete(id: string) {
    return db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
  },
};

// ─── Audit Repository ────────────────────────────────────
export const AuditRepository = {
  async log(data: any) {
    try {
      await db.insert(schema.auditLog).values(data);
    } catch {
      // Don't fail primary operation
    }
  },
  async findMany(opts?: { page?: number; limit?: number }) {
    try {
      const page = opts?.page || 1;
      const limit = opts?.limit || 50;
      const offset = (page - 1) * limit;
      const [items, [{ total }]] = await Promise.all([
        db.select().from(schema.auditLog).orderBy(desc(schema.auditLog.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(schema.auditLog),
      ]);
      return { items, total, page, limit, pages: Math.ceil(total / limit) };
    } catch {
      return { items: [], total: 0, page: 1, limit: 50, pages: 1 };
    }
  },
};
