import { cache } from "react";
import { getPublic } from "@/lib/api/public";
import {
  fallbackCertifications,
  fallbackEducation,
  fallbackExperiences,
  fallbackNavigation,
  fallbackProfile,
  fallbackProjects,
  fallbackSkillCategories,
  fallbackSocialLinks,
  fallbackTestimonials,
  fallbackWebsiteSections,
} from "@/lib/fallback-data";
import type { PortfolioContent } from "@/themes/types";
import type {
  Certification,
  Education,
  Experience,
  NavigationItem,
  Profile,
  Project,
  ServiceOffering,
  Skill,
  SkillCategory,
  SocialLink,
  Testimonial,
  WebsiteSection,
} from "@/types";

type SkillCategoryWithSkills = SkillCategory & { skills: Skill[] };

function mergeSkillCategories(
  categories: SkillCategory[] | undefined,
  skills: Skill[] | undefined
): SkillCategoryWithSkills[] {
  if (!categories || categories.length === 0) return fallbackSkillCategories;
  const list = skills ?? [];
  return categories.map((cat) => ({
    ...cat,
    skills:
      "skills" in cat && Array.isArray((cat as SkillCategoryWithSkills).skills)
        ? (cat as SkillCategoryWithSkills).skills
        : list.filter((s) => s.categoryId === cat.id),
  }));
}

/**
 * The one content payload shared by every design and by the admin preview
 * frames. Cached per request so a page + its metadata only query once.
 */
export const getPortfolioContent = cache(async (): Promise<PortfolioContent> => {
  const [
    bootstrap,
    profileRes,
    projectsRes,
    skillsRes,
    experienceRes,
    educationRes,
    certificationsRes,
    servicesRes,
    testimonialsRes,
    socialRes,
  ] = await Promise.all([
    getPublic<{
      navigation?: NavigationItem[];
      sections?: WebsiteSection[];
    }>("/api/public/bootstrap", {}, { revalidate: 60, tags: ["navigation", "sections", "settings"] }),
    getPublic<{ profile?: Profile | null }>("/api/public/profile", {}, { revalidate: 60, tags: ["profile"] }),
    getPublic<{ projects?: Project[] }>("/api/public/projects", {}, { revalidate: 60, tags: ["projects"] }),
    getPublic<{ categories?: SkillCategory[]; skills?: Skill[] }>("/api/public/skills", {}, { revalidate: 60, tags: ["skills"] }),
    getPublic<{ experience?: Experience[] }>("/api/public/experience", {}, { revalidate: 60, tags: ["experience"] }),
    getPublic<{ education?: Education[] }>("/api/public/education", {}, { revalidate: 60, tags: ["education"] }),
    getPublic<{ certifications?: Certification[] }>("/api/public/certifications", {}, { revalidate: 60, tags: ["certifications"] }),
    getPublic<{ services?: ServiceOffering[] }>("/api/public/services", {}, { revalidate: 60, tags: ["services"] }),
    getPublic<{ testimonials?: Testimonial[] }>("/api/public/testimonials", {}, { revalidate: 60, tags: ["testimonials"] }),
    getPublic<{ socialLinks?: SocialLink[] }>("/api/public/social-links", {}, { revalidate: 60, tags: ["social"] }),
  ]);

  return {
    profile: profileRes.profile ?? fallbackProfile,
    projects: projectsRes.projects ?? fallbackProjects,
    skillCategories: mergeSkillCategories(skillsRes.categories, skillsRes.skills),
    experiences: experienceRes.experience ?? fallbackExperiences,
    education: educationRes.education ?? fallbackEducation,
    certifications: certificationsRes.certifications ?? fallbackCertifications,
    services: servicesRes.services ?? [],
    testimonials: testimonialsRes.testimonials ?? fallbackTestimonials,
    socialLinks: socialRes.socialLinks ?? fallbackSocialLinks,
    navigation: bootstrap.navigation ?? fallbackNavigation,
    sections: bootstrap.sections ?? fallbackWebsiteSections,
  };
});
