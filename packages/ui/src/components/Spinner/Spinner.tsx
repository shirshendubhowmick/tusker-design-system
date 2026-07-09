import type { Ref, SVGAttributes } from "react";

import { cn } from "../../utils/cn";

/** Visual size steps — aligned with Button control heights. */
export const SpinnerSize = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export type SpinnerSize = (typeof SpinnerSize)[keyof typeof SpinnerSize];

const spinnerSizeClass: Record<SpinnerSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

export interface SpinnerProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "children" | "viewBox" | "fill" | "xmlns"
> {
  ref?: Ref<SVGSVGElement>;
  /**
   * Glyph size.
   * @default "md"
   */
  size?: SpinnerSize;
  /**
   * Accessible name when the spinner is the sole loading indicator.
   * When omitted, treated as decorative (`aria-hidden`).
   */
  label?: string;
  className?: string;
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
 * import { Spinner, SpinnerSize } from "@design-system/ui/Spinner";
 *
 * <Spinner size={SpinnerSize.sm} />
 * <Spinner label="Loading results" className="text-accent-text" />
 * ```
 */
export function Spinner(props: SpinnerProps) {
  const { size = SpinnerSize.md, label, className, ref, ...svgProps } = props;
  const dim = spinnerSizeClass[size] ?? spinnerSizeClass.md;
  const decorative = label == null || label === "";

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={cn("shrink-0 animate-spin", dim, className)}
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
