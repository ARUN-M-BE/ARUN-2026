"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { UniverseTiles, useThemeStudio } from "@/components/theme/theme-studio";
import { getTheme, normalizeThemeId, type ThemeId } from "@/config/themes";
import { updateSiteSetting, setActiveTheme } from "@/lib/actions";
import { Loader2, Save, Palette, Shield, Globe, Bell, Radio, Undo2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsClient({ initialSettings }: { initialSettings: Array<{ key: string; value: unknown }> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const getVal = (key: string, fallback: unknown) => {
    const s = initialSettings.find((item) => item.key === key);
    if (!s || s.value === undefined) return fallback;
    try {
      return typeof s.value === "string" ? JSON.parse(s.value) : s.value;
    } catch {
      return s.value;
    }
  };

  // State
  const [siteName, setSiteName] = useState(getVal("site_name", "Developer Portfolio"));
  const [siteDescription, setSiteDescription] = useState(getVal("site_description", "3D Developer Portfolio"));
  const [siteUrl, setSiteUrl] = useState(getVal("site_url", "https://yourdomain.com"));
  const [primaryColor, setPrimaryColor] = useState(getVal("theme_primary_color", "#06b6d4"));
  const [accentColor, setAccentColor] = useState(getVal("theme_accent_color", "#8b5cf6"));
  const [cookieBanner, setCookieBanner] = useState(getVal("enable_cookie_banner", true));
  const [dataRetention, setDataRetention] = useState(getVal("data_retention_days", 365));
  const [emailNotify, setEmailNotify] = useState(getVal("contact_email_notifications", true));

  // Visual universe — preview locally, publish globally
  const { themeId: previewThemeId, setThemeId: previewTheme } = useThemeStudio();
  const [savedThemeId, setSavedThemeId] = useState<ThemeId>(() =>
    normalizeThemeId(getVal("theme.active", "aurora"))
  );
  const [isPublishingTheme, setIsPublishingTheme] = useState(false);

  const handlePublishTheme = async () => {
    setIsPublishingTheme(true);
    try {
      const result = await setActiveTheme(previewThemeId);
      if (!result.success) throw new Error(result.error || "Publish failed");
      setSavedThemeId(previewThemeId);
      toast.success(`${getTheme(previewThemeId).name} published`, {
        description: "Every visitor now lands on this universe by default.",
      });
      router.refresh();
    } catch (err) {
      toast.error("Could not publish universe", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsPublishingTheme(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
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
        description: "Global site configuration and themes revalidated.",
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save System Settings
        </Button>
      </div>

      {/* General Identity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
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

      {/* Visual Universe Studio */}
      <Card className="surface-metal border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Visual Universe Theme
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Select the dark visual system used across the public portfolio and this dashboard. Selection previews
            instantly; publishing makes it the default for every visitor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <UniverseTiles value={previewThemeId} onChange={previewTheme} />

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <Radio className="w-3.5 h-3.5 text-accent" />
              <span>
                Live default:{" "}
                <span className="text-foreground">{getTheme(savedThemeId).name}</span>
              </span>
              {previewThemeId !== savedThemeId && (
                <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                  preview only
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {previewThemeId !== savedThemeId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => previewTheme(savedThemeId)}
                  className="h-9 rounded-xl text-xs"
                >
                  <Undo2 className="w-3.5 h-3.5 mr-1.5" />
                  Revert preview
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={handlePublishTheme}
                disabled={isPublishingTheme || previewThemeId === savedThemeId}
                className="h-9 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                {isPublishingTheme ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                )}
                Publish to portfolio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Futuristic Visual Accents */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" />
            Futuristic 3D Color Accents
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Custom hex shades for the 3D identity sculpture, neon glow gradients and interactive particles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Primary Electric Accent (Default Cyan #06b6d4)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Secondary Cosmic Accent (Default Violet #8b5cf6)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
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
            <Toggle
              size="sm"
              variant={cookieBanner ? "emerald" : "outline"}
              pressed={cookieBanner}
              onPressedChange={setCookieBanner}
              className="h-8 text-xs font-mono"
            >
              {cookieBanner ? "Active" : "Disabled"}
            </Toggle>
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
                Send an immediate notification when a client completes the 3D contact form
              </p>
            </div>
            <Toggle
              size="sm"
              variant={emailNotify ? "amber" : "outline"}
              pressed={emailNotify}
              onPressedChange={setEmailNotify}
              className="h-8 text-xs font-mono"
            >
              {emailNotify ? "Subscribed" : "Muted"}
            </Toggle>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
