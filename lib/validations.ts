import { z } from "zod";

// ─── Profile ──────────────────────────────────────────────
export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  bio: z.string().optional(),
  shortBio: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  avatar: z.string().optional(),
  heroImage: z.string().optional(),
  resumeUrl: z.string().optional(),
  yearsOfExperience: z.coerce.number().int().min(0).optional(),
  projectsCompleted: z.coerce.number().int().min(0).optional(),
  happyClients: z.coerce.number().int().min(0).optional(),
  availability: z.string().optional(),
  status: z.enum(["draft", "published", "unpublished"]).default("published"),
});

// ─── Project ──────────────────────────────────────────────
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).default([]),
  liveUrl: z.string().optional().or(z.literal("")),
  githubUrl: z.string().optional().or(z.literal("")),
  techStack: z.array(z.string()).default([]),
  category: z.string().optional(),
  client: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Skill Category ───────────────────────────────────────
export const skillCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("published"),
});

// ─── Skill ────────────────────────────────────────────────
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  level: z.coerce.number().int().min(0).max(100).default(50),
  categoryId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("published"),
});

// ─── Experience ───────────────────────────────────────────
export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  companyLogo: z.string().optional(),
  companyUrl: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Education ────────────────────────────────────────────
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  logo: z.string().optional(),
  url: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Certification ────────────────────────────────────────
export const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional().or(z.literal("")),
  image: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Service ──────────────────────────────────────────────
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  price: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Testimonial ──────────────────────────────────────────
export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  projectId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Social Link ──────────────────────────────────────────
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  size: z.string().optional().default("md"),
  style: z.string().optional().default("default"),
  placements: z.array(z.string()).default(["footer", "contact"]),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  status: z.enum(["draft", "published", "unpublished"]).default("published"),
});

// ─── Website Section ──────────────────────────────────────
export const sectionSchema = z.object({
  sectionKey: z.string().min(1, "Section key is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  componentType: z.string().default("custom"),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "unpublished"]).default("published"),
  styles: z.record(z.string(), z.unknown()).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

// ─── Contact Form ─────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").max(255),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  phone: z.string().optional(),
  company: z.string().optional(),
  consentGiven: z.boolean().refine((v) => v === true, "Consent is required"),
});

// ─── Navigation ───────────────────────────────────────────
export const navigationSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  isExternal: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  status: z.enum(["published", "draft", "unpublished"]).default("published"),
  group: z.string().default("main"),
  parentId: z.string().optional().nullable(),
});

// ─── Site Settings ────────────────────────────────────────
export const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.unknown(),
  group: z.string().default("general"),
  label: z.string().optional(),
  description: z.string().optional(),
});

// ─── SEO Metadata ─────────────────────────────────────────
export const seoMetadataSchema = z.object({
  page: z.string().min(1, "Page is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  structuredData: z.record(z.string(), z.unknown()).optional(),
  canonicalUrl: z.string().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

// ─── Legal Document ───────────────────────────────────────
export const legalDocumentSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  version: z.string().default("1.0"),
  effectiveDate: z.string().optional(),
  isReviewRequired: z.boolean().default(true),
  status: z.enum(["draft", "published", "unpublished"]).default("draft"),
});

// ─── Login ────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// Type exports
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;
export type SectionFormData = z.infer<typeof sectionSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NavigationFormData = z.infer<typeof navigationSchema>;
export type SiteSettingFormData = z.infer<typeof siteSettingSchema>;
export type SeoMetadataFormData = z.infer<typeof seoMetadataSchema>;
export type LegalDocumentFormData = z.infer<typeof legalDocumentSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
