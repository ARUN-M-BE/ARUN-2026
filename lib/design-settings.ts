import { cache } from "react";
import {
  DEFAULT_DESIGN_ID,
  DESIGNS,
  DESIGN_SETTING_KEYS,
  configsEqual,
  getDesign,
  normalizeDesignConfig,
  type DesignConfig,
  type DesignDefinition,
  type DesignId,
  type DesignStatus,
} from "@/config/designs";
import { SettingsRepository } from "@/server/repositories";

export interface DesignState {
  /** Design currently serving the public portfolio. */
  published: DesignId;
  /** Appearance snapshot baked into the published design. */
  publishedConfig: DesignConfig;
  /** Design that was live before the last publish (rollback target). */
  previous: DesignId | null;
  previousConfig: DesignConfig | null;
  /** Admin's current pick — selection never touches the live site. */
  selected: DesignId;
  /** Saved working config per design (only where a draft row exists). */
  drafts: Partial<Record<DesignId, DesignConfig>>;
  /** Effective config per design (draft → published snapshot → defaults). */
  configs: Record<DesignId, DesignConfig>;
  /** True when a rollback target exists. */
  canRollback: boolean;
  /** Whether visitors may switch views from the public site. */
  viewerToggle: boolean;
}

type SettingRow = { key: string; value: unknown };

function parseStored(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") || trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function readDesignId(value: unknown): DesignId | null {
  const parsed = parseStored(value);
  const candidate =
    parsed && typeof parsed === "object" && "id" in parsed
      ? (parsed as { id?: unknown }).id
      : parsed;
  if (typeof candidate !== "string") return null;
  const match = DESIGNS.find((design) => design.id === candidate.trim());
  return match ? match.id : null;
}

function readConfig(value: unknown, designId: DesignId): DesignConfig | null {
  const parsed = parseStored(value);
  if (!parsed || typeof parsed !== "object") return null;
  return normalizeDesignConfig(designId, parsed);
}

function buildConfigs(
  rows: SettingRow[],
  published: DesignId,
  publishedConfig: DesignConfig
): { drafts: Partial<Record<DesignId, DesignConfig>>; configs: Record<DesignId, DesignConfig> } {
  const drafts: Partial<Record<DesignId, DesignConfig>> = {};
  const configs = {} as Record<DesignId, DesignConfig>;

  for (const design of DESIGNS) {
    const row = rows.find((item) => item.key === DESIGN_SETTING_KEYS.draft(design.id));
    const draft = row ? readConfig(row.value, design.id) : null;
    if (draft) drafts[design.id] = draft;
    configs[design.id] =
      draft ?? (design.id === published ? publishedConfig : design.defaults);
  }

  return { drafts, configs };
}

/**
 * Reads the whole design lifecycle from site_settings. Never throws: a cold or
 * unreachable database falls back to "Current Design" so the site still renders.
 */
export const getDesignState = cache(async (): Promise<DesignState> => {
  let rows: SettingRow[] = [];
  try {
    const settings = await SettingsRepository.findMany();
    rows = (settings ?? []) as SettingRow[];
  } catch (error) {
    console.warn("[design-settings] unable to read design settings:", error);
  }

  const byKey = (key: string) => rows.find((row) => row.key === key)?.value;

  const published = readDesignId(byKey(DESIGN_SETTING_KEYS.published)) ?? DEFAULT_DESIGN_ID;
  const previousRaw = readDesignId(byKey(DESIGN_SETTING_KEYS.previous));
  const previous = previousRaw && previousRaw !== published ? previousRaw : null;

  const publishedConfig =
    readConfig(byKey(DESIGN_SETTING_KEYS.publishedConfig), published) ??
    getDesign(published).defaults;

  const { drafts, configs } = buildConfigs(rows, published, publishedConfig);

  const selected =
    readDesignId(byKey(DESIGN_SETTING_KEYS.selected)) ?? published;

  const previousConfig = previous
    ? readConfig(byKey(DESIGN_SETTING_KEYS.previousConfig), previous) ??
      configs[previous] ??
      getDesign(previous).defaults
    : null;

  // Absent row means "on" — the switcher is a visitor convenience, not a risk.
  const rawToggle = parseStored(byKey(DESIGN_SETTING_KEYS.viewerToggle));
  const viewerToggle =
    rawToggle === undefined || rawToggle === null
      ? true
      : !(rawToggle === false || rawToggle === "false");

  return {
    published,
    publishedConfig,
    previous,
    previousConfig,
    selected,
    drafts,
    configs,
    canRollback: Boolean(previous),
    viewerToggle,
  };
});

export function designStatus(state: DesignState, id: DesignId): DesignStatus {
  if (state.published === id) return "published";
  if (state.selected === id) return "selected";
  const draft = state.drafts[id];
  if (draft && !configsEqual(draft, getDesign(id).defaults)) return "preview";
  return "draft";
}

/** True when a design has unsaved-to-public appearance edits. */
export function hasDraftChanges(state: DesignState, id: DesignId): boolean {
  const draft = state.drafts[id];
  if (!draft) return false;
  if (state.published === id) return !configsEqual(draft, state.publishedConfig);
  return !configsEqual(draft, getDesign(id).defaults);
}

/** The design the public homepage renders right now. */
export async function getPublishedDesign(): Promise<{
  design: DesignDefinition;
  config: DesignConfig;
  state: DesignState;
}> {
  const state = await getDesignState();
  return { design: getDesign(state.published), config: state.publishedConfig, state };
}

/**
 * Preview resolution: draft → published snapshot (if live) → defaults.
 * Drafts never leak to the public site, only to the isolated preview route.
 */
export async function getPreviewDesign(id: DesignId): Promise<{
  design: DesignDefinition;
  config: DesignConfig;
  isDraft: boolean;
}> {
  const state = await getDesignState();
  const draft = state.drafts[id];
  return {
    design: getDesign(id),
    config: draft ?? state.configs[id],
    isDraft: Boolean(draft),
  };
}

export function statusLabel(status: DesignStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
