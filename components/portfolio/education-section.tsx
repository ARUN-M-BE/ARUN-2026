"use client";

import { GraduationCap, Award, ExternalLink, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/context/languageContext";

interface EducationSectionProps {
  education: any[];
  certifications: any[];
}

export function EducationSection({ education, certifications }: EducationSectionProps) {
  const { t, language } = useLanguage();

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t("education.badge", "Credentials")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("education.title", "Education & Industry Certifications")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("education.subtitle", "Formal computer science degrees and verified cloud engineering credentials.")}
          </p>
        </div>

        {/* Education & Certifications Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Education Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span>{language === "ar" ? "المؤهلات الأكاديمية" : "Academic Degrees"}</span>
            </h3>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="glass-panel rounded-3xl p-6 space-y-3 hover:border-blue-500/40 transition-all border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{edu.degree}</h4>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</div>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
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
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{language === "ar" ? "الشهادات والاعتمادات الدولية" : "Industry Certifications"}</span>
            </h3>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="glass-panel rounded-3xl p-6 space-y-3 hover:border-amber-500/40 transition-all border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{cert.name}</h4>
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{cert.issuer}</div>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {new Date(cert.issueDate).getFullYear()}
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
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:underline pt-1 font-semibold"
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
