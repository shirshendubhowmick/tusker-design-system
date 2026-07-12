import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { zIndexClass } from "../../tokens/z-index";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/focus-ring";
import { overlay } from "../../utils/overlay";
import { surface } from "../../utils/surface";

/**
 * Dialog — styled re-export of `@radix-ui/react-dialog`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Trigger`,
 * `Portal`, `Overlay`, `Content`, `Title`, `Description`, `Close`,
 * `createDialogScope`, …). Consumers use Radix docs for behavior; import from
 * `@design-system/ui/Dialog`. DS only merges default styles via `className`.
 *
 * Floating chrome uses shared recipes:
 * - Overlay → {@link overlay} scrim (`z-overlay`)
 * - Content → {@link surface} dialog elevation + `z-modal` + centered fixed panel
 *
 * @see https://www.radix-ui.com/primitives/docs/components/dialog
 */

// ── Overlay ──────────────────────────────────────────────────────────────────

export const dialogOverlayVariants = cva(overlay());

export type DialogOverlayVariantProps = VariantProps<
  typeof dialogOverlayVariants
>;

// ── Content ──────────────────────────────────────────────────────────────────

/**
 * Centered floating panel (all breakpoints).
 * Used by `sm` always; by `md`+ from the `tablet` tier up (≥768px).
 */
const dialogCenteredPanelClass = [
  "top-1/2 left-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "w-[calc(100%-2rem)] max-h-[min(85vh,100%)]",
  "rounded-md",
].join(" ");

/**
 * Full-viewport sheet on the mobile tier only (base styles, &lt;768px).
 * Geometry only — surface radius is off in the base recipe so mobile can be
 * square-edged; tablet+ re-applies `rounded-md` via
 * {@link dialogTabletCenteredPanelClass}.
 */
const dialogMobileFullscreenClass = [
  "inset-0 h-dvh w-full",
  "max-h-none max-w-none",
  "translate-x-0 translate-y-0",
  "rounded-none",
].join(" ");

/**
 * From `tablet:` up — leave full-screen and become a centered modal panel.
 * Pair with a size-specific `tablet:max-w-*`.
 */
const dialogTabletCenteredPanelClass = [
  "tablet:inset-auto tablet:top-1/2 tablet:left-1/2",
  "tablet:h-auto tablet:max-h-[min(85vh,100%)] tablet:w-[calc(100%-2rem)]",
  "tablet:-translate-x-1/2 tablet:-translate-y-1/2",
  "tablet:rounded-md",
].join(" ");

/**
 * Content panel sizing (styling only). Prefer the {@link Content} `size` prop —
 * do **not** pass `dialogContentVariants({ size })` as `className` on top of
 * Content (that double-applies the default `md` recipe and breaks layout).
 *
 * **Mobile vs tablet:** `sm` is always a centered panel. `md` / `lg` / `xl`
 * are full-screen on the mobile tier (&lt;768px) and centered panels from
 * `tablet:` up. Tablet is not treated as mobile.
 */
export const dialogContentVariants = cva(
  [
    // Radius comes from size variants (mobile full-screen needs square edges).
    surface({ elevation: "lg", rounded: false }),
    "fixed",
    zIndexClass("modal"),
    "overflow-y-auto",
    "p-0",
    // Ring when Content receives programmatic / keyboard focus
    focusRing(),
  ],
  {
    variants: {
      /**
       * Product dialog widths — intentionally larger than alert/confirm panels.
       * Alert Dialog will own the compact scale separately.
       *
       * | size | tablet+ max-width | ~px @ 16 | mobile (&lt;768px)   |
       * | ---- | ----------------- | -------- | ------------------ |
       * | sm   | max-w-xl          | 576      | centered panel     |
       * | md   | max-w-2xl         | 672      | full-screen sheet  |
       * | lg   | max-w-4xl         | 896      | full-screen sheet  |
       * | xl   | max-w-6xl         | 1152     | full-screen sheet  |
       */
      size: {
        /** Short forms — always a centered panel (including mobile). */
        sm: cn(dialogCenteredPanelClass, "max-w-xl"),
        /** Default product dialog — full-screen on mobile only. */
        md: cn(
          dialogMobileFullscreenClass,
          dialogTabletCenteredPanelClass,
          "tablet:max-w-2xl",
        ),
        /** Multi-column / richer content — full-screen on mobile only. */
        lg: cn(
          dialogMobileFullscreenClass,
          dialogTabletCenteredPanelClass,
          "tablet:max-w-4xl",
        ),
        /** Large panels — full-screen on mobile only. */
        xl: cn(
          dialogMobileFullscreenClass,
          dialogTabletCenteredPanelClass,
          "tablet:max-w-6xl",
        ),
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type DialogContentVariantProps = VariantProps<
  typeof dialogContentVariants
>;

/** Panel size token for {@link Content} / {@link dialogContentVariants}. */
export type DialogContentSize = NonNullable<DialogContentVariantProps["size"]>;

// ── Title / Description ──────────────────────────────────────────────────────

export const dialogTitleVariants = cva(
  "text-heading-sm text-fg-default font-sans",
);

export const dialogDescriptionVariants = cva(
  "text-body-sm text-fg-muted font-sans",
);

// ── Types ────────────────────────────────────────────────────────────────────

export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Trigger
>;
export type DialogPortalProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Portal
>;
export type DialogOverlayProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
>;
export type DialogContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;
export type DialogTitleProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;
export type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;
export type DialogCloseProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Close
>;

export type DialogTriggerElement = ComponentRef<typeof DialogPrimitive.Trigger>;
export type DialogOverlayElement = ComponentRef<typeof DialogPrimitive.Overlay>;
export type DialogContentElement = ComponentRef<typeof DialogPrimitive.Content>;
export type DialogTitleElement = ComponentRef<typeof DialogPrimitive.Title>;
export type DialogDescriptionElement = ComponentRef<
  typeof DialogPrimitive.Description
>;
export type DialogCloseElement = ComponentRef<typeof DialogPrimitive.Close>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Dialog root — Radix `Root` unchanged (open state, modal mode).
 * All Radix props (`open`, `defaultOpen`, `onOpenChange`, `modal`, …) pass through.
 */
export function Root(props: DialogProps) {
  return <DialogPrimitive.Root {...props} />;
}

Root.displayName = DialogPrimitive.Root.displayName ?? "Dialog.Root";

/**
 * Dialog trigger — opens the dialog. Prefer `asChild` with {@link Button}.
 */
export function Trigger({
  className,
  ref,
  ...props
}: DialogTriggerProps & { ref?: Ref<DialogTriggerElement> }) {
  return <DialogPrimitive.Trigger {...props} ref={ref} className={className} />;
}

Trigger.displayName = DialogPrimitive.Trigger.displayName ?? "Dialog.Trigger";

/**
 * Portal — renders overlay + content into `document.body` (or `container`).
 */
export function Portal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />;
}

Portal.displayName = DialogPrimitive.Portal.displayName ?? "Dialog.Portal";

/**
 * Dimmed scrim behind the dialog panel (`overlay` recipe + `z-overlay`).
 */
export function Overlay({
  className,
  ref,
  ...props
}: DialogOverlayProps & { ref?: Ref<DialogOverlayElement> }) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      ref={ref}
      className={cn(dialogOverlayVariants(), className)}
    />
  );
}

Overlay.displayName = DialogPrimitive.Overlay.displayName ?? "Dialog.Overlay";

/**
 * Dialog content panel — surface + layout at `z-modal`.
 *
 * `size` is DS styling only (not a Radix prop). Default `md`. Pass extra
 * utilities via `className` — never re-apply `dialogContentVariants()` there.
 */
export function Content({
  className,
  size,
  ref,
  ...props
}: DialogContentProps & {
  ref?: Ref<DialogContentElement>;
  /**
   * Panel size (styling only).
   * @default "md"
   */
  size?: DialogContentSize;
}) {
  return (
    <DialogPrimitive.Content
      {...props}
      ref={ref}
      className={cn(dialogContentVariants({ size }), className)}
    />
  );
}

Content.displayName = DialogPrimitive.Content.displayName ?? "Dialog.Content";

/**
 * Accessible title announced when the dialog opens (`role`/`aria` from Radix).
 */
export function Title({
  className,
  ref,
  ...props
}: DialogTitleProps & { ref?: Ref<DialogTitleElement> }) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      className={cn(dialogTitleVariants(), className)}
    />
  );
}

Title.displayName = DialogPrimitive.Title.displayName ?? "Dialog.Title";

/**
 * Optional accessible description announced with the title.
 * Omit and set `aria-describedby={undefined}` on Content when unused.
 */
export function Description({
  className,
  ref,
  ...props
}: DialogDescriptionProps & { ref?: Ref<DialogDescriptionElement> }) {
  return (
    <DialogPrimitive.Description
      {...props}
      ref={ref}
      className={cn(dialogDescriptionVariants(), className)}
    />
  );
}

Description.displayName =
  DialogPrimitive.Description.displayName ?? "Dialog.Description";

/**
 * Close control. Prefer `asChild` with {@link Button} / {@link IconButton}.
 */
export function Close({
  className,
  ref,
  ...props
}: DialogCloseProps & { ref?: Ref<DialogCloseElement> }) {
  return <DialogPrimitive.Close {...props} ref={ref} className={className} />;
}

Close.displayName = DialogPrimitive.Close.displayName ?? "Dialog.Close";
