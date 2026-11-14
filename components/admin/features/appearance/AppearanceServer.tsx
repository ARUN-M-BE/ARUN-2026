import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { getDesignState, designStatus } from "@/lib/design-settings";
import { getThemePreferences, getContrastAudit } from "@/lib/theme";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { DESIGNS, PUBLIC_VIEW_IDS, designToCssVars } from "@/config/designs";
import { isDesignImplemented } from "@/themes/registry";
import { AppearanceClient, type AppearanceDesign } from "./AppearanceClient";

export default async function AppearanceServer() {
  await requireAdmin();

  const [state, preferences, content] = await Promise.all([
    getDesignState(),
    getThemePreferences(),
    getPortfolioContent(),
  ]);

  const designs: AppearanceDesign[] = PUBLIC_VIEW_IDS.map((id) => {
    const design = DESIGNS.find((item) => item.id === id) ?? DESIGNS[0];
    return {
      id: design.id,
      name: design.name,
      tagline: design.tagline,
      description: design.description,
      version: design.version,
      features: design.features,
      traits: design.traits as unknown as Record<string, string>,
      swatches: design.swatches,
      implemented: isDesignImplemented(design.id),
      status: designStatus(state, design.id),
      vars: designToCssVars(state.configs[design.id]),
    };
  });

  const contentSummary = [
    { label: "Projects", count: content.projects.length },
    { label: "Skills", count: content.skillCategories.reduce((sum, item) => sum + (item.skills?.length ?? 0), 0) },
    { label: "Roles", count: content.experiences.length },
    { label: "Education", count: content.education.length },
    { label: "Certifications", count: content.certifications.length },
    { label: "Services", count: content.services.length },
    { label: "Testimonials", count: content.testimonials.length },
    { label: "Social links", count: content.socialLinks.length },
  ];

  const previousDesign = state.previous
    ? DESIGNS.find((design) => design.id === state.previous)?.name ?? state.previous
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appearance & Page Views"
        description="Pick the layout and palette the public portfolio renders. Selecting is never publishing, previews never save, and the previous view is always kept for rollback."
      />
      <AppearanceClient
        designs={designs}
        publishedId={state.published}
        selectedId={state.selected}
        canRollback={state.canRollback}
        previousName={previousDesign}
        paletteId={preferences.theme.id}
        paletteMode={preferences.theme.mode}
        pickerEnabled={preferences.pickerEnabled}
        viewerToggle={state.viewerToggle}
        contrast={getContrastAudit(preferences.theme)}
        contentSummary={contentSummary}
      />
    </div>
  );
}
