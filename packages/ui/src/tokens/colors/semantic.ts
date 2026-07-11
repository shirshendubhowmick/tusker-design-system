import type { ColorMode } from "./modes";
import type { PaletteName, RadixStep } from "./palette";

/**
 * Layer 3 — Semantic color tokens (light + dark)
 *
 * Every token has an explicit **light** and **dark** primitive reference.
 * Components only use the semantic name; mode is chosen by `.light` / `.dark`.
 */

/**
 * Palette step, fixed CSS color, alpha overlay, or a **scale-derived mix**.
 * Prefer palette / mix over one-off hex so rebrands stay in the scale system.
 */
export type SemanticRef =
  | { palette: PaletteName; step: RadixStep }
  | { kind: "fixed"; value: string }
  | { kind: "overlay"; name: "black" | "white"; step: RadixStep }
  | {
      kind: "mix";
      /** Weight of `a` as percent (1–99); remainder is `b`. */
      aPercent: number;
      a: { palette: PaletteName; step: RadixStep };
      b:
        | { palette: PaletteName; step: RadixStep }
        | { kind: "black" }
        | { kind: "white" };
    };

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
 * Mix two palette steps (or a step with black/white) via CSS `color-mix`.
 * `aPercent` is the share of step `a` (e.g. 85 → mostly `a`, 15% `b`).
 */
function mix(
  a: { palette: PaletteName; step: RadixStep },
  b:
    | { palette: PaletteName; step: RadixStep }
    | { kind: "black" }
    | { kind: "white" },
  aPercent: number,
): SemanticRef {
  if (!Number.isInteger(aPercent) || aPercent < 1 || aPercent > 99) {
    throw new Error(`mix aPercent must be integer 1–99, got ${aPercent}`);
  }
  return { kind: "mix", aPercent, a, b };
}

/** Same mix in light and dark (each mode still resolves its own scale values). */
function mixBoth(
  a: { palette: PaletteName; step: RadixStep },
  b:
    | { palette: PaletteName; step: RadixStep }
    | { kind: "black" }
    | { kind: "white" },
  aPercent: number,
): Pick<SemanticToken, "light" | "dark"> {
  const ref = mix(a, b, aPercent);
  return { light: ref, dark: ref };
}

/** Darken a scale step toward black (share of black = 100 - aPercent). */
function darkenBoth(
  palette: PaletteName,
  step: RadixStep,
  /** Percent of the original step kept (e.g. 80 → 20% black). */
  keepPercent: number,
): Pick<SemanticToken, "light" | "dark"> {
  return mixBoth({ palette, step }, { kind: "black" }, keepPercent);
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
    description:
      "Faint UI text (placeholders, hints, de-emphasized chrome). Same step as muted (gray-11) so any use stays body-AA safe on canvas/surface — we cannot enforce “only on disabled,” so the token is safe everywhere rather than a fragile gray-10 exception.",
    ...both("gray", 11),
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
  // Solids: Radix step 9 + white is only ~3:1 (AA large). Buttons/badges use
  // text-label-* (~12–14px regular) → body AA 4.5:1. Darken step 9 toward black
  // via color-mix (still scale-derived; works in both modes — step 11 in dark is
  // a *light* ink and cannot be used as a solid fill).
  {
    name: "success-solid",
    group: "success",
    description: "Solid success fill (AA body with fg-on-success / white)",
    ...darkenBoth("green", 9, 80),
  },
  {
    name: "success-solid-hover",
    group: "success",
    description: "Solid success hover",
    ...darkenBoth("green", 9, 70),
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
    description:
      "Success-colored text / icons (soft + outline + secondary/tertiary)",
    // Light: blend 11→12 (pure 11 fails soft AA; pure 12 reads near-grey).
    // Dark: step 11 (light green on dark canvas).
    light: mix(
      { palette: "green", step: 11 },
      { palette: "green", step: 12 },
      85,
    ),
    dark: p("green", 11),
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
    light: mix(
      { palette: "amber", step: 11 },
      { palette: "amber", step: 12 },
      85,
    ),
    dark: p("amber", 11),
  },

  // ── Danger ─────────────────────────────────────────────────────────
  {
    name: "danger-solid",
    group: "danger",
    description: "Solid danger fill (destructive CTA, AA body with white)",
    ...darkenBoth("red", 9, 85),
  },
  {
    name: "danger-solid-hover",
    group: "danger",
    description: "Solid danger hover",
    ...darkenBoth("red", 9, 70),
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
    description: "Solid info fill (AA body with fg-on-info / white)",
    ...darkenBoth("cyan", 9, 75),
  },
  {
    name: "info-solid-hover",
    group: "info",
    description: "Solid info hover",
    ...darkenBoth("cyan", 9, 65),
  },
  {
    name: "info-subtle",
    group: "info",
    description: "Soft info background",
    ...both("cyan", 3),
  },
  {
    name: "info-border",
    group: "info",
    description: "Info border",
    ...both("cyan", 7),
  },
  {
    name: "info-text",
    group: "info",
    description: "Info-colored text / icons",
    light: mix(
      { palette: "cyan", step: 11 },
      { palette: "cyan", step: 12 },
      85,
    ),
    dark: p("cyan", 11),
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
  if ("kind" in ref && ref.kind === "mix") {
    const a = `${ref.a.palette}.${ref.a.step}`;
    const b = "kind" in ref.b ? ref.b.kind : `${ref.b.palette}.${ref.b.step}`;
    return `mix(${a} ${ref.aPercent}%, ${b})`;
  }
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
