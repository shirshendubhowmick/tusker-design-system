/**
 * Layer 1 — Typeface choices for a Dev tool SaaS.
 *
 * - sans: product UI (navigation, forms, prose)
 * - mono: code, logs, IDs, metrics, keyboard hints
 */

export const fontFamilies = {
  sans: {
    name: "sans",
    stack: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ],
    description: "UI typeface — neutral, highly legible at small sizes",
    role: "ui",
  },
  mono: {
    name: "mono",
    stack: [
      "JetBrains Mono",
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
    description: "Code and data — fixed width for alignment in logs/tables",
    role: "code",
  },
} as const;

export type FontFamilyName = keyof typeof fontFamilies;
