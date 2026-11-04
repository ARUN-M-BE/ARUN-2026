"use client";

import Link from "next/link";
import { ArrowUp, Radio, Shield } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PortfolioFooter() {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/40 pb-8 pt-14 text-xs sm:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/15">
                <Radio className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-foreground text-sm">ARUN M</span>
                <Badge variant="outline" className="ml-2 h-5 rounded-full border-primary/20 bg-primary/5 px-2 text-[9px] font-mono text-primary">ONLINE</Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
              {t("footer.rights", "Original immersive 3D digital universe engineered with Next.js App Router, Three.js, and PostgreSQL.")}
            </p>
          </div>

          {/* Legal Navigation Links */}
          <nav aria-label={language === "ar" ? "روابط قانونية" : "Legal links"} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">
              {t("footer.privacy", "Privacy Policy")}
            </Link>
            <Link href="/legal/terms-and-conditions" className="hover:text-primary transition-colors">
              {t("footer.terms", "Terms of Service")}
            </Link>
            <Link href="/legal/cookie-policy" className="hover:text-primary transition-colors">
              {t("footer.cookies", "Cookie Policy")}
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>{t("nav.admin", "Admin Portal")}</span>
            </Link>
          </nav>

          {/* Back to top button */}
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-border/80 bg-background/70 px-4 text-xs shadow-sm hover:border-primary/30 hover:bg-primary/5"
            aria-label={language === "ar" ? "العودة إلى الأعلى" : "Back to top"}
          >
            <span>{language === "ar" ? "أعلى الصفحة" : "Top of Universe"}</span>
            <ArrowUp className="size-3.5" />
          </Button>
        </div>

        {/* Statutory Compliance Disclosure */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-secondary/70 to-card/50 p-4 text-[11px] leading-relaxed text-muted-foreground shadow-sm sm:p-5">
          <p>
            <strong className="text-foreground">{t("footer.dpdp", "Indian Legal & Regulatory Disclosures:")}</strong>{" "}
            {language === "ar"
              ? "يتم تشغيل هذا الموقع الإرشادي والملف التعريفي مع مراعاة أعلى معايير أمان البيانات وقوانين حماية الخصوصية الرقمية DPDP Act 2023 وقانون تكنولوجيا المعلومات 2000."
              : "This developer portfolio website is operated in compliance with applicable provisions of India's Information Technology Act, 2000 (as amended), IT Rules, and the Digital Personal Data Protection Act, 2023 (DPDP Act) along with DPDP Rules 2025."}
          </p>
        </div>

        {/* Bottom Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-[11px] text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Arun M. {language === "ar" ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </div>
          <div className="font-mono text-cyan-600 dark:text-cyan-400">
            {language === "ar" ? "نظام موزع • 60 FPS • محمي بالكامل" : "DISTRIBUTED SYSTEM • 60 FPS • SECURE"}
          </div>
        </div>
      </div>
    </footer>
  );
}
