import type { ElementType, ReactNode } from "react";

import {
  ControlSize,
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
 * Polymorphic via `as` (same as Button) for anchors / router links.
 *
 * `fullWidth` is accepted on the type (via {@link Button}) but always forced off.
 *
 * @example
 * ```tsx
 * import { Cross2Icon } from "@radix-ui/react-icons";
 * import { IconButton } from "@design-system/ui/IconButton";
 *
 * <IconButton aria-label="Close" variant="tertiary">
 *   <Cross2Icon />
 * </IconButton>
 *
 * <IconButton as="a" href="/search" aria-label="Search">
 *   <MagnifyingGlassIcon />
 * </IconButton>
 * ```
 */

/** @deprecated Prefer {@link ControlSize} — alias kept for call-site stability. */
export type IconButtonSize = ControlSize;

/**
 * {@link Button} props with a required accessible name and icon children.
 * Polymorphic `as` / host props come from {@link ButtonProps}.
 */
export type IconButtonProps<T extends ElementType = "button"> =
  ButtonProps<T> & {
    "children": ReactNode;
    "aria-label": string;
    "size"?: ControlSize;
  };

export function IconButton<T extends ElementType = "button">(
  props: IconButtonProps<T>,
) {
  const size = props.size ?? ControlSize.md;
  const loading = props.loading === true;

  return (
    <Button
      {...props}
      fullWidth={false}
      size={size}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-0! p-0!",
        controlBoxLockClass[size],
        controlIconOnlyGlyphSvgClass[size],
        props.className,
      )}
    >
      {/* Icon-only: swap glyph for spinner — do not stack both. */}
      {loading ? null : props.children}
    </Button>
  );
}

IconButton.displayName = "IconButton";
