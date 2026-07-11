/**
 * Layer 1 — Palette selection
 *
 * Product choices for this Dev tool SaaS. Each entry maps a **product palette
 * name** to a **Radix color scale**. Change the Radix source here (and the CSS
 * imports) to rebrand without renaming semantic tokens.
 *
 * Radix step roles (every scale):
 * | Step  | Use                                              |
 * | ----- | ------------------------------------------------ |
 * | 1–2   | App backgrounds                                  |
 * | 3–5   | Component / interactive surfaces                 |
 * | 6–8   | Borders, separators, focus rings                 |
 * | 9–10  | Solid fills (9 default, 10 hover)                |
 * | 11–12 | Text (11 low-contrast, 12 high-contrast)         |
 */

export const RADIX_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type RadixStep = (typeof RADIX_STEPS)[number];

export const palette = {
  /**
   * Neutral chrome — cool slate for dense, technical UIs (dashboards, logs,
   * sidebars). Pairs cleanly with monospaced code and the navy brand.
   */
  gray: {
    radix: "slate",
    role: "neutral",
    description: "App chrome: canvases, panels, borders, body text",
  },
  /**
   * Brand / accent — custom navy-blue scale seeded from #0D5BD8, generated
   * with the Radix custom palette tool (`src/tokens/colors/blue.css`, not an
   * npm scale). Info uses cyan so brand and info never collide. Used for
   * primary CTAs, selected nav, focus.
   */
  brand: {
    radix: "blue",
    role: "brand",
    description: "Primary actions, selection, brand emphasis, focus ring",
  },
  /**
   * Success — healthy deployments, passing checks, connected integrations.
   */
  green: {
    radix: "green",
    role: "success",
    description: "Positive status and confirmation",
  },
  /**
   * Warning — degraded services, rate limits, non-blocking attention.
   * Amber over yellow for better contrast on both themes.
   */
  amber: {
    radix: "amber",
    role: "warning",
    description: "Caution and non-fatal issues",
  },
  /**
   * Danger — failed jobs, destructive actions, blocking errors.
   */
  red: {
    radix: "red",
    role: "danger",
    description: "Errors and destructive actions",
  },
  /**
   * Info — neutral informational callouts, documentation, secondary links.
   * Cyan, not blue: the brand scale is a custom navy blue, so info stays in a
   * clearly different hue and never looks like a primary CTA. (Radix `cyan`
   * keeps white text on step-9 solids; `sky` would need dark ink.)
   */
  cyan: {
    radix: "cyan",
    role: "info",
    description: "Informational emphasis (not brand)",
  },
} as const;

export type PaletteName = keyof typeof palette;
export type PaletteRole = (typeof palette)[PaletteName]["role"];

/** Overlay primitives (not 12-step scales). */
export const overlays = {
  black: { radix: "black", description: "Dark scrims / modals (alpha scale)" },
  white: {
    radix: "white",
    description: "Light highlights on dark surfaces (alpha scale)",
  },
} as const;
