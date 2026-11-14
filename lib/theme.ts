import { cookies } from "next/headers";
import { cache } from "react";
import {
  DEFAULT_THEME_ID,
  getTheme,
  normalizeThemeId,
  THEME_COOKIE,
  THEMES,
  type PortfolioTheme,
  type ThemeId,
} from "@/config/themes";
import { SettingsRepository } from "@/server/repositories";

export { THEME_COOKIE, THEME_SETTING_KEY } from "@/config/themes";

function readThemeSetting(value: unknown): ThemeId | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Values may be stored as a bare id or as a JSON-encoded string.
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        return normalizeThemeId(JSON.parse(trimmed));
      } catch {
        return null;
      }
    }
    const match = THEMES.find((theme) => theme.id === trimmed);
    return match ? match.id : null;
  }

  if (value && typeof value === "object" && "id" in value) {
    return normalizeThemeId((value as { id?: unknown }).id);
  }

  return null;
}

/**
 * Resolves the theme for the current request.
 *
 * Priority: visitor cookie → globally published setting → Midnight Aurora.
 * Never throws: a cold database (fresh clone, offline build) falls back to the
 * original theme instead of failing the render.
 */
export const getActiveTheme = cache(async (): Promise<PortfolioTheme> => {
  let published: ThemeId | null = null;

  try {
    const settings = await SettingsRepository.findMany();
    const row = settings?.find((item) => item.key === "theme.active");
    published = readThemeSetting(row?.value);
  } catch (err) {
    console.warn("[theme] Unable to read published theme:", err);
  }

  let override: ThemeId | null = null;
  try {
    const store = await cookies();
    const cookieValue = store.get(THEME_COOKIE)?.value;
    if (cookieValue) override = normalizeThemeId(cookieValue);
  } catch {
    // Cookies are unavailable during static generation — ignore.
  }

  return getTheme(override ?? published ?? DEFAULT_THEME_ID);
});

/** Themes the UI is allowed to offer, in registry order. */
export function getAvailableThemes(): readonly PortfolioTheme[] {
  return THEMES;
}
