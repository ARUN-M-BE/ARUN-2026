"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Cookie, Settings2, X } from "lucide-react";
import Link from "next/link";
import { recordConsent } from "@/lib/actions";
import { useLanguage } from "@/context/languageContext";

export function CookieConsent() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent_preferences");
    if (!saved) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = async () => {
    const prefs = { essential: true, analytics: true };
    localStorage.setItem("cookie_consent_preferences", JSON.stringify(prefs));
    setVisible(false);
    await recordConsent({
      type: "cookie_all",
      consentGiven: true,
      preferences: prefs,
    });
  };

  const handleAcceptEssential = async () => {
    const prefs = { essential: true, analytics: false };
    localStorage.setItem("cookie_consent_preferences", JSON.stringify(prefs));
    setVisible(false);
    await recordConsent({
      type: "cookie_essential_only",
      consentGiven: true,
      preferences: prefs,
    });
  };

  const handleSaveCustom = async () => {
    const prefs = { essential: true, analytics: analyticsConsent };
    localStorage.setItem("cookie_consent_preferences", JSON.stringify(prefs));
    setVisible(false);
    await recordConsent({
      type: "cookie_custom",
      consentGiven: true,
      preferences: prefs,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel rounded-2xl p-5 shadow-2xl border border-sky-500/20 space-y-4 text-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/25 flex items-center justify-center">
              <Cookie className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-foreground text-sm">
              {language === "ar" ? "تفضيلات ملفات تعريف الارتباط والخصوصية" : "Privacy & Cookie Preferences"}
            </h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAcceptEssential}
            className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            title={language === "ar" ? "رفض الاختيارية" : "Reject optional cookies"}
            aria-label={language === "ar" ? "رفض ملفات تعريف الارتباط الاختيارية" : "Reject optional cookies"}
          >
            <X className="size-4" />
          </Button>
        </div>

        <p className="text-muted-foreground leading-relaxed text-[11px]">
          {language === "ar"
            ? "نستخدم ملفات تعريف الارتباط الأساسية لتشغيل الموقع بأمان. يتم تعطيل ملفات التحليلات تلقائياً وفقاً لقوانين حماية البيانات الرقمية حتى تمنح موافقتك الصريحة."
            : "We use strictly necessary cookies for website core operations. Optional analytics cookies are disabled by default under India's DPDP Act 2023 until you grant explicit consent."}
        </p>

        {showPreferences && (
          <div className="p-3 rounded-xl bg-secondary/60 border border-border space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">
                  {language === "ar" ? "ملفات الارتباط الأساسية" : "Essential Cookies"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {language === "ar" ? "أمان الجلسات والتفضيلات" : "Core session & preference security"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">
                {language === "ar" ? "نشط دائماً" : "Always Active"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div>
                <span className="font-semibold text-foreground block">
                  {language === "ar" ? "التحليلات والأداء" : "Analytics & Performance"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {language === "ar" ? "قياس الاستخدام دون بيانات شخصية" : "Anonymous usage measurement"}
                </span>
              </div>
              <Toggle
                size="sm"
                variant={analyticsConsent ? "sky" : "outline"}
                pressed={analyticsConsent}
                onPressedChange={setAnalyticsConsent}
                className="h-7 px-2.5 text-xs font-mono"
              >
                {analyticsConsent ? "Allowed" : "Blocked"}
              </Toggle>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {showPreferences ? (
            <Button
              size="sm"
              onClick={handleSaveCustom}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs h-9 rounded-xl"
            >
              {language === "ar" ? "حفظ التفضيلات" : "Save My Preferences"}
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs h-9 rounded-xl shadow-xs"
              >
                {language === "ar" ? "قبول الكل" : "Accept All"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptEssential}
                className="w-full sm:w-auto text-xs h-9 rounded-xl border-border text-foreground hover:bg-secondary"
              >
                {language === "ar" ? "رفض الاختيارية" : "Reject Optional"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(true)}
                className="text-xs h-9 rounded-xl text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border">
          <Link href="/legal/cookie-policy" className="text-sky-500 hover:underline">
            {language === "ar" ? "سياسة ملفات الارتباط" : "Cookie Policy"}
          </Link>{" "}
          &{" "}
          <Link href="/legal/privacy-policy" className="text-sky-500 hover:underline">
            {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
