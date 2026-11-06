"use client";

import React from "react";
import Link from "next/link";
import { Mail, Shield, Terminal, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./voldog-doodles";

export function VoldogFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#204e4a] text-white pt-12 pb-16 px-4 sm:px-8 lg:px-12 font-voldog border-t border-white/10">
      <div className="max-w-[1600px] mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">ARUN M</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#e1e53f]" />
            </div>

            <p className="text-[#b3c3c1] text-[14.08px] leading-[2]">
              Senior Full-Stack Architect & 3D Creative Engineer. Architecting low-latency distributed cloud foundations, stateless HTTP database streaming, and futuristic web experiences.
            </p>

            {/* Lime Zest Social Discs */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/arun-m"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#e1e53f] hover:bg-[#d6da34] flex items-center justify-center text-[#204e4a] transition-all hover:scale-105"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/in/arun-m"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#e1e53f] hover:bg-[#d6da34] flex items-center justify-center text-[#204e4a] transition-all hover:scale-105"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href="mailto:arun@arun-m.in"
                className="w-9 h-9 rounded-full bg-[#e1e53f] hover:bg-[#d6da34] flex items-center justify-center text-[#204e4a] transition-all hover:scale-105"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Architectural Domains */}
          <div className="space-y-3">
            <h4 className="text-[19.2px] font-medium text-white tracking-tight">
              Systems & Stacks
            </h4>
            <ul className="space-y-1 text-[#b3c3c1] text-[14.08px] leading-[2]">
              <li><a href="#systems" className="hover:text-white transition-colors">Serverless Edge Microservices</a></li>
              <li><a href="#systems" className="hover:text-white transition-colors">Neon PostgreSQL HTTP Drivers</a></li>
              <li><a href="#stack" className="hover:text-white transition-colors">Three.js WebGL & Shaders</a></li>
              <li><a href="#principles" className="hover:text-white transition-colors">DPDP Act 2023 Consent Engines</a></li>
              <li><a href="#stack" className="hover:text-white transition-colors">Next.js 16 App Router (RSC)</a></li>
            </ul>
          </div>

          {/* Column 3: Navigation & Sections */}
          <div className="space-y-3">
            <h4 className="text-[19.2px] font-medium text-white tracking-tight">
              Navigation
            </h4>
            <ul className="space-y-1 text-[#b3c3c1] text-[14.08px] leading-[2]">
              <li><a href="#architecture" className="hover:text-white transition-colors">Bespoke Blueprint</a></li>
              <li><a href="#systems" className="hover:text-white transition-colors">Production Packshots</a></li>
              <li><a href="#stack" className="hover:text-white transition-colors">Specialized Tools</a></li>
              <li><a href="#principles" className="hover:text-white transition-colors">B.A.R.F Principles</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Workspace</Link></li>
            </ul>
          </div>

          {/* Column 4: Compliance & Address */}
          <div className="space-y-3">
            <h4 className="text-[19.2px] font-medium text-white tracking-tight">
              Legal & Compliance
            </h4>
            <div className="text-[#b3c3c1] text-[14.08px] leading-[2] space-y-2">
              <p>Registered Entity Jurisdiction: Karnataka, Republic of India.</p>
              <div className="flex items-center gap-2 pt-1 text-xs text-[#e1e53f]">
                <Shield className="w-4 h-4" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <Link href="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <span>·</span>
                <Link href="/legal/terms-of-service" className="hover:underline">Terms</Link>
                <span>·</span>
                <Link href="/legal/cookie-policy" className="hover:underline">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#b3c3c1] text-[12.8px] leading-[1.86]">
          <p>© {new Date().getFullYear()} Arun M. All rights reserved. B.A.R.F style reference edition.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors py-1 px-3 rounded-full hover:bg-white/5"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#e1e53f]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
