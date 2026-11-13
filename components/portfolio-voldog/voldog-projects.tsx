"use client";

import { ArrowUpRight, ArrowRight, Layers, Zap, Shield, Database } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark, GithubIcon } from "./voldog-doodles";
import type { Project } from "@/types";
import { fallbackProjects } from "@/server/repositories/fallback-data";

interface VoldogProjectsProps {
  projects?: Project[];
}

export function VoldogProjects({ projects }: VoldogProjectsProps) {
  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <section id="systems" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto font-voldog">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl relative">
          <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
            <CarrotThreeLineSpark className="w-5 h-5" />
            <span>Core System Packshots</span>
          </div>

          <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
            Production systems{" "}
            <span className="font-bold relative inline-block text-[#204e4a]">
              engineered for high throughput.
              <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
            </span>
          </h2>
          <p className="text-[#204e4a]/75 text-base sm:text-lg font-normal pt-1">
            Packaged architecture case studies. Every system is built without legacy bloat, tested under concurrent load, and verified against strict privacy laws.
          </p>
        </div>

        {/* Cloud Gray Pill Button for All Repositories */}
        <div className="hidden md:block">
          <a
            href="https://github.com/arun-m"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-between gap-4 bg-[#f2f3f4] hover:bg-[#e8ebed] text-[#204e4a] font-medium text-[17px] sm:text-[18px] h-14 sm:h-16 px-7 rounded-full shadow-pill-halo transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>All Git Repositories</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#204e4a] group-hover:rotate-45 transition-transform duration-300">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </a>
        </div>
      </div>

      {/* 
        Grid of Tall Cloud Gray #f2f3f4 product/project cards 
        with 30px radius, 0 40px padding and NO border or drop shadow
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project, idx) => {
          const techList = Array.isArray(project.techStack)
            ? project.techStack
            : ["Distributed Engine", "TypeScript", "PostgreSQL"];

          const metric = project.category || project.client || "10M+ Req/Day · Sub-35ms Edge";

          return (
            <div
              key={project.id || idx}
              className="bg-[#f2f3f4] rounded-[30px] p-8 sm:p-10 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Upper: Floating Packshot / Architecture Preview Box */}
              <div className="space-y-6">
                <div className="w-full h-56 sm:h-64 rounded-[22px] bg-white p-6 flex flex-col justify-between relative overflow-hidden group">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, #204e4a 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Top Status & Index Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#204e4a]/60 tracking-widest font-mono">
                      ARCH-0{idx + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Center Architectural Icon / Stamp */}
                  <div className="relative z-10 my-auto text-center space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#f4f1eb] flex items-center justify-center text-[#204e4a] group-hover:scale-110 transition-transform">
                      {idx % 3 === 0 ? (
                        <Database className="w-7 h-7" />
                      ) : idx % 3 === 1 ? (
                        <Layers className="w-7 h-7" />
                      ) : (
                        <Shield className="w-7 h-7" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#204e4a]/75 uppercase tracking-wider">
                      {idx % 3 === 0
                        ? "Serverless DB Driver"
                        : idx % 3 === 1
                        ? "Interactive 3D Engine"
                        : "Security Guard"}
                    </div>
                  </div>

                  {/* Bottom Tags */}
                  <div className="relative z-10 flex flex-wrap gap-1.5 pt-2">
                    {techList.slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="bg-[#f2f3f4] text-[#204e4a] text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title & Paprika Price Metric */}
                <div className="space-y-2">
                  <h3 className="text-[#204e4a] text-[20.32px] font-medium leading-[1.3]">
                    {project.title}
                  </h3>

                  {/* Paprika Price warm red metric */}
                  <div className="text-[#c1452e] text-[15px] font-medium tracking-tight">
                    {metric}
                  </div>

                  <p className="text-[#204e4a]/75 text-sm sm:text-[15px] leading-relaxed pt-1 line-clamp-3">
                    {project.description ||
                      "Production distributed system built with resilient data pipelines and sub-50ms SLA targets."}
                  </p>
                </div>
              </div>

              {/* Bottom Card Actions: Pill links */}
              <div className="pt-8 flex items-center justify-between border-t border-[#204e4a]/10 mt-6">
                <a
                  href={project.liveUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#204e4a] hover:text-[#204e4a]/75 font-semibold text-sm group"
                >
                  <span>Launch System</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={project.githubUrl || "https://github.com/arun-m"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#e1e53f] flex items-center justify-center text-[#204e4a] transition-colors"
                  title="View Source"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile All Repos Link */}
      <div className="mt-8 text-center md:hidden">
        <a
          href="https://github.com/arun-m"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#f2f3f4] text-[#204e4a] font-medium text-base h-14 px-7 rounded-full shadow-pill-halo w-full"
        >
          <span>All Git Repositories</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
