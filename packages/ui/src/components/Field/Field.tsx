import { type HTMLAttributes, type ReactNode, type Ref, useId } from "react";

import { cn } from "../../utils/cn";
import { Label } from "../Label";
import { Text, TextColor, TextSize, TextVariant } from "../Text";

/** Vertical = label above control; horizontal = choice row (control + label). */
export const FieldOrientation = {
  vertical: "vertical",
  horizontal: "horizontal",
} as const;

export type FieldOrientation =
  (typeof FieldOrientation)[keyof typeof FieldOrientation];

/** Status color for the message line (and `role="alert"` when danger). */
export const FieldMessageTone = {
  default: "default",
  success: "success",
  danger: "danger",
  warning: "warning",
} as const;

export type FieldMessageTone =
  (typeof FieldMessageTone)[keyof typeof FieldMessageTone];

const MESSAGE_COLOR = {
  [FieldMessageTone.default]: TextColor.muted,
  [FieldMessageTone.success]: TextColor.success,
  [FieldMessageTone.danger]: TextColor.danger,
  [FieldMessageTone.warning]: TextColor.warning,
} as const;

/** A11y props Field wants on the control — use the render-prop form of `children`. */
export interface FieldControlProps {
  "id": string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

export interface FieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "color"
> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Visible label. Omit for controls that are named only via `aria-label`.
   */
  label?: ReactNode;
  /**
   * The control (input, checkbox, switch, …).
   *
   * Prefer a function to receive {@link FieldControlProps} (`id`,
   * `aria-describedby`, …). A plain node is fine when you set `id` yourself
   * to match `htmlFor`.
   */
  children: ReactNode | ((props: FieldControlProps) => ReactNode);
  /**
   * Secondary helper under the label (horizontal) or under the control (vertical).
   */
  description?: ReactNode;
  /**
   * Validation / status line (always below the field).
   */
  message?: ReactNode;
  /**
   * Message color (+ alert role when `danger`).
   * @default "default"
   */
  messageTone?: FieldMessageTone;
  /**
   * Layout: `vertical` for text fields; `horizontal` for checkbox / switch / radio.
   * @default "vertical"
   */
  orientation?: FieldOrientation;
  /**
   * Associates the label via `htmlFor` and provides the control `id`
   * (via render-prop / default id).
   */
  htmlFor?: string;
  /**
   * Required marker on the label + `aria-required` on the control (render-prop).
   * @default false
   */
  required?: boolean;
  /**
   * Disabled styling on the label.
   * @default false
   */
  disabled?: boolean;
  /**
   * Stretch to parent width.
   * @default true
   */
  fullWidth?: boolean;
  className?: string;
  labelClassName?: string;
  /** Wrapper around the control slot. */
  controlClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
}

function mergeDescribedBy(
  existing: string | undefined,
  next: string | undefined,
): string | undefined {
  const merged = [existing, next].filter(Boolean).join(" ").trim();
  return merged || undefined;
}

/**
 * Form field layout — orientation, label, description, and message.
 *
 * Not tied to a specific control: pass any control as `children`.
 * Use `orientation="horizontal"` for choice controls (checkbox, switch, radio).
 *
 * @example
 * ```tsx
 * // Text field (vertical) — render prop gets a11y props
 * <Field label="Email" htmlFor="email" message="Optional hint">
 *   {(control) => <Input {...control} />}
 * </Field>
 *
 * // Choice (horizontal)
 * <Field orientation="horizontal" label="Email me updates" htmlFor="mkt">
 *   {(control) => <input type="checkbox" {...control} />}
 * </Field>
 * ```
 */
export function Field(props: FieldProps) {
  const {
    label,
    children,
    description,
    message,
    messageTone = FieldMessageTone.default,
    orientation = FieldOrientation.vertical,
    htmlFor: htmlForProp,
    required = false,
    disabled = false,
    fullWidth = true,
    className,
    labelClassName,
    controlClassName,
    descriptionClassName,
    messageClassName,
    ref,
    id: idProp,
    ...rootProps
  } = props;

  const reactId = useId();
  const baseId = htmlForProp ?? idProp ?? reactId;
  const controlId = htmlForProp ?? baseId;
  const descriptionId = `${baseId}-description`;
  const messageId = `${baseId}-message`;

  const hasLabel = label != null && label !== false && label !== "";
  const hasDescription =
    description != null && description !== false && description !== "";
  const hasMessage = message != null && message !== false && message !== "";

  const describedBy = mergeDescribedBy(
    hasDescription ? descriptionId : undefined,
    hasMessage ? messageId : undefined,
  );

  const controlProps: FieldControlProps = {
    id: controlId,
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(messageTone === FieldMessageTone.danger && hasMessage
      ? { "aria-invalid": true }
      : {}),
    ...(required ? { "aria-required": true } : {}),
  };

  const control =
    typeof children === "function" ? children(controlProps) : children;

  const isHorizontal = orientation === FieldOrientation.horizontal;

  const labelNode = hasLabel ? (
    <Label
      htmlFor={controlId}
      required={required}
      disabled={disabled}
      className={cn(
        // Horizontal: tight line-box so the control can center against the label.
        isHorizontal && "leading-none font-normal",
        labelClassName,
      )}
    >
      {label}
    </Label>
  ) : null;

  const descriptionNode = hasDescription ? (
    <Text
      as="p"
      id={descriptionId}
      variant={TextVariant.body}
      size={TextSize.sm}
      color={TextColor.muted}
      className={descriptionClassName}
    >
      {description}
    </Text>
  ) : null;

  const messageNode = hasMessage ? (
    <Text
      as="p"
      id={messageId}
      variant={TextVariant.body}
      size={TextSize.sm}
      color={MESSAGE_COLOR[messageTone]}
      className={messageClassName}
      role={messageTone === FieldMessageTone.danger ? "alert" : undefined}
    >
      {message}
    </Text>
  ) : null;

  const controlNode = (
    <div
      className={cn(
        // Size to the control and center it in the label row (grid / flex).
        isHorizontal && "flex shrink-0 items-center justify-center self-center",
        controlClassName,
      )}
    >
      {control}
    </div>
  );

  return (
    <div
      {...rootProps}
      ref={ref}
      id={idProp}
      className={cn(
        "flex flex-col gap-1.5",
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
      data-orientation={orientation}
    >
      {isHorizontal ? (
        <>
          {/*
            Two-column grid: control + label share row 1 and center to each other.
            Description sits on row 2 under the label only — so it never pulls the
            control toward the top or bottom of a multi-line block.
          */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-0.5">
            <div className="col-start-1 row-start-1">{controlNode}</div>
            {hasLabel ? (
              <div className="col-start-2 row-start-1 min-w-0">{labelNode}</div>
            ) : null}
            {hasDescription ? (
              <div className="col-start-2 row-start-2 min-w-0">
                {descriptionNode}
              </div>
            ) : null}
          </div>
          {messageNode}
        </>
      ) : (
        <>
          {labelNode}
          {controlNode}
          {descriptionNode}
          {messageNode}
        </>
      )}
    </div>
  );
}

Field.displayName = "Field";
