"use client";

import Link from "next/link";
import { ArrowUp, Layers, Shield, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SocialLink } from "@/types";

interface PortfolioFooterProps {
  socialLinks?: SocialLink[];
}

export function PortfolioFooter({ socialLinks = [] }: PortfolioFooterProps) {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSocials = (socialLinks || []).filter(
    (s) => s.isActive !== false && (!s.placements || s.placements.includes("footer"))
  );

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/60 pb-8 pt-12 sm:pt-16 text-xs">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-md shadow-primary/25">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-extrabold tracking-tight text-foreground">ARUN M</span>
                <Badge variant="outline" className="h-5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ONLINE
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
              {t("footer.rights", "Original immersive 3D digital universe engineered with Next.js App Router, Three.js, and PostgreSQL.")}
            </p>
          </div>

          {/* Social Links Placement (Footer) */}
          {footerSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {footerSocials.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-card/80 text-foreground transition-all text-xs shadow-xs ${
                    item.style === "pill" ? "rounded-full" : ""
                  }`}
                  style={item.color ? { borderColor: `${item.color}30` } : undefined}
                >
                  <span className="font-medium">{item.label || item.platform}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          )}

          {/* Legal Navigation Links & Top Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <nav aria-label={language === "ar" ? "روابط قانونية" : "Legal links"} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link href="/legal/privacy-policy" className="hover:text-foreground transition-colors">
                {t("footer.privacy", "Privacy Policy")}
              </Link>
              <Link href="/legal/terms-and-conditions" className="hover:text-foreground transition-colors">
                {t("footer.terms", "Terms of Service")}
              </Link>
              <Link href="/legal/cookie-policy" className="hover:text-foreground transition-colors">
                {t("footer.cookies", "Cookie Policy")}
              </Link>
              <Link href="/admin" className="flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80">
                <Shield className="w-3.5 h-3.5" />
                <span>{t("nav.admin", "CMS Portal")}</span>
              </Link>
            </nav>

            {/* Back to top button */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-border bg-card px-4 text-xs shadow-xs transition-colors hover:border-primary/40 hover:bg-card"
              aria-label={language === "ar" ? "العودة إلى الأعلى" : "Back to top"}
            >
              <span>{language === "ar" ? "أعلى الصفحة" : "Top of Page"}</span>
              <ArrowUp className="size-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Statutory Compliance Disclosure */}
        <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-[11px] leading-relaxed text-muted-foreground shadow-xs sm:p-5">
          <p>
            <strong className="text-foreground font-semibold">{t("footer.dpdp", "Indian Legal & Regulatory Disclosures:")}</strong>{" "}
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
          <div className="font-mono font-semibold text-primary">
            {language === "ar" ? "نظام موزع • 60 FPS • محمي بالكامل" : "DISTRIBUTED SYSTEM • 60 FPS • SECURE"}
          </div>
        </div>
      </div>
    </footer>
  );
}
