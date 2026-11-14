"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2, Building2 } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences = [] }: ExperienceSectionProps) {
  const { t, language } = useLanguage();

  return (
    <section id="experience" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t("experience.badge", "Work History")}</span>
          </Badge>
          <h2 className="font-display text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("experience.title", "Professional Experience Timeline")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("experience.subtitle", "Leading engineering architecture, scaling distributed platforms, and delivering mission-critical systems.")}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-border ml-4 sm:ml-8 md:ml-28 space-y-10 sm:space-y-12">
          {(experiences || []).map((exp) => (
            <div key={exp.id} className="relative pl-6 sm:pl-8 md:pl-10 group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  exp.isCurrent
                    ? "bg-gradient-to-tr from-primary to-indigo-600 border-primary/40 text-white shadow-md shadow-primary/30"
                    : "bg-card border-border text-muted-foreground group-hover:border-primary group-hover:text-primary"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              {/* Year Label (Desktop floating left) */}
              <div className="hidden md:block absolute -left-36 top-2 text-right w-24 text-xs font-mono font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                {new Date(exp.startDate).getFullYear()} -{" "}
                {exp.isCurrent ? (language === "ar" ? "حتى الآن" : "Present") : exp.endDate ? new Date(exp.endDate).getFullYear() : (language === "ar" ? "حتى الآن" : "Present")}
              </div>

              {/* Experience Card */}
              <div className="glass-panel group-hover:border-primary/40 rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 border border-border shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {exp.position}
                    </h3>
                    <div className="text-xs sm:text-sm font-semibold text-primary mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {exp.location}
                      </span>
                    )}
                    <span className="md:hidden flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech tags */}
                {(() => {
                  const techList = exp.techStack || exp.technologies || [];
                  if (techList.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {techList.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-secondary border border-border text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
