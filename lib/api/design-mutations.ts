"use client";

import { adminApi } from "@/lib/api/admin";

export interface DesignActionResult {
  success: boolean;
  error?: string;
}

export const saveDesignDraft = (
  designId: string,
  config: unknown
): Promise<DesignActionResult> => adminApi.saveDesignDraft(designId, config);

export const resetDesignDraft = (designId: string): Promise<DesignActionResult> =>
  adminApi.resetDesignDraft(designId);

export const selectDesignTheme = (designId: string): Promise<DesignActionResult> =>
  adminApi.selectDesignTheme(designId);

export const publishDesignTheme = (designId: string): Promise<DesignActionResult> =>
  adminApi.publishDesignTheme(designId);

export const savePaletteTheme = (
  themeId: string,
  mode: string
): Promise<DesignActionResult> => adminApi.savePaletteTheme(themeId, mode);

export const setPalettePickerEnabled = (enabled: boolean): Promise<DesignActionResult> =>
  adminApi.setPalettePickerEnabled(enabled);

export const setDesignViewerToggle = (enabled: boolean): Promise<DesignActionResult> =>
  adminApi.setDesignViewerToggle(enabled);

export const rollbackDesignTheme = (): Promise<DesignActionResult> =>
  adminApi.rollbackDesignTheme();
