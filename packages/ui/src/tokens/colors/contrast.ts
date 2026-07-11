/**
 * ADR-003 Layer 3 — semantic token contrast contracts.
 *
 * Resolves catalog tokens to sRGB hex (light + dark) and defines which
 * foreground/background pairs the product claims, at which WCAG floor.
 *
 * Not a component test: pure token math. Storybook axe (Layer 1) still
 * catches rendered UI; this pins token decisions so a regen cannot silently
 * break documented pairs.
 */
import * as radixColors from "@radix-ui/colors";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ColorMode } from "./modes";
import { type PaletteName, type RadixStep, palette } from "./palette";
import {
  type SemanticColorName,
  type SemanticRef,
  getSemanticRef,
  semanticColorTokens,
} from "./semantic";

// ── WCAG relative luminance / contrast ───────────────────────────────

/** sRGB channel → linear. */
function linearizeChannel(channel01: number): number {
  return channel01 <= 0.03928
    ? channel01 / 12.92
    : ((channel01 + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance (WCAG 2.x) for opaque `#rrggbb` / `#rgb`. */
export function relativeLuminance(hex: string): number {
  const rgb = parseHexRgb(hex);
  const r = linearizeChannel(rgb[0]);
  const g = linearizeChannel(rgb[1]);
  const b = linearizeChannel(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two opaque sRGB colors (order-independent). */
export function contrastRatio(a: string, b: string): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

export const WCAG_AA_BODY = 4.5;
export const WCAG_AA_LARGE = 3;

// ── Hex parsing ──────────────────────────────────────────────────────

function parseHexRgb(hex: string): [number, number, number] {
  let h = hex.trim().toLowerCase();
  if (h === "white") return [1, 1, 1];
  if (h === "black") return [0, 0, 0];
  if (!h.startsWith("#")) {
    throw new Error(`Expected #hex color, got "${hex}"`);
  }
  h = h.slice(1);
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length === 8) {
    // Drop alpha — contrast pairs use opaque fills only.
    h = h.slice(0, 6);
  }
  if (h.length !== 6 || !/^[0-9a-f]+$/.test(h)) {
    throw new Error(`Invalid hex color "${hex}"`);
  }
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
}

function normalizeHex(hex: string): string {
  const rgb = parseHexRgb(hex);
  return `#${rgb
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

// ── Custom brand blue (hand-authored CSS, not npm Radix) ─────────────

type BlueScale = Record<RadixStep, string>;

function loadCustomBlueScales(): { light: BlueScale; dark: BlueScale } {
  const cssPath = join(dirname(fileURLToPath(import.meta.url)), "blue.css");
  const css = readFileSync(cssPath, "utf8");
  const darkIdx = css.search(/\.dark\b/);
  const lightPart = darkIdx === -1 ? css : css.slice(0, darkIdx);
  const darkPart = darkIdx === -1 ? "" : css.slice(darkIdx);

  function parseBlock(block: string): BlueScale {
    const out = {} as BlueScale;
    for (const match of block.matchAll(
      /--blue-(\d+):\s*(#[0-9A-Fa-f]{3,8})\b/g,
    )) {
      const step = Number(match[1]) as RadixStep;
      const raw = match[2];
      if (raw && step >= 1 && step <= 12) {
        out[step] = normalizeHex(raw);
      }
    }
    return out;
  }

  const light = parseBlock(lightPart);
  const dark = parseBlock(darkPart);
  for (const step of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
    if (!light[step]) throw new Error(`blue.css light missing --blue-${step}`);
    if (!dark[step]) throw new Error(`blue.css dark missing --blue-${step}`);
  }
  return { light, dark };
}

const customBlue = loadCustomBlueScales();

// ── Resolve SemanticRef / token name → hex ───────────────────────────

type RadixScaleModule = Record<string, string>;

function radixScale(radixName: string, mode: ColorMode): RadixScaleModule {
  const key = mode === "dark" ? `${radixName}Dark` : radixName;
  const scale = (radixColors as Record<string, RadixScaleModule | undefined>)[
    key
  ];
  if (!scale) {
    throw new Error(`@radix-ui/colors missing scale "${key}"`);
  }
  return scale;
}

function resolvePaletteStepToHex(
  paletteName: PaletteName,
  step: RadixStep,
  mode: ColorMode,
): string {
  const radixName = palette[paletteName].radix;

  if (radixName === "blue") {
    return customBlue[mode][step];
  }

  const scale = radixScale(radixName, mode);
  const key = `${radixName}${step}`;
  const value = scale[key];
  if (!value) {
    throw new Error(`Missing ${key} on ${mode} scale`);
  }
  if (!value.startsWith("#")) {
    throw new Error(`Expected hex for ${key}, got "${value}"`);
  }
  return normalizeHex(value);
}

/** sRGB mix of two hex colors (matches CSS color-mix in srgb for opaque hex). */
function mixHex(a: string, b: string, aPercent: number): string {
  const t = aPercent / 100;
  const ca = parseHexRgb(a);
  const cb = parseHexRgb(b);
  const mixed: [number, number, number] = [
    ca[0] * t + cb[0] * (1 - t),
    ca[1] * t + cb[1] * (1 - t),
    ca[2] * t + cb[2] * (1 - t),
  ];
  return `#${mixed
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Resolve a single semantic ref to opaque sRGB `#rrggbb`. */
export function resolveSemanticRefToHex(
  ref: SemanticRef,
  mode: ColorMode,
): string {
  if ("kind" in ref && ref.kind === "fixed") {
    return normalizeHex(ref.value);
  }
  if ("kind" in ref && ref.kind === "overlay") {
    throw new Error(
      `Overlay refs (${ref.name}-a${ref.step}) are not opaque; skip in contrast pairs`,
    );
  }
  if ("kind" in ref && ref.kind === "mix") {
    const aHex = resolvePaletteStepToHex(ref.a.palette, ref.a.step, mode);
    const bHex =
      "kind" in ref.b
        ? ref.b.kind === "black"
          ? "#000000"
          : "#ffffff"
        : resolvePaletteStepToHex(ref.b.palette, ref.b.step, mode);
    return mixHex(aHex, bHex, ref.aPercent);
  }

  return resolvePaletteStepToHex(ref.palette, ref.step, mode);
}

/** Resolve a catalog token name to hex in the given color mode. */
export function resolveSemanticTokenToHex(
  name: SemanticColorName,
  mode: ColorMode,
): string {
  const token = semanticColorTokens.find((t) => t.name === name);
  if (!token) {
    throw new Error(`Unknown semantic color token "${name}"`);
  }
  return resolveSemanticRefToHex(getSemanticRef(token, mode), mode);
}

// ── Pair catalog ─────────────────────────────────────────────────────

/**
 * How strictly we enforce the pair:
 * - `body` — WCAG AA normal text (4.5:1)
 * - `large-ui` — WCAG AA large text / UI component (3:1); typical Radix solid + white
 * - `floor` — known under-body-AA debt; pin a measured floor so it cannot regress
 *   until tokens are deliberately improved (then raise or promote to `body`)
 */
export type ContrastRole = "body" | "large-ui" | "floor";

export interface SemanticContrastPair {
  /** Stable id for test titles / failure messages. */
  id: string;
  fg: SemanticColorName;
  bg: SemanticColorName;
  role: ContrastRole;
  /**
   * Required for `floor` pairs (and optional override for others).
   * Defaults: body → 4.5, large-ui → 3.
   */
  minRatio?: number;
  /** Why this pair exists / why the role is not plain body AA. */
  note?: string;
  /** Modes to check; default both. */
  modes?: readonly ColorMode[];
}

function pair(
  fg: SemanticColorName,
  bg: SemanticColorName,
  role: ContrastRole,
  opts?: Omit<SemanticContrastPair, "id" | "fg" | "bg" | "role">,
): SemanticContrastPair {
  return {
    id: `${fg}/${bg}`,
    fg,
    bg,
    role,
    ...opts,
  };
}

/**
 * Product contrast contracts — every intentional fg/bg combination we claim.
 *
 * Target is WCAG AA for how the kit actually paints type:
 * - Buttons / badges use `text-label-*` at ~12–14px regular → **normal text → 4.5:1**
 *   (not large-text 3:1; large would need ≥18pt or ≥14pt bold).
 * - Soft / outline status uses `*-text` on canvas, surface, or `*-subtle` → **4.5:1**.
 *
 * Use `floor` only for deliberate, documented exceptions (none today).
 * Use `large-ui` only if a pair is intentionally non-text UI chrome at 3:1.
 */
export const semanticContrastPairs: readonly SemanticContrastPair[] = [
  // ── Neutral text on surfaces ───────────────────────────────────────
  pair("fg-default", "bg-canvas", "body"),
  pair("fg-default", "bg-subtle", "body"),
  pair("fg-default", "bg-surface", "body"),
  pair("fg-muted", "bg-canvas", "body"),
  pair("fg-muted", "bg-surface", "body"),
  pair("fg-subtle", "bg-canvas", "body", {
    note: "Same step as muted (gray-11): faint token is safe for any use, not only disabled/hints",
  }),
  pair("fg-subtle", "bg-surface", "body"),
  pair("fg-on-inverse", "bg-inverse", "body"),

  // ── Brand text ─────────────────────────────────────────────────────
  pair("accent-text", "bg-canvas", "body"),
  pair("accent-text", "bg-surface", "body"),
  pair("accent-text", "accent-subtle", "body"),

  // ── Status text (soft badges, messages, outline) ───────────────────
  pair("success-text", "bg-canvas", "body"),
  pair("success-text", "bg-surface", "body"),
  pair("success-text", "success-subtle", "body"),
  pair("warning-text", "bg-canvas", "body"),
  pair("warning-text", "bg-surface", "body"),
  pair("warning-text", "warning-subtle", "body"),
  pair("danger-text", "bg-canvas", "body"),
  pair("danger-text", "bg-surface", "body"),
  pair("danger-text", "danger-subtle", "body"),
  pair("info-text", "bg-canvas", "body"),
  pair("info-text", "bg-surface", "body"),
  pair("info-text", "info-subtle", "body"),

  // ── Solid fills + on-fill ink (button / solid badge labels) ────────
  pair("fg-on-accent", "accent-solid", "body", {
    note: "Custom brand blue-9 seeded for white label text",
  }),
  pair("fg-on-accent", "accent-solid-hover", "body"),
  pair("fg-on-warning", "warning-solid", "body", {
    note: "Fixed dark ink on amber solid (not white)",
  }),
  pair("fg-on-success", "success-solid", "body", {
    note: "Solid tuned for white labels at text-label-* sizes (4.5:1)",
  }),
  pair("fg-on-success", "success-solid-hover", "body"),
  pair("fg-on-danger", "danger-solid", "body"),
  pair("fg-on-danger", "danger-solid-hover", "body"),
  pair("fg-on-info", "info-solid", "body"),
  pair("fg-on-info", "info-solid-hover", "body"),
] as const;

export function minRatioForPair(pair: SemanticContrastPair): number {
  if (pair.minRatio != null) return pair.minRatio;
  if (pair.role === "body") return WCAG_AA_BODY;
  if (pair.role === "large-ui") return WCAG_AA_LARGE;
  throw new Error(`Pair ${pair.id} role "floor" requires minRatio`);
}

export function modesForPair(pair: SemanticContrastPair): readonly ColorMode[] {
  return pair.modes ?? (["light", "dark"] as const);
}
