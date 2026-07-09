import { type VariantProps, cva } from "class-variance-authority";
import { type ReactNode, type Ref, useId } from "react";

import { cn } from "../../utils/cn";
import { Input, type InputProps } from "../Input";

/**
 * Form field — label + {@link Input} + optional message.
 *
 * Combines the layout used across product forms (see Storybook Validation).
 * Forwards all Input props (`color`, `size`, icons, native attributes, `ref`).
 */
const messageVariants = cva("text-body-sm", {
  variants: {
    color: {
      default: "text-fg-muted",
      success: "text-success-text",
      danger: "text-danger-text",
      warning: "text-warning-text",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export type FormFieldMessageColor = NonNullable<
  VariantProps<typeof messageVariants>["color"]
>;

export interface FormFieldProps extends Omit<InputProps, "className"> {
  /**
   * Visible label, associated via `htmlFor` / `id`.
   * `ReactNode` so callers can pass plain text or rich content (required mark, badge, link).
   */
  label: ReactNode;
  /**
   * Helper or validation content under the control.
   * `ReactNode` so callers can pass plain text or rich content (icon + text, links, emphasis).
   */
  message?: ReactNode;
  /**
   * Classes for the outer stack (`label` + control + message).
   * Input chrome styling still uses `inputClassName`.
   */
  className?: string;
  /** Classes forwarded to {@link Input} (field chrome). */
  inputClassName?: string;
  /** Classes for the label element. */
  labelClassName?: string;
  /** Classes for the message element. */
  messageClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

export function FormField(props: FormFieldProps) {
  const {
    label,
    message,
    className,
    inputClassName,
    labelClassName,
    messageClassName,
    "id": idProp,
    color = "default",
    fullWidth = true,
    "aria-describedby": ariaDescribedByProp,
    ...inputProps
  } = props;

  const reactId = useId();
  const inputId = idProp ?? reactId;
  const messageId = `${inputId}-message`;
  const hasMessage = message != null && message !== false && message !== "";

  const ariaDescribedBy =
    [hasMessage ? messageId : null, ariaDescribedByProp]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
      data-slot="form-field"
    >
      <label
        htmlFor={inputId}
        className={cn("text-label-md text-fg-default", labelClassName)}
        data-slot="form-field-label"
      >
        {label}
      </label>
      <Input
        {...inputProps}
        id={inputId}
        color={color}
        fullWidth={fullWidth}
        className={inputClassName}
        aria-describedby={ariaDescribedBy}
      />
      {hasMessage ? (
        <p
          id={messageId}
          className={cn(messageVariants({ color }), messageClassName)}
          data-slot="form-field-message"
          // Announce validation errors to assistive tech.
          role={color === "danger" ? "alert" : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
