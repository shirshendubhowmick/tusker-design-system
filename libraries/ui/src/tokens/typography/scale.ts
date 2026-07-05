/**
 * Layer 2 — Typography primitives (scales).
 *
 * Sized for dense developer tooling: default body is 14px (`sm`), not 16px.
 * Values are rem-based (root 16px assumed).
 *
 * `defaultLineHeight` is the line-height Tailwind pairs with bare `text-*`
 * size utilities (semantic text styles set their own leading).
 */

/** Font size steps → rem / px reference */
export const fontSizes = {
  '2xs': {
    rem: '0.6875rem',
    px: 11,
    defaultLineHeight: '1.25',
    description: 'Micro labels, dense badges',
  },
  xs: {
    rem: '0.75rem',
    px: 12,
    defaultLineHeight: '1.5',
    description: 'Captions, meta, table secondary',
  },
  sm: {
    rem: '0.875rem',
    px: 14,
    defaultLineHeight: '1.5',
    description: 'Default body / controls (tool density)',
  },
  md: {
    rem: '1rem',
    px: 16,
    defaultLineHeight: '1.5',
    description: 'Comfortable body, dialog copy',
  },
  lg: {
    rem: '1.125rem',
    px: 18,
    defaultLineHeight: '1.375',
    description: 'Emphasized body, small titles',
  },
  xl: {
    rem: '1.25rem',
    px: 20,
    defaultLineHeight: '1.25',
    description: 'Section titles',
  },
  '2xl': {
    rem: '1.5rem',
    px: 24,
    defaultLineHeight: '1.25',
    description: 'Page section headings',
  },
  '3xl': {
    rem: '1.875rem',
    px: 30,
    defaultLineHeight: '1.25',
    description: 'Page titles',
  },
  '4xl': {
    rem: '2.25rem',
    px: 36,
    defaultLineHeight: '1.25',
    description: 'Marketing / empty-state hero',
  },
} as const;

export type FontSizeName = keyof typeof fontSizes;

/**
 * Extra Tailwind size aliases emitted into CSS (not primary product steps).
 * `base` keeps `text-base` working as the comfortable 16px body (`md`).
 */
export const fontSizeAliases = {
  base: 'md',
} as const satisfies Record<string, FontSizeName>;

export const fontWeights = {
  regular: { value: '400', description: 'Body copy' },
  medium: { value: '500', description: 'Labels, nav items, emphasis' },
  semibold: { value: '600', description: 'Headings, strong UI labels' },
  bold: { value: '700', description: 'Rare high emphasis' },
} as const;

export type FontWeightName = keyof typeof fontWeights;

export const lineHeights = {
  none: { value: '1', description: 'Icons, single-line chips' },
  tight: { value: '1.25', description: 'Headings' },
  snug: { value: '1.375', description: 'Compact multi-line UI' },
  normal: { value: '1.5', description: 'Body text' },
  relaxed: { value: '1.625', description: 'Long-form / docs' },
} as const;

export type LineHeightName = keyof typeof lineHeights;

export const letterSpacings = {
  tighter: { value: '-0.02em', description: 'Large headings' },
  tight: { value: '-0.01em', description: 'Titles' },
  normal: { value: '0', description: 'Default' },
  wide: { value: '0.02em', description: 'Overlines, all-caps labels' },
  wider: { value: '0.04em', description: 'Eyebrow labels' },
} as const;

export type LetterSpacingName = keyof typeof letterSpacings;
