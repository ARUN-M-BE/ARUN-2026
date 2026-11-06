"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";

interface VoldogExperienceProps {
  experiences?: any[];
}

export function VoldogExperience({ experiences }: VoldogExperienceProps) {
  const fallbackExperiences = [
    {
      id: "exp-1",
      position: "Lead Distributed Cloud Architect",
      company: "Autonomous Infrastructure Labs",
      location: "Bangalore, IN",
      startDate: "2023",
      endDate: "Present",
      description: "Spearheading distributed edge microservices across Cloudflare Workers and Neon PostgreSQL. Engineered sub-35ms p99 latency routes handling 12M+ daily active requests.",
      highlights: [
        "Architected serverless HTTP database connection pools using @neondatabase/serverless.",
        "Implemented end-to-end DPDP Act 2023 compliance auditing and automated consent ledgers.",
        "Reduced cloud compute overhead by 42% through aggressive edge static caching.",
      ],
    },
    {
      id: "exp-2",
      position: "Senior Full-Stack Architect & 3D Engineer",
      company: "HyperScale Spatial Studios",
      location: "Remote / Global",
      startDate: "2021",
      endDate: "2023",
      description: "Led development of interactive 3D WebGL platforms utilizing React Three Fiber, GLSL shaders, and Next.js App Router for enterprise clients worldwide.",
      highlights: [
        "Crafted custom Three.js post-processing pipelines running at 60 FPS across mobile and desktop.",
        "Integrated type-safe Drizzle ORM schemas with PostgreSQL and automated CI migrations.",
        "Mentored a team of 14 full-stack and creative frontend engineers.",
      ],
    },
    {
      id: "exp-3",
      position: "Systems Software Engineer",
      company: "Core Cloud Technologies",
      location: "Bangalore, IN",
      startDate: "2019",
      endDate: "2021",
      description: "Developed microservices, REST APIs, and automated telemetry collectors with Node.js, TypeScript, and Docker container orchestration.",
      highlights: [
        "Containerized legacy monoliths into Kubernetes clusters with zero scheduled downtime.",
        "Established automated integration testing pipelines with Vitest and Playwright.",
      ],
    },
  ];

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
        {exps.map((exp: any, idx: number) => {
          const dateRange = exp.startDate
            ? `${exp.startDate} — ${exp.endDate || "Present"}`
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

              {/* Highlights */}
              {exp.highlights && Array.isArray(exp.highlights) && (
                <div className="space-y-2 pt-2 border-t border-[#e4e8e6]">
                  {exp.highlights.map((h: string, hIdx: number) => (
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

