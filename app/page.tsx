import {
  getPublicProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
  getPublicCertifications,
  getPublicTestimonials,
  getPublicSocialLinks,
  getPublicNavigation,
  getPublicSections,
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    navigation,
    sections,
  ] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicSkills(),
    getPublicExperience(),
    getPublicEducation(),
    getPublicCertifications(),
    getPublicTestimonials(),
    getPublicSocialLinks(),
    getPublicNavigation(),
    getPublicSections(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary transition-colors duration-300 overflow-x-hidden">
      {/* Ambient Interactive Cursor Glow */}
      <MouseGlow />

      {/* Global Fixed Floating Glass Navbar */}
      <PortfolioNavbar navigation={navigation} socialLinks={socialLinks} />

      {/* Main Sections — Dynamically Rendered by Sort Order and Published Status */}
      <main className="relative z-10 space-y-8">
        {sections.map((section) => {
          switch (section.sectionKey) {
            case "hero":
              return <HeroSection key={section.id} profile={profile as any} />;
            case "about":
              return <AboutSection key={section.id} profile={profile as any} />;
            case "projects":
              return <ProjectsSection key={section.id} projects={projects as any} />;
            case "skills":
              return <SkillsSection key={section.id} categoriesWithSkills={categoriesWithSkills} />;
            case "telemetry":
              return <RealtimeTelemetry key={section.id} />;
            case "experience":
              return <ExperienceSection key={section.id} experiences={experiences} />;
            case "education":
              return (
                <EducationSection
                  key={section.id}
                  education={education}
                  certifications={certifications}
                />
              );
            case "testimonials":
              return <TestimonialsSection key={section.id} testimonials={testimonials} />;
            case "contact":
              return (
                <ContactSection
                  key={section.id}
                  profile={profile as any}
                  socialLinks={socialLinks as any}
                />
              );
            default:
              return (
                <section
                  key={section.id}
                  id={section.sectionKey}
                  className="py-16 sm:py-20 relative overflow-hidden"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-3 mb-8">
                      {section.badge && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-600 dark:text-sky-400">
                          <span>{section.badge}</span>
                        </div>
                      )}
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                        {section.title}
                      </h2>
                      {section.subtitle && (
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    {section.content && (
                      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    )}
                  </div>
                </section>
              );
          }
        })}
      </main>

      {/* Footer & Compliance Notice with Social Links Placement */}
      <PortfolioFooter socialLinks={socialLinks} />

      {/* DPDP Act 2023 Compliant Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
