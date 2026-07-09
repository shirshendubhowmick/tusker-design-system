import type { ReactNode, Ref } from "react";

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
/**
 * Square geometry with `!` so we win over Button size padding (`h-*`/`px-*`)
 * and tertiary bare height collapse (`!h-auto !px-0 !py-0`).
 * Without this, tertiary often ends up tall (fixed height) and tight horizontally.
 */
const iconButtonSizeClass = {
  /** Matches Button sm height (32px) */
  sm: [
    "inline-flex shrink-0 items-center justify-center",
    "!size-8 !min-h-8 !min-w-8 !max-h-8 !max-w-8",
    "!gap-0 !p-0",
    "[&_svg]:size-3.5",
  ].join(" "),
  /** Matches Button md height (36px) */
  md: [
    "inline-flex shrink-0 items-center justify-center",
    "!size-9 !min-h-9 !min-w-9 !max-h-9 !max-w-9",
    "!gap-0 !p-0",
    "[&_svg]:size-4",
  ].join(" "),
  /** Matches Button lg height (40px) */
  lg: [
    "inline-flex shrink-0 items-center justify-center",
    "!size-10 !min-h-10 !min-w-10 !max-h-10 !max-w-10",
    "!gap-0 !p-0",
    "[&_svg]:size-5",
  ].join(" "),
} as const;

export type IconButtonSize = keyof typeof iconButtonSizeClass;

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
   * Square control size (matches Button heights).
   * @default "md"
   */
  "size"?: IconButtonSize;
  "ref"?: Ref<HTMLButtonElement>;
};

export function IconButton(props: IconButtonProps) {
  const { children, className, size = "md", ...buttonProps } = props;

  return (
    <Button
      {...buttonProps}
      fullWidth={false}
      size={size}
      className={cn(iconButtonSizeClass[size], className)}
      data-slot="icon-button"
    >
      {children}
    </Button>
  );
}

IconButton.displayName = "IconButton";
