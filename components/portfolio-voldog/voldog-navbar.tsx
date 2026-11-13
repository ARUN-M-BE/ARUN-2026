"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./voldog-doodles";

interface VoldogNavbarProps {
  onSwitchTheme?: () => void;
}

export function VoldogNavbar({ onSwitchTheme }: VoldogNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "ARCHITECTURE", href: "#architecture" },
    { label: "SYSTEMS", href: "#systems" },
    { label: "STACK", href: "#stack" },
    { label: "PRINCIPLES", href: "#principles" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-voldog ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e4e8e6] py-3.5 shadow-sm"
          : "bg-white py-5"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#204e4a] text-[15px] font-semibold tracking-[1px] hover:text-[#204e4a]/75 transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Center: Bold Butcher Green Wordmark */}
        <div className="flex items-center justify-center">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-[#204e4a] text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:opacity-90 transition-opacity">
              ARUN M
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#e1e53f]" />
          </Link>
        </div>

        {/* Right: Social Outlines & Lime Zest Pill Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://github.com/arun-m"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#204e4a]/20 flex items-center justify-center text-[#204e4a] hover:bg-[#f2f3f4] transition-colors"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/arun-m"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#204e4a]/20 flex items-center justify-center text-[#204e4a] hover:bg-[#f2f3f4] transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {onSwitchTheme && (
            <button
              onClick={onSwitchTheme}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#204e4a]/20 text-[#204e4a] text-xs font-semibold hover:bg-[#f4f1eb] transition-colors"
              title="Switch to 3D Cyberpunk Theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#204e4a]" />
              <span>3D Void</span>
            </button>
          )}

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center bg-[#e1e53f] hover:bg-[#d6da34] text-[#204e4a] font-semibold text-[15px] px-7 py-3 rounded-[50px] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            HIRE ARCHITECT
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-full bg-[#e1e53f] text-[#204e4a] flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e4e8e6] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#204e4a] text-base font-semibold tracking-[1px] py-1 border-b border-[#e4e8e6]/60"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#e1e53f] text-[#204e4a] font-semibold text-base py-3.5 rounded-[50px] shadow-sm"
            >
              HIRE ARCHITECT
            </a>
            {onSwitchTheme && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSwitchTheme();
                }}
                className="w-full text-center border border-[#204e4a]/20 text-[#204e4a] font-semibold text-sm py-2.5 rounded-full"
              >
                Switch to Cyberpunk 3D Theme
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
