"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronDown, CheckCircle2, Sparkles, SlidersHorizontal } from "lucide-react";
import { CarrotThreeLineSpark } from "./voldog-doodles";

export function VoldogFinder() {
  const [scale, setScale] = useState("1M+ Global Daily Transactions");
  const [tier, setTier] = useState("Serverless Edge Microservices");
  const [db, setDb] = useState("Neon Postgres + Drizzle ORM");
  const [compliance, setCompliance] = useState("DPDP 2023 + Sub-50ms SLA");
  const [matched, setMatched] = useState(false);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setMatched(true);
  };

  return (
    <section className="py-12 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto font-voldog">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
          <CarrotThreeLineSpark className="w-5 h-5" />
          <span>Interactive Architecture Configurator</span>
        </div>
        <h2 className="text-[#204e4a] text-2xl sm:text-3xl font-medium leading-tight">
          Find your exact <span className="font-bold">system blueprint</span> in 4 clicks.
        </h2>
      </div>

      {/* 
        Full-width Paper form with 25px radius and 0 0 30px 6px shadow glow
      */}
      <form
        onSubmit={handleMatch}
        className="bg-white rounded-[25px] shadow-finder-glow border border-[#e4e8e6] p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
      >
        {/* Field 1: Target Scale */}
        <div className="p-3 sm:p-4 lg:border-r border-[#e4e8e6] space-y-1">
          <label className="text-xs uppercase font-bold text-[#204e4a]/60 tracking-wider">
            1. Target Scale
          </label>
          <div className="relative">
            <select
              value={scale}
              onChange={(e) => {
                setScale(e.target.value);
                setMatched(false);
              }}
              className="w-full bg-transparent text-[#204e4a] font-medium text-[16px] sm:text-[17px] appearance-none pr-8 focus:outline-none cursor-pointer"
            >
              <option value="1M+ Global Daily Transactions">1M+ Global Req/Day</option>
              <option value="10M+ Enterprise Event Stream">10M+ Event Stream</option>
              <option value="Sub-50ms Regional Edge">Sub-50ms Edge Fleet</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#204e4a] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 2: Architecture Tier */}
        <div className="p-3 sm:p-4 lg:border-r border-[#e4e8e6] space-y-1">
          <label className="text-xs uppercase font-bold text-[#204e4a]/60 tracking-wider">
            2. System Tier
          </label>
          <div className="relative">
            <select
              value={tier}
              onChange={(e) => {
                setTier(e.target.value);
                setMatched(false);
              }}
              className="w-full bg-transparent text-[#204e4a] font-medium text-[16px] sm:text-[17px] appearance-none pr-8 focus:outline-none cursor-pointer"
            >
              <option value="Serverless Edge Microservices">Edge Microservices</option>
              <option value="3D WebGL / Canvas Universe">3D WebGL Experience</option>
              <option value="Distributed Hybrid Cloud">Distributed Cloud</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#204e4a] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 3: Database Paradigm */}
        <div className="p-3 sm:p-4 lg:border-r border-[#e4e8e6] space-y-1">
          <label className="text-xs uppercase font-bold text-[#204e4a]/60 tracking-wider">
            3. Database
          </label>
          <div className="relative">
            <select
              value={db}
              onChange={(e) => {
                setDb(e.target.value);
                setMatched(false);
              }}
              className="w-full bg-transparent text-[#204e4a] font-medium text-[16px] sm:text-[17px] appearance-none pr-8 focus:outline-none cursor-pointer"
            >
              <option value="Neon Postgres + Drizzle ORM">Neon Postgres + Drizzle</option>
              <option value="Cloudflare D1 + KV + Hyperdrive">Cloudflare D1 + KV</option>
              <option value="Event Store + CQRS Pipeline">Event Store + CQRS</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#204e4a] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 4: Security SLA */}
        <div className="p-3 sm:p-4 space-y-1">
          <label className="text-xs uppercase font-bold text-[#204e4a]/60 tracking-wider">
            4. Compliance
          </label>
          <div className="relative">
            <select
              value={compliance}
              onChange={(e) => {
                setCompliance(e.target.value);
                setMatched(false);
              }}
              className="w-full bg-transparent text-[#204e4a] font-medium text-[16px] sm:text-[17px] appearance-none pr-8 focus:outline-none cursor-pointer"
            >
              <option value="DPDP 2023 + Sub-50ms SLA">DPDP 2023 + Zero Trust</option>
              <option value="OWASP Top 10 + End-to-End Auth">OWASP + NextAuth</option>
              <option value="Strict SOC2 + Audit Trails">Strict Audit Logging</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#204e4a] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 5: Lime Zest Submit Block */}
        <button
          type="submit"
          className="group w-full h-14 sm:h-16 bg-[#e1e53f] hover:bg-[#d6da34] text-[#204e4a] font-semibold text-[17px] sm:text-[18px] rounded-[20px] px-5 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>BUILD BLUEPRINT</span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#204e4a] group-hover:rotate-45 transition-transform duration-300">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </button>
      </form>

      {/* Matched Architecture Card */}
      {matched && (
        <div className="mt-6 bg-[#f4f1eb] rounded-[30px] p-6 sm:p-8 border border-[#204e4a]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in-50 zoom-in-95 duration-300">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c1452e] bg-white px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recommended Architecture Match</span>
            </div>
            <h3 className="text-[#204e4a] text-xl sm:text-2xl font-bold">
              Autonomous Edge Engine: {tier}
            </h3>
            <p className="text-[#204e4a]/80 text-sm sm:text-base max-w-2xl">
              Configured for <strong>{scale}</strong> with stateless <strong>{db}</strong> connections and guaranteed <strong>{compliance}</strong> governance.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-[#204e4a] hover:bg-[#1a3f3c] text-white text-sm font-semibold px-6 py-3.5 rounded-full whitespace-nowrap shadow-sm"
          >
            <span>Request System Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </section>
  );
}

