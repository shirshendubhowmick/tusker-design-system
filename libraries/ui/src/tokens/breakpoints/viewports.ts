import type { BreakpointName } from "./scale";
import { breakpoints } from "./scale";

/**
 * Storybook viewport entries aligned to product breakpoints.
 *
 * Widths are chosen as representative devices *inside* each tier range so the
 * active tier matches what designers expect when using the toolbar:
 * - mobile  → 375px  (0–767)
 * - tablet  → 768px  (768–1023, tier start)
 * - desktop → 1280px (≥1024, comfortable app shell)
 *
 * @see https://storybook.js.org/docs/essentials/viewport
 */
export interface DesignSystemViewport {
  name: string;
  styles: { width: string; height: string };
  type: "mobile" | "tablet" | "desktop";
}

/** Viewport toolbar options (keys = Storybook viewport values). */
export const designSystemViewports = {
  mobile: {
    name: "Mobile",
    styles: {
      width: "375px",
      height: "812px",
    },
    type: "mobile" as const,
  },
  tablet: {
    name: "Tablet",
    styles: {
      width: `${breakpoints.tablet.minWidthPx}px`,
      height: "1024px",
    },
    type: "tablet" as const,
  },
  desktop: {
    name: "Desktop",
    styles: {
      width: "1280px",
      height: "900px",
    },
    type: "desktop" as const,
  },
} as const satisfies Record<BreakpointName, DesignSystemViewport>;

/** Default Storybook viewport when opening the project. */
export const defaultStorybookViewport: BreakpointName = "desktop";

/** Human notes for docs (width used in the toolbar vs tier range). */
export const storybookViewportNotes: Record<
  BreakpointName,
  { toolbarWidthPx: number; tier: string; note: string }
> = {
  mobile: {
    toolbarWidthPx: 375,
    tier: formatTier("mobile"),
    note: "Representative phone width inside the mobile tier.",
  },
  tablet: {
    toolbarWidthPx: breakpoints.tablet.minWidthPx,
    tier: formatTier("tablet"),
    note: "Starts exactly at the tablet min-width (768px).",
  },
  desktop: {
    toolbarWidthPx: 1280,
    tier: formatTier("desktop"),
    note: "Comfortable app shell above the 1024px desktop floor.",
  },
};

function formatTier(name: BreakpointName): string {
  const bp = breakpoints[name];
  if (bp.maxWidthPx == null) return `≥ ${bp.minWidthPx}px`;
  if (bp.minWidthPx === 0) return `0 – ${bp.maxWidthPx}px`;
  return `${bp.minWidthPx} – ${bp.maxWidthPx}px`;
}
