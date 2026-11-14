import { cookies } from "next/headers";
import { cache } from "react";
import {
  DEFAULT_COLOR_MODE,
  DEFAULT_THEME_ID,
  THEMES,
  THEME_COOKIE,
  THEME_MODE_COOKIE,
  THEME_MODE_SETTING_KEY,
  THEME_PICKER_SETTING_KEY,
  THEME_SETTING_KEY,
  normalizeColorMode,
  normalizeThemeId,
  resolveTheme,
  type ColorMode,
  type PortfolioTheme,
  type ResolvedTheme,
  type ThemeId,
} from "@/config/themes";
import { checkContrast, type ContrastCheck } from "@/lib/colors";
import { SettingsRepository } from "@/server/repositories";

export { THEME_COOKIE, THEME_MODE_COOKIE, THEME_SETTING_KEY } from "@/config/themes";

/**
 * Reads a site-settings row. Values can be stored as a bare string, a
 * JSON-encoded string, or a JSON object depending on which admin screen
 * wrote them, so all three shapes are unwrapped here.
 */
function readSettingString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        return typeof parsed === "string" ? parsed : null;
      } catch {
        return null;
      }
    }
    return trimmed;
  }

  if (typeof value === "boolean") return value ? "true" : "false";

  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }

  return null;
}

export interface ThemePreferences {
  theme: ResolvedTheme;
  pickerEnabled: boolean;
}

/**
 * Resolves the palette for the current request.
 *
 * Priority: visitor cookie → globally published setting → Midnight Aurora.
 * Never throws: a cold database (fresh clone, offline build) falls back to the
 * original palette instead of failing the render.
 */
export const getThemePreferences = cache(async (): Promise<ThemePreferences> => {
  let publishedId: ThemeId | null = null;
  let publishedMode: ColorMode | null = null;
  let pickerEnabled = true;

  try {
    const settings = await SettingsRepository.findMany();
    const find = (key: string) => settings?.find((item) => item.key === key);

    const themeRow = find(THEME_SETTING_KEY);
    const rawTheme = readSettingString(themeRow?.value);
    if (rawTheme) publishedId = normalizeThemeId(rawTheme);

    const modeRow = find(THEME_MODE_SETTING_KEY);
    const rawMode = readSettingString(modeRow?.value);
    if (rawMode) publishedMode = normalizeColorMode(rawMode);

    const pickerRow = find(THEME_PICKER_SETTING_KEY);
    const rawPicker = readSettingString(pickerRow?.value);
    if (rawPicker) pickerEnabled = rawPicker !== "false";
  } catch (err) {
    console.warn("[theme] Unable to read published palette:", err);
  }

  let cookieTheme: ThemeId | null = null;
  let cookieMode: ColorMode | null = null;

  try {
    const store = await cookies();
    const themeCookie = store.get(THEME_COOKIE)?.value;
    if (themeCookie) cookieTheme = normalizeThemeId(themeCookie);

    const modeCookie = store.get(THEME_MODE_COOKIE)?.value;
    if (modeCookie) cookieMode = normalizeColorMode(modeCookie);
  } catch {
    // Cookies are unavailable during static generation — ignore.
  }

  // Visitor overrides only apply while the admin allows palette switching.
  const theme = resolveTheme(
    pickerEnabled && cookieTheme ? cookieTheme : publishedId ?? DEFAULT_THEME_ID,
    pickerEnabled && cookieMode ? cookieMode : publishedMode ?? DEFAULT_COLOR_MODE
  );

  return { theme, pickerEnabled };
});

/** Convenience accessor for the resolved palette only. */
export const getActiveTheme = cache(async (): Promise<ResolvedTheme> => {
  const { theme } = await getThemePreferences();
  return theme;
});

/** Palettes the UI is allowed to offer, in registry order. */
export function getAvailableThemes(): readonly PortfolioTheme[] {
  return THEMES;
}

/**
 * Real WCAG checks for a resolved palette. Used by the admin appearance
 * screen so contrast is measured, never asserted.
 */
export function getContrastAudit(theme: ResolvedTheme): ContrastCheck[] {
  const { vars } = theme;
  return [
    checkContrast("Body text on page", vars["--foreground"], vars["--background"]),
    checkContrast("Body text on cards", vars["--card-foreground"], vars["--card"]),
    checkContrast("Muted text on cards", vars["--muted-foreground"], vars["--card"]),
    checkContrast("Primary button label", vars["--primary-foreground"], vars["--primary"]),
    checkContrast("Accent button label", vars["--accent-foreground"], vars["--accent"]),
    checkContrast("Brand primary on page", vars["--primary"], vars["--background"]),
    checkContrast("Brand accent on page", vars["--accent"], vars["--background"]),
  ];
}
