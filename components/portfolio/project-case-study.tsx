"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Code2,
  ExternalLink,
  FolderGit2,
  Images,
  Layers,
  Maximize2,
  MousePointer2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { UniverseSwitcher } from "@/components/theme/theme-studio";
import type { Project } from "@/types";

interface ProjectCaseStudyProps {
  project: Project;
  previous: Pick<Project, "slug" | "title"> | null;
  next: Pick<Project, "slug" | "title"> | null;
}

function formatRange(start?: Date | string | null, end?: Date | string | null) {
  const fmt = (value?: Date | string | null) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
  };
  const from = fmt(start);
  const to = fmt(end) ?? "Present";
  if (!from) return to;
  return `${from} — ${to}`;
}

export function ProjectCaseStudy({ project, previous, next }: ProjectCaseStudyProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const frames = useMemo(() => {
    const list = [
      project.thumbnail,
      project.thumbnailUrl,
      ...(project.images ?? []),
      ...(project.galleryImages ?? []),
    ].filter((src): src is string => typeof src === "string" && src.length > 0);
    return Array.from(new Set(list));
  }, [project]);

  const tech = useMemo(
    () => ((project.techStack as string[] | null) ?? []).filter(Boolean),
    [project.techStack]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsZoomed(false);
      if (frames.length < 2) return;
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % frames.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + frames.length) % frames.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [frames.length]);

  const activeFrame = frames[activeIndex];
  const timeline = formatRange(project.startDate, project.endDate);

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient environment */}
      <div className="pointer-events-none fixed inset-0 grid-etch opacity-30" aria-hidden />
      <div
        className="pointer-events-none fixed left-1/2 top-[-10rem] h-[32rem] w-[60rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ backgroundColor: "var(--mesh-1)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-[-16rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full blur-[150px]"
        style={{ backgroundColor: "var(--mesh-2)" }}
        aria-hidden
      />

      {/* Contextual top bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              case study / {project.slug}
            </span>
            <UniverseSwitcher compact />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        {/* Hero */}
        <motion.div {...fade} className="grid items-start gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary"
              >
                <FolderGit2 className="h-3 w-3" />
                {project.category || "Case Study"}
              </Badge>
              {project.isFeatured && (
                <Badge
                  variant="outline"
                  className="h-auto gap-1 rounded-full border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent"
                >
                  <Sparkles className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {timeline && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {timeline}
                </span>
              )}
            </div>

            <h1 className="font-display text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {project.shortDescription ||
                project.description ||
                "An engineering case study from the portfolio."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <Button
                  asChild
                  className="h-11 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit live product
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-border bg-card/70 px-5 text-xs font-semibold text-foreground hover:border-primary/40"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Code2 className="mr-1.5 h-3.5 w-3.5" />
                    Source
                  </a>
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className="h-11 rounded-full px-4 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <a href="#build">Read the build</a>
              </Button>
            </div>

            <dl className="grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
              {[
                { label: "Client", value: project.client || "Independent", icon: UserRound },
                { label: "Domain", value: project.category || "Full-stack", icon: Layers },
                { label: "Stack", value: tech.length ? `${tech.length} tools` : "Custom", icon: Code2 },
                { label: "Frames", value: frames.length ? `${frames.length} shots` : "1 view", icon: Images },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="space-y-1">
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Icon className="h-3 w-3" />
                      {item.label}
                    </dt>
                    <dd className="truncate text-xs font-semibold text-foreground">{item.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* Interactive frame viewer */}
          <div className="lg:col-span-5">
            <TiltCard maxTilt={7} className="rounded-[28px]">
              <div className="glass-panel-glow relative overflow-hidden rounded-[28px] border border-border">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  {activeFrame ? (
                    <button
                      type="button"
                      onClick={() => setIsZoomed(true)}
                      className="group relative block h-full w-full cursor-zoom-in"
                      aria-label="Enlarge project frame"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeFrame}
                        alt={`${project.title} frame ${activeIndex + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="eager"
                        decoding="async"
                      />
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white/90 backdrop-blur">
                        <Maximize2 className="h-3 w-3" />
                        expand
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
                      <span className="font-display text-5xl font-black text-background/70">
                        {project.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] text-white/85 backdrop-blur">
                      <MousePointer2 className="h-3 w-3" />
                      drag to tilt
                    </span>
                    {frames.length > 1 && (
                      <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] text-white/85 backdrop-blur">
                        {activeIndex + 1} / {frames.length}
                      </span>
                    )}
                  </div>
                </div>

                {frames.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-card/60 p-2.5">
                    {frames.map((frame, index) => (
                      <button
                        key={`${frame}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show frame ${index + 1}`}
                        aria-pressed={activeIndex === index}
                        className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition-all ${
                          activeIndex === index
                            ? "border-primary opacity-100"
                            : "border-border/60 opacity-55 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={frame} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </TiltCard>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              use ← → to browse frames · esc to close
            </p>
          </div>
        </motion.div>

        {/* The build */}
        <motion.section
          id="build"
          {...(reduceMotion ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } })}
          className="mt-16 grid gap-8 lg:grid-cols-12"
        >
          <div className="space-y-4 lg:col-span-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              The build
            </h2>
            <div className="rounded-3xl border border-border bg-card/70 p-6 text-sm leading-relaxed text-foreground/90 sm:p-8">
              <p className="whitespace-pre-wrap">
                {project.description ||
                  "Architecture notes for this project have not been published yet."}
              </p>
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card/70 p-6">
              <h3 className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tech.length > 0 ? (
                  tech.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-foreground"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Stack not specified</span>
                )}
              </div>

              {(project.liveUrl || project.githubUrl) && (
                <div className="mt-5 space-y-2 border-t border-border pt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="truncate font-mono">{project.liveUrl.replace(/^https?:\/\//, "")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="truncate font-mono">{project.githubUrl.replace(/^https?:\/\//, "")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card/70 p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Timeline
              </h3>
              <p className="mt-2 font-display text-base font-semibold text-foreground">
                {timeline || "Ongoing"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Every case study ships with architecture notes, review artefacts and telemetry.
              </p>
            </div>
          </aside>
        </motion.section>

        {/* Prev / next */}
        <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="Project navigation">
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" />
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Previous
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-foreground">{previous.title}</span>
                </span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}

          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-border bg-card/60 p-5 text-right transition-colors hover:border-primary/40 sm:justify-end"
            >
              <span className="sm:order-2 flex items-center gap-3">
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Next
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-foreground">{next.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </nav>

        <div className="mt-10 text-center">
          <Button asChild variant="ghost" className="rounded-full text-xs text-muted-foreground hover:text-foreground">
            <Link href="/#projects">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              All case studies
            </Link>
          </Button>
        </div>
      </main>

      {/* Lightbox */}
      {isZoomed && activeFrame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded project frame"
          onClick={() => setIsZoomed(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeFrame}
            alt={project.title}
            className="max-h-[88vh] max-w-full rounded-2xl border border-white/10 object-contain"
          />
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
