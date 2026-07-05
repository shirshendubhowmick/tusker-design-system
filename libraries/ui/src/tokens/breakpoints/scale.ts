/**
 * Breakpoints — mobile, tablet, desktop (mobile-first).
 *
 * Base styles apply to **mobile**. Use `tablet:` and `desktop:` variants for
 * larger viewports (Tailwind min-width media queries).
 *
 * | Name      | Min width | Typical devices              |
 * | --------- | --------- | ---------------------------- |
 * | mobile    | 0         | phones, narrow windows       |
 * | tablet    | 768px     | tablets, small laptops       |
 * | desktop   | 1024px    | laptops, monitors, dashboards|
 */

export const breakpoints = {
  mobile: {
    name: 'mobile',
    /** Inclusive start of the range (always 0 for the base tier). */
    minWidthPx: 0,
    minWidthRem: '0rem',
    /** Exclusive end — width at which the next tier starts. */
    maxWidthPx: 767,
    description: 'Default / base styles. Phones and narrow viewports.',
    tailwindVariant: null,
    /** CSS custom property registered for docs (not a min-width query). */
    cssVar: '--breakpoint-mobile',
  },
  tablet: {
    name: 'tablet',
    minWidthPx: 768,
    minWidthRem: '48rem',
    maxWidthPx: 1023,
    description: 'Tablets and small laptops. Side-by-side layouts begin.',
    tailwindVariant: 'tablet',
    cssVar: '--breakpoint-tablet',
  },
  desktop: {
    name: 'desktop',
    minWidthPx: 1024,
    minWidthRem: '64rem',
    maxWidthPx: null,
    description: 'Laptops and desktops. Full app chrome and multi-column dashboards.',
    tailwindVariant: 'desktop',
    cssVar: '--breakpoint-desktop',
  },
} as const;

export type BreakpointName = keyof typeof breakpoints;

/** Ordered from smallest to largest. */
export const breakpointOrder = ['mobile', 'tablet', 'desktop'] as const satisfies readonly BreakpointName[];

/**
 * Resolve which named breakpoint a viewport width falls into (mobile-first ranges).
 */
export function resolveBreakpoint(widthPx: number): BreakpointName {
  if (widthPx >= breakpoints.desktop.minWidthPx) return 'desktop';
  if (widthPx >= breakpoints.tablet.minWidthPx) return 'tablet';
  return 'mobile';
}

/** Human-readable range label for docs. */
export function formatBreakpointRange(name: BreakpointName): string {
  const bp = breakpoints[name];
  if (bp.maxWidthPx == null) return `≥ ${bp.minWidthPx}px`;
  if (bp.minWidthPx === 0) return `0 – ${bp.maxWidthPx}px`;
  return `${bp.minWidthPx} – ${bp.maxWidthPx}px`;
}
