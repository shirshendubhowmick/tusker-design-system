import { cn } from "./cn";

/**
 * Focus ring intents — brand default + validation / status tints.
 * Geometry matches `shadow-focus` (3px soft ring).
 */
export const FocusRingIntent = {
  default: "default",
  success: "success",
  danger: "danger",
  warning: "warning",
} as const;

export type FocusRingIntent =
  (typeof FocusRingIntent)[keyof typeof FocusRingIntent];

/**
 * Shadow utilities (no pseudo prefix) — product tokens from the shadow scale.
 * Status intents use named utilities (`shadow-focus-success`, …), not Tailwind
 * arbitrary box-shadow color-mix values, so rings stay live CSS variables
 * (dark mode) and avoid nested color-mix through mixed solid tokens.
 *
 * Note: do not write fake utility class strings in comments — Tailwind v4
 * content scanning will try to generate them and can crash the CSS pipeline.
 */
export const focusRingShadowClass = {
  [FocusRingIntent.default]: "shadow-focus",
  [FocusRingIntent.success]: "shadow-focus-success",
  [FocusRingIntent.danger]: "shadow-focus-danger",
  [FocusRingIntent.warning]: "shadow-focus-warning",
} as const satisfies Record<FocusRingIntent, string>;

export interface FocusRingOptions {
  /**
   * Ring color intent.
   * @default "default"
   */
  intent?: FocusRingIntent;
  /**
   * When true, apply on `:focus-within` (wrapper chrome with a nested control).
   * When false, apply on `:focus-visible` (the element itself).
   * @default false
   */
  within?: boolean;
  /**
   * Suppress the UA outline on the same pseudo.
   * Defaults to `true` for self-focus, `false` for within (inner control owns outline).
   */
  outlineNone?: boolean;
}

function withPseudo(within: boolean, utility: string): string {
  const pseudo = within ? "focus-within" : "focus-visible";
  return `${pseudo}:${utility}`;
}

/**
 * Shared keyboard focus ring for interactive controls.
 *
 * @example
 * ```tsx
 * // Button / Checkbox / IconButton (self-focused)
 * className={cn(focusRing())}
 *
 * // Input field chrome (descendant focus)
 * className={cn(focusRing({ intent: "danger", within: true }))}
 *
 * // CVA tables
 * focusRingClass.within.success
 * ```
 */
export function focusRing(options: FocusRingOptions = {}): string {
  const intent = options.intent ?? FocusRingIntent.default;
  const within = options.within === true;
  const outlineNone = options.outlineNone ?? !within;
  const shadow = focusRingShadowClass[intent];

  return cn(
    outlineNone && withPseudo(within, "outline-none"),
    withPseudo(within, shadow),
  );
}

/**
 * Pre-built class maps for CVA variant tables.
 * - `self`   → `:focus-visible` (+ outline-none)
 * - `within` → `:focus-within` (no outline-none)
 */
export const focusRingClass = {
  self: {
    [FocusRingIntent.default]: focusRing({ intent: FocusRingIntent.default }),
    [FocusRingIntent.success]: focusRing({ intent: FocusRingIntent.success }),
    [FocusRingIntent.danger]: focusRing({ intent: FocusRingIntent.danger }),
    [FocusRingIntent.warning]: focusRing({ intent: FocusRingIntent.warning }),
  },
  within: {
    [FocusRingIntent.default]: focusRing({
      intent: FocusRingIntent.default,
      within: true,
    }),
    [FocusRingIntent.success]: focusRing({
      intent: FocusRingIntent.success,
      within: true,
    }),
    [FocusRingIntent.danger]: focusRing({
      intent: FocusRingIntent.danger,
      within: true,
    }),
    [FocusRingIntent.warning]: focusRing({
      intent: FocusRingIntent.warning,
      within: true,
    }),
  },
} as const satisfies Record<"self" | "within", Record<FocusRingIntent, string>>;
