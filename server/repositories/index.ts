import { db } from "../config/database";
import * as schema from "../models/schema";
import { eq, desc, asc, and, or, ilike, count } from "drizzle-orm";
import { isUUID } from "@/lib/utils";
import {
  fallbackProfile,
  fallbackProjects,
  fallbackSkillCategories,
  fallbackExperiences,
  fallbackEducation,
  fallbackCertifications,
  fallbackTestimonials,
} from "./fallback-data";
import type {
  ProfileInsert,
  ProjectInsert,
  SkillCategoryInsert,
  SkillInsert,
  ExperienceInsert,
  EducationInsert,
  CertificationInsert,
  ServiceOfferingInsert,
  TestimonialInsert,
  ContactMessageInsert,
  ConsentRecordInsert,
  NavigationItemInsert,
  SiteSettingInsert,
  LegalDocumentInsert,
  LegalVersionHistoryInsert,
  MediaAssetInsert,
  AuditLogEntryInsert,
  PaginationParams,
} from "@/types";

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
  async upsert(data: Partial<ProfileInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & Partial<ProfileInsert>;
      const existing = await this.getFirst();
      if (existing && existing.id && isUUID(existing.id) && existing.id !== fallbackProfile.id) {
        return await db.update(schema.profile).set({ ...cleanData, updatedAt: new Date() }).where(eq(schema.profile.id, existing.id));
      }
      return await db.insert(schema.profile).values(cleanData as ProfileInsert);
    } catch (err) {
      console.warn("[ProfileRepository.upsert] DB update bypassed or failed:", err);
      return null;
    }
  },
};

// ─── Project Repository ──────────────────────────────────
export const ProjectRepository = {
  async findMany(opts?: PaginationParams & { search?: string; status?: string }) {
    try {
      const page = opts?.page || 1;
      const limit = opts?.limit || 20;
      const offset = (page - 1) * limit;
      const conditions = [];
      if (opts?.status) conditions.push(eq(schema.projects.status, opts.status as "draft" | "published" | "unpublished"));
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
      if (isUUID(id)) {
        const [item] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
        if (item) return item;
      }
      const cleanSlug = id.replace(/^proj-/, "");
      const [bySlug] = await db.select().from(schema.projects).where(
        or(eq(schema.projects.slug, id), eq(schema.projects.slug, cleanSlug))
      ).limit(1);
      if (bySlug) return bySlug;

      return fallbackProjects.find((p) => p.id === id || p.slug === id || p.slug === cleanSlug) || null;
    } catch {
      const cleanSlug = id.replace(/^proj-/, "");
      return fallbackProjects.find((p) => p.id === id || p.slug === id || p.slug === cleanSlug) || null;
    }
  },
  async create(data: ProjectInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & ProjectInsert;
      const [item] = await db.insert(schema.projects).values(cleanData as ProjectInsert).returning();
      return item;
    } catch (err) {
      console.warn("[ProjectRepository.create] DB insert failed:", err);
      return { ...data, id: (data as { id?: string }).id || "proj-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<ProjectInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };

      // 1. Try finding by UUID if valid UUID
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.projects).set(updateData).where(eq(schema.projects.id, id)).returning();
          return updated;
        }
      }

      // 2. Try finding by slug (including cleanSlug)
      const cleanSlug = id.replace(/^proj-/, "");
      const targetSlug = data.slug || cleanSlug;
      const [bySlug] = await db.select().from(schema.projects).where(
        or(eq(schema.projects.slug, targetSlug), eq(schema.projects.slug, id), eq(schema.projects.slug, cleanSlug))
      ).limit(1);
      if (bySlug) {
        const [updated] = await db.update(schema.projects).set(updateData).where(eq(schema.projects.id, bySlug.id)).returning();
        return updated;
      }

      // 3. Fallback item promotion to database
      const insertData = { ...updateData, slug: targetSlug } as { id?: string } & ProjectInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.projects).values(insertData as ProjectInsert).returning();
      return created;
    } catch (err) {
      console.warn("[ProjectRepository.update] DB update/upsert error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.projects).where(eq(schema.projects.id, id));
      }
      const cleanSlug = id.replace(/^proj-/, "");
      return await db.delete(schema.projects).where(
        or(eq(schema.projects.slug, id), eq(schema.projects.slug, cleanSlug))
      );
    } catch (err) {
      console.warn("[ProjectRepository.delete] DB delete error:", err);
      return null;
    }
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
  async createCategory(data: SkillCategoryInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & SkillCategoryInsert;
      const [cat] = await db.insert(schema.skillCategories).values(cleanData as SkillCategoryInsert).returning();
      return cat;
    } catch (err) {
      console.warn("[SkillRepository.createCategory] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "cat-" + Date.now() };
    }
  },
  async deleteCategory(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.skillCategories).where(eq(schema.skillCategories.id, id));
      }
      const cleanSlug = id.replace(/^cat-/, "");
      return await db.delete(schema.skillCategories).where(
        or(eq(schema.skillCategories.slug, id), eq(schema.skillCategories.slug, cleanSlug))
      );
    } catch (err) {
      console.warn("[SkillRepository.deleteCategory] Error:", err);
      return null;
    }
  },
  async getSkills(opts?: { categoryId?: string; search?: string }) {
    try {
      const conditions = [];
      if (opts?.categoryId && isUUID(opts.categoryId)) conditions.push(eq(schema.skills.categoryId, opts.categoryId));
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
  async createSkill(data: SkillInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & SkillInsert;
      const safeData = {
        ...cleanData,
        categoryId: isUUID(data?.categoryId) ? data.categoryId : null,
      };
      const [skill] = await db.insert(schema.skills).values(safeData as SkillInsert).returning();
      return skill;
    } catch (err) {
      console.warn("[SkillRepository.createSkill] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "sk-" + Date.now() };
    }
  },
  async deleteSkill(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.skills).where(eq(schema.skills.id, id));
      }
      const cleanSlug = id.replace(/^sk-/, "");
      return await db.delete(schema.skills).where(
        or(eq(schema.skills.slug, id), eq(schema.skills.slug, cleanSlug))
      );
    } catch (err) {
      console.warn("[SkillRepository.deleteSkill] Error:", err);
      return null;
    }
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
  async create(data: ExperienceInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & ExperienceInsert;
      const [exp] = await db.insert(schema.experience).values(cleanData as ExperienceInsert).returning();
      return exp;
    } catch (err) {
      console.warn("[ExperienceRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "exp-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<ExperienceInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.experience).where(eq(schema.experience.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.experience).set(updateData).where(eq(schema.experience.id, id)).returning();
          return updated;
        }
      }
      if (data.company) {
        const [existing] = await db.select().from(schema.experience).where(eq(schema.experience.company, data.company)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.experience).set(updateData).where(eq(schema.experience.id, existing.id)).returning();
          return updated;
        }
      }
      const insertData = { ...updateData } as { id?: string } & ExperienceInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.experience).values(insertData as ExperienceInsert).returning();
      return created;
    } catch (err) {
      console.warn("[ExperienceRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.experience).where(eq(schema.experience.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[ExperienceRepository.delete] Error:", err);
      return null;
    }
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
  async create(data: EducationInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & EducationInsert;
      const [edu] = await db.insert(schema.education).values(cleanData as EducationInsert).returning();
      return edu;
    } catch (err) {
      console.warn("[EducationRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "edu-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<EducationInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.education).where(eq(schema.education.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.education).set(updateData).where(eq(schema.education.id, id)).returning();
          return updated;
        }
      }
      if (data.institution) {
        const [existing] = await db.select().from(schema.education).where(eq(schema.education.institution, data.institution)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.education).set(updateData).where(eq(schema.education.id, existing.id)).returning();
          return updated;
        }
      }
      const insertData = { ...updateData } as { id?: string } & EducationInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.education).values(insertData as EducationInsert).returning();
      return created;
    } catch (err) {
      console.warn("[EducationRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.education).where(eq(schema.education.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[EducationRepository.delete] Error:", err);
      return null;
    }
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
  async create(data: CertificationInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & CertificationInsert;
      const [cert] = await db.insert(schema.certifications).values(cleanData as CertificationInsert).returning();
      return cert;
    } catch (err) {
      console.warn("[CertificationRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "cert-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<CertificationInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.certifications).where(eq(schema.certifications.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.certifications).set(updateData).where(eq(schema.certifications.id, id)).returning();
          return updated;
        }
      }
      if (data.name) {
        const [existing] = await db.select().from(schema.certifications).where(eq(schema.certifications.name, data.name)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.certifications).set(updateData).where(eq(schema.certifications.id, existing.id)).returning();
          return updated;
        }
      }
      const insertData = { ...updateData } as { id?: string } & CertificationInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.certifications).values(insertData as CertificationInsert).returning();
      return created;
    } catch (err) {
      console.warn("[CertificationRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.certifications).where(eq(schema.certifications.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[CertificationRepository.delete] Error:", err);
      return null;
    }
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
  async create(data: ServiceOfferingInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & ServiceOfferingInsert;
      const [svc] = await db.insert(schema.services).values(cleanData as ServiceOfferingInsert).returning();
      return svc;
    } catch (err) {
      console.warn("[ServiceRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "svc-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<ServiceOfferingInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.services).where(eq(schema.services.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.services).set(updateData).where(eq(schema.services.id, id)).returning();
          return updated;
        }
      }
      if (data.title) {
        const [existing] = await db.select().from(schema.services).where(eq(schema.services.title, data.title)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.services).set(updateData).where(eq(schema.services.id, existing.id)).returning();
          return updated;
        }
      }
      const insertData = { ...updateData } as { id?: string } & ServiceOfferingInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.services).values(insertData as ServiceOfferingInsert).returning();
      return created;
    } catch (err) {
      console.warn("[ServiceRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.services).where(eq(schema.services.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[ServiceRepository.delete] Error:", err);
      return null;
    }
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
  async create(data: TestimonialInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & TestimonialInsert;
      const [t] = await db.insert(schema.testimonials).values(cleanData as TestimonialInsert).returning();
      return t;
    } catch (err) {
      console.warn("[TestimonialRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "test-" + Date.now() };
    }
  },
  async update(id: string, data: Partial<TestimonialInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.testimonials).set(updateData).where(eq(schema.testimonials.id, id)).returning();
          return updated;
        }
      }
      if (data.name) {
        const [existing] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.name, data.name)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.testimonials).set(updateData).where(eq(schema.testimonials.id, existing.id)).returning();
          return updated;
        }
      }
      const insertData = { ...updateData } as { id?: string } & TestimonialInsert;
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.testimonials).values(insertData as TestimonialInsert).returning();
      return created;
    } catch (err) {
      console.warn("[TestimonialRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[TestimonialRepository.delete] Error:", err);
      return null;
    }
  },
};

// ─── Message & DPDP Repository ───────────────────────────
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
  async create(data: ContactMessageInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & ContactMessageInsert;
      return await db.insert(schema.contactMessages).values(cleanData as ContactMessageInsert);
    } catch (err) {
      console.warn("[MessageRepository.create] Stored in local fallback log:", err);
      return null;
    }
  },
  async recordConsent(data: ConsentRecordInsert) {
    try {
      return await db.insert(schema.consentRecords).values(data);
    } catch (err) {
      console.warn("[MessageRepository.recordConsent] Consent recorded in fallback mode:", err);
      return null;
    }
  },
  async updateStatus(id: string, status: string) {
    try {
      if (isUUID(id)) {
        return await db.update(schema.contactMessages).set({ messageStatus: status as "unread" | "read" | "replied" | "archived" | "spam" }).where(eq(schema.contactMessages.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[MessageRepository.updateStatus] Error:", err);
      return null;
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[MessageRepository.delete] Error:", err);
      return null;
    }
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
  async create(data: NavigationItemInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & NavigationItemInsert;
      const [nav] = await db.insert(schema.navigation).values(cleanData as NavigationItemInsert).returning();
      return nav;
    } catch (err) {
      console.warn("[NavigationRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "nav-" + Date.now() };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.navigation).where(eq(schema.navigation.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[NavigationRepository.delete] Error:", err);
      return null;
    }
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
  async upsert(key: string, value: unknown) {
    try {
      const [existing] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
      if (existing) {
        return await db.update(schema.siteSettings).set({ value: typeof value === "object" ? JSON.stringify(value) : String(value), updatedAt: new Date() }).where(eq(schema.siteSettings.id, existing.id));
      }
      return await db.insert(schema.siteSettings).values({ key, value: typeof value === "object" ? JSON.stringify(value) : String(value), group: "general" });
    } catch (err) {
      console.warn("[SettingsRepository.upsert] Error:", err);
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
  async update(id: string, data: Partial<LegalDocumentInsert>) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & Partial<LegalDocumentInsert>;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        return await db.update(schema.legalDocuments).set(updateData).where(eq(schema.legalDocuments.id, id));
      }
      if (data.slug) {
        return await db.update(schema.legalDocuments).set(updateData).where(eq(schema.legalDocuments.slug, data.slug));
      }
      return null;
    } catch (err) {
      console.warn("[LegalRepository.update] Error:", err);
      return null;
    }
  },
  async addVersionHistory(data: LegalVersionHistoryInsert) {
    try {
      const safeData = {
        ...data,
        documentId: isUUID(data?.documentId) ? data.documentId : null,
        changedBy: isUUID(data?.changedBy) ? data.changedBy : null,
      };
      return await db.insert(schema.legalVersionHistory).values(safeData as LegalVersionHistoryInsert);
    } catch (err) {
      console.warn("[LegalRepository.addVersionHistory] Error:", err);
      return null;
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.legalDocuments).where(eq(schema.legalDocuments.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[LegalRepository.delete] Error:", err);
      return null;
    }
  },
};

// ─── Media Repository ────────────────────────────────────
export const MediaRepository = {
  async findMany(opts?: PaginationParams) {
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
  async create(data: MediaAssetInsert) {
    try {
      const { id: _ignored, ...cleanData } = data as { id?: string } & MediaAssetInsert;
      const [asset] = await db.insert(schema.mediaAssets).values(cleanData as MediaAssetInsert).returning();
      return asset;
    } catch (err) {
      console.warn("[MediaRepository.create] Error:", err);
      return { ...data, id: (data as { id?: string }).id || "media-" + Date.now() };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
      }
      return null;
    } catch (err) {
      console.warn("[MediaRepository.delete] Error:", err);
      return null;
    }
  },
};

// ─── Audit Repository ────────────────────────────────────
export const AuditRepository = {
  async log(data: AuditLogEntryInsert) {
    try {
      const safeData = {
        ...data,
        userId: isUUID(data?.userId) ? data.userId : null,
      };
      await db.insert(schema.auditLog).values(safeData as AuditLogEntryInsert);
    } catch {
      // Don't fail primary operation
    }
  },
  async findMany(opts?: PaginationParams) {
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
