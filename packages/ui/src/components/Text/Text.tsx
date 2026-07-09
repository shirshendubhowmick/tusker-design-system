import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import {
  type TextStyleName,
  textStyles,
} from "../../tokens/typography/semantic";
import { cn } from "../../utils/cn";

/**
 * Semantic typography wrapper.
 *
 * Maps product text styles (`text-heading-lg`, `text-body-md`, …) via:
 * - `variant` — group: display | heading | body | label | code | metric
 * - `size`    — step within that group (e.g. heading + lg → `text-heading-lg`)
 * - `color`   — semantic foreground utility
 * - `as`      — required HTML element (p, span, h1, label, …)
 *
 * Prefer the exported maps over string literals:
 * ```tsx
 * <Text as="p" variant={TextVariant.body} size={TextSize.md} color={TextColor.muted} />
 * ```
 */

/** Semantic typography groups. */
export const TextVariant = {
  display: "display",
  heading: "heading",
  body: "body",
  label: "label",
  code: "code",
  metric: "metric",
} as const;

export type TextVariant = (typeof TextVariant)[keyof typeof TextVariant];

/**
 * Size steps across groups (not every pair is valid).
 * Multi-word steps use camelCase keys → kebab values (`mdMedium` → `md-medium`).
 */
export const TextSize = {
  xl: "xl",
  lg: "lg",
  md: "md",
  sm: "sm",
  xs: "xs",
  mdMedium: "md-medium",
  overline: "overline",
  block: "block",
} as const;

export type TextSize = (typeof TextSize)[keyof typeof TextSize];

/**
 * Semantic foreground colors.
 * Multi-word tokens use camelCase keys (`onDanger` → `on-danger`).
 */
export const TextColor = {
  default: "default",
  muted: "muted",
  subtle: "subtle",
  accent: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  onAccent: "on-accent",
  onInverse: "on-inverse",
  onSuccess: "on-success",
  onWarning: "on-warning",
  onDanger: "on-danger",
  onInfo: "on-info",
} as const;

export type TextColor = (typeof TextColor)[keyof typeof TextColor];

const DEFAULT_SIZE_BY_VARIANT: Record<TextVariant, TextSize> = {
  [TextVariant.display]: TextSize.md,
  [TextVariant.heading]: TextSize.md,
  [TextVariant.body]: TextSize.md,
  [TextVariant.label]: TextSize.md,
  [TextVariant.code]: TextSize.md,
  [TextVariant.metric]: TextSize.md,
};

const COLOR_CLASS: Record<TextColor, string> = {
  [TextColor.default]: "text-fg-default",
  [TextColor.muted]: "text-fg-muted",
  [TextColor.subtle]: "text-fg-subtle",
  [TextColor.accent]: "text-accent-text",
  [TextColor.success]: "text-success-text",
  [TextColor.warning]: "text-warning-text",
  [TextColor.danger]: "text-danger-text",
  [TextColor.info]: "text-info-text",
  [TextColor.onAccent]: "text-fg-on-accent",
  [TextColor.onInverse]: "text-fg-on-inverse",
  [TextColor.onSuccess]: "text-fg-on-success",
  [TextColor.onWarning]: "text-fg-on-warning",
  [TextColor.onDanger]: "text-fg-on-danger",
  [TextColor.onInfo]: "text-fg-on-info",
};

const STYLE_NAMES = new Set<string>(textStyles.map((style) => style.name));

function resolveStyleName(variant: TextVariant, size: TextSize): TextStyleName {
  const candidate = `${variant}-${size}`;
  if (STYLE_NAMES.has(candidate)) {
    return candidate as TextStyleName;
  }
  const fallback = `${variant}-${DEFAULT_SIZE_BY_VARIANT[variant]}`;
  if (STYLE_NAMES.has(fallback)) {
    return fallback as TextStyleName;
  }
  return "body-md";
}

function styleClassName(variant: TextVariant, size: TextSize): string {
  return `text-${resolveStyleName(variant, size)}`;
}

interface TextOwnProps {
  /** Required HTML element to render. */
  as: ElementType;
  /**
   * Semantic style group.
   * @default "body"
   */
  variant?: TextVariant;
  /**
   * Step within `variant` (e.g. `TextVariant.heading` + `TextSize.lg` → `text-heading-lg`).
   * @default "md"
   */
  size?: TextSize;
  /**
   * Semantic text color.
   * @default "default"
   */
  color?: TextColor;
  children?: ReactNode;
  className?: string;
}

export type TextProps<T extends ElementType = ElementType> = TextOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps>;

export function Text<T extends ElementType = ElementType>(props: TextProps<T>) {
  const {
    as: Component,
    variant = TextVariant.body,
    size = DEFAULT_SIZE_BY_VARIANT[variant ?? TextVariant.body],
    color = TextColor.default,
    className,
    children,
    ...rest
  } = props;

  return (
    <Component
      {...rest}
      className={cn(
        styleClassName(variant, size),
        COLOR_CLASS[color],
        className,
      )}
      data-slot="text"
    >
      {children}
    </Component>
  );
}
