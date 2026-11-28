import { apiFetch } from "@/lib/api/client";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function buildQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      qs.set(k, String(v));
    }
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export const adminApi = {
  // Profile
  updateProfile: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Projects
  createProject: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Skills & Categories
  createSkillCategory: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/skill-categories", { method: "POST", body: JSON.stringify(data) }),
  updateSkillCategory: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/skill-categories/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkillCategory: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/skill-categories/${encodeURIComponent(id)}`, { method: "DELETE" }),
  createSkill: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/skills/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/skills/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Experience
  createExperience: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/experience/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/experience/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Education
  createEducation: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/education/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/education/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Certifications
  createCertification: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/certifications", { method: "POST", body: JSON.stringify(data) }),
  updateCertification: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/certifications/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCertification: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/certifications/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Services
  createService: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/services/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/services/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Testimonials
  createTestimonial: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/testimonials", { method: "POST", body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/testimonials/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/testimonials/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Messages
  getContactMessages: (opts?: { search?: string; status?: string; page?: number; limit?: number }) =>
    apiFetch<unknown>(`/api/admin/messages${buildQuery(opts)}`, { cache: "no-store" }),
  updateMessageStatus: (id: string, status: string) =>
    apiFetch<ActionResponse>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteMessage: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Social Links
  createSocialLink: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/social-links", { method: "POST", body: JSON.stringify(data) }),
  updateSocialLink: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/social-links/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSocialLink: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/social-links/${encodeURIComponent(id)}`, { method: "DELETE" }),
  reorderSocialLinks: (orderedIds: string[]) =>
    apiFetch<ActionResponse>("/api/admin/social-links/reorder", { method: "PATCH", body: JSON.stringify({ orderedIds }) }),

  // Navigation
  createNavigation: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/navigation", { method: "POST", body: JSON.stringify(data) }),
  updateNavigation: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/navigation/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteNavigation: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/navigation/${encodeURIComponent(id)}`, { method: "DELETE" }),
  reorderNavigation: (orderedIds: string[]) =>
    apiFetch<ActionResponse>("/api/admin/navigation/reorder", { method: "PATCH", body: JSON.stringify({ orderedIds }) }),

  // Sections
  createSection: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/sections", { method: "POST", body: JSON.stringify(data) }),
  updateSection: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/sections/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  duplicateSection: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/sections/${encodeURIComponent(id)}/duplicate`, { method: "POST" }),
  deleteSection: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/sections/${encodeURIComponent(id)}`, { method: "DELETE" }),
  reorderSections: (orderedIds: string[]) =>
    apiFetch<ActionResponse>("/api/admin/sections/reorder", { method: "PATCH", body: JSON.stringify({ orderedIds }) }),
  toggleSectionStatus: (id: string, status: string) =>
    apiFetch<ActionResponse>(`/api/admin/sections/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Settings & Theme
  updateSiteSetting: (key: string, value: unknown) =>
    apiFetch<ActionResponse>("/api/admin/settings", { method: "PUT", body: JSON.stringify({ key, value }) }),
  setActiveTheme: (themeId: string) =>
    apiFetch<ActionResponse>("/api/admin/settings/theme", { method: "PUT", body: JSON.stringify({ themeId }) }),

  // Appearance / Design Studio
  saveDesignDraft: (designId: string, config: unknown) =>
    apiFetch<ActionResponse>("/api/admin/design/draft", { method: "PUT", body: JSON.stringify({ designId, config }) }),
  resetDesignDraft: (designId: string) =>
    apiFetch<ActionResponse>("/api/admin/design/draft/reset", { method: "POST", body: JSON.stringify({ designId }) }),
  selectDesignTheme: (designId: string) =>
    apiFetch<ActionResponse>("/api/admin/design/select", { method: "PUT", body: JSON.stringify({ designId }) }),
  publishDesignTheme: (designId: string) =>
    apiFetch<ActionResponse>("/api/admin/design/publish", { method: "POST", body: JSON.stringify({ designId }) }),
  rollbackDesignTheme: () =>
    apiFetch<ActionResponse>("/api/admin/design/rollback", { method: "POST" }),
  savePaletteTheme: (themeId: string, mode: string) =>
    apiFetch<ActionResponse>("/api/admin/design/palette", { method: "PUT", body: JSON.stringify({ themeId, mode }) }),
  setPalettePickerEnabled: (enabled: boolean) =>
    apiFetch<ActionResponse>("/api/admin/design/palette-picker", { method: "PUT", body: JSON.stringify({ enabled }) }),
  setDesignViewerToggle: (enabled: boolean) =>
    apiFetch<ActionResponse>("/api/admin/design/viewer-toggle", { method: "PUT", body: JSON.stringify({ enabled }) }),

  // SEO
  upsertSeoMetadata: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/seo", { method: "PUT", body: JSON.stringify(data) }),

  // Legal
  updateLegalDocument: (id: string, data: unknown) =>
    apiFetch<ActionResponse>(`/api/admin/legal/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLegalDocument: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/legal/${encodeURIComponent(id)}`, { method: "DELETE" }),

  // Media (presign + S3 PUT + register)
  presignMediaUpload: (data: { filename: string; contentType: string; size: number; folder?: string }) =>
    apiFetch<{ uploadUrl: string; publicUrl: string; key: string }>("/api/admin/media/presign", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createMediaAsset: (data: unknown) =>
    apiFetch<ActionResponse>("/api/admin/media", { method: "POST", body: JSON.stringify(data) }),
  deleteMediaAsset: (id: string) =>
    apiFetch<ActionResponse>(`/api/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
