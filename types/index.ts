/**
 * Comprehensive Domain & API Type Definitions
 * Copyright (c) 2026 Arun M (https://arun-m.in). All Rights Reserved.
 *
 * Provides strongly-typed models, API response envelopes, and entity schemas
 * to eliminate 'any' and ensure end-to-end type safety across client & server.
 */

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type * as schema from "@/lib/db/schema";

// ─── Database Infer Select Types ─────────────────────────
export type AdminUser = InferSelectModel<typeof schema.adminUsers>;
export type AdminUserInsert = InferInsertModel<typeof schema.adminUsers>;

export type Profile = InferSelectModel<typeof schema.profile>;
export type ProfileInsert = InferInsertModel<typeof schema.profile>;

export type Project = InferSelectModel<typeof schema.projects>;
export type ProjectInsert = InferInsertModel<typeof schema.projects>;

export type SkillCategory = InferSelectModel<typeof schema.skillCategories>;
export type SkillCategoryInsert = InferInsertModel<typeof schema.skillCategories>;

export type Skill = InferSelectModel<typeof schema.skills>;
export type SkillInsert = InferInsertModel<typeof schema.skills>;

export type Experience = InferSelectModel<typeof schema.experience>;
export type ExperienceInsert = InferInsertModel<typeof schema.experience>;

export type Education = InferSelectModel<typeof schema.education>;
export type EducationInsert = InferInsertModel<typeof schema.education>;

export type Certification = InferSelectModel<typeof schema.certifications>;
export type CertificationInsert = InferInsertModel<typeof schema.certifications>;

export type ServiceOffering = InferSelectModel<typeof schema.services>;
export type ServiceOfferingInsert = InferInsertModel<typeof schema.services>;

export type Testimonial = InferSelectModel<typeof schema.testimonials>;
export type TestimonialInsert = InferInsertModel<typeof schema.testimonials>;

export type SocialLink = InferSelectModel<typeof schema.socialLinks>;
export type SocialLinkInsert = InferInsertModel<typeof schema.socialLinks>;

export type ContactMessage = InferSelectModel<typeof schema.contactMessages>;
export type ContactMessageInsert = InferInsertModel<typeof schema.contactMessages>;

export type SiteSetting = InferSelectModel<typeof schema.siteSettings>;
export type SiteSettingInsert = InferInsertModel<typeof schema.siteSettings>;

export type NavigationItem = InferSelectModel<typeof schema.navigation>;
export type NavigationItemInsert = InferInsertModel<typeof schema.navigation>;

export type SeoMetadata = InferSelectModel<typeof schema.seoMetadata>;
export type SeoMetadataInsert = InferInsertModel<typeof schema.seoMetadata>;

export type LegalDocument = InferSelectModel<typeof schema.legalDocuments>;
export type LegalDocumentInsert = InferInsertModel<typeof schema.legalDocuments>;

export type LegalVersionHistory = InferSelectModel<typeof schema.legalVersionHistory>;
export type LegalVersionHistoryInsert = InferInsertModel<typeof schema.legalVersionHistory>;

export type ConsentRecord = InferSelectModel<typeof schema.consentRecords>;
export type ConsentRecordInsert = InferInsertModel<typeof schema.consentRecords>;

export type MediaAsset = InferSelectModel<typeof schema.mediaAssets>;
export type MediaAssetInsert = InferInsertModel<typeof schema.mediaAssets>;

export type AuditLogEntry = InferSelectModel<typeof schema.auditLog>;
export type AuditLogEntryInsert = InferInsertModel<typeof schema.auditLog>;

// ─── Composite & Joined Domain Models ────────────────────
export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

export interface PublicPortfolioData {
  profile: Profile | null;
  projects: Project[];
  categoriesWithSkills: SkillCategoryWithSkills[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
}

export interface DashboardStats {
  projects: number;
  skills: number;
  experience: number;
  messages: number;
  views: number;
  unreadMessages?: number;
  education?: number;
  certifications?: number;
  testimonials?: number;
  services?: number;
}

// ─── Pagination & Query Parameter Types ───────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  entity?: string;
  folder?: string;
  categoryId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Standard API Envelopes ──────────────────────────────
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiResponseMeta {
  page?: number;
  per_page?: number;
  total?: number;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

// ─── Theme & Layout Types ────────────────────────────────
export type PortfolioTheme = "cyberpunk" | "voldog";

export interface PortfolioLayoutProps {
  profile?: Profile | null;
  projects?: Project[];
  categoriesWithSkills?: SkillCategoryWithSkills[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  testimonials?: Testimonial[];
  socialLinks?: SocialLink[];
  onSwitchTheme?: () => void;
}
