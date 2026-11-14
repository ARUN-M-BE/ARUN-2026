"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { DesignEyebrow, DesignPill, DesignShell, Reveal, useDesignMotion } from "@/themes/shared";
import {
  collectAchievements,
  contactChannels,
  displayBio,
  displayName,
  displayTitle,
  educationRange,
  experienceRange,
  projectImage,
  projectStack,
  sectionCopy,
} from "@/themes/utils";
import type { DesignProps } from "@/themes/types";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

export default function ParallaxDesign({ content, config }: DesignProps) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const railScale = useTransform(progress, [0, 1], [0, 1]);
  const { duration } = useDesignMotion(config);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const driftFar = useTransform(heroProgress, [0, 1], [0, -(config.parallax / 100) * 120]);
  const driftMid = useTransform(heroProgress, [0, 1], [0, -(config.parallax / 100) * 220]);
  const driftNear = useTransform(heroProgress, [0, 1], [0, -(config.parallax / 100) * 340]);
  const fadeOut = useTransform(heroProgress, [0, 0.85], [1, 0]);

  const name = displayName(content);
  const achievements = collectAchievements(content).slice(0, 4);
  const channels = contactChannels(content);
  const featured = content.projects.slice(0, 6);
  const copy = {
    work: sectionCopy(content, "projects", { title: "Selected work", subtitle: "Case studies, live products and systems.", badge: "Work" }),
    about: sectionCopy(content, "about", { title: "About", subtitle: "", badge: "Profile" }),
    skills: sectionCopy(content, "skills", { title: "Capabilities", subtitle: "", badge: "Stack" }),
    path: sectionCopy(content, "experience", { title: "Career path", subtitle: "", badge: "Experience" }),
    contact: sectionCopy(content, "contact", { title: "Let's build", subtitle: "", badge: "Contact" }),
  };

  return (
    <DesignShell config={config}>
      {/* Scroll progress rail */}
      <motion.div
        style={{ scaleX: railScale }}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--pf-accent)]"
        aria-hidden
      />

      {/* Depth field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -left-40 top-10 h-[36rem] w-[36rem] rounded-full opacity-60 blur-[120px]"
          style={{ background: "var(--pf-wash)" }}
        />
        <div
          className="absolute -right-32 top-[42rem] h-[30rem] w-[30rem] rounded-full opacity-50 blur-[130px]"
          style={{ background: "var(--pf-glow)" }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="#top" className="text-xs font-semibold tracking-[0.2em] text-white/85 uppercase">
            {name}
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
            {SECTIONS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[11px] font-medium tracking-wide text-white/65 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={`mailto:${content.profile?.email ?? ""}`}
            className="rounded-full border border-[var(--pf-accent-line)] px-3.5 py-1.5 text-[11px] font-semibold text-[var(--pf-accent)] transition-colors hover:bg-[var(--pf-accent-soft)]"
          >
            Start a project
          </a>
        </div>
      </header>

      {/* Wrapped in a `main` landmark: axe reports a page without one as
          `landmark-one-main`, and screen-reader users get a skip target. */}
      <main>

      {/* ── Hero ───────────────────────────────────────── */}
      <section id="top" ref={heroRef} className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 sm:pt-40">
        <motion.div style={{ opacity: fadeOut }} className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            {/* Hero block paints at full opacity on the first frame (LCP). */}
            <Reveal config={config} eager>
              <DesignEyebrow>Design 02 · Parallax</DesignEyebrow>
            </Reveal>
            <Reveal config={config} delay={0.05} eager>
              <h1
                className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
                style={{ fontSize: `calc(clamp(2.75rem, 7vw, 5rem) * var(--pf-font-scale))` }}
              >
                {name}
                <span className="mt-2 block text-[var(--pf-accent)]">{displayTitle(content)}</span>
              </h1>
            </Reveal>
            <Reveal config={config} delay={0.1} eager>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                {displayBio(content)}
              </p>
            </Reveal>
            <Reveal config={config} delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent)] px-6 py-3 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  Explore the work
                  <ArrowDownRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                >
                  Get in touch
                </a>
              </div>
            </Reveal>
          </div>

          {/* Layered depth stack */}
          <div className="relative h-[26rem] sm:h-[30rem]" aria-hidden>
            <motion.div
              style={{ y: driftFar }}
              className="absolute left-6 top-2 h-64 w-[78%] rounded-[var(--pf-radius)] border border-white/[0.07] bg-white/[0.02]"
            />
            <motion.div
              style={{ y: driftMid }}
              className="absolute left-12 top-16 h-64 w-[78%] overflow-hidden rounded-[var(--pf-radius)] border border-white/[0.09] bg-white/[0.04] backdrop-blur-sm"
            >
              {featured[1] && projectImage(featured[1]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={projectImage(featured[1])!} alt="" className="h-full w-full object-cover opacity-80" />
              ) : null}
            </motion.div>
            <motion.div
              style={{ y: driftNear }}
              className="absolute left-0 top-28 h-72 w-[86%] overflow-hidden rounded-[var(--pf-radius)] border border-white/10 bg-black/60 shadow-[0_40px_120px_-50px_rgba(0,0,0,1)]"
            >
              {featured[0] && projectImage(featured[0]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={projectImage(featured[0])!} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--pf-accent-soft)] text-4xl font-semibold text-white/60">
                  {featured[0]?.title.slice(0, 2).toUpperCase() ?? "AM"}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pf-accent)]">
                  Now viewing
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {featured[0]?.title ?? "Portfolio"}
                </p>
              </div>
            </motion.div>
            <p className="absolute -bottom-2 left-0 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
              scroll · layers drift with you
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ────────────────────────────────── */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 sm:grid-cols-4">
          {[
            { label: "Years", value: content.profile?.yearsOfExperience ?? 0 },
            { label: "Projects", value: content.projects.length },
            { label: "Stack", value: content.skillCategories.reduce((sum, c) => sum + (c.skills?.length ?? 0), 0) },
            { label: "Clients", value: content.profile?.happyClients ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="py-8 text-center">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Work ───────────────────────────────────────── */}
      <section id="work" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-10 lg:grid-cols-[180px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DesignEyebrow>{copy.work.badge}</DesignEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{copy.work.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/65">{copy.work.subtitle}</p>
          </div>

          <div className="space-y-8">
            {featured.map((project, index) => {
              const image = projectImage(project);
              const stack = projectStack(project).slice(0, 4);
              return (
                <Reveal key={project.id} config={config} delay={index * 0.04}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid gap-6 overflow-hidden rounded-[var(--pf-radius)] border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-[var(--pf-accent-line)] sm:grid-cols-[240px_1fr]"
                    style={{ boxShadow: "var(--pf-card-shadow)" }}
                  >
                    <div className="relative h-40 overflow-hidden rounded-[var(--pf-radius-sm)] bg-black/50 sm:h-36">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={project.title}
                          loading={index === 0 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[var(--pf-accent-soft)] text-xl text-white/60">
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-4 py-1">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <span className="h-px w-4 bg-white/20" aria-hidden />
                          {project.category || "Case study"}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-[var(--pf-accent)]">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/65">
                          {project.shortDescription || project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {stack.map((tech) => (
                          <DesignPill key={tech}>{tech}</DesignPill>
                        ))}
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pf-accent)]">
                          Open
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About + achievements ───────────────────────── */}
      <section id="about" className="relative border-t border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
          <Reveal config={config}>
            <div>
              <DesignEyebrow>{copy.about.badge}</DesignEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{copy.about.title}</h2>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                {content.profile?.bio || displayBio(content)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.profile?.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/55">
                    <MapPin className="h-3 w-3" /> {content.profile.location}
                  </span>
                )}
                {content.profile?.availability && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-accent-line)] bg-[var(--pf-accent-soft)] px-3 py-1 text-[11px] text-[var(--pf-accent)]">
                    {content.profile.availability}
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <div className="space-y-3">
            {achievements.map((item, index) => (
              <Reveal key={item.id} config={config} delay={index * 0.05}>
                <div className="flex gap-4 rounded-[var(--pf-radius-sm)] border border-white/[0.07] bg-black/30 p-4">
                  <span className="mt-0.5 font-mono text-[10px] text-[var(--pf-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs font-medium leading-relaxed text-white/85">{item.title}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {achievements.length === 0 && (
              <p className="rounded-[var(--pf-radius-sm)] border border-dashed border-white/10 p-6 text-xs text-white/60">
                Achievements appear here once they are added to experience entries in the CMS.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────── */}
      <section id="skills" className="relative mx-auto max-w-6xl px-5 py-24">
        <DesignEyebrow>{copy.skills.badge}</DesignEyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{copy.skills.title}</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {content.skillCategories.map((category, catIndex) => (
            <Reveal key={category.id} config={config} delay={catIndex * 0.05}>
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-white/90">{category.name}</h3>
                  <span className="font-mono text-[10px] text-white/55">
                    {category.skills?.length ?? 0} skills
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {(category.skills ?? []).slice(0, 5).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/65">{skill.name}</span>
                        <span className="font-mono text-white/55">{skill.level}%</span>
                      </div>
                      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: duration + 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-[var(--pf-accent)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Experience / education ─────────────────────── */}
      <section id="path" className="relative border-t border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <DesignEyebrow>{copy.path.badge}</DesignEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{copy.path.title}</h2>
            <ol className="mt-8 space-y-6 border-l border-white/10 pl-6">
              {content.experiences.map((exp, index) => (
                <Reveal key={exp.id} config={config} delay={index * 0.04} as="li">
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[var(--pf-accent)]" aria-hidden />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                      {experienceRange(exp)}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-white">
                      {exp.position} <span className="text-white/60">· {exp.company}</span>
                    </h3>
                    {exp.description && (
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{exp.description}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Education</h3>
              <ul className="mt-4 space-y-4">
                {content.education.map((item) => (
                  <li key={item.id} className="rounded-[var(--pf-radius-sm)] border border-white/[0.07] p-4">
                    <p className="text-xs font-semibold text-white/90">{item.degree}</p>
                    <p className="mt-0.5 text-[11px] text-white/65">{item.institution}</p>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {educationRange(item)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Certifications</h3>
              <ul className="mt-4 space-y-2">
                {content.certifications.map((cert) => (
                  <li key={cert.id} className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2">
                    <span className="text-[11px] text-white/70">{cert.name}</span>
                    <span className="font-mono text-[10px] text-white/55">{cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────── */}
      {content.services.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-5 py-24">
          <DesignEyebrow>Engagements</DesignEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">How I can help</h2>
          <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {content.services.map((service, index) => (
              <Reveal key={service.id} config={config} delay={index * 0.04}>
                <div className="group grid gap-3 py-6 sm:grid-cols-[60px_1fr_auto] sm:items-start">
                  <span className="font-mono text-[10px] text-white/65">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-[var(--pf-accent)]">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-white/65">
                      {service.shortDescription || service.description}
                    </p>
                  </div>
                  {service.price && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pf-accent)]">
                      {service.price}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact ────────────────────────────────────── */}
      <section id="contact" className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <Reveal config={config}>
            <DesignEyebrow>{copy.contact.badge}</DesignEyebrow>
            <h2
              className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl"
              style={{ fontSize: "calc(clamp(2.25rem, 5vw, 3.75rem) * var(--pf-font-scale))" }}
            >
              {copy.contact.title || "Let's build something worth exploring."}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div className="space-y-3">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="group flex items-center justify-between gap-4 rounded-[var(--pf-radius-sm)] border border-white/[0.07] px-4 py-3 transition-colors hover:border-[var(--pf-accent-line)]"
                >
                  <span className="flex items-center gap-3 text-xs text-white/70">
                    {channel.label === "Email" ? <Mail className="h-3.5 w-3.5" /> : channel.label === "Phone" ? <Phone className="h-3.5 w-3.5" /> : channel.label === "Resume" ? <Download className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                    {channel.value}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/65 transition-colors group-hover:text-[var(--pf-accent)]" />
                </a>
              ))}
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Elsewhere</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {content.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/65 transition-colors hover:border-[var(--pf-accent-line)] hover:text-white"
                  >
                    {link.label || link.platform}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-white/60">
                {content.profile?.availability || "Open to architectural advisory and product engagements."}
              </p>
            </div>
          </div>
        </div>
      </section>

      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-[11px] text-white/55 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-3 w-3" />
            © {new Date().getFullYear()} {name}
          </span>
          <span className="font-mono uppercase tracking-[0.24em]">Design 02 · Parallax Experience</span>
        </div>
      </footer>
    </DesignShell>
  );
}
