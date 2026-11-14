import type { CSSProperties } from "react";
import { FONT_STACKS } from "@/config/designs";
import { resolveHomepageSections } from "@/lib/homepage-sections";
import type { DesignProps } from "@/themes/types";

import { PortfolioNavbar } from "@/components/portfolio/navbar";
import { MouseGlow } from "@/components/portfolio/mouse-glow";
import { Reveal } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { HeroSection } from "@/components/portfolio/hero-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ServicesSection } from "@/components/portfolio/services-section";
import { RealtimeTelemetry } from "@/components/portfolio/realtime-telemetry";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { PortfolioFooter } from "@/components/portfolio/footer";
import { CookieConsent } from "@/components/portfolio/cookie-consent";

/**
 * Design 01 — the original portfolio.
 *
 * This is the previous `app/page.tsx` body, moved verbatim. Markup, section
 * order and behaviour are unchanged; the only addition is a wrapper that lets
 * the appearance studio re-tint the existing global tokens.
 */
export function CurrentDesign({ content, config, mode = "dark" }: DesignProps) {
  const {
    profile,
    projects,
    skillCategories,
    experiences,
    education,
    certifications,
    testimonials,
    socialLinks,
    navigation,
    services,
  } = content;

  const sections = resolveHomepageSections(content.sections);

  // SkillsSection requires a concrete array; the shared payload allows null.
  const categoriesWithSkills = skillCategories.map((category) => ({
    ...category,
    skills: category.skills ?? [],
  }));

  // Dark is the shipped look: the design config re-tints the global tokens.
  // In light mode those tokens already come from the SSR palette, so the design
  // must stop overriding them or the page would stay dark.
  const appearance =
    mode === "light"
      ? ({ fontFamily: FONT_STACKS[config.fontFamily] } as CSSProperties)
      : ({
          "--primary": config.accent,
          "--ring": config.accent,
          "--accent": config.accentSecondary,
          "--background": config.background,
          fontFamily: FONT_STACKS[config.fontFamily],
        } as CSSProperties);

  return (
    <div
      style={appearance}
      className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary transition-colors duration-300 overflow-x-hidden"
    >
      {/* Ambient Interactive Cursor Glow */}
      <MouseGlow />
      <ScrollProgress />

      {/* Global Fixed Floating Glass Navbar */}
      <PortfolioNavbar navigation={navigation} socialLinks={socialLinks} />

      {/* Main Sections — Dynamically Rendered by Sort Order and Published Status */}
      <main className="relative z-10 space-y-8">
        {sections.map((section) => {
          switch (section.sectionKey) {
            case "hero":
              return (
                // `eager` keeps the hero painted from the first frame so it becomes
                // the LCP element instead of a late, smaller overlay.
                <Reveal key={section.id} amount={0.05} eager>
                  <HeroSection profile={profile} />
                </Reveal>
              );
            case "about":
              return (
                <Reveal key={section.id}>
                  <AboutSection profile={profile} />
                </Reveal>
              );
            case "projects":
              return (
                <Reveal key={section.id}>
                  <ProjectsSection projects={projects} />
                </Reveal>
              );
            case "skills":
              return (
                <Reveal key={section.id}>
                  <SkillsSection categoriesWithSkills={categoriesWithSkills} />
                </Reveal>
              );
            case "services":
              return (
                <Reveal key={section.id} amount={0.08}>
                  <ServicesSection services={services} />
                </Reveal>
              );
            case "telemetry":
              return (
                <Reveal key={section.id}>
                  <RealtimeTelemetry />
                </Reveal>
              );
            case "experience":
              return (
                <Reveal key={section.id}>
                  <ExperienceSection experiences={experiences} />
                </Reveal>
              );
            case "education":
              return (
                <Reveal key={section.id}>
                  <EducationSection education={education} certifications={certifications} />
                </Reveal>
              );
            case "testimonials":
              return (
                <Reveal key={section.id}>
                  <TestimonialsSection testimonials={testimonials} />
                </Reveal>
              );
            case "contact":
              return (
                <Reveal key={section.id}>
                  <ContactSection profile={profile} socialLinks={socialLinks} />
                </Reveal>
              );
            default:
              return (
                <Reveal key={section.id}>
                  <section id={section.sectionKey} className="py-16 sm:py-20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="space-y-3 mb-8">
                        {section.badge && (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-mono text-primary">
                            <span>{section.badge}</span>
                          </div>
                        )}
                        <h2 className="font-display text-balance text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
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
                </Reveal>
              );
          }
        })}
      </main>

      {/* Footer & Compliance Notice with Social Links Placement */}
      <Reveal amount={0.05}>
        <PortfolioFooter socialLinks={socialLinks} />
      </Reveal>

      {/* DPDP Act 2023 Compliant Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default CurrentDesign;
