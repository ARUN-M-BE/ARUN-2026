"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/languageContext";

interface ExperienceSectionProps {
  experiences: any[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const { t, language } = useLanguage();

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t("experience.badge", "Work history")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("experience.title", "Professional Experience Timeline")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("experience.subtitle", "Leading engineering architecture, scaling distributed platforms, and delivering mission-critical systems.")}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-border ml-4 md:ml-32 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 md:pl-10 group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  exp.isCurrent
                    ? "bg-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/30 animate-pulse"
                    : "bg-background border-border text-muted-foreground group-hover:border-cyan-500 group-hover:text-cyan-500"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              {/* Year Label (Desktop floating left) */}
              <div className="hidden md:block absolute -left-36 top-2 text-right w-24 text-xs font-mono font-semibold text-muted-foreground group-hover:text-cyan-500 transition-colors">
                {new Date(exp.startDate).getFullYear()} -{" "}
                {exp.isCurrent ? (language === "ar" ? "حتى الآن" : "Present") : exp.endDate ? new Date(exp.endDate).getFullYear() : (language === "ar" ? "حتى الآن" : "Present")}
              </div>

              {/* Experience Card */}
              <div className="glass-panel group-hover:border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                      {exp.position}
                    </h3>
                    <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    )}
                    <span className="md:hidden flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(exp.startDate).getFullYear()} -{" "}
                      {exp.isCurrent ? (language === "ar" ? "الآن" : "Present") : exp.endDate ? new Date(exp.endDate).getFullYear() : (language === "ar" ? "الآن" : "Present")}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>

                {/* Key achievements list */}
                {exp.achievements && (exp.achievements as string[]).length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {((exp.achievements as string[]) || []).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech tags */}
                {exp.technologies && (exp.technologies as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {((exp.technologies as string[]) || []).map((t: string) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary border border-border text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
