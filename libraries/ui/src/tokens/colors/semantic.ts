import type { ColorMode } from "./modes";
import type { PaletteName, RadixStep } from "./palette";

/**
 * Layer 3 — Semantic color tokens (light + dark)
 *
 * Every token has an explicit **light** and **dark** primitive reference.
 * Components only use the semantic name; mode is chosen by `.light` / `.dark`.
 */

export type SemanticRef =
  | { palette: PaletteName; step: RadixStep }
  | { kind: "fixed"; value: string }
  | { kind: "overlay"; name: "black" | "white"; step: RadixStep };

export interface SemanticToken {
  /** CSS / Tailwind token name without the `color-` prefix (e.g. `bg-canvas`). */
  name: string;
  /** Human-readable purpose. */
  description: string;
  /** Primitive reference in light mode. */
  light: SemanticRef;
  /** Primitive reference in dark mode. */
  dark: SemanticRef;
  /** Grouping for docs. */
  group:
    | "background"
    | "foreground"
    | "border"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "focus"
    | "overlay";
}

function p(palette: PaletteName, step: RadixStep): SemanticRef {
  return { palette, step };
}

/** Same step mapping in both modes (Radix scale values still change). */
function both(
  palette: PaletteName,
  step: RadixStep,
): Pick<SemanticToken, "light" | "dark"> {
  const ref = p(palette, step);
  return { light: ref, dark: ref };
}

function fixedBoth(value: string): Pick<SemanticToken, "light" | "dark"> {
  const ref = { kind: "fixed" as const, value };
  return { light: ref, dark: ref };
}

/**
 * Canonical semantic color list — single source of truth.
 * CSS (`semantic.css`, `semantic-dark.css`) is generated via `pnpm tokens:generate`.
 */
export const semanticColorTokens = [
  // ── Backgrounds ────────────────────────────────────────────────────
  // Same step indices: Radix dark scales invert luminance automatically.
  {
    name: "bg-canvas",
    group: "background",
    description: "App root canvas / page background",
    ...both("gray", 1),
  },
  {
    name: "bg-subtle",
    group: "background",
    description: "Subtle regions (sidebar, table header, well)",
    ...both("gray", 2),
  },
  {
    name: "bg-surface",
    group: "background",
    description: "Raised surface (card, panel, popover)",
    // Dark: slightly higher step so cards lift off the canvas more clearly.
    light: p("gray", 2),
    dark: p("gray", 3),
  },
  {
    name: "bg-surface-hover",
    group: "background",
    description: "Hovered surface / row",
    light: p("gray", 3),
    dark: p("gray", 4),
  },
  {
    name: "bg-surface-active",
    group: "background",
    description: "Pressed or selected surface",
    light: p("gray", 4),
    dark: p("gray", 5),
  },
  {
    name: "bg-inverse",
    group: "background",
    description: "Inverted surface (tooltips, inverse chips)",
    ...both("gray", 12),
  },

  // ── Foreground / text ──────────────────────────────────────────────
  {
    name: "fg-default",
    group: "foreground",
    description: "Primary body text and icons",
    ...both("gray", 12),
  },
  {
    name: "fg-muted",
    group: "foreground",
    description: "Secondary text (labels, meta, help)",
    ...both("gray", 11),
  },
  {
    name: "fg-subtle",
    group: "foreground",
    description: "Tertiary text (placeholders, disabled hints)",
    ...both("gray", 10),
  },
  {
    name: "fg-on-accent",
    group: "foreground",
    description: "Text/icons on solid accent fills",
    ...fixedBoth("white"),
  },
  {
    name: "fg-on-inverse",
    group: "foreground",
    description: "Text on inverse surfaces",
    ...both("gray", 1),
  },
  {
    name: "fg-on-success",
    group: "foreground",
    description: "Text on solid success fills",
    ...fixedBoth("white"),
  },
  {
    name: "fg-on-warning",
    group: "foreground",
    description:
      "Text on solid warning fills — fixed dark ink (amber solids stay bright in both modes)",
    // Do NOT use gray-12: it becomes light in dark mode and fails on amber.
    ...fixedBoth("#1c2024"),
  },
  {
    name: "fg-on-danger",
    group: "foreground",
    description: "Text on solid danger fills",
    ...fixedBoth("white"),
  },
  {
    name: "fg-on-info",
    group: "foreground",
    description: "Text on solid info fills",
    ...fixedBoth("white"),
  },

  // ── Borders ────────────────────────────────────────────────────────
  {
    name: "border-default",
    group: "border",
    description: "Default control and card borders",
    ...both("gray", 6),
  },
  {
    name: "border-muted",
    group: "border",
    description: "Hairline separators, subtle dividers",
    ...both("gray", 5),
  },
  {
    name: "border-strong",
    group: "border",
    description: "Emphasized borders / focus-adjacent",
    ...both("gray", 8),
  },
  {
    name: "border-hover",
    group: "border",
    description: "Border on interactive hover",
    ...both("gray", 7),
  },

  // ── Accent (brand) ─────────────────────────────────────────────────
  {
    name: "accent-solid",
    group: "accent",
    description: "Primary solid fill (CTA, selected control)",
    ...both("brand", 9),
  },
  {
    name: "accent-solid-hover",
    group: "accent",
    description: "Primary solid hover / active",
    ...both("brand", 10),
  },
  {
    name: "accent-subtle",
    group: "accent",
    description: "Soft brand background (badges, selected rows)",
    ...both("brand", 3),
  },
  {
    name: "accent-subtle-hover",
    group: "accent",
    description: "Soft brand hover background",
    ...both("brand", 4),
  },
  {
    name: "accent-border",
    group: "accent",
    description: "Brand-tinted border",
    ...both("brand", 7),
  },
  {
    name: "accent-text",
    group: "accent",
    description: "Brand-colored text and ghost actions",
    ...both("brand", 11),
  },

  // ── Success ────────────────────────────────────────────────────────
  {
    name: "success-solid",
    group: "success",
    description: "Solid success fill",
    ...both("green", 9),
  },
  {
    name: "success-solid-hover",
    group: "success",
    description: "Solid success hover",
    ...both("green", 10),
  },
  {
    name: "success-subtle",
    group: "success",
    description: "Soft success background (alerts, tags)",
    ...both("green", 3),
  },
  {
    name: "success-border",
    group: "success",
    description: "Success border",
    ...both("green", 7),
  },
  {
    name: "success-text",
    group: "success",
    description: "Success-colored text / icons",
    ...both("green", 11),
  },

  // ── Warning ────────────────────────────────────────────────────────
  {
    name: "warning-solid",
    group: "warning",
    description: "Solid warning fill",
    ...both("amber", 9),
  },
  {
    name: "warning-solid-hover",
    group: "warning",
    description: "Solid warning hover",
    ...both("amber", 10),
  },
  {
    name: "warning-subtle",
    group: "warning",
    description: "Soft warning background",
    ...both("amber", 3),
  },
  {
    name: "warning-border",
    group: "warning",
    description: "Warning border",
    ...both("amber", 7),
  },
  {
    name: "warning-text",
    group: "warning",
    description: "Warning-colored text / icons",
    ...both("amber", 11),
  },

  // ── Danger ─────────────────────────────────────────────────────────
  {
    name: "danger-solid",
    group: "danger",
    description: "Solid danger fill (destructive CTA)",
    ...both("red", 9),
  },
  {
    name: "danger-solid-hover",
    group: "danger",
    description: "Solid danger hover",
    ...both("red", 10),
  },
  {
    name: "danger-subtle",
    group: "danger",
    description: "Soft danger background",
    ...both("red", 3),
  },
  {
    name: "danger-border",
    group: "danger",
    description: "Danger border",
    ...both("red", 7),
  },
  {
    name: "danger-text",
    group: "danger",
    description: "Danger-colored text / icons",
    ...both("red", 11),
  },

  // ── Info ───────────────────────────────────────────────────────────
  {
    name: "info-solid",
    group: "info",
    description: "Solid info fill",
    ...both("blue", 9),
  },
  {
    name: "info-solid-hover",
    group: "info",
    description: "Solid info hover",
    ...both("blue", 10),
  },
  {
    name: "info-subtle",
    group: "info",
    description: "Soft info background",
    ...both("blue", 3),
  },
  {
    name: "info-border",
    group: "info",
    description: "Info border",
    ...both("blue", 7),
  },
  {
    name: "info-text",
    group: "info",
    description: "Info-colored text / icons",
    ...both("blue", 11),
  },

  // ── Focus / overlay ────────────────────────────────────────────────
  {
    name: "focus-ring",
    group: "focus",
    description: "Keyboard focus ring",
    ...both("brand", 8),
  },
  {
    name: "overlay-scrim",
    group: "overlay",
    description: "Modal / drawer scrim",
    light: { kind: "overlay", name: "black", step: 8 },
    // Dark: slightly heavier scrim so modals separate from dark canvas.
    dark: { kind: "overlay", name: "black", step: 9 },
  },
] as const satisfies readonly SemanticToken[];

export type SemanticColorName = (typeof semanticColorTokens)[number]["name"];

export const semanticColorGroups = [
  "background",
  "foreground",
  "border",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
  "focus",
  "overlay",
] as const;

export type SemanticColorGroup = (typeof semanticColorGroups)[number];

/** Resolve a semantic token ref to a human-readable primitive path for docs. */
export function formatSemanticRef(ref: SemanticRef): string {
  if ("kind" in ref && ref.kind === "fixed") return ref.value;
  if ("kind" in ref && ref.kind === "overlay")
    return `${ref.name}-a${ref.step}`;
  return `${ref.palette}.${ref.step}`;
}

/** Get the ref for a given mode. */
export function getSemanticRef(
  token: (typeof semanticColorTokens)[number],
  mode: ColorMode,
): SemanticRef {
  return mode === "dark" ? token.dark : token.light;
}

/** True when light and dark point at different primitive refs. */
export function hasModeOverride(
  token: (typeof semanticColorTokens)[number],
): boolean {
  return formatSemanticRef(token.light) !== formatSemanticRef(token.dark);
}
