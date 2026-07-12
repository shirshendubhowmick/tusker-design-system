import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { ControlSize } from "../../tokens/control";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";

/**
 * Checkbox — styled re-export of `@radix-ui/react-checkbox`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Indicator`,
 * `createCheckboxScope`, types). Consumers use Radix docs for behavior; import
 * from `@design-system/ui/Checkbox`. DS only merges default styles via `className`.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/checkbox
 */

export type { CheckedState } from "@radix-ui/react-checkbox";

export const checkboxRootVariants = cva(
  [
    "peer shrink-0 appearance-none",
    "inline-flex items-center justify-center",
    "rounded-sm border bg-bg-surface",
    "border-border-default text-fg-on-accent",
    "transition-[color,background-color,border-color,box-shadow,opacity]",
    focusRing(),
    "cursor-pointer",
    "enabled:hover:border-accent-border",
    "disabled:cursor-not-allowed disabled:opacity-65",
    // Checked / indeterminate — brand solid fill + white mark
    "data-[state=checked]:border-accent-solid data-[state=checked]:bg-accent-solid",
    "data-[state=indeterminate]:border-accent-solid data-[state=indeterminate]:bg-accent-solid",
  ],
  {
    variants: {
      /**
       * Visual box size (not a Radix prop). Apply via
       * `className={checkboxRootVariants({ size: "sm" })}` — Root defaults to `md`.
       */
      size: {
        [ControlSize.sm]: "size-3.5 [&_svg]:size-2.5",
        [ControlSize.md]: "size-4 [&_svg]:size-3",
        [ControlSize.lg]: "size-5 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      size: ControlSize.md,
    },
  },
);

export type CheckboxRootVariantProps = VariantProps<
  typeof checkboxRootVariants
>;

export const checkboxIndicatorVariants = cva(
  "flex items-center justify-center text-current",
);

export type CheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

export type CheckboxIndicatorProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Indicator
>;

export type CheckboxRootElement = ComponentRef<typeof CheckboxPrimitive.Root>;
export type CheckboxIndicatorElement = ComponentRef<
  typeof CheckboxPrimitive.Indicator
>;

/**
 * Checkbox root — Radix `Root` with DS styles.
 * All Radix props (`checked`, `defaultChecked`, `onCheckedChange`, …) pass through.
 */
export function Root({
  className,
  ref,
  ...props
}: CheckboxProps & { ref?: Ref<CheckboxRootElement> }) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      ref={ref}
      className={cn(checkboxRootVariants(), className)}
    />
  );
}

Root.displayName = CheckboxPrimitive.Root.displayName ?? "Checkbox.Root";

/**
 * Checkbox indicator — shown when checked / indeterminate.
 * Pass mark content as children (e.g. `@radix-ui/react-icons` CheckIcon).
 */
export function Indicator({
  className,
  ref,
  ...props
}: CheckboxIndicatorProps & { ref?: Ref<CheckboxIndicatorElement> }) {
  return (
    <CheckboxPrimitive.Indicator
      {...props}
      ref={ref}
      className={cn(checkboxIndicatorVariants(), className)}
    />
  );
}

Indicator.displayName =
  CheckboxPrimitive.Indicator.displayName ?? "Checkbox.Indicator";

// Scope + unstable composition — re-exported from the Radix entry (see index.ts).
