import { type CxOptions, cx } from "class-variance-authority";
import { extendTailwindMerge } from "tailwind-merge";

import { semanticColorTokens } from "../tokens/colors/semantic";
import { fontSizes } from "../tokens/typography/scale";
import { textStyles } from "../tokens/typography/semantic";

/** Arguments accepted by `cn` / CVA `cx` (strings, arrays, conditional objects, falsy). */
export type ClassValue = CxOptions[number];

/**
 * tailwind-merge must know design-system `text-*` utilities:
 * - semantic text styles (`text-label-lg`, …) are typography composites
 * - semantic colors (`text-fg-on-accent`, `text-danger-text`, …) are colors
 *
 * Without this, both land in the same default group and the later class wins
 * (e.g. Button loses `text-label-lg` when `text-fg-on-accent` is applied).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Semantic text styles + primitive size steps (e.g. `text-label-lg`, `text-2xs`).
      "font-size": [
        {
          text: [
            ...textStyles.map((style) => style.name),
            ...Object.keys(fontSizes),
          ],
        },
      ],
      // Semantic color utilities used as `text-{token}`.
      "text-color": [{ text: semanticColorTokens.map((token) => token.name) }],
    },
  },
});

/** Merge class names with Tailwind-aware conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}
