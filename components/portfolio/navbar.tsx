"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandPalette } from "./command-palette";
import {
  Radio,
  Menu,
  Volume2,
  VolumeX,
  Shield,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Languages,
  Settings2,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";

export function PortfolioNavbar() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const playChime = (freq = 640, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtx || new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        setAudioCtx(ctx);
        setSoundEnabled(true);
      } catch {
        setSoundEnabled(false);
      }
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setSoundEnabled(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const navLinks = [
    { label: t("nav.universe", "Universe"), href: "#hero" },
    { label: t("nav.projects", "Projects"), href: "#projects" },
    { label: t("nav.skills", "Skills"), href: "#skills" },
    { label: t("nav.experience", "Experience"), href: "#experience" },
    { label: t("nav.credentials", "Credentials"), href: "#education" },
    { label: t("nav.analytics", "Live Telemetry"), href: "#analytics" },
    { label: t("nav.contact", "Contact"), href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3.5 ${
        scrolled
          ? "glass-panel border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand with live status badge */}
        <div className="flex items-center gap-4">
          <a href="#hero" onClick={() => playChime(780)} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-black font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-sm">ARUN M</span>
              <span className="block text-[10px] text-cyan-500 font-mono tracking-widest uppercase">
                {language === "ar" ? "معمار برمجيات 3D" : "3D Architect"}
              </span>
            </div>
          </a>

          <div className="hidden xl:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{t("nav.statusOnline", "Cluster Active")} • 60 FPS</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/80 border border-border/80 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => playChime(440, 0.08)}
              onClick={() => playChime(880, 0.12)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Command Palette */}
          <CommandPalette />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={language === "ar" ? "إعدادات الموقع" : "Site preferences"}
                title={language === "ar" ? "إعدادات الموقع" : "Site preferences"}
                className="size-9 rounded-xl border-border/80 bg-background/70 shadow-sm"
              >
                <Settings2 className="size-4 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="px-2.5 py-2">
                <span className="block text-xs font-semibold text-foreground">
                  {language === "ar" ? "تفضيلات الموقع" : "Site preferences"}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                  {language === "ar" ? "خصص طريقة استكشافك" : "Make this space yours"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { playChime(600, 0.1); toggleLanguage(); }}>
                <Languages className="text-cyan-600 dark:text-cyan-300" />
                <span>{language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { playChime(700, 0.1); setTheme(theme === "dark" ? "light" : "dark"); }}>
                {theme === "dark"
                  ? <Sun className="text-amber-500" />
                  : <Moon className="text-violet-500" />}
                <span>{language === "ar"
                  ? (theme === "dark" ? "التبديل إلى المظهر الفاتح" : "التبديل إلى المظهر الداكن")
                  : (theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={toggleFullscreen}>
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                <span>{language === "ar"
                  ? (isFullscreen ? "إنهاء العرض الغامر" : "تفعيل العرض الغامر")
                  : (isFullscreen ? "Exit immersive view" : "Enter immersive view")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={toggleSound}>
                {soundEnabled
                  ? <Volume2 className="text-cyan-600 dark:text-cyan-300" />
                  : <VolumeX />}
                <span>{language === "ar"
                  ? (soundEnabled ? "إيقاف الأجواء الصوتية" : "تشغيل الأجواء الصوتية")
                  : (soundEnabled ? "Turn ambience off" : "Turn ambience on")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin link */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden h-9 rounded-xl border-border/80 bg-background/70 px-3 text-xs text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 sm:inline-flex"
          >
            <Link href="/admin">
              <Shield className="w-3.5 h-3.5 mr-1 text-cyan-500" />
              <span>{t("nav.admin", "CMS Portal")}</span>
            </Link>
          </Button>

          {/* Mobile hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)] border-border bg-background/95 text-foreground backdrop-blur-2xl">
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-tight text-foreground text-sm">DEV.PORTFOLIO</span>
                </div>

                <nav aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"} className="space-y-1">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleLanguage();
                    }}
                    className="h-10 rounded-xl px-3 text-xs"
                  >
                    <Languages className="size-4 text-cyan-600 dark:text-cyan-300" />
                    <span>{language === "en" ? "العربية" : "English"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Toggle color theme"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="size-10 rounded-xl"
                  >
                    {theme === "dark" ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-violet-500" />}
                  </Button>
                </div>

                <div className="border-t border-border pt-3">
                  <Button asChild variant="outline" className="h-11 w-full justify-between rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
                    <Link href="/admin">
                      <span>{t("nav.admin", "Admin CMS Login")}</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
