"use client";

import { VoldogNavbar } from "./voldog-navbar";
import { VoldogHero } from "./voldog-hero";
import { VoldogFinder } from "./voldog-finder";
import { VoldogProjects } from "./voldog-projects";
import { VoldogRibbon } from "./voldog-ribbon";
import { VoldogSkills } from "./voldog-skills";
import { VoldogBenefits } from "./voldog-benefits";
import { VoldogExperience } from "./voldog-experience";
import { VoldogTestimonials } from "./voldog-testimonials";
import { VoldogFaq } from "./voldog-faq";
import { VoldogCta } from "./voldog-cta";
import { VoldogFooter } from "./voldog-footer";
import { CookieConsent } from "@/components/portfolio/cookie-consent";
import type {
  Profile,
  Project,
  SkillCategoryWithSkills,
  Experience,
  Education,
  Certification,
  Testimonial,
  SocialLink,
} from "@/types";

interface VoldogLayoutProps {
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

export function VoldogLayout({
  profile,
  projects = [],
  categoriesWithSkills = [],
  experiences = [],
  education: _education = [],
  certifications: _certifications = [],
  testimonials = [],
  socialLinks = [],
  onSwitchTheme,
}: VoldogLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#204e4a] font-voldog selection:bg-[#e1e53f] selection:text-[#204e4a] overflow-x-hidden">
      {/* Centered Wordmark Nav Bar */}
      <VoldogNavbar onSwitchTheme={onSwitchTheme} />

      {/* Main Sections */}
      <main className="space-y-4">
        {/* Framed Hero Panel with 35px Paper Border & 88px Radius */}
        <VoldogHero profile={profile} />

        {/* Full-width Architecture Stack Finder Bar */}
        <VoldogFinder />

        {/* Tall Cloud Gray Product/Project Cards */}
        <VoldogProjects projects={projects} />

        {/* Signature Lime Zest Text Ribbon Band over Oat Canvas */}
        <VoldogRibbon />

        {/* Specialized Tools & Domain Toggle Tabs */}
        <VoldogSkills categoriesWithSkills={categoriesWithSkills} />

        {/* B.A.R.F Engineering Standards (Benefit Callout Cards) */}
        <VoldogBenefits />

        {/* Career Timeline */}
        <VoldogExperience experiences={experiences} />

        {/* Google Review Customer Feedback Cards */}
        <VoldogTestimonials testimonials={testimonials} />

        {/* FAQ Accordion Rows with Cloud Gray Discs */}
        <VoldogFaq />

        {/* Arched Photo CTA Block with Butcher Fade Overlay */}
        <VoldogCta profile={profile} socialLinks={socialLinks} />
      </main>

      {/* Butcher Green Site Footer */}
      <VoldogFooter />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

