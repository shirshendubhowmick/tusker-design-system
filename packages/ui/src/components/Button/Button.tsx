import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import {
  ControlSize,
  controlHeightClass,
  resolveControlSize,
} from "../../tokens/control";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";
import { Spinner } from "../Spinner";

/**
 * Button styles — product variants on design-system semantic tokens.
 *
 * CVA dimensions:
 * - variant   — visual treatment: primary (solid), secondary (outline), tertiary (ghost)
 * - color     — semantic intent: primary (brand), danger, success, warning, info
 * - size      — {@link ControlSize} (`sm` / `md` / `lg`)
 * - fullWidth — stretch to container (not applied for tertiary)
 * - bare      — tertiary only: no padding / fixed height (text-only control)
 *
 * Style × intent are combined via compoundVariants (e.g. solid danger, ghost success).
 * Hover/active only apply when enabled. Active is stronger than hover for every variant.
 */
export const buttonVariants = cva(
  [
    "items-center justify-center gap-2",
    "rounded-md font-sans font-medium",
    // Shared press affordance: nudge down on active (all variants).
    "transition-[color,background-color,border-color,transform,filter,opacity]",
    "enabled:active:translate-y-px",
    "cursor-pointer",
    focusRing(),
    // 65% keeps secondary/tertiary readable on canvas (50% was too washed out).
    "disabled:cursor-not-allowed disabled:opacity-65",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary: "",
        secondary: "border bg-bg-surface",
        tertiary: "bg-transparent",
      },
      color: {
        primary: "",
        danger: "",
        success: "",
        warning: "",
        info: "",
      },
      size: {
        /** Dense controls, table rows, compact toolbars */
        [ControlSize.sm]: `${controlHeightClass.sm} px-2.5 text-label-md`,
        /** Default product control */
        [ControlSize.md]: `${controlHeightClass.md} px-3 text-label-lg`,
        /** Page-level CTAs, empty states */
        [ControlSize.lg]: `${controlHeightClass.lg} px-4 text-label-lg`,
      },
      /**
       * fullWidth needs a block-level flex box so `w-full` fills the parent.
       * (inline-flex + centered Storybook canvas made fullWidth look broken.)
       */
      fullWidth: {
        true: "flex w-full",
        false: "inline-flex w-auto shrink-0",
      },
      /** Tertiary-only: strip padding/height so the control is just label text. */
      bare: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Tertiary never stretches — fullWidth is ignored for this variant.
      {
        variant: "tertiary",
        class: "!inline-flex !w-auto shrink-0",
      },
      // Tertiary bare — text-only; overrides size box model.
      {
        variant: "tertiary",
        bare: true,
        class: "!h-auto !min-h-0 !px-0 !py-0 gap-0",
      },

      // ── primary (solid) — hover step; active deepens further (no 3rd solid token)
      {
        variant: "primary",
        color: "primary",
        class: [
          "bg-accent-solid text-fg-on-accent",
          "enabled:hover:bg-accent-solid-hover",
          "enabled:active:bg-accent-solid-hover enabled:active:brightness-95",
        ],
      },
      {
        variant: "primary",
        color: "danger",
        class: [
          "bg-danger-solid text-fg-on-danger",
          "enabled:hover:bg-danger-solid-hover",
          "enabled:active:bg-danger-solid-hover enabled:active:brightness-95",
        ],
      },
      {
        variant: "primary",
        color: "success",
        class: [
          "bg-success-solid text-fg-on-success",
          "enabled:hover:bg-success-solid-hover",
          "enabled:active:bg-success-solid-hover enabled:active:brightness-95",
        ],
      },
      {
        variant: "primary",
        color: "warning",
        class: [
          "bg-warning-solid text-fg-on-warning",
          "enabled:hover:bg-warning-solid-hover",
          "enabled:active:bg-warning-solid-hover enabled:active:brightness-95",
        ],
      },
      {
        variant: "primary",
        color: "info",
        class: [
          "bg-info-solid text-fg-on-info",
          "enabled:hover:bg-info-solid-hover",
          "enabled:active:bg-info-solid-hover enabled:active:brightness-95",
        ],
      },

      // ── secondary (outline) — solid-weight border (not the lighter *-border token)
      {
        variant: "secondary",
        color: "primary",
        class: [
          "border-accent-solid text-accent-text",
          "enabled:hover:bg-accent-subtle",
          "enabled:active:bg-accent-subtle-hover",
        ],
      },
      {
        variant: "secondary",
        color: "danger",
        class: [
          "border-danger-solid text-danger-text",
          "enabled:hover:bg-danger-subtle",
          // No status *-subtle-hover token — deepen fill on press.
          "enabled:active:bg-danger-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "secondary",
        color: "success",
        class: [
          "border-success-solid text-success-text",
          "enabled:hover:bg-success-subtle",
          "enabled:active:bg-success-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "secondary",
        color: "warning",
        class: [
          "border-warning-solid text-warning-text",
          "enabled:hover:bg-warning-subtle",
          "enabled:active:bg-warning-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "secondary",
        color: "info",
        class: [
          "border-info-solid text-info-text",
          "enabled:hover:bg-info-subtle",
          "enabled:active:bg-info-subtle enabled:active:brightness-95",
        ],
      },

      // ── tertiary padded — ghost fill on the element ────────────────
      {
        variant: "tertiary",
        bare: false,
        color: "primary",
        class: [
          "text-accent-text",
          "enabled:hover:bg-accent-subtle",
          "enabled:active:bg-accent-subtle-hover",
        ],
      },
      {
        variant: "tertiary",
        bare: false,
        color: "danger",
        class: [
          "text-danger-text",
          "enabled:hover:bg-danger-subtle",
          "enabled:active:bg-danger-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "tertiary",
        bare: false,
        color: "success",
        class: [
          "text-success-text",
          "enabled:hover:bg-success-subtle",
          "enabled:active:bg-success-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "tertiary",
        bare: false,
        color: "warning",
        class: [
          "text-warning-text",
          "enabled:hover:bg-warning-subtle",
          "enabled:active:bg-warning-subtle enabled:active:brightness-95",
        ],
      },
      {
        variant: "tertiary",
        bare: false,
        color: "info",
        class: [
          "text-info-text",
          "enabled:hover:bg-info-subtle",
          "enabled:active:bg-info-subtle enabled:active:brightness-95",
        ],
      },

      // ── tertiary bare — no fill; darken label via color-mix (solid ≠ darker than *-text)
      {
        variant: "tertiary",
        bare: true,
        color: "primary",
        class: [
          "text-accent-text",
          "enabled:hover:text-[color-mix(in_srgb,var(--color-accent-text)_72%,black)]",
          "enabled:active:text-[color-mix(in_srgb,var(--color-accent-text)_60%,black)]",
        ],
      },
      {
        variant: "tertiary",
        bare: true,
        color: "danger",
        class: [
          "text-danger-text",
          "enabled:hover:text-[color-mix(in_srgb,var(--color-danger-text)_72%,black)]",
          "enabled:active:text-[color-mix(in_srgb,var(--color-danger-text)_60%,black)]",
        ],
      },
      {
        variant: "tertiary",
        bare: true,
        color: "success",
        class: [
          "text-success-text",
          "enabled:hover:text-[color-mix(in_srgb,var(--color-success-text)_72%,black)]",
          "enabled:active:text-[color-mix(in_srgb,var(--color-success-text)_60%,black)]",
        ],
      },
      {
        variant: "tertiary",
        bare: true,
        color: "warning",
        class: [
          "text-warning-text",
          "enabled:hover:text-[color-mix(in_srgb,var(--color-warning-text)_72%,black)]",
          "enabled:active:text-[color-mix(in_srgb,var(--color-warning-text)_60%,black)]",
        ],
      },
      {
        variant: "tertiary",
        bare: true,
        color: "info",
        class: [
          "text-info-text",
          "enabled:hover:text-[color-mix(in_srgb,var(--color-info-text)_72%,black)]",
          "enabled:active:text-[color-mix(in_srgb,var(--color-info-text)_60%,black)]",
        ],
      },
    ],
    defaultVariants: {
      variant: "primary",
      color: "primary",
      size: ControlSize.md,
      fullWidth: false,
      bare: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariantProps {
  ref?: Ref<HTMLButtonElement>;
  /**
   * Shows a spinner, sets `aria-busy`, and disables interaction.
   * Label children stay mounted so the control width does not jump.
   * @default false
   */
  loading?: boolean;
  /**
   * Optional content when `loading` is true.
   * Defaults to existing `children` (spinner is prepended either way).
   */
  loadingText?: ReactNode;
}

/** Strip CVA-only / component props so they are not forwarded to the DOM. */
function getButtonDomProps(
  props: ButtonProps,
): ButtonHTMLAttributes<HTMLButtonElement> {
  const {
    variant: _variant,
    color: _color,
    size: _size,
    fullWidth: _fullWidth,
    bare: _bare,
    className: _className,
    children: _children,
    loading: _loading,
    loadingText: _loadingText,
    ref: _ref,
    ...domProps
  } = props;

  return domProps;
}

export function Button(props: ButtonProps) {
  const domProps = getButtonDomProps(props);
  // Tertiary is content-sized only; fullWidth does not apply (including bare).
  const bare = props.bare === true;
  const isTertiary = props.variant === "tertiary";
  const fullWidth = isTertiary || bare ? false : props.fullWidth;
  const loading = props.loading === true;
  const disabled = loading || props.disabled === true;
  const label =
    loading && props.loadingText != null ? props.loadingText : props.children;

  return (
    <button
      {...domProps}
      ref={props.ref}
      type={props.type ?? "button"}
      disabled={disabled}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({
          variant: props.variant,
          color: props.color,
          size: props.size,
          fullWidth,
          bare,
        }),
        // Loading uses disabled styles; block pointer events while busy.
        loading && "pointer-events-none",
        props.className,
      )}
      data-loading={loading ? "true" : undefined}
    >
      {loading ? <Spinner size={resolveControlSize(props.size)} /> : null}
      {label}
    </button>
  );
}

Button.displayName = "Button";
