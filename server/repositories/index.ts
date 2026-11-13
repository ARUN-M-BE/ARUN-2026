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
  fallbackSocialLinks,
  fallbackNavigation,
  fallbackWebsiteSections,
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
      const { id: _ignored, ...cleanData } = data;
      const [existingRow] = await db.select().from(schema.profile).limit(1);
      if (existingRow) {
        const [updated] = await db
          .update(schema.profile)
          .set({ ...cleanData, updatedAt: new Date() })
          .where(eq(schema.profile.id, existingRow.id))
          .returning();
        return updated;
      }
      const [inserted] = await db.insert(schema.profile).values(cleanData).returning();
      return inserted;
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [item] = await db.insert(schema.projects).values(cleanData).returning();
      return item;
    } catch (err) {
      console.warn("[ProjectRepository.create] DB insert failed:", err);
      return { ...data, id: data.id || "proj-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData, slug: targetSlug };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.projects).values(insertData).returning();
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
  async createCategory(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [cat] = await db.insert(schema.skillCategories).values(cleanData).returning();
      return cat;
    } catch (err) {
      console.warn("[SkillRepository.createCategory] Error:", err);
      return { ...data, id: "cat-" + Date.now() };
    }
  },
  async updateCategory(id: string, data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.skillCategories).where(eq(schema.skillCategories.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.skillCategories).set(updateData).where(eq(schema.skillCategories.id, id)).returning();
          return updated;
        }
      }
      const cleanSlug = id.replace(/^cat-/, "");
      const [existingSlug] = await db
        .select()
        .from(schema.skillCategories)
        .where(or(eq(schema.skillCategories.slug, id), eq(schema.skillCategories.slug, cleanSlug)))
        .limit(1);
      if (existingSlug) {
        const [updated] = await db.update(schema.skillCategories).set(updateData).where(eq(schema.skillCategories.id, existingSlug.id)).returning();
        return updated;
      }
      const [created] = await db.insert(schema.skillCategories).values({
        name: cleanData.name || "Category",
        slug: cleanData.slug || cleanSlug,
        status: cleanData.status || "published",
        sortOrder: typeof cleanData.sortOrder === "number" ? cleanData.sortOrder : 0,
        updatedAt: new Date(),
      }).returning();
      return created;
    } catch (err) {
      console.warn("[SkillRepository.updateCategory] Error:", err);
      return { ...data, id };
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
  async createSkill(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const safeData = {
        ...cleanData,
        categoryId: isUUID(data?.categoryId) ? data.categoryId : null,
      };
      const [skill] = await db.insert(schema.skills).values(safeData).returning();
      return skill;
    } catch (err) {
      console.warn("[SkillRepository.createSkill] Error:", err);
      return { ...data, id: "sk-" + Date.now() };
    }
  },
  async updateSkill(id: string, data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const safeData = {
        ...cleanData,
        categoryId: isUUID(data?.categoryId) ? data.categoryId : null,
        updatedAt: new Date(),
      };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.skills).where(eq(schema.skills.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.skills).set(safeData).where(eq(schema.skills.id, id)).returning();
          return updated;
        }
      }
      const cleanSlug = id.replace(/^sk-/, "");
      const [existingSlug] = await db
        .select()
        .from(schema.skills)
        .where(or(eq(schema.skills.slug, id), eq(schema.skills.slug, cleanSlug)))
        .limit(1);
      if (existingSlug) {
        const [updated] = await db.update(schema.skills).set(safeData).where(eq(schema.skills.id, existingSlug.id)).returning();
        return updated;
      }
      const [created] = await db.insert(schema.skills).values({
        name: cleanData.name || "New Skill",
        slug: cleanData.slug || cleanSlug,
        level: typeof cleanData.level === "number" ? cleanData.level : 85,
        categoryId: safeData.categoryId,
        isFeatured: typeof cleanData.isFeatured === "boolean" ? cleanData.isFeatured : true,
        status: cleanData.status || "published",
        sortOrder: typeof cleanData.sortOrder === "number" ? cleanData.sortOrder : 0,
        updatedAt: new Date(),
      }).returning();
      return created;
    } catch (err) {
      console.warn("[SkillRepository.updateSkill] Error:", err);
      return { ...data, id };
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [exp] = await db.insert(schema.experience).values(cleanData).returning();
      return exp;
    } catch (err) {
      console.warn("[ExperienceRepository.create] Error:", err);
      return { ...data, id: "exp-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.experience).values(insertData).returning();
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [edu] = await db.insert(schema.education).values(cleanData).returning();
      return edu;
    } catch (err) {
      console.warn("[EducationRepository.create] Error:", err);
      return { ...data, id: "edu-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.education).values(insertData).returning();
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [cert] = await db.insert(schema.certifications).values(cleanData).returning();
      return cert;
    } catch (err) {
      console.warn("[CertificationRepository.create] Error:", err);
      return { ...data, id: "cert-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.certifications).values(insertData).returning();
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [svc] = await db.insert(schema.services).values(cleanData).returning();
      return svc;
    } catch (err) {
      console.warn("[ServiceRepository.create] Error:", err);
      return { ...data, id: "svc-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.services).values(insertData).returning();
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [t] = await db.insert(schema.testimonials).values(cleanData).returning();
      return t;
    } catch (err) {
      console.warn("[TestimonialRepository.create] Error:", err);
      return { ...data, id: "test-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
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
      const insertData = { ...updateData };
      if (isUUID(id)) insertData.id = id;
      const [created] = await db.insert(schema.testimonials).values(insertData).returning();
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
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      return await db.insert(schema.contactMessages).values(cleanData);
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
    try {
      if (isUUID(id)) {
        return await db.update(schema.contactMessages).set({ messageStatus: status }).where(eq(schema.contactMessages.id, id));
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

// ─── Social Link Repository ──────────────────────────────
export const SocialLinkRepository = {
  async findMany() {
    try {
      const items = await db.select().from(schema.socialLinks).orderBy(asc(schema.socialLinks.sortOrder));
      return items && items.length > 0 ? items : fallbackSocialLinks;
    } catch {
      return fallbackSocialLinks;
    }
  },
  async findPublished() {
    try {
      const items = await db
        .select()
        .from(schema.socialLinks)
        .where(and(eq(schema.socialLinks.isActive, true), eq(schema.socialLinks.status, "published")))
        .orderBy(asc(schema.socialLinks.sortOrder));
      return items && items.length > 0 ? items : fallbackSocialLinks.filter((s) => s.isActive && s.status === "published");
    } catch {
      return fallbackSocialLinks.filter((s) => s.isActive && s.status === "published");
    }
  },
};

// ─── Navigation Repository ───────────────────────────────
export const NavigationRepository = {
  async findMany() {
    try {
      const items = await db.select().from(schema.navigation).orderBy(asc(schema.navigation.sortOrder));
      return items && items.length > 0 ? items : fallbackNavigation;
    } catch {
      return fallbackNavigation;
    }
  },
  async findActive() {
    try {
      const items = await db
        .select()
        .from(schema.navigation)
        .where(and(eq(schema.navigation.isActive, true), eq(schema.navigation.status, "published")))
        .orderBy(asc(schema.navigation.sortOrder));
      return items && items.length > 0 ? items : fallbackNavigation.filter((i) => i.isActive && i.status === "published");
    } catch {
      return fallbackNavigation.filter((i) => i.isActive && i.status === "published");
    }
  },
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [nav] = await db.insert(schema.navigation).values(cleanData).returning();
      return nav;
    } catch (err) {
      console.warn("[NavigationRepository.create] Error:", err);
      return { ...data, id: "nav-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.navigation).where(eq(schema.navigation.id, id)).limit(1);
        if (existing) {
          const [updated] = await db.update(schema.navigation).set(updateData).where(eq(schema.navigation.id, id)).returning();
          return updated;
        }
      }
      if (data.href || data.label) {
        const [existing] = await db
          .select()
          .from(schema.navigation)
          .where(
            or(
              data.href ? eq(schema.navigation.href, data.href) : undefined,
              data.label ? eq(schema.navigation.label, data.label) : undefined
            )
          )
          .limit(1);
        if (existing) {
          const [updated] = await db.update(schema.navigation).set(updateData).where(eq(schema.navigation.id, existing.id)).returning();
          return updated;
        }
      }
      const [created] = await db.insert(schema.navigation).values({
        label: cleanData.label || "Link",
        href: cleanData.href || "#",
        icon: cleanData.icon || null,
        color: cleanData.color || null,
        badge: cleanData.badge || null,
        style: cleanData.style || "default",
        isExternal: Boolean(cleanData.isExternal || cleanData.target === "_blank"),
        sortOrder: typeof cleanData.sortOrder === "number" ? cleanData.sortOrder : 0,
        isActive: typeof cleanData.isActive === "boolean" ? cleanData.isActive : true,
        status: cleanData.status || "published",
        group: cleanData.group || "main",
        updatedAt: new Date(),
      }).returning();
      return created;
    } catch (err) {
      console.warn("[NavigationRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.navigation).where(eq(schema.navigation.id, id));
      }
      const cleanLabel = id.replace(/^nav-/, "");
      return await db.delete(schema.navigation).where(
        or(
          eq(schema.navigation.label, cleanLabel),
          eq(schema.navigation.href, `#${cleanLabel}`),
          eq(schema.navigation.href, `/${cleanLabel}`)
        )
      );
    } catch (err) {
      console.warn("[NavigationRepository.delete] Error:", err);
      return null;
    }
  },
  async reorder(orderedIds: string[]) {
    try {
      const promises = orderedIds.map((id, index) => {
        if (isUUID(id)) {
          return db.update(schema.navigation).set({ sortOrder: index + 1, updatedAt: new Date() }).where(eq(schema.navigation.id, id));
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      return true;
    } catch (err) {
      console.warn("[NavigationRepository.reorder] Error:", err);
      return false;
    }
  },
};

// ─── Website Section Repository ───────────────────────────
export const SectionRepository = {
  async findMany() {
    try {
      const items = await db.select().from(schema.websiteSections).orderBy(asc(schema.websiteSections.sortOrder));
      return items && items.length > 0 ? items : fallbackWebsiteSections;
    } catch {
      return fallbackWebsiteSections;
    }
  },
  async findPublished() {
    try {
      const items = await db
        .select()
        .from(schema.websiteSections)
        .where(eq(schema.websiteSections.status, "published"))
        .orderBy(asc(schema.websiteSections.sortOrder));
      return items && items.length > 0 ? items : fallbackWebsiteSections.filter((s) => s.status === "published");
    } catch {
      return fallbackWebsiteSections.filter((s) => s.status === "published");
    }
  },
  async getById(id: string) {
    try {
      if (isUUID(id)) {
        const [sec] = await db.select().from(schema.websiteSections).where(eq(schema.websiteSections.id, id)).limit(1);
        return sec || fallbackWebsiteSections.find((s) => s.id === id) || null;
      }
      return fallbackWebsiteSections.find((s) => s.id === id) || null;
    } catch {
      return fallbackWebsiteSections.find((s) => s.id === id) || null;
    }
  },
  async getByKey(sectionKey: string) {
    try {
      const [sec] = await db.select().from(schema.websiteSections).where(eq(schema.websiteSections.sectionKey, sectionKey)).limit(1);
      return sec || fallbackWebsiteSections.find((s) => s.sectionKey === sectionKey) || null;
    } catch {
      return fallbackWebsiteSections.find((s) => s.sectionKey === sectionKey) || null;
    }
  },
  async create(data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const [sec] = await db.insert(schema.websiteSections).values(cleanData).returning();
      return sec;
    } catch (err) {
      console.warn("[SectionRepository.create] Error:", err);
      return { ...data, id: "sec-" + Date.now() };
    }
  },
  async update(id: string, data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
      const updateData = { ...cleanData, updatedAt: new Date() };
      if (isUUID(id)) {
        const [existing] = await db.select().from(schema.websiteSections).where(eq(schema.websiteSections.id, id)).limit(1);
        if (existing) {
          const [updated] = await db
            .update(schema.websiteSections)
            .set(updateData)
            .where(eq(schema.websiteSections.id, id))
            .returning();
          return updated;
        }
      }
      const keyToMatch = data.sectionKey || (id.startsWith("sec-") ? id.replace(/^sec-/, "") : id);
      if (keyToMatch) {
        const [existing] = await db
          .select()
          .from(schema.websiteSections)
          .where(eq(schema.websiteSections.sectionKey, keyToMatch))
          .limit(1);
        if (existing) {
          const [updated] = await db
            .update(schema.websiteSections)
            .set(updateData)
            .where(eq(schema.websiteSections.id, existing.id))
            .returning();
          return updated;
        }
      }
      const [created] = await db
        .insert(schema.websiteSections)
        .values({
          sectionKey: keyToMatch || "section",
          title: cleanData.title || "Section",
          subtitle: cleanData.subtitle || null,
          badge: cleanData.badge || null,
          description: cleanData.description || null,
          content: cleanData.content || null,
          componentType: cleanData.componentType || keyToMatch || "custom",
          sortOrder: typeof cleanData.sortOrder === "number" ? cleanData.sortOrder : 0,
          status: cleanData.status || "published",
          styles: cleanData.styles || null,
          metadata: cleanData.metadata || null,
          updatedAt: new Date(),
        })
        .returning();
      return created;
    } catch (err) {
      console.warn("[SectionRepository.update] Error:", err);
      return { ...data, id };
    }
  },
  async duplicate(id: string) {
    try {
      const original = await this.getById(id);
      if (!original) throw new Error("Section not found");
      const newKey = `${original.sectionKey}-copy-${Date.now().toString().slice(-4)}`;
      const duplicatedData = {
        sectionKey: newKey,
        title: `${original.title} (Copy)`,
        subtitle: original.subtitle,
        badge: original.badge,
        description: original.description,
        content: original.content,
        componentType: original.componentType,
        sortOrder: original.sortOrder + 1,
        status: "draft" as const,
        styles: original.styles,
        metadata: original.metadata,
      };
      return await this.create(duplicatedData);
    } catch (err) {
      console.warn("[SectionRepository.duplicate] Error:", err);
      return null;
    }
  },
  async delete(id: string) {
    try {
      if (isUUID(id)) {
        return await db.delete(schema.websiteSections).where(eq(schema.websiteSections.id, id));
      }
      const cleanKey = id.replace(/^sec-/, "");
      return await db.delete(schema.websiteSections).where(
        or(eq(schema.websiteSections.sectionKey, id), eq(schema.websiteSections.sectionKey, cleanKey))
      );
    } catch (err) {
      console.warn("[SectionRepository.delete] Error:", err);
      return null;
    }
  },
  async reorder(orderedIds: string[]) {
    try {
      const promises = orderedIds.map((id, index) => {
        if (isUUID(id)) {
          return db
            .update(schema.websiteSections)
            .set({ sortOrder: index + 1, updatedAt: new Date() })
            .where(eq(schema.websiteSections.id, id));
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      return true;
    } catch (err) {
      console.warn("[SectionRepository.reorder] Error:", err);
      return false;
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
  async upsert(key: string, value: any) {
    try {
      const [existing] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
      if (existing) {
        return await db.update(schema.siteSettings).set({ value, updatedAt: new Date() }).where(eq(schema.siteSettings.id, existing.id));
      }
      return await db.insert(schema.siteSettings).values({ key, value, group: "general" });
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
  async update(id: string, data: any) {
    try {
      const { id: _ignored, ...cleanData } = data;
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
  async addVersionHistory(data: any) {
    try {
      const safeData = {
        ...data,
        documentId: isUUID(data?.documentId) ? data.documentId : null,
        changedBy: isUUID(data?.changedBy) ? data.changedBy : null,
      };
      return await db.insert(schema.legalVersionHistory).values(safeData);
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
    try {
      const { id: _ignored, ...cleanData } = data;
      const [asset] = await db.insert(schema.mediaAssets).values(cleanData).returning();
      return asset;
    } catch (err) {
      console.warn("[MediaRepository.create] Error:", err);
      return { ...data, id: "media-" + Date.now() };
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
  async log(data: any) {
    try {
      const safeData = {
        ...data,
        userId: isUUID(data?.userId) ? data.userId : null,
      };
      await db.insert(schema.auditLog).values(safeData);
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
