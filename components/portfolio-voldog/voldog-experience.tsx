"use client";

import { CheckCircle2 } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";
import type { Experience } from "@/types";
import { fallbackExperiences } from "@/server/repositories/fallback-data";

interface VoldogExperienceProps {
  experiences?: Experience[];
}

export function VoldogExperience({ experiences }: VoldogExperienceProps) {
  const exps = experiences && experiences.length > 0 ? experiences : fallbackExperiences;

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto font-voldog">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
          <CarrotThreeLineSpark className="w-5 h-5" />
          <span>Professional Career Timeline</span>
        </div>

        <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
          Architectural track record{" "}
          <span className="font-bold relative inline-block text-[#204e4a]">
            delivering at scale.
            <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
          </span>
        </h2>

        <p className="text-[#204e4a]/75 text-base sm:text-lg">
          Over 6+ years of designing and maintaining distributed software systems that sustain mission-critical loads.
        </p>
      </div>

      {/* Experience Cards */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {exps.map((exp, idx: number) => {
          const dateRange = exp.startDate
            ? `${new Date(exp.startDate).getFullYear()} — ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`
            : "2022 — Present";

          return (
            <div
              key={exp.id || idx}
              className="bg-white rounded-[30px] p-8 sm:p-10 border border-[#e4e8e6] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <h3 className="text-[#204e4a] text-xl sm:text-2xl font-bold">
                    {exp.position}
                  </h3>
                  <div className="text-[#204e4a]/75 text-sm sm:text-base font-semibold flex items-center gap-2">
                    <span>{exp.company}</span>
                    <span>·</span>
                    <span className="text-[#204e4a]/60">{exp.location || "Bangalore, IN"}</span>
                  </div>
                </div>

                {/* Paprika Price warm red date badge */}
                <div className="inline-block bg-[#f4f1eb] text-[#c1452e] font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-full self-start sm:self-center font-mono">
                  {dateRange}
                </div>
              </div>

              <p className="text-[#204e4a]/85 text-base leading-relaxed mb-6 font-normal">
                {exp.description}
              </p>

              {/* Achievements / Highlights */}
              {exp.achievements && Array.isArray(exp.achievements) && (
                <div className="space-y-2 pt-2 border-t border-[#e4e8e6]">
                  {exp.achievements.map((h: string, hIdx: number) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-sm text-[#204e4a]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#e1e53f] shrink-0 mt-0.5 fill-[#204e4a]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

