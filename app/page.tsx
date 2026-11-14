import { createElement } from "react";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { getActiveTheme } from "@/lib/theme";
import { parseViewParam, resolvePageView } from "@/lib/page-view";
import { getDesignComponent } from "@/themes/registry";
import { ViewSwitcher } from "@/components/portfolio/view-switcher";
import { SplashCursorLayer } from "@/components/effects/splash-cursor-layer";

/**
 * Public homepage.
 *
 * The design that renders is decided on the server from `design.published`
 * (written only by an explicit Publish action), or from `?view=<id>` for a
 * one-off preview that writes nothing. Every design receives the exact same
 * CMS payload — no design owns its own content.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const [content, view, theme] = await Promise.all([
    getPortfolioContent(),
    resolvePageView(parseViewParam(params.view)),
    getActiveTheme(),
  ]);

  const Design = getDesignComponent(view.id);

  return (
    <>
      {/* createElement keeps the resolved design out of the JSX component
          namespace, so React never treats it as a component created in render. */}
      {createElement(Design, {
        content,
        config: view.config,
        mode: theme.mode,
        preview: view.preview,
      })}
      {/* Ink trail above the content, below the navbar and any dialog. */}
      <SplashCursorLayer />
      {view.viewerToggle && !view.preview && <ViewSwitcher current={view.id} />}
    </>
  );
}
