/**
 * Box shadow tokens for elevation and focus (Dev tool SaaS).
 *
 * Prefer semantic elevation names over one-off `shadow-[…]` values.
 * Values differ slightly in dark mode (see `primitives.css` + dark overrides)
 * so surfaces stay legible on near-black canvases.
 *
 * Downward elevation (default — cards, modals, menus):
 *   none < xs < sm < md < lg < xl
 *
 * Upward / top shadows (content below the surface — bottom sheets, sticky footers):
 *   top-xs < top-sm < top-md < top-lg
 *
 * Special:
 *   - inner  — inset wells / pressed inputs
 *   - focus  — keyboard focus ring (pairs with focus-ring color)
 *   - border — 1px outline shadow (when you need a ring without layout shift)
 */

export type ShadowModeValues = {
  /** CSS box-shadow for light mode */
  light: string;
  /** CSS box-shadow for dark mode */
  dark: string;
};

export type ShadowToken = {
  name: string;
  description: string;
  group: 'elevation' | 'top' | 'focus' | 'utility';
  /** Tailwind utility, e.g. `shadow-md` */
  utility: string;
  /** CSS variable, e.g. `--shadow-md` */
  cssVar: string;
} & ShadowModeValues;

/**
 * Canonical shadow list. CSS must stay in sync with light/dark values here.
 */
export const shadowTokens = {
  none: {
    name: 'none',
    group: 'utility',
    utility: 'shadow-none',
    cssVar: '--shadow-none',
    description: 'No elevation (flat surface / reset)',
    light: 'none',
    dark: 'none',
  },
  xs: {
    name: 'xs',
    group: 'elevation',
    utility: 'shadow-xs',
    cssVar: '--shadow-xs',
    description: 'Hairline lift — low-emphasis cards, subtle resting controls',
    light: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
    dark: '0 1px 1px 0 rgb(0 0 0 / 0.9), 0 2px 6px 0 rgb(0 0 0 / 0.75)',
  },
  sm: {
    name: 'sm',
    group: 'elevation',
    utility: 'shadow-sm',
    cssVar: '--shadow-sm',
    description: 'Default card / panel elevation on the canvas',
    light:
      '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
    dark: '0 1px 2px 0 rgb(0 0 0 / 0.95), 0 4px 8px 0 rgb(0 0 0 / 0.8), 0 8px 20px 0 rgb(0 0 0 / 0.7)',
  },
  md: {
    name: 'md',
    group: 'elevation',
    utility: 'shadow-md',
    cssVar: '--shadow-md',
    description: 'Dropdowns, popovers, select menus, floating toolbars',
    light:
      '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
    dark: '0 2px 4px 0 rgb(0 0 0 / 0.95), 0 8px 16px -2px rgb(0 0 0 / 0.85), 0 16px 32px -4px rgb(0 0 0 / 0.75)',
  },
  lg: {
    name: 'lg',
    group: 'elevation',
    utility: 'shadow-lg',
    cssVar: '--shadow-lg',
    description: 'Modals, drawers, command palette, large floating panels',
    light:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
    dark: '0 4px 8px 0 rgb(0 0 0 / 0.95), 0 12px 24px -2px rgb(0 0 0 / 0.9), 0 28px 48px -6px rgb(0 0 0 / 0.8)',
  },
  xl: {
    name: 'xl',
    group: 'elevation',
    utility: 'shadow-xl',
    cssVar: '--shadow-xl',
    description: 'Highest elevation — rare full-screen takeovers, marketing moments',
    light:
      '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
    dark: '0 6px 12px 0 rgb(0 0 0 / 0.95), 0 20px 36px -4px rgb(0 0 0 / 0.92), 0 40px 64px -8px rgb(0 0 0 / 0.85)',
  },

  // ── Top / upward (casts above the surface) ─────────────────────────
  'top-xs': {
    name: 'top-xs',
    group: 'top',
    utility: 'shadow-top-xs',
    cssVar: '--shadow-top-xs',
    description: 'Hairline upward shadow — sticky footers, subtle bottom bars',
    light: '0 -1px 2px 0 rgb(0 0 0 / 0.04)',
    dark: '0 -1px 1px 0 rgb(0 0 0 / 0.9), 0 -2px 6px 0 rgb(0 0 0 / 0.75)',
  },
  'top-sm': {
    name: 'top-sm',
    group: 'top',
    utility: 'shadow-top-sm',
    cssVar: '--shadow-top-sm',
    description: 'Default bottom sheet / mobile action bar separation from content above',
    light:
      '0 -1px 2px 0 rgb(0 0 0 / 0.05), 0 -1px 3px 0 rgb(0 0 0 / 0.08)',
    dark: '0 -1px 2px 0 rgb(0 0 0 / 0.95), 0 -4px 8px 0 rgb(0 0 0 / 0.8), 0 -8px 20px 0 rgb(0 0 0 / 0.7)',
  },
  'top-md': {
    name: 'top-md',
    group: 'top',
    utility: 'shadow-top-md',
    cssVar: '--shadow-top-md',
    description: 'Elevated bottom sheet or docked panel floating over scrollable content',
    light:
      '0 -4px 6px -1px rgb(0 0 0 / 0.08), 0 -2px 4px -2px rgb(0 0 0 / 0.06)',
    dark: '0 -2px 4px 0 rgb(0 0 0 / 0.95), 0 -8px 16px -2px rgb(0 0 0 / 0.85), 0 -16px 32px -4px rgb(0 0 0 / 0.75)',
  },
  'top-lg': {
    name: 'top-lg',
    group: 'top',
    utility: 'shadow-top-lg',
    cssVar: '--shadow-top-lg',
    description: 'Strong top shadow — large bottom sheets, media scrubbers, prominent docks',
    light:
      '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.08)',
    dark: '0 -4px 8px 0 rgb(0 0 0 / 0.95), 0 -12px 24px -2px rgb(0 0 0 / 0.9), 0 -28px 48px -6px rgb(0 0 0 / 0.8)',
  },

  inner: {
    name: 'inner',
    group: 'utility',
    utility: 'shadow-inner',
    cssVar: '--shadow-inner',
    description: 'Inset well — pressed inputs, recessed code blocks',
    light: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.06)',
    dark: 'inset 0 1px 3px 0 rgb(0 0 0 / 0.9), inset 0 0 0 1px rgb(0 0 0 / 0.55)',
  },
  border: {
    name: 'border',
    group: 'utility',
    utility: 'shadow-border',
    cssVar: '--shadow-border',
    description: '1px outline via shadow (no layout shift; uses border-default color)',
    light: '0 0 0 1px var(--color-border-default)',
    dark: '0 0 0 1px var(--color-border-default)',
  },
  focus: {
    name: 'focus',
    group: 'focus',
    utility: 'shadow-focus',
    cssVar: '--shadow-focus',
    description: 'Keyboard focus ring (pairs with focus-ring / brand accent)',
    light: '0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent)',
    dark: '0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 70%, transparent)',
  },
} as const satisfies Record<string, ShadowToken>;

export type ShadowName = keyof typeof shadowTokens;

/** Downward elevation tokens, low → high. */
export const shadowElevationOrder = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
] as const satisfies readonly ShadowName[];

/** Upward / top shadows, low → high (for bottom sheets, sticky footers). */
export const shadowTopOrder = [
  'top-xs',
  'top-sm',
  'top-md',
  'top-lg',
] as const satisfies readonly ShadowName[];

/** Full list for docs. */
export const shadowOrder = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'top-xs',
  'top-sm',
  'top-md',
  'top-lg',
  'inner',
  'border',
  'focus',
] as const satisfies readonly ShadowName[];

export const shadowGroups = ['elevation', 'top', 'focus', 'utility'] as const;
export type ShadowGroup = (typeof shadowGroups)[number];
