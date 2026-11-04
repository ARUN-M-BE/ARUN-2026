import {
  getPublicProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
  getPublicCertifications,
  getPublicTestimonials,
  getPublicSocialLinks,
} from "@/lib/actions";

import { PortfolioNavbar } from "@/components/portfolio/navbar";
import { MouseGlow } from "@/components/portfolio/mouse-glow";
import { HeroSection } from "@/components/portfolio/hero-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { RealtimeTelemetry } from "@/components/portfolio/realtime-telemetry";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { PortfolioFooter } from "@/components/portfolio/footer";
import { CookieConsent } from "@/components/portfolio/cookie-consent";

export const revalidate = 60; // Cache and revalidate public content

export default async function HomePage() {
  const [
    profile,
    projects,
    categoriesWithSkills,
    experiences,
    education,
    certifications,
    testimonials,
    socialLinks,
  ] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicSkills(),
    getPublicExperience(),
    getPublicEducation(),
    getPublicCertifications(),
    getPublicTestimonials(),
    getPublicSocialLinks(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary transition-colors duration-300 overflow-x-hidden">
      {/* Ambient Interactive Cursor Glow */}
      <MouseGlow />

      {/* Global Fixed Floating Glass Navbar */}
      <PortfolioNavbar />

      {/* Main Sections */}
      <main className="relative z-10 space-y-8">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <SkillsSection categoriesWithSkills={categoriesWithSkills} />
        <RealtimeTelemetry />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} certifications={certifications} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>

      {/* Footer & Compliance Notice */}
      <PortfolioFooter />

      {/* DPDP Act 2023 Compliant Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
