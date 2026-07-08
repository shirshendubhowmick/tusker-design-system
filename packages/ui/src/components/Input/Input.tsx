import { type VariantProps, cva } from "class-variance-authority";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "../../utils/cn";

/**
 * Text input — product control on design-system semantic tokens.
 *
 * CVA dimensions:
 * - color — validation / intent: default, success, danger (error), warning
 * - size  — sm / md / lg (aligned with Button control heights)
 * - fullWidth — stretch to parent
 *
 * Icons: pass any `ReactNode` via `startIcon` / `endIcon`. Prefer
 * `@radix-ui/react-icons` in apps (optional peer). Icons are decorative;
 * label the control with `aria-label` / `<label htmlFor>`.
 */
/**
 * Focus ring matching `shadow-focus` geometry (3px soft ring), tinted with a
 * semantic solid so validation colors keep their own focus affordance.
 * Applied with `focus-within` so the ring tracks the nested control.
 */
const focusRing = {
  default: "focus-within:shadow-focus",
  success:
    "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-success-solid)_45%,transparent)]",
  danger:
    "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger-solid)_45%,transparent)]",
  warning:
    "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-warning-solid)_45%,transparent)]",
} as const;

/** Outer field chrome — border, surface, focus, size box. */
export const inputFieldVariants = cva(
  [
    "relative inline-flex min-w-0 items-center",
    "rounded-md border bg-bg-surface font-sans",
    "transition-[color,background-color,border-color,box-shadow]",
    // surface-hover is one step darker than surface (subtle matches surface in light).
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-65 has-[:disabled]:bg-bg-surface-hover",
    "has-[:read-only]:bg-bg-surface-hover",
  ],
  {
    variants: {
      color: {
        default: [
          "border-border-default",
          "hover:has-[:enabled]:border-border-hover",
          "focus-within:border-accent-border",
          focusRing.default,
        ],
        success: [
          "border-success-border",
          "hover:has-[:enabled]:border-success-solid",
          "focus-within:border-success-solid",
          focusRing.success,
        ],
        danger: [
          "border-danger-border",
          "hover:has-[:enabled]:border-danger-solid",
          "focus-within:border-danger-solid",
          focusRing.danger,
        ],
        warning: [
          "border-warning-border",
          "hover:has-[:enabled]:border-warning-solid",
          "focus-within:border-warning-solid",
          focusRing.warning,
        ],
      },
      size: {
        sm: "h-8",
        md: "h-9",
        lg: "h-10",
      },
      fullWidth: {
        true: "flex w-full",
        false: "inline-flex w-auto",
      },
    },
    defaultVariants: {
      color: "default",
      size: "md",
      fullWidth: true,
    },
  },
);

/** Native control — transparent inside the field chrome. */
export const inputControlVariants = cva(
  [
    "min-w-0 flex-1 bg-transparent font-sans text-fg-default",
    "placeholder:text-fg-muted",
    "outline-none border-0 shadow-none",
    "disabled:cursor-not-allowed",
    "read-only:cursor-default",
  ],
  {
    variants: {
      size: {
        sm: "h-full px-2.5 text-body-sm",
        md: "h-full px-3 text-body-md",
        lg: "h-full px-3.5 text-body-md",
      },
      hasStartIcon: {
        true: "",
        false: "",
      },
      hasEndIcon: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", hasStartIcon: true, class: "pl-8" },
      { size: "md", hasStartIcon: true, class: "pl-9" },
      { size: "lg", hasStartIcon: true, class: "pl-10" },
      { size: "sm", hasEndIcon: true, class: "pr-8" },
      { size: "md", hasEndIcon: true, class: "pr-9" },
      { size: "lg", hasEndIcon: true, class: "pr-10" },
    ],
    defaultVariants: {
      size: "md",
      hasStartIcon: false,
      hasEndIcon: false,
    },
  },
);

const iconSlotVariants = cva(
  [
    "pointer-events-none absolute inset-y-0 flex items-center",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      side: {
        start: "left-0",
        end: "right-0",
      },
      size: {
        sm: "px-2.5 [&_svg]:size-3.5",
        md: "px-3 [&_svg]:size-4",
        lg: "px-3.5 [&_svg]:size-4",
      },
      color: {
        default: "text-fg-muted",
        success: "text-success-text",
        danger: "text-danger-text",
        warning: "text-warning-text",
      },
    },
    defaultVariants: {
      side: "start",
      size: "md",
      color: "default",
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputFieldVariants>;

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    InputVariantProps {
  ref?: Ref<HTMLInputElement>;
  /** Leading icon (e.g. MagnifyingGlassIcon from `@radix-ui/react-icons`). */
  startIcon?: ReactNode;
  /** Trailing icon (e.g. Cross2Icon, CheckIcon). */
  endIcon?: ReactNode;
}

/** Strip component-only props so they are not forwarded to the DOM input. */
function getInputDomProps(
  props: InputProps,
): InputHTMLAttributes<HTMLInputElement> {
  const {
    color: _color,
    size: _size,
    fullWidth: _fullWidth,
    className: _className,
    startIcon: _startIcon,
    endIcon: _endIcon,
    ...domProps
  } = props;

  return domProps;
}

export function Input(props: InputProps) {
  const domProps = getInputDomProps(props);
  const color = props.color ?? "default";
  const size = props.size ?? "md";
  const fullWidth = props.fullWidth ?? true;
  const hasStartIcon = props.startIcon != null;
  const hasEndIcon = props.endIcon != null;
  const isInvalid =
    props["aria-invalid"] === true ||
    props["aria-invalid"] === "true" ||
    color === "danger";

  return (
    <div
      className={cn(
        inputFieldVariants({ color, size, fullWidth }),
        props.className,
      )}
      data-slot="input-field"
    >
      {hasStartIcon ? (
        <span
          className={iconSlotVariants({ side: "start", size, color })}
          data-slot="input-start-icon"
          aria-hidden
        >
          {props.startIcon}
        </span>
      ) : null}
      <input
        {...domProps}
        type={props.type ?? "text"}
        aria-invalid={isInvalid || undefined}
        className={inputControlVariants({
          size,
          hasStartIcon,
          hasEndIcon,
        })}
        data-slot="input"
      />
      {hasEndIcon ? (
        <span
          className={iconSlotVariants({ side: "end", size, color })}
          data-slot="input-end-icon"
          aria-hidden
        >
          {props.endIcon}
        </span>
      ) : null}
    </div>
  );
}
