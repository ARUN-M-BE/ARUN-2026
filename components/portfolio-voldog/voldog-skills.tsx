"use client";

import React, { useState } from "react";
import { Server, Cpu, Box, Cloud, ShieldCheck, Terminal, Database, Code2 } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";

interface VoldogSkillsProps {
  categoriesWithSkills?: any[];
}

export function VoldogSkills({ categoriesWithSkills }: VoldogSkillsProps) {
  const fallbackCategories = [
    {
      id: "cat-cloud",
      name: "Cloud & Distributed Systems",
      slug: "cloud",
      icon: "server",
      skills: [
        { name: "Cloudflare Workers & OpenNext", proficiency: "Architect / 98%", metric: "Sub-20ms Edge" },
        { name: "Neon PostgreSQL (HTTP Driver)", proficiency: "Advanced / 95%", metric: "Serverless Pooling" },
        { name: "Docker & Kubernetes Swarm", proficiency: "Production / 92%", metric: "Zero Downtime" },
        { name: "Drizzle ORM & Migrations", proficiency: "Architect / 96%", metric: "Type-Safe SQL" },
      ],
    },
    {
      id: "cat-frontend",
      name: "Modern Frontend & 3D WebGL",
      slug: "frontend",
      icon: "box",
      skills: [
        { name: "Next.js 16 App Router (RSC)", proficiency: "Mastery / 99%", metric: "Streaming SSR" },
        { name: "React 19 & Concurrent Mode", proficiency: "Expert / 96%", metric: "Hydration Guard" },
        { name: "Three.js & React Three Fiber", proficiency: "Advanced / 94%", metric: "60 FPS Shaders" },
        { name: "TailwindCSS & Bespoke Systems", proficiency: "Mastery / 98%", metric: "Zero Layout Shift" },
      ],
    },
    {
      id: "cat-security",
      name: "Security, Auth & Compliance",
      slug: "security",
      icon: "shield",
      skills: [
        { name: "DPDP Act 2023 Architecture", proficiency: "Compliant / 100%", metric: "Consent Ledger" },
        { name: "NextAuth v5 / Auth.js Guards", proficiency: "Expert / 95%", metric: "JWT / Session Proxy" },
        { name: "OWASP Hardening & CSRF", proficiency: "Strict / 96%", metric: "Defense in Depth" },
        { name: "Automated Vitest & End-to-End", proficiency: "Verified / 94%", metric: "Regression-Proof" },
      ],
    },
  ];

  const categories = categoriesWithSkills && categoriesWithSkills.length > 0 ? categoriesWithSkills : fallbackCategories;
  const [activeIdx, setActiveIdx] = useState(0);
  const activeCategory = categories[activeIdx] || categories[0];

  return (
    <section id="stack" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto font-voldog">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
          <CarrotThreeLineSpark className="w-5 h-5" />
          <span>Core Capabilities & Tech Stack</span>
        </div>

        <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
          Specialized tools{" "}
          <span className="font-bold relative inline-block text-[#204e4a]">
            for resilient engineering.
            <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
          </span>
        </h2>

        <p className="text-[#204e4a]/75 text-base sm:text-lg">
          We categorize our craft across distributed cloud infrastructure, creative 3D web engines, and stringent compliance guarantees.
        </p>

        {/* 
          Species / Category Toggle Pill:
          Paper container with 100px radius holding tabs where active tab is Lime Zest 100px pill
        */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex flex-wrap items-center bg-white p-1.5 rounded-[100px] shadow-toggle-lift border border-[#e4e8e6]">
            {categories.map((cat, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={cat.id || idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-[100px] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#e1e53f] text-[#204e4a] shadow-sm"
                      : "text-[#204e4a]/60 hover:text-[#204e4a]"
                  }`}
                >
                  {idx === 0 ? (
                    <Server className="w-4 h-4" />
                  ) : idx === 1 ? (
                    <Box className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{cat.name.split("&")[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Cloud Gray Skill Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeCategory.skills &&
          activeCategory.skills.map((skill: any, idx: number) => (
            <div
              key={skill.id || skill.name || idx}
              className="bg-[#f2f3f4] rounded-[30px] p-8 flex flex-col justify-between space-y-6 transition-all hover:bg-[#eaecee] hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#204e4a] shadow-sm">
                    <Code2 className="w-5 h-5 text-[#204e4a]" />
                  </div>
                  {/* Paprika metric */}
                  <span className="text-[#c1452e] font-mono text-xs font-bold">
                    {skill.metric || "Production"}
                  </span>
                </div>

                <h3 className="text-[#204e4a] text-lg sm:text-[19px] font-bold leading-snug">
                  {skill.name}
                </h3>
              </div>

              <div className="pt-4 border-t border-[#204e4a]/10 flex items-center justify-between text-xs text-[#204e4a]/70">
                <span>Proficiency Level</span>
                <span className="font-semibold text-[#204e4a]">
                  {skill.proficiency || `${skill.level || 95}%`}
                </span>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

