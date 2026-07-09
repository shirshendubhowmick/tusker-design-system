/**
 * Shared interactive control scale (Button, Input, IconButton, Spinner, …).
 *
 * Keeps hit targets and glyphs aligned across form chrome.
 * Components compose these classes and add their own padding/type/etc.
 *
 * Geometry (default Tailwind spacing):
 *   sm → 32px (step 8)
 *   md → 36px (step 9)
 *   lg → 40px (step 10)
 *
 * Prefer `ControlSize.*` over string literals in product code.
 */

export const ControlSize = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export type ControlSize = (typeof ControlSize)[keyof typeof ControlSize];

/** Low → high for matrices / docs. */
export const controlSizeOrder = [
  ControlSize.sm,
  ControlSize.md,
  ControlSize.lg,
] as const;

/** Fixed control height utilities. */
export const controlHeightClass = {
  [ControlSize.sm]: "h-8",
  [ControlSize.md]: "h-9",
  [ControlSize.lg]: "h-10",
} as const satisfies Record<ControlSize, string>;

/** Square outer box (same steps as height). */
export const controlBoxClass = {
  [ControlSize.sm]: "size-8",
  [ControlSize.md]: "size-9",
  [ControlSize.lg]: "size-10",
} as const satisfies Record<ControlSize, string>;

/**
 * Locked square with `!` — IconButton must beat Button size padding
 * and tertiary bare height collapse.
 */
export const controlBoxLockClass = {
  [ControlSize.sm]: "!size-8 !min-h-8 !min-w-8 !max-h-8 !max-w-8",
  [ControlSize.md]: "!size-9 !min-h-9 !min-w-9 !max-h-9 !max-w-9",
  [ControlSize.lg]: "!size-10 !min-h-10 !min-w-10 !max-h-10 !max-w-10",
} as const satisfies Record<ControlSize, string>;

/** Inline glyph / spinner size inside padded controls. */
export const controlGlyphClass = {
  [ControlSize.sm]: "size-3.5",
  [ControlSize.md]: "size-4",
  [ControlSize.lg]: "size-4.5",
} as const satisfies Record<ControlSize, string>;

/** `[&_svg]:…` form for icon slots (Input, etc.). */
export const controlGlyphSvgClass = {
  [ControlSize.sm]: "[&_svg]:size-3.5",
  [ControlSize.md]: "[&_svg]:size-4",
  [ControlSize.lg]: "[&_svg]:size-4.5",
} as const satisfies Record<ControlSize, string>;

/**
 * Icon-only controls use a slightly larger glyph at `lg`
 * (fills the 40px hit target better than the padded-control scale).
 */
export const controlIconOnlyGlyphSvgClass = {
  [ControlSize.sm]: "[&_svg]:size-3.5",
  [ControlSize.md]: "[&_svg]:size-4",
  [ControlSize.lg]: "[&_svg]:size-5",
} as const satisfies Record<ControlSize, string>;

/** Coerce CVA / optional size props to a known token (default `md`). */
export function resolveControlSize(
  size: ControlSize | null | undefined,
): ControlSize {
  if (size != null && size in controlHeightClass) {
    return size;
  }
  return ControlSize.md;
}
