import type { ComponentType } from "react";
import type { DesignId } from "@/config/designs";
import type { DesignProps } from "@/themes/types";

import CurrentDesign from "@/themes/current";
import ParallaxDesign from "@/themes/parallax";
import GlassDesign from "@/themes/glass";
import BentoSdesign from "@/themes/bento";

/**
 * Design registry — the only place that knows which component renders which
 * design id. Every design receives the same PortfolioContent payload, so a new
 * design is one folder plus one line here.
 *
 * Designs without an implementation stay in the metadata registry (so the
 * studio can describe them) but are not selectable or publishable — a card is
 * never allowed to pretend a design works.
 */
export type DesignView = ComponentType<DesignProps>;

const COMPONENTS: Partial<Record<DesignId, DesignView>> = {
  current: CurrentDesign,
  parallax: ParallaxDesign,
  glass: GlassDesign,
  bento: BentoSdesign,
};

export function isDesignImplemented(id: DesignId): boolean {
  return Boolean(COMPONENTS[id]);
}

export function getDesignComponent(id: DesignId): DesignView {
  return COMPONENTS[id] ?? CurrentDesign;
}

export const IMPLEMENTED_DESIGN_IDS = Object.keys(COMPONENTS) as DesignId[];
