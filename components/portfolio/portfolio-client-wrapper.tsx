"use client";

import { useState, useEffect } from "react";
import { VoldogLayout } from "@/components/portfolio-voldog/voldog-layout";
import { CyberpunkLayout } from "@/components/portfolio/cyberpunk-layout";
import { ThemeSwitchPill } from "@/components/portfolio-voldog/theme-switch-pill";
import type {
  PortfolioTheme,
  Profile,
  Project,
  SkillCategoryWithSkills,
  Experience,
  Education,
  Certification,
  Testimonial,
  SocialLink,
} from "@/types";

interface PortfolioClientWrapperProps {
  initialTheme?: PortfolioTheme;
  profile?: Profile | null;
  projects?: Project[];
  categoriesWithSkills?: SkillCategoryWithSkills[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  testimonials?: Testimonial[];
  socialLinks?: SocialLink[];
}

export function PortfolioClientWrapper({
  initialTheme = "voldog",
  profile,
  projects = [],
  categoriesWithSkills = [],
  experiences = [],
  education = [],
  certifications = [],
  testimonials = [],
  socialLinks = [],
}: PortfolioClientWrapperProps) {
  const [theme, setTheme] = useState<"cyberpunk" | "voldog">(initialTheme);

  // Sync with URL query or localStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme === "voldog" || urlTheme === "cyberpunk") {
        setTheme(urlTheme);
        return;
      }

      const stored = localStorage.getItem("preferred_portfolio_theme");
      if (stored === "voldog" || stored === "cyberpunk") {
        setTheme(stored);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === "voldog" ? "cyberpunk" : "voldog";
    setTheme(next);
    try {
      localStorage.setItem("preferred_portfolio_theme", next);
    } catch {}
  };

  const sharedProps = {
    profile,
    projects,
    categoriesWithSkills,
    experiences,
    education,
    certifications,
    testimonials,
    socialLinks,
    onSwitchTheme: handleToggleTheme,
  };

  return (
    <>
      {theme === "voldog" ? (
        <VoldogLayout {...sharedProps} />
      ) : (
        <CyberpunkLayout {...sharedProps} />
      )}

      {/* Floating Theme Switcher Pill */}
      <ThemeSwitchPill currentTheme={theme} onToggle={handleToggleTheme} />
    </>
  );
}

