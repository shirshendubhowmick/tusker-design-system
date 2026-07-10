import { type ReactNode, type Ref, useId } from "react";

import { Field, FieldMessageTone } from "../Field";
import { Input, type InputProps } from "../Input";

/**
 * Form field — label + {@link Input} + optional message.
 *
 * Convenience wrapper around {@link Field} (vertical) + {@link Input}.
 * For checkboxes / switches, use {@link Field} with `orientation="horizontal"`.
 */

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
    required,
    disabled,
    "aria-describedby": ariaDescribedByProp,
    ref,
    ...inputProps
  } = props;

  const reactId = useId();
  const inputId = idProp ?? reactId;

  const messageTone =
    color === "success" || color === "danger" || color === "warning"
      ? color
      : FieldMessageTone.default;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      message={message}
      messageTone={messageTone}
      required={Boolean(required)}
      disabled={Boolean(disabled)}
      fullWidth={fullWidth ?? true}
      className={className}
      labelClassName={labelClassName}
      messageClassName={messageClassName}
    >
      {(control) => (
        <Input
          {...inputProps}
          {...control}
          ref={ref}
          id={inputId}
          color={color}
          fullWidth={fullWidth ?? true}
          required={required ?? undefined}
          disabled={disabled ?? undefined}
          className={inputClassName}
          aria-describedby={
            [control["aria-describedby"], ariaDescribedByProp]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
      )}
    </Field>
  );
}

FormField.displayName = "FormField";
