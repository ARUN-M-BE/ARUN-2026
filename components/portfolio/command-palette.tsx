"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Shield,
  Languages,
  Command as CommandIcon,
  Palette,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { PALETTE_SECTIONS, SECTION_TONE_CLASS } from "@/config/site-sections";
import { THEMES } from "@/config/themes";
import { useThemeStudio, ThemeSwatches } from "@/components/theme/theme-studio";
import { Button } from "@/components/ui/button";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { themeId, setThemeId } = useThemeStudio();
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
        className="hidden h-9 sm:h-10 items-center gap-2 rounded-xl border-border bg-card/60 px-3 text-xs text-muted-foreground shadow-xs transition-all hover:border-primary/40 hover:bg-primary/5 md:flex"
        title="Quick search (Ctrl+K)"
      >
        <span className="text-foreground/80">{language === "ar" ? "بحث سريع..." : "Search portfolio..."}</span>
        <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-foreground shadow-xs">
          <CommandIcon className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-card border-border overflow-hidden rounded-2xl text-foreground shadow-2xl">
          <CommandInput placeholder={language === "ar" ? "ابحث عن قسم أو مشروع أو أمر..." : "Type a section, project, or command..."} className="text-xs" />
          <CommandList className="max-h-80 overflow-y-auto">
            <CommandEmpty>{language === "ar" ? "لم يتم العثور على نتائج" : "No results found."}</CommandEmpty>
            
            <CommandGroup heading={language === "ar" ? "أقسام الموقع" : "Portfolio Navigation"}>
              {PALETTE_SECTIONS.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <CommandItem
                    key={section.key}
                    onSelect={() => scrollToSection(section.key)}
                  >
                    <SectionIcon
                      className={`mr-2 h-4 w-4 ${SECTION_TONE_CLASS[section.tone ?? "primary"]}`}
                    />
                    {t(section.labelKey, section.label)}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading={language === "ar" ? "التفضيلات والمظهر" : "Preferences & Appearance"}>
              {THEMES.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`universe ${item.name} ${item.tagline}`}
                  onSelect={() => {
                    setThemeId(item.id);
                    setOpen(false);
                  }}
                >
                  <ThemeSwatches theme={item} className="mr-2" />
                  <span className="flex-1">
                    {language === "ar" ? "الكون البصري: " : "Visual Universe: "}
                    {item.name}
                  </span>
                  {themeId === item.id && <Palette className="w-3.5 h-3.5 text-primary" />}
                </CommandItem>
              ))}

              <CommandItem
                onSelect={() => {
                  toggleLanguage();
                  setOpen(false);
                }}
              >
                <Languages className="w-4 h-4 mr-2 text-primary" />
                <span>{language === "en" ? "تبديل الواجهة إلى العربية" : "Switch to English"}</span>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push("/admin");
                }}
              >
                <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                <span>{language === "ar" ? "فتح بوابة إدارة المحتوى" : "Open CMS Admin Portal"}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
