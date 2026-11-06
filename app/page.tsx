import {
  getPublicProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
  getPublicCertifications,
  getPublicTestimonials,
  getPublicSocialLinks,
  getSiteSettings,
} from "@/lib/actions";

import { PortfolioClientWrapper } from "@/components/portfolio/portfolio-client-wrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ theme?: string }>;
}) {
  const [
    profile,
    projects,
    categoriesWithSkills,
    experiences,
    education,
    certifications,
    testimonials,
    socialLinks,
    settings,
  ] = await Promise.all([
    getPublicProfile(),
    getPublicProjects(),
    getPublicSkills(),
    getPublicExperience(),
    getPublicEducation(),
    getPublicCertifications(),
    getPublicTestimonials(),
    getPublicSocialLinks(),
    getSiteSettings(),
  ]);

  // Determine active theme from backend site_settings
  const themeSetting = settings?.find((s: any) => s.key === "portfolio_theme");
  let backendTheme: "cyberpunk" | "voldog" = "voldog";
  if (themeSetting?.value) {
    try {
      const val = typeof themeSetting.value === "string" ? JSON.parse(themeSetting.value) : themeSetting.value;
      if (val === "cyberpunk" || val === "voldog") {
        backendTheme = val;
      }
    } catch {}
  }

  // Handle URL override if provided
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialTheme =
    resolvedParams?.theme === "cyberpunk" || resolvedParams?.theme === "voldog"
      ? (resolvedParams.theme as "cyberpunk" | "voldog")
      : backendTheme;

  return (
    <PortfolioClientWrapper
      initialTheme={initialTheme}
      profile={profile}
      projects={projects}
      categoriesWithSkills={categoriesWithSkills}
      experiences={experiences}
      education={education}
      certifications={certifications}
      testimonials={testimonials}
      socialLinks={socialLinks}
    />
  );
}
