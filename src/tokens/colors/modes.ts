/**
 * Color modes for the design system.
 *
 * Strategy:
 * 1. **Radix scales** — light + dark CSS for each chosen scale. Class / data
 *    attribute on a scope flips `--slate-*`, `--indigo-*`, etc.
 * 2. **Semantic + primitive tokens** — re-declared under light and dark scopes
 *    in `semantic-dark.css`, pointing at those Radix vars (so `bg-bg-canvas` /
 *    `text-fg-default` actually change with mode).
 *
 * Enable dark mode (any one is enough; prefer class on `<html>`):
 *
 * ```html
 * <html class="dark" data-theme="dark">…</html>
 * ```
 */

export const colorModes = ['light', 'dark'] as const;
export type ColorMode = (typeof colorModes)[number];

export const colorModeMeta = {
  light: {
    className: 'light',
    description: 'Light surfaces — near-white canvas, dark text (slate-12)',
    selector: '.light, .light-theme, [data-theme="light"], html:not(.dark)',
    /** Expected feel for docs */
    canvasStep: 'slate-1 (light ≈ #fcfcfd)',
    foregroundStep: 'slate-12 (light ≈ #1c2024)',
  },
  dark: {
    className: 'dark',
    description: 'Dark surfaces — near-black canvas, light text (slate-12)',
    selector: 'html.dark, .dark, .dark-theme, [data-theme="dark"]',
    canvasStep: 'slate-1 (dark ≈ #111113)',
    foregroundStep: 'slate-12 (dark ≈ #edeef0)',
  },
} as const;

export const colorModeActivation = {
  rootClass: 'dark',
  dataAttribute: 'data-theme',
  mediaQuery: '(prefers-color-scheme: dark)',
  cssColorScheme: {
    light: 'light',
    dark: 'dark',
  },
} as const;
