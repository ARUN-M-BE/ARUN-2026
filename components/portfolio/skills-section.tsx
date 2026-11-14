"use client";

import { useState } from "react";
import { Cpu, Star, SlidersHorizontal, Sparkles, Server, ShieldCheck, Layers } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import SplitText from "@/components/SplitText";
import type { SkillCategory, Skill } from "@/types";

export type CategoryWithSkills = SkillCategory & { skills: Skill[] };

interface SkillsSectionProps {
  categoriesWithSkills: CategoryWithSkills[];
}

export function SkillsSection({ categoriesWithSkills = [] }: SkillsSectionProps) {
  const { t, language } = useLanguage();
  const [activeCluster, setActiveCluster] = useState<string>("All");
  const [minProficiency, setMinProficiency] = useState<number>(0);

  const getCategoryIcon = (name: string) => {
    if (name.toLowerCase().includes("frontend") || name.toLowerCase().includes("3d")) return Sparkles;
    if (name.toLowerCase().includes("backend") || name.toLowerCase().includes("system")) return Server;
    if (name.toLowerCase().includes("cloud") || name.toLowerCase().includes("security")) return ShieldCheck;
    return Layers;
  };

  const filteredClusters = (categoriesWithSkills || [])
    .filter((c) => activeCluster === "All" || c.name === activeCluster)
    .map((c) => ({
      ...c,
      skills: (c.skills || []).filter((s) => s.level >= minProficiency),
    }));

  return (
    <section id="skills" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-mono text-primary"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t("skills.badge", "Technical Capabilities")}</span>
          </Badge>
          <SplitText
            tag="h2"
            text={t("skills.title", "Interactive Skills Constellation")}
            effect="rise"
            staggerFrom="start"
            className="font-display text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
              className={`h-9 rounded-xl px-4 text-xs transition-all ${
                activeCluster === "All"
                  ? "bg-gradient-to-r from-primary to-indigo-600 font-semibold text-white shadow-md shadow-primary/20 hover:from-indigo-500 hover:to-violet-500"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {language === "ar" ? "جميع المجالات" : "All Domains"}
            </Button>
            {(categoriesWithSkills || []).map((cat) => (
              <Button
                key={cat.id}
                type="button"
                size="sm"
                variant={activeCluster === cat.name ? "default" : "outline"}
                aria-pressed={activeCluster === cat.name}
                onClick={() => setActiveCluster(cat.name)}
                className={`h-9 rounded-xl px-4 text-xs font-medium transition-all ${
                  activeCluster === cat.name
                    ? "bg-gradient-to-r from-primary to-indigo-600 font-semibold text-white shadow-md shadow-primary/20 hover:from-indigo-500 hover:to-violet-500"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Proficiency Threshold Slider */}
          <div className="flex items-center justify-center gap-3 pt-3 text-xs font-mono text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>{t("skills.sliderLabel", "Minimum Proficiency")}:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minProficiency}
              onChange={(e) => setMinProficiency(Number(e.target.value))}
              aria-label="Filter minimum proficiency percentage"
              className="w-28 cursor-pointer accent-primary sm:w-36"
            />
            <span className="min-w-8 font-bold text-primary">{minProficiency}%</span>
          </div>
        </div>

        {/* Skill Clusters Grid */}
        {filteredClusters.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl p-8 bg-card/40 max-w-lg mx-auto">
            <Cpu className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              {language === "ar" ? "لا توجد كفاءات مسجلة" : "No competencies found"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "جرب تخفيض مستوى الكفاءة أو إعادة ضبط الفلتر" : "Try lowering the minimum proficiency slider or resetting the filter."}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveCluster("All");
                setMinProficiency(0);
              }}
              className="mt-4 text-xs rounded-xl"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClusters.map((cluster) => {
              const ClusterIcon = getCategoryIcon(cluster.name);
              return (
                <StaggerItem key={cluster.id}>
                <div
                  className="glass-panel space-y-5 rounded-3xl border border-border p-6 shadow-xs transition-colors hover:border-primary/40 sm:p-7"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border border-primary/20 bg-primary/10 p-1.5 text-primary">
                        <ClusterIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
                        {cluster.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {cluster.skills.length} {language === "ar" ? "مهارات" : "skills"}
                    </span>
                  </div>

                  {cluster.skills.length === 0 ? (
                    <div className="py-6 text-center space-y-1.5 border border-dashed border-border/60 rounded-2xl bg-secondary/20 p-4">
                      <p className="text-xs text-muted-foreground italic">
                        {minProficiency > 0
                          ? `No skills matching ≥ ${minProficiency}% proficiency.`
                          : "No skills in this category yet."}
                      </p>
                      <span className="font-mono text-[10px] text-primary/80">Active Constellation Expansion</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cluster.skills.map((skill) => (
                        <div key={skill.id} className="space-y-1.5 group">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-foreground transition-colors group-hover:text-primary">
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
                              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-600 transition-all duration-700"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
