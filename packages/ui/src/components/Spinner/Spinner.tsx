import type { Ref, SVGAttributes } from "react";

import {
  ControlSize,
  type ControlSize as ControlSizeToken,
  controlGlyphClass,
  resolveControlSize,
} from "../../tokens/control";
import { cn } from "../../utils/cn";

/** @deprecated Prefer {@link ControlSize} — alias kept for call-site stability. */
export type SpinnerSize = ControlSizeToken;

/** @deprecated Prefer {@link ControlSize} */
export const SpinnerSize = ControlSize;

export interface SpinnerProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "children" | "viewBox" | "fill" | "xmlns"
> {
  ref?: Ref<SVGSVGElement>;
  /**
   * Glyph size ({@link ControlSize}).
   * @default "md"
   */
  size?: ControlSizeToken | null;
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
 * import { Spinner } from "@design-system/ui/Spinner";
 * import { ControlSize } from "@design-system/ui/tokens";
 *
 * <Spinner size={ControlSize.sm} />
 * <Spinner label="Loading results" className="text-accent-text" />
 * ```
 */
export function Spinner(props: SpinnerProps) {
  const { size, label, className, ref, ...svgProps } = props;
  const sizeKey = resolveControlSize(size);
  const decorative = label == null || label === "";

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={cn(
        "shrink-0 animate-spin",
        controlGlyphClass[sizeKey],
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
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
