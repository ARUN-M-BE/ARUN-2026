"use client";

import { adminApi } from "@/lib/api/admin";
import type {
  NavigationFormData,
  SectionFormData,
  SeoMetadataFormData,
  SocialLinkFormData,
} from "@/lib/validations";
import type { MessageStatus, NavigationItem, SocialLink, WebsiteSection } from "@/types";

export const updateProfile = (data: unknown) => adminApi.updateProfile(data);

export const createProject = (data: unknown) => adminApi.createProject(data);
export const updateProject = (id: string, data: unknown) => adminApi.updateProject(id, data);
export const deleteProject = (id: string) => adminApi.deleteProject(id);

export const createSkillCategory = (data: unknown) => adminApi.createSkillCategory(data);
export const updateSkillCategory = (id: string, data: unknown) =>
  adminApi.updateSkillCategory(id, data);
export const deleteSkillCategory = (id: string) => adminApi.deleteSkillCategory(id);
export const createSkill = (data: unknown) => adminApi.createSkill(data);
export const updateSkill = (id: string, data: unknown) => adminApi.updateSkill(id, data);
export const deleteSkill = (id: string) => adminApi.deleteSkill(id);

export const createExperience = (data: unknown) => adminApi.createExperience(data);
export const updateExperience = (id: string, data: unknown) =>
  adminApi.updateExperience(id, data);
export const deleteExperience = (id: string) => adminApi.deleteExperience(id);

export const createEducation = (data: unknown) => adminApi.createEducation(data);
export const updateEducation = (id: string, data: unknown) => adminApi.updateEducation(id, data);
export const deleteEducation = (id: string) => adminApi.deleteEducation(id);

export const createCertification = (data: unknown) => adminApi.createCertification(data);
export const updateCertification = (id: string, data: unknown) =>
  adminApi.updateCertification(id, data);
export const deleteCertification = (id: string) => adminApi.deleteCertification(id);

export const createService = (data: unknown) => adminApi.createService(data);
export const updateService = (id: string, data: unknown) => adminApi.updateService(id, data);
export const deleteService = (id: string) => adminApi.deleteService(id);

export const createTestimonial = (data: unknown) => adminApi.createTestimonial(data);
export const updateTestimonial = (id: string, data: unknown) =>
  adminApi.updateTestimonial(id, data);
export const deleteTestimonial = (id: string) => adminApi.deleteTestimonial(id);

export const updateMessageStatus = (id: string, status: MessageStatus) =>
  adminApi.updateMessageStatus(id, status);
export const deleteMessage = (id: string) => adminApi.deleteMessage(id);

export const createSocialLink = (
  data: SocialLinkFormData
): Promise<{ success: boolean; data?: SocialLink; error?: string }> =>
  adminApi.createSocialLink(data) as Promise<{
    success: boolean;
    data?: SocialLink;
    error?: string;
  }>;
export const updateSocialLink = (
  id: string,
  data: Partial<SocialLinkFormData>
): Promise<{ success: boolean; data?: SocialLink; error?: string }> =>
  adminApi.updateSocialLink(id, data) as Promise<{
    success: boolean;
    data?: SocialLink;
    error?: string;
  }>;
export const deleteSocialLink = (id: string) => adminApi.deleteSocialLink(id);
export const reorderSocialLinks = (orderedIds: string[]) =>
  adminApi.reorderSocialLinks(orderedIds);

export const createNavigation = (
  data: NavigationFormData
): Promise<{ success: boolean; data?: NavigationItem; error?: string }> =>
  adminApi.createNavigation(data) as Promise<{
    success: boolean;
    data?: NavigationItem;
    error?: string;
  }>;
export const updateNavigation = (
  id: string,
  data: Partial<NavigationFormData>
): Promise<{ success: boolean; data?: NavigationItem; error?: string }> =>
  adminApi.updateNavigation(id, data) as Promise<{
    success: boolean;
    data?: NavigationItem;
    error?: string;
  }>;
export const deleteNavigation = (id: string) => adminApi.deleteNavigation(id);
export const reorderNavigation = (orderedIds: string[]) =>
  adminApi.reorderNavigation(orderedIds);

export const createSection = (
  data: SectionFormData
): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> =>
  adminApi.createSection(data) as Promise<{
    success: boolean;
    data?: WebsiteSection;
    error?: string;
  }>;
export const updateSection = (
  id: string,
  data: Partial<SectionFormData>
): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> =>
  adminApi.updateSection(id, data) as Promise<{
    success: boolean;
    data?: WebsiteSection;
    error?: string;
  }>;
export const duplicateSection = (
  id: string
): Promise<{ success: boolean; data?: WebsiteSection; error?: string }> =>
  adminApi.duplicateSection(id) as Promise<{
    success: boolean;
    data?: WebsiteSection;
    error?: string;
  }>;
export const deleteSection = (id: string) => adminApi.deleteSection(id);
export const reorderSections = (orderedIds: string[]) => adminApi.reorderSections(orderedIds);
export const toggleSectionStatus = (
  id: string,
  status: "draft" | "published" | "unpublished"
) => adminApi.toggleSectionStatus(id, status);

export const updateSiteSetting = (key: string, value: unknown) =>
  adminApi.updateSiteSetting(key, value);
export const setActiveTheme = (themeId: string) => adminApi.setActiveTheme(themeId);

export const upsertSeoMetadata = (data: SeoMetadataFormData) =>
  adminApi.upsertSeoMetadata(data);

export const updateLegalDocument = (id: string, data: unknown) =>
  adminApi.updateLegalDocument(id, data);
export const deleteLegalDocument = (id: string) => adminApi.deleteLegalDocument(id);
