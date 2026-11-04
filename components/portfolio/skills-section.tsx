"use client";

import { useState } from "react";
import { Cpu, Star, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  categoriesWithSkills: any[];
}

export function SkillsSection({ categoriesWithSkills }: SkillsSectionProps) {
  const { t, language } = useLanguage();
  const [activeCluster, setActiveCluster] = useState<string>("All");
  const [minProficiency, setMinProficiency] = useState<number>(0);

  const filteredClusters = categoriesWithSkills
    .filter((c) => activeCluster === "All" || c.name === activeCluster)
    .map((c) => ({
      ...c,
      skills: (c.skills || []).filter((s: any) => s.level >= minProficiency),
    }))
    .filter((c) => c.skills.length > 0);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-600 dark:text-violet-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t("skills.badge", "Technical capabilities")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("skills.title", "Interactive Skills Constellation")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("skills.subtitle", "Explore domain clusters across frontend, backend, database systems, and cloud infrastructure.")}
          </p>

          {/* Cluster Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <Button
              type="button"
              size="sm"
              variant={activeCluster === "All" ? "default" : "outline"}
              aria-pressed={activeCluster === "All"}
              onClick={() => setActiveCluster("All")}
              className={`h-9 rounded-full px-4 text-xs transition-all ${
                activeCluster === "All"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 font-semibold text-white shadow-md shadow-violet-500/15 hover:from-violet-500 hover:to-cyan-500"
                  : "bg-secondary/60 text-muted-foreground"
              }`}
            >
              {language === "ar" ? "جميع المجالات" : "All Domains"}
            </Button>
            {categoriesWithSkills.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                size="sm"
                variant={activeCluster === cat.name ? "default" : "outline"}
                aria-pressed={activeCluster === cat.name}
                onClick={() => setActiveCluster(cat.name)}
                className={`h-9 rounded-full px-4 text-xs font-medium transition-all ${
                  activeCluster === cat.name
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 font-semibold text-white shadow-md shadow-violet-500/15 hover:from-violet-500 hover:to-cyan-500"
                    : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Proficiency Threshold Slider */}
          <div className="flex items-center justify-center gap-3 pt-3 text-xs font-mono text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t("skills.sliderLabel", "Minimum Proficiency")}:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minProficiency}
              onChange={(e) => setMinProficiency(Number(e.target.value))}
              className="w-28 sm:w-36 accent-cyan-500 cursor-pointer"
            />
            <span className="text-cyan-600 dark:text-cyan-400 font-bold min-w-8">{minProficiency}%</span>
          </div>
        </div>

        {/* Skill Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 border border-border hover:border-violet-500/40 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-foreground tracking-tight">
                  {cluster.name}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {cluster.skills.length} {language === "ar" ? "مهارات" : "skills"}
                </span>
              </div>

              <div className="space-y-4">
                {cluster.skills.map((skill: any) => (
                  <div key={skill.id} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-foreground group-hover:text-cyan-500 transition-colors">
                        <span>{skill.name}</span>
                        {skill.isFeatured && (
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <span className="font-mono text-muted-foreground">{skill.level}%</span>
                    </div>

                    {/* Progress Bar with Gradient */}
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
