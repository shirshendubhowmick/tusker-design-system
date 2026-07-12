import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { zIndexClass } from "../../tokens/z-index";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";
import { overlay } from "../../utils/overlay";
import { surface } from "../../utils/surface";

/**
 * AlertDialog — styled re-export of `@radix-ui/react-alert-dialog`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Trigger`,
 * `Portal`, `Overlay`, `Content`, `Title`, `Description`, `Action`, `Cancel`,
 * `createAlertDialogScope`, …). Consumers use Radix docs for behavior; import
 * from `@design-system/ui/AlertDialog`. DS only merges default styles.
 *
 * Compact, always-centered confirm/alert panels — not product Dialog. Prefer
 * this for destructive / irreversible confirms; use `@design-system/ui/Dialog`
 * for forms and larger content (including mobile full-screen `md`+).
 *
 * @see https://www.radix-ui.com/primitives/docs/components/alert-dialog
 */

// ── Overlay ──────────────────────────────────────────────────────────────────

export const alertDialogOverlayVariants = cva(overlay());

export type AlertDialogOverlayVariantProps = VariantProps<
  typeof alertDialogOverlayVariants
>;

// ── Content ──────────────────────────────────────────────────────────────────

/**
 * Always-centered compact panel (all breakpoints, including mobile).
 * No full-screen sheet — that pattern belongs to product Dialog.
 */
const alertDialogCenteredPanelClass = [
  "top-1/2 left-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "w-[calc(100%-2rem)] max-h-[min(85vh,100%)]",
  "rounded-md",
].join(" ");

/**
 * Content panel sizing (styling only). Prefer the {@link Content} `size` prop —
 * do **not** pass `alertDialogContentVariants({ size })` as `className` on
 * Content (double-applies the default recipe).
 *
 * Compact scale (always centered, including mobile):
 *
 * | size | max-width | ~px @ 16 |
 * | ---- | --------- | -------- |
 * | sm   | max-w-sm  | 384      |
 * | md   | max-w-md  | 448      |
 * | lg   | max-w-lg  | 512      |
 */
export const alertDialogContentVariants = cva(
  [
    surface({ elevation: "lg" }),
    "fixed",
    zIndexClass("modal"),
    alertDialogCenteredPanelClass,
    "overflow-y-auto",
    "p-0",
    focusRing(),
  ],
  {
    variants: {
      size: {
        /** Tight confirm (short copy + actions) */
        sm: "max-w-sm",
        /** Default alert / confirm */
        md: "max-w-md",
        /** Slightly roomier message body */
        lg: "max-w-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type AlertDialogContentVariantProps = VariantProps<
  typeof alertDialogContentVariants
>;

/** Panel size token for {@link Content} / {@link alertDialogContentVariants}. */
export type AlertDialogContentSize = NonNullable<
  AlertDialogContentVariantProps["size"]
>;

// ── Title / Description ──────────────────────────────────────────────────────

export const alertDialogTitleVariants = cva(
  "text-heading-sm text-fg-default font-sans",
);

export const alertDialogDescriptionVariants = cva(
  "text-body-sm text-fg-muted font-sans",
);

// ── Types ────────────────────────────────────────────────────────────────────

export type AlertDialogProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
>;
export type AlertDialogTriggerProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;
export type AlertDialogPortalProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Portal
>;
export type AlertDialogOverlayProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Overlay
>;
export type AlertDialogContentProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
>;
export type AlertDialogTitleProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>;
export type AlertDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;
export type AlertDialogActionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
>;
export type AlertDialogCancelProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;

export type AlertDialogTriggerElement = ComponentRef<
  typeof AlertDialogPrimitive.Trigger
>;
export type AlertDialogOverlayElement = ComponentRef<
  typeof AlertDialogPrimitive.Overlay
>;
export type AlertDialogContentElement = ComponentRef<
  typeof AlertDialogPrimitive.Content
>;
export type AlertDialogTitleElement = ComponentRef<
  typeof AlertDialogPrimitive.Title
>;
export type AlertDialogDescriptionElement = ComponentRef<
  typeof AlertDialogPrimitive.Description
>;
export type AlertDialogActionElement = ComponentRef<
  typeof AlertDialogPrimitive.Action
>;
export type AlertDialogCancelElement = ComponentRef<
  typeof AlertDialogPrimitive.Cancel
>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Alert dialog root — Radix `Root` unchanged.
 * Props: `open`, `defaultOpen`, `onOpenChange`, …
 */
export function Root(props: AlertDialogProps) {
  return <AlertDialogPrimitive.Root {...props} />;
}

Root.displayName = AlertDialogPrimitive.Root.displayName ?? "AlertDialog.Root";

/**
 * Trigger that opens the alert. Prefer `asChild` with {@link Button}.
 */
export function Trigger({
  className,
  ref,
  ...props
}: AlertDialogTriggerProps & { ref?: Ref<AlertDialogTriggerElement> }) {
  return (
    <AlertDialogPrimitive.Trigger {...props} ref={ref} className={className} />
  );
}

Trigger.displayName =
  AlertDialogPrimitive.Trigger.displayName ?? "AlertDialog.Trigger";

/**
 * Portal — renders overlay + content into `document.body` (or `container`).
 */
export function Portal(props: AlertDialogPortalProps) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

Portal.displayName =
  AlertDialogPrimitive.Portal.displayName ?? "AlertDialog.Portal";

/**
 * Dimmed scrim (`overlay` recipe + `z-overlay`).
 */
export function Overlay({
  className,
  ref,
  ...props
}: AlertDialogOverlayProps & { ref?: Ref<AlertDialogOverlayElement> }) {
  return (
    <AlertDialogPrimitive.Overlay
      {...props}
      ref={ref}
      className={cn(alertDialogOverlayVariants(), className)}
    />
  );
}

Overlay.displayName =
  AlertDialogPrimitive.Overlay.displayName ?? "AlertDialog.Overlay";

/**
 * Alert content panel — compact centered surface at `z-modal`.
 *
 * `size` is DS styling only (not a Radix prop). Default `md`. Pass extras via
 * `className` — never re-apply `alertDialogContentVariants()` there.
 */
export function Content({
  className,
  size,
  ref,
  ...props
}: AlertDialogContentProps & {
  ref?: Ref<AlertDialogContentElement>;
  /**
   * Panel size (styling only).
   * @default "md"
   */
  size?: AlertDialogContentSize;
}) {
  return (
    <AlertDialogPrimitive.Content
      {...props}
      ref={ref}
      className={cn(alertDialogContentVariants({ size }), className)}
    />
  );
}

Content.displayName =
  AlertDialogPrimitive.Content.displayName ?? "AlertDialog.Content";

/**
 * Accessible title announced when the alert opens.
 */
export function Title({
  className,
  ref,
  ...props
}: AlertDialogTitleProps & { ref?: Ref<AlertDialogTitleElement> }) {
  return (
    <AlertDialogPrimitive.Title
      {...props}
      ref={ref}
      className={cn(alertDialogTitleVariants(), className)}
    />
  );
}

Title.displayName =
  AlertDialogPrimitive.Title.displayName ?? "AlertDialog.Title";

/**
 * Accessible description for the alert.
 */
export function Description({
  className,
  ref,
  ...props
}: AlertDialogDescriptionProps & {
  ref?: Ref<AlertDialogDescriptionElement>;
}) {
  return (
    <AlertDialogPrimitive.Description
      {...props}
      ref={ref}
      className={cn(alertDialogDescriptionVariants(), className)}
    />
  );
}

Description.displayName =
  AlertDialogPrimitive.Description.displayName ?? "AlertDialog.Description";

/**
 * Confirming action (closes the alert). Prefer `asChild` with {@link Button}.
 */
export function Action({
  className,
  ref,
  ...props
}: AlertDialogActionProps & { ref?: Ref<AlertDialogActionElement> }) {
  return (
    <AlertDialogPrimitive.Action {...props} ref={ref} className={className} />
  );
}

Action.displayName =
  AlertDialogPrimitive.Action.displayName ?? "AlertDialog.Action";

/**
 * Dismiss / cancel (closes the alert). Prefer `asChild` with {@link Button}.
 */
export function Cancel({
  className,
  ref,
  ...props
}: AlertDialogCancelProps & { ref?: Ref<AlertDialogCancelElement> }) {
  return (
    <AlertDialogPrimitive.Cancel {...props} ref={ref} className={className} />
  );
}

Cancel.displayName =
  AlertDialogPrimitive.Cancel.displayName ?? "AlertDialog.Cancel";
