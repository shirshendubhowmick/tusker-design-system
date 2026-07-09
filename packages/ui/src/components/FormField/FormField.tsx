import { type ReactNode, type Ref, useId } from "react";

import { cn } from "../../utils/cn";
import { Input, type InputProps } from "../Input";
import { Text, TextColor } from "../Text";

/**
 * Form field — label + {@link Input} + optional message.
 *
 * Combines the layout used across product forms.
 * Forwards all Input props (`color`, `size`, icons, native attributes, `ref`).
 * Label and message render via {@link Text}.
 */

const MESSAGE_COLOR = {
  default: TextColor.muted,
  success: TextColor.success,
  danger: TextColor.danger,
  warning: TextColor.warning,
} as const;

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

  const messageColor =
    MESSAGE_COLOR[color as keyof typeof MESSAGE_COLOR] ?? TextColor.muted;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
      data-slot="form-field"
    >
      <Text
        as="label"
        htmlFor={inputId}
        variant="label"
        size="md"
        color={TextColor.default}
        className={labelClassName}
        data-slot="form-field-label"
      >
        {label}
      </Text>
      <Input
        {...inputProps}
        id={inputId}
        color={color}
        fullWidth={fullWidth}
        className={inputClassName}
        aria-describedby={ariaDescribedBy}
      />
      {hasMessage ? (
        <Text
          as="p"
          id={messageId}
          variant="body"
          size="sm"
          color={messageColor}
          className={messageClassName}
          data-slot="form-field-message"
          // Announce validation errors to assistive tech.
          role={color === "danger" ? "alert" : undefined}
        >
          {message}
        </Text>
      ) : null}
    </div>
  );
}
