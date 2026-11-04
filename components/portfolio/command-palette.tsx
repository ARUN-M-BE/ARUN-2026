"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Sparkles,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Mail,
  Shield,
  FileText,
  ExternalLink,
  Activity,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Button } from "@/components/ui/button";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toggleLanguage, language, t } = useLanguage();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const scrollToSection = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-xl border-border/80 bg-background/70 px-3 text-xs text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 md:flex"
        title="Quick search (Ctrl+K)"
      >
        <span className="text-foreground/80">{language === "ar" ? "بحث سريع..." : "Search universe..."}</span>
        <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-foreground shadow-xs">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-card border-border overflow-hidden rounded-xl text-foreground">
          <CommandInput placeholder={language === "ar" ? "ابحث عن قسم أو مشروع أو أمر..." : "Type a section, project, or command..."} className="text-xs" />
          <CommandList className="max-h-80 overflow-y-auto">
            <CommandEmpty>{language === "ar" ? "لم يتم العثور على نتائج" : "No results found in universe."}</CommandEmpty>
            
            <CommandGroup heading={language === "ar" ? "أقسام الموقع" : "Portfolio Sections"}>
              <CommandItem onSelect={() => scrollToSection("hero")}>
                <Sparkles className="w-4 h-4 mr-2 text-cyan-500" />
                {t("nav.universe", "Hero & 3D Sculpture")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("about")}>
                <User className="w-4 h-4 mr-2 text-violet-500" />
                {language === "ar" ? "القصة والهوية" : "Personal Story & Identity"}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("projects")}>
                <FolderGit2 className="w-4 h-4 mr-2 text-cyan-500" />
                {t("nav.projects", "Project Universe")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("skills")}>
                <Cpu className="w-4 h-4 mr-2 text-violet-500" />
                {t("nav.skills", "Skills Constellation")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("analytics")}>
                <Activity className="w-4 h-4 mr-2 text-cyan-500" />
                {t("nav.analytics", "Live Telemetry & Observability")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("experience")}>
                <Briefcase className="w-4 h-4 mr-2 text-emerald-500" />
                {t("nav.experience", "Career Milestones Timeline")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("education")}>
                <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                {t("nav.credentials", "Education & Credentials")}
              </CommandItem>
              <CommandItem onSelect={() => scrollToSection("contact")}>
                <Mail className="w-4 h-4 mr-2 text-pink-500" />
                {t("nav.contact", "Contact Gateway")}
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading={language === "ar" ? "التفضيلات والمظهر" : "Preferences & Appearance"}>
              <CommandItem
                onSelect={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setOpen(false);
                }}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 mr-2 text-amber-500" />
                    <span>{language === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to Light Theme"}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2 text-violet-500" />
                    <span>{language === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to Dark Theme"}</span>
                  </>
                )}
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  toggleLanguage();
                  setOpen(false);
                }}
              >
                <Languages className="w-4 h-4 mr-2 text-cyan-500" />
                <span>{language === "en" ? "التبديل إلى العربية (Arabic)" : "Switch to English"}</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading={language === "ar" ? "القانون والخصوصية" : "Legal & Compliance"}>
              <CommandItem onSelect={() => { setOpen(false); router.push("/legal/privacy-policy"); }}>
                <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                Privacy Policy (DPDP Act 2023)
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); router.push("/legal/terms-and-conditions"); }}>
                <FileText className="w-4 h-4 mr-2 text-amber-500" />
                Terms & Conditions
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); router.push("/legal/cookie-policy"); }}>
                <FileText className="w-4 h-4 mr-2 text-cyan-500" />
                Cookie Policy
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading={language === "ar" ? "إدارة الموقع" : "Administration"}>
              <CommandItem onSelect={() => { setOpen(false); router.push("/admin"); }}>
                <ExternalLink className="w-4 h-4 mr-2 text-cyan-500" />
                Admin CMS Dashboard
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
