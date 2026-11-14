import { cache } from "react";
import {
  getPublicCertifications,
  getPublicEducation,
  getPublicExperience,
  getPublicNavigation,
  getPublicProfile,
  getPublicProjects,
  getPublicSections,
  getPublicServices,
  getPublicSkills,
  getPublicSocialLinks,
  getPublicTestimonials,
} from "@/lib/actions";
import type { PortfolioContent } from "@/themes/types";
import type {
  Certification,
  Education,
  Experience,
  NavigationItem,
  Profile,
  Project,
  ServiceOffering,
  SkillCategory,
  SocialLink,
  Testimonial,
  WebsiteSection,
} from "@/types";

function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch((error) => {
    console.warn("[portfolio-content] query failed, using empty fallback:", error);
    return fallback;
  });
}

/**
 * The one content payload shared by every design and by the admin preview
 * frames. Cached per request so a page + its metadata only query once.
 */
export const getPortfolioContent = cache(async (): Promise<PortfolioContent> => {
  const [
    profile,
    projects,
    skillCategories,
    experiences,
    education,
    certifications,
    services,
    testimonials,
    socialLinks,
    navigation,
    sections,
  ] = await Promise.all([
    safe(getPublicProfile() as Promise<Profile | null>, null),
    safe(getPublicProjects() as Promise<Project[]>, []),
    safe(getPublicSkills() as Promise<SkillCategory[]>, []),
    safe(getPublicExperience() as Promise<Experience[]>, []),
    safe(getPublicEducation() as Promise<Education[]>, []),
    safe(getPublicCertifications() as Promise<Certification[]>, []),
    safe(getPublicServices() as Promise<ServiceOffering[]>, []),
    safe(getPublicTestimonials() as Promise<Testimonial[]>, []),
    safe(getPublicSocialLinks() as Promise<SocialLink[]>, []),
    safe(getPublicNavigation() as Promise<NavigationItem[]>, []),
    safe(getPublicSections() as Promise<WebsiteSection[]>, []),
  ]);

  return {
    profile,
    projects,
    skillCategories,
    experiences,
    education,
    certifications,
    services,
    testimonials,
    socialLinks,
    navigation,
    sections,
  };
});
