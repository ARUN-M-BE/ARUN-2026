"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/locales/en.json";
import arTranslations from "@/locales/ar.json";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

type TranslationNode = string | { [key: string]: TranslationNode };

const translations: Record<Language, Record<string, TranslationNode>> = {
  en: enTranslations as unknown as Record<string, TranslationNode>,
  ar: arTranslations as unknown as Record<string, TranslationNode>,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [direction, setDirection] = useState<Direction>("ltr");

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const saved = localStorage.getItem("preferred_lang") as Language;
      if (saved && (saved === "en" || saved === "ar")) {
        setLanguageState(saved);
        setDirection(saved === "ar" ? "rtl" : "ltr");
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    setDirection(dir);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    try {
      const parts = key.split(".");
      let current: TranslationNode | undefined = translations[language];
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, TranslationNode>)[part];
        } else {
          return fallback || key;
        }
      }
      return typeof current === "string" ? current : fallback || key;
    } catch {
      return fallback || key;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
