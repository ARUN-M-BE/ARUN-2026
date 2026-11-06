"use client";

import React from "react";
import { Sparkles, Palette, Check } from "lucide-react";

interface ThemeSwitchPillProps {
  currentTheme: "cyberpunk" | "voldog";
  onToggle: () => void;
}

export function ThemeSwitchPill({ currentTheme, onToggle }: ThemeSwitchPillProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 font-voldog">
      <button
        onClick={onToggle}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 active:scale-95 bg-white text-[#204e4a] border-[#204e4a]/20 hover:border-[#204e4a] shadow-[0_6px_34px_rgba(0,0,0,0.15)]"
        title={
          currentTheme === "voldog"
            ? "Switch to Cyberpunk 3D Theme"
            : "Switch to VOLDOG Raw Architect Theme"
        }
      >
        <div className="w-6 h-6 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a]">
          <Palette className="w-3.5 h-3.5" />
        </div>

        <div className="text-left text-xs">
          <div className="font-bold leading-tight">
            {currentTheme === "voldog" ? "VOLDOG Raw" : "Cyberpunk 3D"}
          </div>
          <div className="text-[10px] text-[#204e4a]/60 font-medium">
            Click to switch theme
          </div>
        </div>
      </button>
    </div>
  );
}

