import type { ReactNode, Ref } from "react";

import {
  ControlSize,
  type ControlSize as ControlSizeToken,
  controlBoxLockClass,
  controlIconOnlyGlyphSvgClass,
} from "../../tokens/control";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "../Button";

/**
 * Icon-only control — square geometry on the same variant/color system as {@link Button}.
 *
 * Requires an accessible name via `aria-label`.
 * Pass a single icon as `children` (prefer `@radix-ui/react-icons`).
 *
 * @example
 * ```tsx
 * import { Cross2Icon } from "@radix-ui/react-icons";
 * import { IconButton } from "@design-system/ui/IconButton";
 *
 * <IconButton aria-label="Close" variant="tertiary">
 *   <Cross2Icon />
 * </IconButton>
 * ```
 */

/** @deprecated Prefer {@link ControlSize} — alias kept for call-site stability. */
export type IconButtonSize = ControlSizeToken;

export type IconButtonProps = Omit<
  ButtonProps,
  "fullWidth" | "children" | "aria-label" | "size"
> & {
  /** Icon node (decorative). */
  "children": ReactNode;
  /**
   * Accessible name for the control (required for icon-only buttons).
   * Prefer a short verb phrase, e.g. "Close dialog", "Search".
   */
  "aria-label": string;
  /**
   * Square control size ({@link ControlSize} — matches shared control heights).
   * @default "md"
   */
  "size"?: ControlSizeToken;
  "ref"?: Ref<HTMLButtonElement>;
};

export function IconButton(props: IconButtonProps) {
  const {
    children,
    className,
    size = ControlSize.md,
    loading,
    ...buttonProps
  } = props;

  return (
    <Button
      {...buttonProps}
      loading={loading}
      fullWidth={false}
      size={size}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-0! p-0!",
        controlBoxLockClass[size],
        controlIconOnlyGlyphSvgClass[size],
        className,
      )}
      data-slot="icon-button"
    >
      {/* Icon-only: swap glyph for spinner — do not stack both. */}
      {loading ? null : children}
    </Button>
  );
}

IconButton.displayName = "IconButton";
