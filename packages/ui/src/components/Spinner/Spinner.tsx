import type { Ref, SVGAttributes } from "react";

import { cn } from "../../utils/cn";

/**
 * Size token → Tailwind size utility.
 * Keys (`sm` / `md` / `lg`) are the public size API; values are the glyph classes.
 */
export const SpinnerSize = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
} as const;

export type SpinnerSize = keyof typeof SpinnerSize;

export interface SpinnerProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "children" | "viewBox" | "fill" | "xmlns"
> {
  ref?: Ref<SVGSVGElement>;
  /**
   * Glyph size (`sm` | `md` | `lg`).
   * @default "md"
   */
  size?: SpinnerSize | null;
  /**
   * Accessible name when the spinner is the sole loading indicator.
   * When omitted, treated as decorative (`aria-hidden`).
   */
  label?: string;
  className?: string;
}

function resolveSpinnerSize(size: SpinnerProps["size"]): SpinnerSize {
  if (size != null && size in SpinnerSize) {
    return size;
  }
  return "md";
}

/**
 * Indeterminate circular spinner.
 *
 * Inherits `currentColor` — pair with semantic text utilities
 * (`text-fg-on-accent`, `text-accent-text`, …) or place inside a
 * colored parent (e.g. Button loading state).
 *
 * @example
 * ```tsx
 * import { Spinner } from "@design-system/ui/Spinner";
 *
 * <Spinner size="sm" />
 * <Spinner label="Loading results" className="text-accent-text" />
 * ```
 */
export function Spinner(props: SpinnerProps) {
  const { size, label, className, ref, ...svgProps } = props;
  const sizeKey = resolveSpinnerSize(size);
  const decorative = label == null || label === "";

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={cn("shrink-0 animate-spin", SpinnerSize[sizeKey], className)}
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-slot="spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h2zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

Spinner.displayName = "Spinner";
