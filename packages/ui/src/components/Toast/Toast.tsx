import { Cross2Icon } from "@radix-ui/react-icons";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { type VariantProps, cva } from "class-variance-authority";
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactNode,
  Ref,
} from "react";

import { zIndexClass } from "../../tokens/z-index";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

/**
 * Toast — styled re-export of `@radix-ui/react-toast`, plus a DS layout kit.
 *
 * **Radix parts (ADR-002):** same public surface as Radix (`Provider`,
 * `Viewport`, `Root`, `Title`, `Description`, `Action`, `Close`,
 * `createToastScope`, …). Consumers use Radix docs for behavior; import from
 * `@design-system/ui/Toast`. DS only merges default styles (+ optional `color`
 * on Title / icon ink, `position` on Viewport). Panel fill stays neutral.
 *
 * **Composition kit:** {@link Body} is a higher-level layout (icon + title +
 * description + optional action + close) — not a Radix part. Prefer it for
 * product toasts; drop to primitives for fully custom chrome.
 *
 * Stacking uses `z-toast` (above modals). Place one {@link Provider} near the
 * app root with a single {@link Viewport}; open individual {@link Root} toasts
 * as needed. Pair Provider `swipeDirection` with viewport edge (e.g. bottom
 * stacks → swipe `"down"` or `"right"`).
 *
 * @see https://www.radix-ui.com/primitives/docs/components/toast
 */

// ── Viewport ─────────────────────────────────────────────────────────────────

/**
 * Corner / edge placement for the toast stack (styling only — not a Radix prop).
 */
export const ToastViewportPosition = {
  "top-left": "top-left",
  "top-center": "top-center",
  "top-right": "top-right",
  "bottom-left": "bottom-left",
  "bottom-center": "bottom-center",
  "bottom-right": "bottom-right",
} as const;

export type ToastViewportPosition =
  (typeof ToastViewportPosition)[keyof typeof ToastViewportPosition];

/** Low → high for docs / matrices. */
export const toastViewportPositionOrder = [
  ToastViewportPosition["top-left"],
  ToastViewportPosition["top-center"],
  ToastViewportPosition["top-right"],
  ToastViewportPosition["bottom-left"],
  ToastViewportPosition["bottom-center"],
  ToastViewportPosition["bottom-right"],
] as const satisfies readonly ToastViewportPosition[];

/**
 * Fixed notification stack. Radix renders an `<ol>`; keep list semantics.
 * Default `position="bottom-right"`.
 */
export const toastViewportVariants = cva(
  [
    "fixed",
    zIndexClass("toast"),
    "flex max-h-screen w-full max-w-[min(24rem,100%)] gap-2 p-4",
    "outline-none",
    // Don’t block the page where the viewport has no toasts
    "pointer-events-none [&>li]:pointer-events-auto",
  ],
  {
    variants: {
      /**
       * Screen corner / edge for the stack (styling only).
       * Top edges grow downward (`flex-col`); bottom edges grow upward
       * (`flex-col-reverse`) so the newest toast sits nearest the edge.
       */
      position: {
        "top-left": "top-0 left-0 flex-col",
        "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col",
        "top-right": "top-0 right-0 flex-col",
        "bottom-left": "bottom-0 left-0 flex-col-reverse",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse",
        "bottom-right": "bottom-0 right-0 flex-col-reverse",
      },
    },
    defaultVariants: {
      position: ToastViewportPosition["bottom-right"],
    },
  },
);

export type ToastViewportVariantProps = VariantProps<
  typeof toastViewportVariants
>;

// ── Root ─────────────────────────────────────────────────────────────────────

/**
 * Toast panel chrome — always neutral surface.
 * Intent is expressed via title / icon color (compose a leading icon), not panel fill.
 */
export const toastRootVariants = cva([
  // Row: [icon + copy] (flex-1) | Action + Close
  "relative flex w-full items-center gap-3",
  "rounded-md border border-border-default bg-bg-surface p-4 shadow-md",
  "text-fg-default outline-none",
  focusRing(),
  // Swipe (Radix CSS variables)
  "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
  "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
  "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:transition-transform",
]);

export type ToastRootVariantProps = VariantProps<typeof toastRootVariants>;

/**
 * Semantic intent for title + leading icon (styling only — not a Radix prop).
 * Panel background stays neutral; only ink / icon color changes.
 */
export const ToastColor = {
  default: "default",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
} as const;

export type ToastColor = (typeof ToastColor)[keyof typeof ToastColor];

// ── Title / Description / Icon ───────────────────────────────────────────────

export const toastTitleVariants = cva("text-label-lg font-sans font-medium", {
  variants: {
    color: {
      default: "text-fg-default",
      success: "text-success-text",
      danger: "text-danger-text",
      warning: "text-warning-text",
      info: "text-info-text",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

/** Supporting copy stays muted on the neutral panel for hierarchy. */
export const toastDescriptionVariants = cva(
  "text-body-sm font-sans text-fg-muted",
);

/**
 * Leading status icon — same semantic ink as {@link toastTitleVariants}.
 * Compose as the first child inside the copy column (or beside it).
 */
export const toastIconVariants = cva(
  // Top-align with title (Root is items-center for actions)
  "size-5 shrink-0 self-start [&_svg]:size-5",
  {
    variants: {
      color: {
        default: "text-fg-muted",
        success: "text-success-text",
        danger: "text-danger-text",
        warning: "text-warning-text",
        info: "text-info-text",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

// ── Action / Close ───────────────────────────────────────────────────────────

/**
 * Trailing cluster for Action + Close (side by side).
 * Compose: copy (flex-1) → `<div className={toastActionsClass}>` → Action → Close.
 */
export const toastActionsClass =
  "flex shrink-0 items-center gap-1.5 self-center";

/** Prefer `asChild` + {@link Button} for product actions. */
export const toastActionVariants = cva([
  "relative inline-flex shrink-0 items-center justify-center",
  "rounded-md px-2.5 py-1",
  "text-label-md font-medium",
  "border-border-default bg-bg-surface border",
  "hover:bg-bg-surface-hover",
  "cursor-pointer",
  focusRing(),
  "disabled:cursor-not-allowed disabled:opacity-65",
]);

/**
 * Prefer `asChild` + {@link IconButton} for dismiss.
 * Keep in the {@link toastActionsClass} cluster next to Action (not absolute).
 */
export const toastCloseVariants = cva([
  "relative inline-flex size-7 shrink-0 items-center justify-center",
  "rounded-md",
  "text-fg-muted hover:text-fg-default hover:bg-bg-surface-hover",
  "cursor-pointer",
  focusRing(),
  "disabled:cursor-not-allowed disabled:opacity-65",
  "[&_svg]:size-3.5",
]);

// ── Types ────────────────────────────────────────────────────────────────────

export type ToastProviderProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Provider
>;
export type ToastViewportProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Viewport
>;
export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Root>;
export type ToastTitleProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Title
>;
export type ToastDescriptionProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Description
>;
export type ToastActionProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Action
>;
export type ToastCloseProps = ComponentPropsWithoutRef<
  typeof ToastPrimitive.Close
>;

export type ToastViewportElement = ComponentRef<typeof ToastPrimitive.Viewport>;
export type ToastRootElement = ComponentRef<typeof ToastPrimitive.Root>;
export type ToastTitleElement = ComponentRef<typeof ToastPrimitive.Title>;
export type ToastDescriptionElement = ComponentRef<
  typeof ToastPrimitive.Description
>;
export type ToastActionElement = ComponentRef<typeof ToastPrimitive.Action>;
export type ToastCloseElement = ComponentRef<typeof ToastPrimitive.Close>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Toast provider — duration, swipe, label. Wrap app chrome once.
 */
export function Provider(props: ToastProviderProps) {
  return <ToastPrimitive.Provider {...props} />;
}

Provider.displayName = ToastPrimitive.Provider.displayName ?? "Toast.Provider";

/**
 * Viewport — fixed stack region for open toasts (`z-toast`).
 *
 * `position` is DS styling only (not a Radix prop). Default `bottom-right`.
 */
export function Viewport({
  className,
  position,
  ref,
  ...props
}: ToastViewportProps & {
  ref?: Ref<ToastViewportElement>;
  /**
   * Screen placement for the toast stack (styling only).
   * @default "bottom-right"
   */
  position?: ToastViewportPosition;
}) {
  return (
    <ToastPrimitive.Viewport
      {...props}
      ref={ref}
      className={cn(toastViewportVariants({ position }), className)}
    />
  );
}

Viewport.displayName = ToastPrimitive.Viewport.displayName ?? "Toast.Viewport";

/**
 * Individual toast root — neutral elevated panel.
 * Express intent with {@link Title} `color` + a leading icon (`toastIconVariants`).
 */
export function Root({
  className,
  ref,
  ...props
}: ToastProps & { ref?: Ref<ToastRootElement> }) {
  return (
    <ToastPrimitive.Root
      {...props}
      ref={ref}
      className={cn(toastRootVariants(), className)}
    />
  );
}

Root.displayName = ToastPrimitive.Root.displayName ?? "Toast.Root";

/**
 * Toast title. Optional `color` sets semantic ink (panel stays neutral).
 */
export function Title({
  className,
  color,
  ref,
  ...props
}: ToastTitleProps & {
  ref?: Ref<ToastTitleElement>;
  /**
   * Semantic text color (styling only).
   * @default "default"
   */
  color?: ToastColor;
}) {
  return (
    <ToastPrimitive.Title
      {...props}
      ref={ref}
      className={cn(toastTitleVariants({ color }), className)}
    />
  );
}

Title.displayName = ToastPrimitive.Title.displayName ?? "Toast.Title";

/**
 * Optional supporting copy under the title (always muted on the neutral panel).
 */
export function Description({
  className,
  ref,
  ...props
}: ToastDescriptionProps & { ref?: Ref<ToastDescriptionElement> }) {
  return (
    <ToastPrimitive.Description
      {...props}
      ref={ref}
      className={cn(toastDescriptionVariants(), className)}
    />
  );
}

Description.displayName =
  ToastPrimitive.Description.displayName ?? "Toast.Description";

/**
 * Action control (requires `altText`). Prefer `asChild` + {@link Button}.
 */
export function Action({
  className,
  ref,
  ...props
}: ToastActionProps & { ref?: Ref<ToastActionElement> }) {
  return (
    <ToastPrimitive.Action
      {...props}
      ref={ref}
      className={cn(toastActionVariants(), className)}
    />
  );
}

Action.displayName = ToastPrimitive.Action.displayName ?? "Toast.Action";

/**
 * Dismiss control. Prefer `asChild` + {@link IconButton}.
 */
export function Close({
  className,
  ref,
  ...props
}: ToastCloseProps & { ref?: Ref<ToastCloseElement> }) {
  return (
    <ToastPrimitive.Close
      {...props}
      ref={ref}
      className={cn(toastCloseVariants(), className)}
    />
  );
}

Close.displayName = ToastPrimitive.Close.displayName ?? "Toast.Close";

// ── Body (composition kit — not a Radix part) ────────────────────────────────

/**
 * Standard toast layout: leading icon → title / description → action + close.
 *
 * Higher-level kit (same idea as FormField) that composes the styled Radix
 * parts. Use inside {@link Root}:
 *
 * ```tsx
 * <Root open onOpenChange={…}>
 *   <Body
 *     color="success"
 *     icon={<CheckCircledIcon />}
 *     title="Deploy finished"
 *     description="edge-api is live in us-east-1."
 *     actionLabel="View"
 *   />
 * </Root>
 * ```
 *
 * Pass `icon` from the app (e.g. `@radix-ui/react-icons`). Panel stays
 * neutral; `color` only tints the title and icon.
 */
export interface ToastBodyProps {
  /**
   * Semantic intent for title + leading icon (styling only).
   * @default "default"
   */
  color?: ToastColor;
  /** Primary line — rendered as {@link Title}. */
  title: ReactNode;
  /** Supporting line — rendered as {@link Description} when set. */
  description?: ReactNode;
  /**
   * Leading status glyph (decorative, `aria-hidden`).
   * Apps supply the icon; DS only applies {@link toastIconVariants}.
   */
  icon?: ReactNode;
  /**
   * Optional action content (prefer Button `size="sm"`).
   * Wrapped in {@link Action} with `asChild`. Provide `actionAltText`, or use
   * `actionLabel` which sets both the button label and alt text.
   */
  action?: ReactNode;
  /**
   * Accessible name for {@link Action} when `action` is set.
   * Required by Radix when an action is present.
   */
  actionAltText?: string;
  /**
   * Convenience: render a secondary sm Button as the action.
   * Sets `actionAltText` to the same string when `actionAltText` is omitted.
   */
  actionLabel?: string;
  /**
   * Show the dismiss control.
   * @default true
   */
  close?: boolean;
  /**
   * Icon for the dismiss IconButton.
   * @default Cross2Icon from `@radix-ui/react-icons`
   */
  closeIcon?: ReactNode;
  /**
   * Accessible name for dismiss.
   * @default "Dismiss"
   */
  closeLabel?: string;
  /** Extra classes on the copy column (title + description). */
  className?: string;
}

/**
 * Product toast content layout. Compose inside {@link Root}.
 */
export function Body(props: ToastBodyProps) {
  const color = props.color ?? ToastColor.default;
  const actionContent =
    props.action ??
    (props.actionLabel != null && props.actionLabel !== "" ? (
      <Button size="sm" variant="secondary">
        {props.actionLabel}
      </Button>
    ) : null);

  const resolvedActionAltText = props.actionAltText ?? props.actionLabel;
  const showAction =
    actionContent != null &&
    resolvedActionAltText != null &&
    resolvedActionAltText !== "";
  const showClose = props.close !== false;
  const showActions = showAction || showClose;

  return (
    <>
      {props.icon != null ? (
        <span className={toastIconVariants({ color })} aria-hidden>
          {props.icon}
        </span>
      ) : null}
      <div
        className={cn("flex min-w-0 flex-1 flex-col gap-1", props.className)}
      >
        <Title color={color}>{props.title}</Title>
        {props.description != null && props.description !== "" ? (
          <Description>{props.description}</Description>
        ) : null}
      </div>
      {showActions ? (
        <div className={toastActionsClass}>
          {showAction ? (
            <Action altText={resolvedActionAltText} asChild>
              {actionContent}
            </Action>
          ) : null}
          {showClose ? (
            <Close asChild>
              <IconButton
                aria-label={props.closeLabel ?? "Dismiss"}
                variant="tertiary"
                size="sm"
              >
                {props.closeIcon ?? <Cross2Icon />}
              </IconButton>
            </Close>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

Body.displayName = "Toast.Body";
