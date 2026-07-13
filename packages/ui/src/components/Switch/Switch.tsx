import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { ControlSize } from "../../tokens/control";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";

/**
 * Switch — styled re-export of `@radix-ui/react-switch`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Thumb`,
 * `createSwitchScope`, …). Consumers use Radix docs for behavior; import from
 * `@design-system/ui/Switch`. DS only merges default styles (+ optional `size`
 * on Root).
 *
 * Pair with {@link Field} `orientation="horizontal"` for labeled form rows
 * (ADR-002 choice-control layout).
 *
 * @see https://www.radix-ui.com/primitives/docs/components/switch
 */

// ── Root (track) ─────────────────────────────────────────────────────────────

/**
 * Switch track. `size` is styling only (not a Radix prop).
 * Thumb position uses flex `justify-*` from `data-state` — no size prop on Thumb.
 */
export const switchRootVariants = cva(
  [
    "peer shrink-0 appearance-none",
    "inline-flex items-center",
    "rounded-full border border-transparent",
    "transition-[color,background-color,border-color,box-shadow,opacity]",
    focusRing(),
    "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-65",
    // Thumb slide via flex alignment (Radix `data-state` on Root)
    "data-[state=unchecked]:justify-start",
    "data-[state=checked]:justify-end",
    // Unchecked — border-scale fill so the track lifts off canvas in dark mode
    // (surface-active ≈ slate-5 is too close to canvas slate-1).
    "data-[state=unchecked]:bg-border-default",
    "enabled:data-[state=unchecked]:hover:bg-border-hover",
    // Checked — brand solid
    "data-[state=checked]:bg-accent-solid",
    "enabled:data-[state=checked]:hover:bg-accent-solid-hover",
  ],
  {
    variants: {
      /**
       * Track size (styling only). Prefer the Root `size` prop.
       */
      size: {
        [ControlSize.sm]: "h-4 w-7 p-0.5",
        [ControlSize.md]: "h-5 w-9 p-0.5",
        [ControlSize.lg]: "h-6 w-11 p-0.5",
      },
    },
    defaultVariants: {
      size: ControlSize.md,
    },
  },
);

export type SwitchRootVariantProps = VariantProps<typeof switchRootVariants>;

export type SwitchSize = NonNullable<SwitchRootVariantProps["size"]>;

// ── Thumb ────────────────────────────────────────────────────────────────────

/**
 * Sliding thumb. Height fills the track’s content box; position comes from
 * Root flex justify (no size prop required on Thumb).
 *
 * Always white so the knob stays visible on both light and dark tracks
 * (`bg-bg-surface` on `bg-surface-active` collapses in dark mode). Prefer a
 * tight ring over elevation shadow — product `shadow-sm` is large and
 * heavily black in dark mode, which optically shifts the knob off-center.
 */
export const switchThumbVariants = cva([
  "pointer-events-none block aspect-square h-full shrink-0",
  "rounded-full bg-white",
  // Hairline edge only (no soft drop shadow)
  "ring-1 ring-black/15",
]);

export type SwitchThumbVariantProps = VariantProps<typeof switchThumbVariants>;

// ── Types ────────────────────────────────────────────────────────────────────

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;
export type SwitchThumbProps = ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Thumb
>;

export type SwitchRootElement = ComponentRef<typeof SwitchPrimitive.Root>;
export type SwitchThumbElement = ComponentRef<typeof SwitchPrimitive.Thumb>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Switch root (track) — Radix `Root` with DS styles.
 * All Radix props (`checked`, `defaultChecked`, `onCheckedChange`, …) pass through.
 *
 * Prefer composing a {@link Thumb} as the only child.
 */
export function Root({
  className,
  size,
  ref,
  ...props
}: SwitchProps & {
  ref?: Ref<SwitchRootElement>;
  /**
   * Track size (styling only).
   * @default "md"
   */
  size?: SwitchSize;
}) {
  return (
    <SwitchPrimitive.Root
      {...props}
      ref={ref}
      className={cn(switchRootVariants({ size }), className)}
    />
  );
}

Root.displayName = SwitchPrimitive.Root.displayName ?? "Switch.Root";

/**
 * Switch thumb — slides via Root `data-state` + flex justify.
 */
export function Thumb({
  className,
  ref,
  ...props
}: SwitchThumbProps & { ref?: Ref<SwitchThumbElement> }) {
  return (
    <SwitchPrimitive.Thumb
      {...props}
      ref={ref}
      className={cn(switchThumbVariants(), className)}
    />
  );
}

Thumb.displayName = SwitchPrimitive.Thumb.displayName ?? "Switch.Thumb";
