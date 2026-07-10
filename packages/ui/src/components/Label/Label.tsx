import type { LabelHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "../../utils/cn";

export interface LabelProps extends Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children"
> {
  ref?: Ref<HTMLLabelElement>;
  children: ReactNode;
  /**
   * Shows a required marker (`*`) after the label.
   * Visual only — still set `required` on the control for a11y/forms.
   * @default false
   */
  required?: boolean;
  /**
   * Muted + not-allowed cursor when the associated control is disabled.
   * @default false
   */
  disabled?: boolean;
  className?: string;
}

/**
 * Form label — `text-label-md` with required / disabled affordances.
 *
 * Prefer pairing with {@link Field} for layout. Can later compose Radix Label
 * if needed; styles stay on this component.
 *
 * @example
 * ```tsx
 * import { Label } from "@design-system/ui/Label";
 *
 * <Label htmlFor="email" required>Email</Label>
 * ```
 */
export function Label(props: LabelProps) {
  const {
    children,
    required = false,
    disabled = false,
    className,
    ref,
    ...labelProps
  } = props;

  return (
    <label
      {...labelProps}
      ref={ref}
      className={cn(
        "text-label-md inline-flex items-center gap-0.5",
        disabled
          ? "text-fg-muted cursor-not-allowed opacity-65"
          : "text-fg-default",
        className,
      )}
      data-slot="label"
      data-disabled={disabled ? "true" : undefined}
      data-required={required ? "true" : undefined}
    >
      {children}
      {required ? (
        <span
          className="text-danger-text font-medium"
          aria-hidden
          data-slot="label-required"
        >
          *
        </span>
      ) : null}
    </label>
  );
}

Label.displayName = "Label";
