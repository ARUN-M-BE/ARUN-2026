"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateSiteSetting } from "@/lib/actions";
import { Loader2, Save, Palette, Shield, Globe, Bell, Check, Sparkles, Layers } from "lucide-react";
import { toast } from "sonner";

export function SettingsClient({ initialSettings }: { initialSettings: any[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const getVal = (key: string, fallback: any) => {
    const s = initialSettings.find((item) => item.key === key);
    if (!s || s.value === undefined) return fallback;
    try {
      return typeof s.value === "string" ? JSON.parse(s.value) : s.value;
    } catch {
      return s.value;
    }
  };

  // State
  const [portfolioTheme, setPortfolioTheme] = useState<"voldog" | "cyberpunk">(
    getVal("portfolio_theme", "voldog")
  );
  const [siteName, setSiteName] = useState(getVal("site_name", "Arun M | Senior Full-Stack Architect"));
  const [siteDescription, setSiteDescription] = useState(
    getVal("site_description", "Raw distributed architecture engineered for sub-50ms global scale.")
  );
  const [siteUrl, setSiteUrl] = useState(getVal("site_url", "https://arun-m.in"));
  const [primaryColor, setPrimaryColor] = useState(getVal("theme_primary_color", "#204e4a"));
  const [accentColor, setAccentColor] = useState(getVal("theme_accent_color", "#e1e53f"));
  const [cookieBanner, setCookieBanner] = useState(getVal("enable_cookie_banner", true));
  const [dataRetention, setDataRetention] = useState(getVal("data_retention_days", 365));
  const [emailNotify, setEmailNotify] = useState(getVal("contact_email_notifications", true));

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        updateSiteSetting("portfolio_theme", JSON.stringify(portfolioTheme)),
        updateSiteSetting("site_name", JSON.stringify(siteName)),
        updateSiteSetting("site_description", JSON.stringify(siteDescription)),
        updateSiteSetting("site_url", JSON.stringify(siteUrl)),
        updateSiteSetting("theme_primary_color", JSON.stringify(primaryColor)),
        updateSiteSetting("theme_accent_color", JSON.stringify(accentColor)),
        updateSiteSetting("enable_cookie_banner", JSON.stringify(cookieBanner)),
        updateSiteSetting("data_retention_days", JSON.stringify(Number(dataRetention))),
        updateSiteSetting("contact_email_notifications", JSON.stringify(emailNotify)),
      ]);

      toast.success("Settings saved successfully", {
        description: `Active public theme set to ${
          portfolioTheme === "voldog" ? "VOLDOG Raw Architect" : "Cyberpunk 3D Universe"
        }.`,
      });
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save System Settings
        </Button>
      </div>

      {/* ─── PUBLIC PORTFOLIO EXPERIENCE THEME SELECTOR ─── */}
      <Card className="bg-card border-border border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#e1e53f]" />
            Public Portfolio Active Theme Selector
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Choose which design system is served to visitors on https://arun-m.in by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voldog Raw Theme Card */}
            <div
              onClick={() => setPortfolioTheme("voldog")}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                portfolioTheme === "voldog"
                  ? "bg-[#204e4a]/10 border-[#e1e53f] shadow-lg shadow-[#e1e53f]/10"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a] font-bold text-xs">
                    VD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      VOLDOG Raw Architect
                      <span className="text-[10px] font-semibold bg-[#e1e53f] text-[#204e4a] px-2 py-0.5 rounded-full uppercase">
                        Recommended
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400">Editorial Light · Butcher Green & Lime Zest</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    portfolioTheme === "voldog"
                      ? "bg-[#e1e53f] border-[#e1e53f] text-[#204e4a]"
                      : "border-zinc-600 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#204e4a]" title="Butcher Green" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e1e53f]" title="Lime Zest" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f4f1eb]" title="Oat Canvas" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f2f3f4]" title="Cloud Gray" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c1452e]" title="Paprika Price" />
                  <span className="text-[11px] text-zinc-400 ml-1">Color Palette</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Framed hero with 88px radius, pill buttons, B.A.R.F architecture callouts, curved Oat sections, and snaking slogan ribbon.
                </p>
              </div>
            </div>

            {/* Cyberpunk 3D Theme Card */}
            <div
              onClick={() => setPortfolioTheme("cyberpunk")}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                portfolioTheme === "cyberpunk"
                  ? "bg-cyan-950/20 border-cyan-400 shadow-lg shadow-cyan-500/10"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    3D
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Cyberpunk 3D Universe
                    </h4>
                    <p className="text-[11px] text-zinc-400">Dark Mode · Three.js WebGL & Neon Glow</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    portfolioTheme === "cyberpunk"
                      ? "bg-cyan-400 border-cyan-400 text-black"
                      : "border-zinc-600 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#04060b]" title="Dark Void" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" title="Electric Cyan" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" title="Cosmic Violet" />
                  <span className="text-[11px] text-zinc-400 ml-1">Color Palette</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Interactive Three.js particle universe, neon glow cards, cyber telemetry grid, and futuristic dark glass aesthetic.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Identity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            General Universe Metadata
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Basic identity properties rendered in headers and Open Graph previews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Portfolio Title / Brand Name</Label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Production Canonical URL</Label>
              <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-300">Global Meta Tagline</Label>
            <Input value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & DPDP Compliance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Privacy, Consent & DPDP Act 2023 Rules
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Configure consent management, data erasure periods, and compliance preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs text-white">Enable Cookie Consent Banner</Label>
              <p className="text-[11px] text-muted-foreground">
                Displays privacy choice manager to visitors before activating non-essential scripts
              </p>
            </div>
            <Switch checked={cookieBanner} onCheckedChange={setCookieBanner} />
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-xs text-zinc-300">Personal Data Retention Period (Days)</Label>
            <Input
              type="number"
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="w-48 font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Under DPDP Act 2023, data should not be retained longer than required for the initial purpose.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs text-white">Email Notification on Contact Submissions</Label>
              <p className="text-[11px] text-muted-foreground">
                Send an immediate notification when a client completes the contact form
              </p>
            </div>
            <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
