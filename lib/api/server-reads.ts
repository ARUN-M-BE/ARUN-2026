import { fetchAdminServer } from "@/lib/api/server-admin";
import type {
  AuditLogEntry,
  Certification,
  ContactMessage,
  Education,
  Experience,
  LegalDocument,
  MediaAsset,
  NavigationItem,
  Profile,
  Project,
  SeoMetadata,
  ServiceOffering,
  SiteSetting,
  Skill,
  SkillCategory,
  SocialLink,
  Testimonial,
  WebsiteSection,
} from "@/types";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function getProfile(): Promise<Profile | null> {
  const res = await fetchAdminServer<{ profile?: Profile | null } | Profile | null>(
    "/api/admin/profile",
    null
  );
  if (res && typeof res === "object" && "profile" in res) return res.profile ?? null;
  return (res as Profile | null) ?? null;
}

export async function getProjects(opts?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<Project>> {
  const qs = new URLSearchParams();
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.status) qs.set("status", opts.status);
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  const q = qs.toString();
  const res = await fetchAdminServer<PaginatedResult<Project> | { projects?: Project[] }>(
    `/api/admin/projects${q ? `?${q}` : ""}`,
    { items: [], total: 0, page: opts?.page ?? 1, limit: opts?.limit ?? 10, pages: 0 }
  );
  if ("items" in res) return res;
  const items = res.projects ?? [];
  return { items, total: items.length, page: 1, limit: items.length || 10, pages: 1 };
}

export async function getProjectById(id: string): Promise<Project | null> {
  const res = await fetchAdminServer<{ project?: Project | null } | Project | null>(
    `/api/admin/projects/${encodeURIComponent(id)}`,
    null
  );
  if (res && typeof res === "object" && "project" in res) return res.project ?? null;
  return (res as Project | null) ?? null;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const res = await fetchAdminServer<{ categories?: SkillCategory[] } | SkillCategory[]>(
    "/api/admin/skill-categories",
    []
  );
  return Array.isArray(res) ? res : (res.categories ?? []);
}

export async function getSkills(opts?: {
  categoryId?: string;
  search?: string;
}): Promise<Skill[]> {
  const qs = new URLSearchParams();
  if (opts?.categoryId) qs.set("categoryId", opts.categoryId);
  if (opts?.search) qs.set("search", opts.search);
  const q = qs.toString();
  const res = await fetchAdminServer<{ skills?: Skill[] } | Skill[]>(
    `/api/admin/skills${q ? `?${q}` : ""}`,
    []
  );
  return Array.isArray(res) ? res : (res.skills ?? []);
}

export async function getExperiences(): Promise<Experience[]> {
  const res = await fetchAdminServer<{ experience?: Experience[] } | Experience[]>(
    "/api/admin/experience",
    []
  );
  return Array.isArray(res) ? res : (res.experience ?? []);
}

export async function getEducation(): Promise<Education[]> {
  const res = await fetchAdminServer<{ education?: Education[] } | Education[]>(
    "/api/admin/education",
    []
  );
  return Array.isArray(res) ? res : (res.education ?? []);
}

export async function getCertifications(): Promise<Certification[]> {
  const res = await fetchAdminServer<{ certifications?: Certification[] } | Certification[]>(
    "/api/admin/certifications",
    []
  );
  return Array.isArray(res) ? res : (res.certifications ?? []);
}

export async function getServices(): Promise<ServiceOffering[]> {
  const res = await fetchAdminServer<{ services?: ServiceOffering[] } | ServiceOffering[]>(
    "/api/admin/services",
    []
  );
  return Array.isArray(res) ? res : (res.services ?? []);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetchAdminServer<{ testimonials?: Testimonial[] } | Testimonial[]>(
    "/api/admin/testimonials",
    []
  );
  return Array.isArray(res) ? res : (res.testimonials ?? []);
}

export async function getContactMessages(opts?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<ContactMessage>> {
  const qs = new URLSearchParams();
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.status) qs.set("status", opts.status);
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  const q = qs.toString();
  return fetchAdminServer<PaginatedResult<ContactMessage>>(
    `/api/admin/messages${q ? `?${q}` : ""}`,
    { items: [], total: 0, page: opts?.page ?? 1, limit: opts?.limit ?? 20, pages: 0 }
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const res = await fetchAdminServer<{ socialLinks?: SocialLink[] } | SocialLink[]>(
    "/api/admin/social-links",
    []
  );
  return Array.isArray(res) ? res : (res.socialLinks ?? []);
}

export async function getNavigation(): Promise<NavigationItem[]> {
  const res = await fetchAdminServer<{ navigation?: NavigationItem[] } | NavigationItem[]>(
    "/api/admin/navigation",
    []
  );
  return Array.isArray(res) ? res : (res.navigation ?? []);
}

export async function getSections(): Promise<WebsiteSection[]> {
  const res = await fetchAdminServer<{ sections?: WebsiteSection[] } | WebsiteSection[]>(
    "/api/admin/sections",
    []
  );
  return Array.isArray(res) ? res : (res.sections ?? []);
}

export async function getSiteSettings(): Promise<SiteSetting[]> {
  const res = await fetchAdminServer<{ settings?: SiteSetting[] } | SiteSetting[]>(
    "/api/admin/settings",
    []
  );
  return Array.isArray(res) ? res : (res.settings ?? []);
}

export async function getSeoMetadata(page?: string): Promise<SeoMetadata | SeoMetadata[] | null> {
  const q = page ? `?page=${encodeURIComponent(page)}` : "";
  return fetchAdminServer<SeoMetadata | SeoMetadata[] | null>(
    `/api/admin/seo${q}`,
    page ? null : []
  );
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const res = await fetchAdminServer<{ documents?: LegalDocument[] } | LegalDocument[]>(
    "/api/admin/legal",
    []
  );
  return Array.isArray(res) ? res : (res.documents ?? []);
}

export async function getMediaAssets(opts?: {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
  type?: string;
}): Promise<PaginatedResult<MediaAsset>> {
  const qs = new URLSearchParams();
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  if (opts?.folder) qs.set("folder", opts.folder);
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.type) qs.set("type", opts.type);
  const q = qs.toString();
  return fetchAdminServer<PaginatedResult<MediaAsset>>(
    `/api/admin/media${q ? `?${q}` : ""}`,
    { items: [], total: 0, page: opts?.page ?? 1, limit: opts?.limit ?? 20, pages: 0 }
  );
}

export async function getAuditLogs(opts?: {
  page?: number;
  limit?: number;
  entity?: string;
  action?: string;
  search?: string;
}): Promise<PaginatedResult<AuditLogEntry>> {
  const qs = new URLSearchParams();
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  if (opts?.entity) qs.set("entity", opts.entity);
  if (opts?.action) qs.set("action", opts.action);
  if (opts?.search) qs.set("search", opts.search);
  const q = qs.toString();
  return fetchAdminServer<PaginatedResult<AuditLogEntry>>(
    `/api/admin/audit-log${q ? `?${q}` : ""}`,
    { items: [], total: 0, page: opts?.page ?? 1, limit: opts?.limit ?? 20, pages: 0 }
  );
}

export async function getDashboardStats() {
  return fetchAdminServer("/api/admin/dashboard", {
    projects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    certifications: 0,
    unreadMessages: 0,
    testimonials: 0,
    services: 0,
    views: 0,
    viewsToday: 0,
    uniqueVisitors: 0,
    topCountry: null as string | null,
    topCountries: [] as Array<{ country: string | null; total: number }>,
    topPages: [] as Array<{ path: string; total: number }>,
    dailyViews: [] as Array<{ day: string; total: number }>,
    sections: 0,
    publishedSections: 0,
    draftSections: 0,
    unpublishedSections: 0,
  });
}
