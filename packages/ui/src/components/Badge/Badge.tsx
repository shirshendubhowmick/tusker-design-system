import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "../../utils/cn";

/**
 * Compact status / meta chip for tables, filters, and chrome.
 *
 * CVA dimensions:
 * - variant — soft (subtle fill), outline, solid
 * - color   — neutral | primary | success | warning | danger | info
 * - size    — sm | md
 */
export const badgeVariants = cva(
  [
    "inline-flex max-w-full items-center justify-center gap-1",
    "rounded-full font-sans font-medium whitespace-nowrap",
    "select-none",
  ],
  {
    variants: {
      variant: {
        soft: "",
        outline: "border bg-transparent",
        solid: "",
      },
      color: {
        neutral: "",
        primary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
      size: {
        sm: "h-5 gap-0.5 px-1.5 text-label-sm",
        md: "h-6 gap-1 px-2 text-label-md",
      },
    },
    compoundVariants: [
      // ── soft ──────────────────────────────────────────────────────
      {
        variant: "soft",
        color: "neutral",
        class: "bg-bg-surface-active text-fg-muted",
      },
      {
        variant: "soft",
        color: "primary",
        class: "bg-accent-subtle text-accent-text",
      },
      {
        variant: "soft",
        color: "success",
        class: "bg-success-subtle text-success-text",
      },
      {
        variant: "soft",
        color: "warning",
        class: "bg-warning-subtle text-warning-text",
      },
      {
        variant: "soft",
        color: "danger",
        class: "bg-danger-subtle text-danger-text",
      },
      {
        variant: "soft",
        color: "info",
        class: "bg-info-subtle text-info-text",
      },

      // ── outline ───────────────────────────────────────────────────
      {
        variant: "outline",
        color: "neutral",
        class: "border-border-default text-fg-muted",
      },
      {
        variant: "outline",
        color: "primary",
        class: "border-accent-border text-accent-text",
      },
      {
        variant: "outline",
        color: "success",
        class: "border-success-border text-success-text",
      },
      {
        variant: "outline",
        color: "warning",
        class: "border-warning-border text-warning-text",
      },
      {
        variant: "outline",
        color: "danger",
        class: "border-danger-border text-danger-text",
      },
      {
        variant: "outline",
        color: "info",
        class: "border-info-border text-info-text",
      },

      // ── solid ─────────────────────────────────────────────────────
      {
        variant: "solid",
        color: "neutral",
        class: "bg-bg-inverse text-fg-on-inverse",
      },
      {
        variant: "solid",
        color: "primary",
        class: "bg-accent-solid text-fg-on-accent",
      },
      {
        variant: "solid",
        color: "success",
        class: "bg-success-solid text-fg-on-success",
      },
      {
        variant: "solid",
        color: "warning",
        class: "bg-warning-solid text-fg-on-warning",
      },
      {
        variant: "solid",
        color: "danger",
        class: "bg-danger-solid text-fg-on-danger",
      },
      {
        variant: "solid",
        color: "info",
        class: "bg-info-solid text-fg-on-info",
      },
    ],
    defaultVariants: {
      variant: "soft",
      color: "neutral",
      size: "md",
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">, BadgeVariantProps {
  ref?: Ref<HTMLSpanElement>;
  children: ReactNode;
}

/** Strip CVA-only props so they are not forwarded to the DOM. */
function getBadgeDomProps(props: BadgeProps): HTMLAttributes<HTMLSpanElement> {
  const {
    variant: _variant,
    color: _color,
    size: _size,
    className: _className,
    children: _children,
    ref: _ref,
    ...domProps
  } = props;
  return domProps;
}

/**
 * Status / meta badge.
 *
 * @example
 * ```tsx
 * import { Badge } from "@design-system/ui/Badge";
 *
 * <Badge color="success">Active</Badge>
 * <Badge variant="outline" color="danger" size="sm">Failed</Badge>
 * ```
 */
export function Badge(props: BadgeProps) {
  const domProps = getBadgeDomProps(props);

  return (
    <span
      {...domProps}
      ref={props.ref}
      className={cn(
        badgeVariants({
          variant: props.variant,
          color: props.color,
          size: props.size,
        }),
        props.className,
      )}
      data-slot="badge"
    >
      {props.children}
    </span>
  );
}

Badge.displayName = "Badge";
