import type { JSX } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Reusable skeleton primitives modelled on the MUI skeleton API
 * (text / circular / rectangular / rounded) but expressed with the
 * project's own `Skeleton` token so every loading state inherits the
 * Midnight Aurora palette automatically.
 */

interface SkeletonTextProps {
  /** Number of stacked lines. */
  lines?: number;
  className?: string;
  /** Width of the trailing line, so paragraphs taper naturally. */
  lastLineWidth?: string;
}

/** Paragraph placeholder that mirrors real line-height rhythm. */
export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = "62%",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3 rounded-full",
            index === lines - 1 ? "" : "w-full"
          )}
          style={index === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

interface SectionHeaderSkeletonProps {
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow badge + title + subtitle placeholder shared by every portfolio section. */
export function SectionHeaderSkeleton({
  align = "center",
  className,
}: SectionHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="h-7 w-44 rounded-full" />
      <Skeleton className="h-9 w-full max-w-md rounded-2xl sm:h-11" />
      <SkeletonText lines={2} lastLineWidth="80%" className="mx-auto max-w-xl" />
    </div>
  );
}

/** Hero: headline, tagline, CTA cluster, stat row and the 3D sculpture frame. */
export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-8 w-64 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-3/4 rounded-2xl" />
            <Skeleton className="h-8 w-2/3 rounded-2xl" />
          </div>
          <SkeletonText lines={3} className="max-w-xl" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[340px] w-full rounded-3xl sm:h-[440px] lg:h-[520px]" />
        </div>
      </div>
    </section>
  );
}

/** About: narrative column + tech stack chip grid. */
export function AboutSkeleton() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <SkeletonText lines={4} />
            <SkeletonText lines={3} lastLineWidth="48%" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-10 w-40 rounded-xl" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-7 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-40 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  columnsClassName?: string;
  cardClassName?: string;
}

/** Generic responsive card grid used by projects, testimonials and credential lists. */
export function CardGridSkeleton({
  count = 6,
  columnsClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  cardClassName = "h-72 rounded-3xl",
}: CardGridSkeletonProps) {
  return (
    <div className={cn("grid gap-6", columnsClassName)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cardClassName} />
      ))}
    </div>
  );
}

/** Projects: filter controls + thumbnail card grid. */
export function ProjectsSkeleton() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <CardGridSkeleton count={6} cardClassName="h-80 rounded-3xl" />
      </div>
    </section>
  );
}

/** Skills: cluster filter chips, proficiency slider and cluster panels. */
export function SkillsSkeleton() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-5 rounded-3xl border border-border p-6 sm:p-7"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
              {Array.from({ length: 4 }).map((__, row) => (
                <div key={row} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24 rounded-full" />
                    <Skeleton className="h-3 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineSkeletonProps {
  items?: number;
}

/** Experience + education timelines (node marker, meta row, description lines). */
export function TimelineSkeleton({ items = 3 }: TimelineSkeletonProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="mt-14 space-y-10 border-l-2 border-border pl-6 sm:pl-8">
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="relative space-y-4 rounded-3xl border border-border p-6 sm:p-8">
              <Skeleton className="absolute -left-[25px] top-6 size-8 rounded-full" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Skeleton className="h-5 w-52 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40 rounded-full" />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Telemetry: metric cards, waveform plot and edge-node list. */
export function TelemetrySkeleton() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <SectionHeaderSkeleton />
      <div className="mt-14 space-y-8 rounded-3xl border border-border p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

/** Contact: direct-info column + form field stack. */
export function ContactSkeleton() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="space-y-6 lg:col-span-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-10 w-4/5 rounded-2xl" />
          <SkeletonText lines={2} />
          <div className="space-y-3 border-t border-border pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-11 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-border p-6 sm:p-10 lg:col-span-7" aria-hidden="true">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-11 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}

/** Footer: brand block, legal link row and attribution strip. */
export function FooterSkeleton() {
  return (
    <footer className="border-t border-border pb-8 pt-12 sm:pt-16" aria-hidden="true">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
            <SkeletonText lines={2} className="max-w-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-28 rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-24 rounded-2xl" />
        <div className="flex flex-col justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <Skeleton className="h-3 w-48 rounded-full" />
          <Skeleton className="h-3 w-56 rounded-full" />
        </div>
      </div>
    </footer>
  );
}

interface PageSkeletonProps {
  /** Section keys to render a placeholder for, in display order. */
  sections?: string[];
}

const SECTION_SKELETONS: Record<string, () => JSX.Element> = {
  hero: HeroSkeleton,
  about: AboutSkeleton,
  projects: ProjectsSkeleton,
  skills: SkillsSkeleton,
  telemetry: TelemetrySkeleton,
  experience: () => <TimelineSkeleton items={3} />,
  education: () => <TimelineSkeleton items={2} />,
  testimonials: () => (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <CardGridSkeleton count={3} cardClassName="h-64 rounded-3xl" />
      </div>
    </section>
  ),
  contact: ContactSkeleton,
};

/** Composes the section placeholders used by the route-level `loading.tsx`. */
export function PageSkeleton({
  sections = ["hero", "about", "projects", "skills", "telemetry"],
}: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {sections.map((key) => {
        const SectionSkeleton = SECTION_SKELETONS[key];
        return SectionSkeleton ? <SectionSkeleton key={key} /> : null;
      })}
    </div>
  );
}
