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
import type { DesignConfig, DesignId } from "@/config/designs";
import type { ColorMode } from "@/config/themes";

/**
 * The single content payload every design receives. Designs never query the
 * database themselves — they render exactly what the CMS publishes.
 */
export interface PortfolioContent {
  profile: Profile | null;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  services: ServiceOffering[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
  sections: WebsiteSection[];
}

export interface DesignProps {
  content: PortfolioContent;
  config: DesignConfig;
  /** Resolved palette mode for this request (SSR, so no flash). */
  mode?: ColorMode;
  /** True while rendering inside the admin preview frame. */
  preview?: boolean;
}

export interface DesignComponent {
  (props: DesignProps): React.ReactElement | null;
}

/** Achievements are authored inside experience entries; flatten them for display. */
export interface AchievementEntry {
  id: string;
  title: string;
  detail: string;
  source: string;
}

export interface DesignMeta {
  id: DesignId;
  supportsWebGL: boolean;
}
