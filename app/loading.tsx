import { FooterSkeleton, PageSkeleton } from "@/components/skeletons";

/**
 * Route-level loading UI for the portfolio shell.
 * Section placeholders are shared with any future Suspense boundary,
 * so the loading shape always matches the rendered layout.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageSkeleton sections={["hero", "about", "projects", "skills", "telemetry"]} />
      <FooterSkeleton />
    </div>
  );
}
