"use server";

import { revalidatePath } from "next/cache";
import {
  DESIGN_SETTING_KEYS,
  getDesign,
  normalizeDesignConfig,
  normalizeDesignId,
  type DesignId,
} from "@/config/designs";
import {
  THEME_MODE_SETTING_KEY,
  THEME_PICKER_SETTING_KEY,
  THEME_SETTING_KEY,
  normalizeColorMode,
  normalizeThemeId,
} from "@/config/themes";
import { getDesignState } from "@/lib/design-settings";
import { requireAdmin } from "@/lib/auth-guard";
import { SettingsController } from "@/server/controllers";

export interface DesignActionResult {
  success: boolean;
  error?: string;
}

function serialize(value: unknown): string {
  return JSON.stringify(value);
}

async function writeSetting(key: string, value: unknown): Promise<DesignActionResult> {
  try {
    const result = await SettingsController.updateSiteSetting(key, value);
    if (!result.success) {
      return { success: false, error: result.error || `Failed to write ${key}` };
    }
    return { success: true };
  } catch (error) {
    // Database failures must surface — never pretend a publish succeeded.
    console.error(`[design-actions] write failed for ${key}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to write ${key}`,
    };
  }
}

function refresh(designId?: DesignId) {
  revalidatePath("/", "layout");
  revalidatePath("/admin/theme-studio");
  if (designId) revalidatePath(`/admin/theme-studio/preview/${designId}`);
}

/** Saves the appearance draft for one design. Never touches the live site. */
export async function saveDesignDraft(
  designId: string,
  config: unknown
): Promise<DesignActionResult> {
  await requireAdmin();
  const id = normalizeDesignId(designId);
  const normalized = normalizeDesignConfig(id, config);

  const result = await writeSetting(DESIGN_SETTING_KEYS.draft(id), serialize(normalized));
  if (result.success) refresh(id);
  return result;
}

/** Restores a design's appearance to its shipped defaults (draft level). */
export async function resetDesignDraft(designId: string): Promise<DesignActionResult> {
  await requireAdmin();
  const id = normalizeDesignId(designId);
  const defaults = getDesign(id).defaults;

  const result = await writeSetting(DESIGN_SETTING_KEYS.draft(id), serialize(defaults));
  if (result.success) refresh(id);
  return result;
}

/** Marks a design as the admin's pick. Does NOT change the public portfolio. */
export async function selectDesignTheme(designId: string): Promise<DesignActionResult> {
  await requireAdmin();
  const id = normalizeDesignId(designId);
  const result = await writeSetting(DESIGN_SETTING_KEYS.selected, id);
  if (result.success) refresh(id);
  return result;
}

/**
 * Publishes a design: snapshots its effective appearance, flips the public
 * design, stores the outgoing design for rollback, and clears the selection.
 */
export async function publishDesignTheme(designId: string): Promise<DesignActionResult> {
  await requireAdmin();
  const id = normalizeDesignId(designId);
  const state = await getDesignState();
  const config = state.configs[id] ?? getDesign(id).defaults;

  // Snapshot appearance first so readers never see a new design + old tokens.
  const configWrite = await writeSetting(
    DESIGN_SETTING_KEYS.publishedConfig,
    serialize(config)
  );
  if (!configWrite.success) return configWrite;

  if (state.published !== id) {
    const previousWrite = await writeSetting(DESIGN_SETTING_KEYS.previous, state.published);
    if (!previousWrite.success) return previousWrite;

    const previousConfigWrite = await writeSetting(
      DESIGN_SETTING_KEYS.previousConfig,
      serialize(state.publishedConfig)
    );
    if (!previousConfigWrite.success) return previousConfigWrite;
  }

  const publishWrite = await writeSetting(DESIGN_SETTING_KEYS.published, id);
  if (!publishWrite.success) return publishWrite;

  const selectWrite = await writeSetting(DESIGN_SETTING_KEYS.selected, id);
  if (!selectWrite.success) return selectWrite;

  refresh(id);
  return { success: true };
}

/** Stores the admin's default palette + colour mode. */
export async function savePaletteTheme(
  themeId: string,
  mode: string
): Promise<DesignActionResult> {
  await requireAdmin();

  const themeWrite = await writeSetting(THEME_SETTING_KEY, normalizeThemeId(themeId));
  if (!themeWrite.success) return themeWrite;

  const modeWrite = await writeSetting(THEME_MODE_SETTING_KEY, normalizeColorMode(mode));
  if (!modeWrite.success) return modeWrite;

  refresh();
  return { success: true };
}

/** Enables or disables the visitor-facing palette picker. */
export async function setPalettePickerEnabled(enabled: boolean): Promise<DesignActionResult> {
  await requireAdmin();

  const result = await writeSetting(THEME_PICKER_SETTING_KEY, enabled ? "true" : "false");
  if (result.success) refresh();
  return result;
}

/** Enables or disables the visitor-facing view switcher. */
export async function setDesignViewerToggle(enabled: boolean): Promise<DesignActionResult> {
  await requireAdmin();

  const result = await writeSetting(
    DESIGN_SETTING_KEYS.viewerToggle,
    enabled ? "true" : "false"
  );
  if (result.success) refresh();
  return result;
}

/** Restores the design that was live before the last publish. */
export async function rollbackDesignTheme(): Promise<DesignActionResult> {
  await requireAdmin();
  const state = await getDesignState();

  if (!state.previous) {
    return { success: false, error: "No previous published design to restore." };
  }

  const target = state.previous;
  const targetConfig = state.previousConfig ?? getDesign(target).defaults;

  const configWrite = await writeSetting(
    DESIGN_SETTING_KEYS.publishedConfig,
    serialize(targetConfig)
  );
  if (!configWrite.success) return configWrite;

  const previousWrite = await writeSetting(
    DESIGN_SETTING_KEYS.previousConfig,
    serialize(state.publishedConfig)
  );
  if (!previousWrite.success) return previousWrite;

  const publishWrite = await writeSetting(DESIGN_SETTING_KEYS.published, target);
  if (!publishWrite.success) return publishWrite;

  const swapWrite = await writeSetting(DESIGN_SETTING_KEYS.previous, state.published);
  if (!swapWrite.success) return swapWrite;

  const selectWrite = await writeSetting(DESIGN_SETTING_KEYS.selected, target);
  if (!selectWrite.success) return selectWrite;

  refresh(target);
  return { success: true };
}
