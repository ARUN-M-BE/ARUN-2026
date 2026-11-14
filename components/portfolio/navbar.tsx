"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Sparkles,
  Menu,
  Volume2,
  VolumeX,
  Shield,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Check,
  Languages,
  Settings2,
  FolderGit2,
  Cpu,
  Activity,
  Briefcase,
  GraduationCap,
  Mail,
  Layers,
  User,
  Compass,
  Star,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { NAVBAR_SECTIONS } from "@/config/site-sections";
import { THEMES } from "@/config/themes";
import { useThemeStudio, UniverseSwitcher, ThemeSwatches } from "@/components/theme/theme-studio";
import type { NavigationItem, SocialLink } from "@/types";

interface PortfolioNavbarProps {
  navigation?: NavigationItem[];
  socialLinks?: SocialLink[];
}

function resolveIcon(name?: string | null) {
  switch (name) {
    case "Sparkles": return Sparkles;
    case "FolderGit2": return FolderGit2;
    case "Cpu": return Cpu;
    case "Briefcase": return Briefcase;
    case "GraduationCap": return GraduationCap;
    case "Activity": return Activity;
    case "Mail": return Mail;
    case "User": return User;
    case "Compass": return Compass;
    case "Star": return Star;
    case "Layers": return Layers;
    case "Globe": return Globe;
    default: return Sparkles;
  }
}

export function PortfolioNavbar({ navigation = [], socialLinks = [] }: PortfolioNavbarProps) {
  const { themeId, setThemeId } = useThemeStudio();
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      // Audio autoplay policy handled
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

  const navLinks = navigation && navigation.length > 0
    ? navigation.map((item) => ({
        label: item.label,
        href: item.href,
        icon: resolveIcon(item.icon),
        badge: item.badge,
        style: item.style,
        color: item.color,
      }))
    : NAVBAR_SECTIONS.map((section) => ({
        label: t(section.labelKey, section.label),
        href: section.href,
        icon: section.icon,
        badge: section.badge ?? null,
        style: section.style ?? "default",
        color: "primary",
      }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 ${
        scrolled
          ? "glass-panel border-b border-border shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand with live status badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#hero"
            onClick={() => playChime(780)}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-md shadow-primary/25 transition-transform group-hover:scale-105 sm:h-9 sm:w-9">
              <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <span className="font-display text-sm font-extrabold tracking-tight text-foreground sm:text-base">ARUN M</span>
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                {language === "ar" ? "معمار برمجيات 3D" : "3D Architect"}
              </span>
            </div>
          </a>
          
        </div>

        {/* Desktop Nav Links */}
        <nav
          aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}
          className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-secondary/80 border border-border backdrop-blur-md"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => playChime(440, 0.08)}
              onClick={() => playChime(880, 0.12)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex items-center gap-1.5 ${
                link.style === "pill"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : link.style === "glow"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/90"
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                /* `bg-primary/20` left this 9px badge at 4.3:1 against the dark
                   surface; a lighter wash keeps the chip look while clearing AA. */
                <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Visual Universe Switcher */}
          <UniverseSwitcher compact className="hidden sm:inline-flex" />

          {/* Command Palette */}
          <CommandPalette />

          {/* Preferences Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={language === "ar" ? "إعدادات الموقع" : "Site preferences"}
                title={language === "ar" ? "إعدادات الموقع" : "Site preferences"}
                className="size-9 sm:size-10 rounded-xl border-border bg-card/60 shadow-xs hover:border-primary/40 hover:bg-primary/5"
              >
                <Settings2 className="size-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 border-border backdrop-blur-xl shadow-xl">
              <DropdownMenuLabel className="px-2.5 py-2">
                <span className="block text-xs font-bold text-foreground">
                  {language === "ar" ? "تفضيلات العرض" : "Experience Controls"}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                  {language === "ar" ? "تخصيص الواجهة والسمات الصوتية" : "Customize theme, audio & locale"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2.5 text-xs py-2.5 cursor-pointer"
                onSelect={() => { playChime(600, 0.1); toggleLanguage(); }}
              >
                <Languages className="size-4 text-primary" />
                <span>{language === "en" ? "Switch to Arabic (العربية)" : "التبديل إلى الإنجليزية"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Visual Universe
              </DropdownMenuLabel>
              {THEMES.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="gap-2.5 text-xs py-2.5 cursor-pointer"
                  onSelect={() => { playChime(700, 0.1); setThemeId(item.id); }}
                >
                  <ThemeSwatches theme={item} />
                  <span className="flex-1 truncate">{item.name}</span>
                  {themeId === item.id && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2.5 text-xs py-2.5 cursor-pointer"
                onSelect={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="size-4 text-primary" /> : <Maximize2 className="size-4 text-primary" />}
                <span>
                  {language === "ar"
                    ? (isFullscreen ? "إنهاء العرض الغامر" : "شاشة كاملة غامرة")
                    : (isFullscreen ? "Exit Immersive View" : "Fullscreen Immersive")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2.5 text-xs py-2.5 cursor-pointer"
                onSelect={toggleSound}
              >
                {soundEnabled
                  ? <Volume2 className="size-4 text-emerald-500" />
                  : <VolumeX className="size-4 text-muted-foreground" />}
                <span>
                  {language === "ar"
                    ? (soundEnabled ? "إيقاف الأجواء الصوتية" : "تشغيل الأجواء الصوتية")
                    : (soundEnabled ? "Disable Audio Ambience" : "Enable Audio Ambience")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin CMS Portal Shortcut */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-9 sm:h-10 rounded-xl border-border bg-card/60 px-3.5 text-xs font-semibold text-foreground shadow-xs hover:border-primary/40 hover:bg-primary/5"
          >
            <Link href="/admin">
              <Shield className="mr-1.5 w-3.5 h-3.5 text-primary" />
              <span>{t("nav.admin", "CMS Portal")}</span>
            </Link>
          </Button>

          {/* Mobile Sheet Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="lg:hidden size-9 sm:size-10 rounded-xl text-foreground hover:bg-secondary"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,85vw)] border-border bg-card/95 text-foreground backdrop-blur-2xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 font-bold text-white shadow-md shadow-primary/25">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-display text-base font-extrabold tracking-tight text-foreground">ARUN M</span>
                    <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {language === "ar" ? "معمار برمجيات 3D" : "3D Architect"}
                    </span>
                  </div>
                </div>

                <nav aria-label={language === "ar" ? "التنقل الرئيسي المحمول" : "Mobile navigation"} className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <SheetClose asChild key={link.href}>
                        <a
                          href={link.href}
                          className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Icon className="size-4 shrink-0 text-primary" />
                          <span>{link.label}</span>
                        </a>
                      </SheetClose>
                    );
                  })}
                </nav>

                {/* Mobile Socials */}
                {(() => {
                  const navbarSocials = (socialLinks || []).filter(
                    (s) => s.isActive !== false && (!s.placements || s.placements.includes("navbar"))
                  );
                  if (navbarSocials.length === 0) return null;
                  return (
                    <div className="pt-4 flex flex-wrap gap-2">
                      {navbarSocials.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg border border-border bg-secondary text-xs text-foreground font-mono flex items-center gap-1.5"
                          style={item.color ? { borderColor: `${item.color}40` } : undefined}
                        >
                          <span>{item.label || item.platform}</span>
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="h-11 rounded-xl text-xs gap-1.5 justify-center"
                  >
                    <Languages className="size-4 text-primary" />
                    <span>{language === "en" ? "العربية" : "English"}</span>
                  </Button>

                  <UniverseSwitcher compact className="h-11 w-full" label="Visual Universe" />
                </div>

                <SheetClose asChild>
                  <Button asChild variant="default" className="h-11 w-full justify-between rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-xs font-semibold text-white shadow-md shadow-primary/25 hover:from-indigo-500 hover:to-violet-500">
                    <Link href="/admin">
                      <span className="flex items-center gap-2">
                        <Shield className="size-4" />
                        {t("nav.admin", "Admin CMS Portal")}
                      </span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
