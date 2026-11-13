/**
 * Strongly-Typed Domain & API Models for https://arun-m.in
 * Generated from production schema & PostgreSQL data models.
 * Copyright (c) 2026 Arun M (https://arun-m.in). All rights reserved.
 */

export type Status = "draft" | "published" | "unpublished";
export type MessageStatus = "unread" | "read" | "replied" | "archived" | "spam";

export interface Profile {
  id: string;
  fullName: string;
  title: string;
  subtitle: string | null;
  bio: string | null;
  shortBio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  avatar: string | null;
  heroImage: string | null;
  resumeUrl: string | null;
  yearsOfExperience: number | null;
  projectsCompleted: number | null;
  happyClients: number | null;
  availability: string | null;
  status: Status;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  thumbnail: string | null;
  images: string[] | null;
  liveUrl: string | null;
  githubUrl: string | null;
  techStack: string[] | null;
  category: string | null;
  client: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isFeatured: boolean;
  sortOrder: number;
  status: Status;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  level: number;
  categoryId: string | null;
  isFeatured: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  type: string | null;
  description: string | null;
  achievements: string[] | null;
  techStack: string[] | null;
  companyLogo: string | null;
  companyUrl: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  isFeatured: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  location: string | null;
  description: string | null;
  grade: string | null;
  logo: string | null;
  url: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credentialId: string | null;
  credentialUrl: string | null;
  image: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  isFeatured: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceOffering {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
  price: string | null;
  isFeatured: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  content: string;
  avatar: string | null;
  rating: number | null;
  projectId: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  sortOrder: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  phone: string | null;
  company: string | null;
  messageStatus: MessageStatus;
  consentGiven: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  repliedAt: Date | null;
  createdAt: Date;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  group: string;
  label: string | null;
  description: string | null;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  isExternal: boolean;
  sortOrder: number;
  isActive: boolean;
  group: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoMetadata {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  structuredData: unknown;
  canonicalUrl: string | null;
  noIndex: boolean;
  updatedAt: Date;
}

export interface LegalDocument {
  id: string;
  type: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  effectiveDate: Date | null;
  isReviewRequired: boolean;
  status: Status;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalVersionHistory {
  id: string;
  documentId: string;
  version: string;
  content: string;
  changedBy: string | null;
  changeNote: string | null;
  createdAt: Date;
}

export interface ConsentRecord {
  id: string;
  type: string;
  ipAddress: string | null;
  userAgent: string | null;
  consentGiven: boolean;
  preferences: Record<string, unknown> | null;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  folder: string | null;
  copyright: string | null;
  license: string | null;
  attribution: string | null;
  uploadedBy: string | null;
  createdAt: Date;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
  unreadMessages: number;
  views: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    totalPages?: number;
  };
}
