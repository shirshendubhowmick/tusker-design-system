import { type VariantProps, cva } from "class-variance-authority";
import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "../../utils/cn";

/**
 * Text input styles — product control on design-system semantic tokens.
 *
 * CVA dimensions:
 * - color — validation / intent: default (neutral), success, danger (error), warning
 * - size  — sm / md / lg (aligned with Button control heights)
 * - fullWidth — stretch to parent
 *
 * Uses `danger` (not a separate "error" scale) so form error states share
 * the same semantic palette as Button and other status UI.
 */
/**
 * Focus ring matching `shadow-focus` geometry (3px soft ring), tinted with a
 * semantic solid so validation colors keep their own focus affordance.
 */
const focusRing = {
  /** Brand / default — product `shadow-focus` token (`--color-focus-ring`). */
  default: "focus-visible:shadow-focus",
  success:
    "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-success-solid)_45%,transparent)]",
  danger:
    "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger-solid)_45%,transparent)]",
  warning:
    "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-warning-solid)_45%,transparent)]",
} as const;

export const inputVariants = cva(
  [
    "block min-w-0",
    "rounded-md border bg-bg-surface font-sans text-fg-default",
    "placeholder:text-fg-muted",
    "transition-[color,background-color,border-color,box-shadow]",
    "outline-none",
    // surface-hover is one step darker than surface (subtle matches surface in light).
    "disabled:cursor-not-allowed disabled:opacity-65 disabled:bg-bg-surface-hover",
    "read-only:bg-bg-surface-hover",
  ],
  {
    variants: {
      color: {
        default: [
          "border-border-default",
          "enabled:hover:border-border-hover",
          "focus-visible:border-accent-border",
          focusRing.default,
        ],
        success: [
          "border-success-border",
          "enabled:hover:border-success-solid",
          "focus-visible:border-success-solid",
          focusRing.success,
        ],
        danger: [
          "border-danger-border",
          "enabled:hover:border-danger-solid",
          "focus-visible:border-danger-solid",
          focusRing.danger,
        ],
        warning: [
          "border-warning-border",
          "enabled:hover:border-warning-solid",
          "focus-visible:border-warning-solid",
          focusRing.warning,
        ],
      },
      size: {
        /** Dense forms, table filters */
        sm: "h-8 px-2.5 text-body-sm",
        /** Default product control */
        md: "h-9 px-3 text-body-md",
        /** Emphasized / touch-friendly fields */
        lg: "h-10 px-3.5 text-body-md",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      color: "default",
      size: "md",
      fullWidth: true,
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputVariants>;

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    InputVariantProps {
  ref?: Ref<HTMLInputElement>;
}

/** Strip CVA-only props so they are not forwarded to the DOM. */
function getInputDomProps(
  props: InputProps,
): InputHTMLAttributes<HTMLInputElement> {
  const {
    color: _color,
    size: _size,
    fullWidth: _fullWidth,
    className: _className,
    ...domProps
  } = props;

  return domProps;
}

export function Input(props: InputProps) {
  const domProps = getInputDomProps(props);
  const color = props.color ?? "default";
  const isInvalid =
    props["aria-invalid"] === true ||
    props["aria-invalid"] === "true" ||
    color === "danger";

  return (
    <input
      {...domProps}
      type={props.type ?? "text"}
      aria-invalid={isInvalid || undefined}
      className={cn(
        inputVariants({
          color,
          size: props.size,
          fullWidth: props.fullWidth,
        }),
        props.className,
      )}
    />
  );
}
