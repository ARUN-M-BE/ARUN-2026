import {
  isDesignId,
  type DesignConfig,
  type DesignId,
} from "@/config/designs";
import { getDesignState } from "@/lib/design-settings";

/**
 * Resolves which design the homepage renders.
 *
 * - `?view=<id>` renders that design as a one-off preview. Nothing is written,
 *   so an admin can open any view in a new tab without affecting the live site.
 * - Otherwise the design stored in `design.published` is used, which only
 *   changes when an admin explicitly publishes.
 *
 * Never throws: a cold database falls back to the Current Design.
 */
export interface ActiveView {
  id: DesignId;
  config: DesignConfig;
  /** True when the view came from `?view=` and is not persisted. */
  preview: boolean;
  /** True when the admin has enabled the visitor-facing view switcher. */
  viewerToggle: boolean;
}

export function parseViewParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function resolvePageView(requested?: string): Promise<ActiveView> {
  const state = await getDesignState();

  if (requested && isDesignId(requested)) {
    const draft = state.drafts[requested];
    return {
      id: requested,
      config: draft ?? state.configs[requested],
      preview: true,
      viewerToggle: false,
    };
  }

  return {
    id: state.published,
    config: state.publishedConfig,
    preview: false,
    viewerToggle: state.viewerToggle,
  };
}
