"use client";

import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Badge } from "@/components/ui/badge";
import type { Education, Certification } from "@/types";

interface EducationSectionProps {
  education: Education[];
  certifications: Certification[];
}

export function EducationSection({ education = [], certifications = [] }: EducationSectionProps) {
  const { t, language } = useLanguage();

  return (
    <section id="education" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t("education.badge", "Credentials")}</span>
          </Badge>
          <h2 className="font-display text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("education.title", "Education & Industry Certifications")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("education.subtitle", "Formal computer science degrees and verified cloud engineering credentials.")}
          </p>
        </div>

        {/* Education & Certifications Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Education Column */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>{language === "ar" ? "المؤهلات الأكاديمية" : "Academic Degrees"}</span>
            </h3>

            <div className="space-y-4">
              {(education || []).map((edu) => (
                <div key={edu.id} className="glass-panel rounded-3xl p-6 space-y-3 hover:border-sky-500/40 transition-all border border-border shadow-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">{edu.degree}</h4>
                      <div className="text-xs text-primary font-semibold mt-0.5">{edu.institution}</div>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {edu.isCurrent ? (language === "ar" ? "الآن" : "Present") : edu.endDate ? new Date(edu.endDate).getFullYear() : (language === "ar" ? "الآن" : "Present")}
                    </div>
                  </div>

                  {edu.field && (
                    <div className="text-xs text-foreground/80 font-medium">
                      {language === "ar" ? "التخصص:" : "Major:"} {edu.field}
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{language === "ar" ? "الشهادات والاعتمادات الدولية" : "Industry Certifications"}</span>
            </h3>

            <div className="space-y-4">
              {(certifications || []).map((cert) => (
                <div key={cert.id} className="glass-panel rounded-3xl p-6 space-y-3 hover:border-amber-500/40 transition-all border border-border shadow-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">{cert.name}</h4>
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{cert.issuer}</div>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {cert.issueDate ? new Date(cert.issueDate).getFullYear() : ""}
                    </div>
                  </div>

                  {cert.credentialId && (
                    <div className="text-[11px] font-mono text-muted-foreground">
                      ID: {cert.credentialId}
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline pt-1 font-semibold"
                    >
                      <span>{t("education.verifyLink", "Verify Credential")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
