import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { ControlSize } from "../../tokens/control";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";

/**
 * RadioGroup — styled re-export of `@radix-ui/react-radio-group`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Item`,
 * `Indicator`, `createRadioGroupScope`, …). Consumers use Radix docs for
 * behavior; import from `@design-system/ui/RadioGroup`. DS only merges default
 * styles via `className` (+ optional `size` on Item).
 *
 * Pair with {@link Field} `orientation="horizontal"` for labeled choice rows,
 * or compose labels beside each Item.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/radio-group
 */

// ── Root ─────────────────────────────────────────────────────────────────────

/**
 * Group layout — vertical stack by default. Override with `className`
 * (e.g. `flex-row flex-wrap gap-4`) for horizontal sets.
 */
export const radioGroupRootVariants = cva("grid gap-2");

export type RadioGroupRootVariantProps = VariantProps<
  typeof radioGroupRootVariants
>;

// ── Item ─────────────────────────────────────────────────────────────────────

/**
 * Radio control chrome. Aligns with Checkbox (border, focus ring, accent
 * checked fill). Circle geometry; sizes follow {@link ControlSize}.
 */
export const radioGroupItemVariants = cva(
  [
    "peer shrink-0 appearance-none",
    "inline-flex items-center justify-center",
    "rounded-full border bg-bg-surface",
    "border-border-default text-fg-on-accent",
    "transition-[color,background-color,border-color,box-shadow,opacity]",
    focusRing(),
    "cursor-pointer",
    "enabled:hover:border-accent-border",
    "disabled:cursor-not-allowed disabled:opacity-65",
    // Checked — brand solid fill (indicator mark uses on-accent)
    "data-[state=checked]:border-accent-solid data-[state=checked]:bg-accent-solid",
  ],
  {
    variants: {
      /**
       * Visual control size (styling only — not a Radix prop).
       * Prefer the Item `size` prop; or override via
       * `className={radioGroupItemVariants({ size: "sm" })}`.
       */
      size: {
        [ControlSize.sm]: "size-3.5",
        [ControlSize.md]: "size-4",
        [ControlSize.lg]: "size-5",
      },
    },
    defaultVariants: {
      size: ControlSize.md,
    },
  },
);

export type RadioGroupItemVariantProps = VariantProps<
  typeof radioGroupItemVariants
>;

export type RadioGroupItemSize = NonNullable<
  RadioGroupItemVariantProps["size"]
>;

// ── Indicator ────────────────────────────────────────────────────────────────

/**
 * Inner mark when the item is checked. Default is a filled dot via `::after`;
 * pass children to replace (e.g. a custom icon).
 */
export const radioGroupIndicatorVariants = cva([
  "relative flex size-full items-center justify-center",
  // Default on-accent dot (no children required)
  "after:bg-fg-on-accent after:block after:size-[40%] after:rounded-full after:content-['']",
  // Hide pseudo-dot when a custom child mark is provided
  "has-[>*]:after:hidden",
]);

export type RadioGroupIndicatorVariantProps = VariantProps<
  typeof radioGroupIndicatorVariants
>;

// ── Types ────────────────────────────────────────────────────────────────────

export type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
>;
export type RadioGroupItemProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
>;
export type RadioGroupIndicatorProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Indicator
>;

export type RadioGroupRootElement = ComponentRef<
  typeof RadioGroupPrimitive.Root
>;
export type RadioGroupItemElement = ComponentRef<
  typeof RadioGroupPrimitive.Item
>;
export type RadioGroupIndicatorElement = ComponentRef<
  typeof RadioGroupPrimitive.Indicator
>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Radio group root — Radix `Root` (value, orientation, form attrs, …).
 * Soft vertical stack layout by default.
 */
export function Root({
  className,
  ref,
  ...props
}: RadioGroupProps & { ref?: Ref<RadioGroupRootElement> }) {
  return (
    <RadioGroupPrimitive.Root
      {...props}
      ref={ref}
      className={cn(radioGroupRootVariants(), className)}
    />
  );
}

Root.displayName = RadioGroupPrimitive.Root.displayName ?? "RadioGroup.Root";

/**
 * Single radio option. Requires `value`. Compose with {@link Indicator}.
 *
 * `size` is DS styling only (not a Radix prop). Default `md`.
 */
export function Item({
  className,
  size,
  ref,
  ...props
}: RadioGroupItemProps & {
  ref?: Ref<RadioGroupItemElement>;
  /**
   * Control size (styling only).
   * @default "md"
   */
  size?: RadioGroupItemSize;
}) {
  return (
    <RadioGroupPrimitive.Item
      {...props}
      ref={ref}
      className={cn(radioGroupItemVariants({ size }), className)}
    />
  );
}

Item.displayName = RadioGroupPrimitive.Item.displayName ?? "RadioGroup.Item";

/**
 * Checked mark. Renders a default on-accent dot; pass children for a custom mark.
 */
export function Indicator({
  className,
  ref,
  ...props
}: RadioGroupIndicatorProps & {
  ref?: Ref<RadioGroupIndicatorElement>;
}) {
  return (
    <RadioGroupPrimitive.Indicator
      {...props}
      ref={ref}
      className={cn(radioGroupIndicatorVariants(), className)}
    />
  );
}

Indicator.displayName =
  RadioGroupPrimitive.Indicator.displayName ?? "RadioGroup.Indicator";
