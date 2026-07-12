import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import { zIndexClass } from "../../tokens/z-index";
import { cn } from "../../utils/cn";
import { surfaceClass } from "../../utils/surface";

/**
 * DropdownMenu — styled re-export of `@radix-ui/react-dropdown-menu`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Trigger`,
 * `Portal`, `Content`, `Item`, `CheckboxItem`, `RadioItem`, `Label`, `Group`,
 * `Separator`, `Sub`, `SubTrigger`, `SubContent`, `ItemIndicator`, `Arrow`,
 * `createDropdownMenuScope`, …). Consumers use Radix docs for behavior; import
 * from `@design-system/ui/DropdownMenu`. DS only merges default styles.
 *
 * Floating chrome uses shared recipes:
 * - Content / SubContent → {@link surfaceClass.menu} + `z-dropdown`
 * - Items → semantic highlight / disabled (no raw palette steps)
 *
 * Prefer `Trigger asChild` + {@link Button} / {@link IconButton}.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/dropdown-menu
 */

// ── Content / SubContent ─────────────────────────────────────────────────────

/**
 * Panel chrome shared by Content and SubContent.
 * Uses the compact menu surface recipe (elevation + list padding).
 */
export const dropdownMenuContentVariants = cva([
  surfaceClass.menu,
  "min-w-40",
  // Radix positions with transform; keep z for portaled stacking
  zIndexClass("dropdown"),
  "outline-none",
  // Constrain long menus to available viewport height from Radix
  "max-h-[var(--radix-dropdown-menu-content-available-height)]",
  "overflow-y-auto",
]);

export type DropdownMenuContentVariantProps = VariantProps<
  typeof dropdownMenuContentVariants
>;

// ── Item (shared base for Item / CheckboxItem / RadioItem / SubTrigger) ─────

/**
 * Menu row styles. Prefer applying via the part components; export for
 * composition (e.g. danger tone on `Item` via `tone` prop).
 */
export const dropdownMenuItemVariants = cva(
  [
    "relative flex cursor-pointer items-center gap-2",
    "rounded-sm px-2 py-1.5",
    "text-label-md text-fg-default font-sans select-none outline-none",
    // When `asChild` + `<a>` / router Link — beat global product anchor chrome
    "no-underline hover:no-underline",
    // Icons inside rows
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
    // Highlighted (keyboard / pointer) — Radix uses data-highlighted
    "data-[highlighted]:bg-bg-surface-hover data-[highlighted]:text-fg-default",
    // Match Button/Checkbox: keep pointer events so not-allowed is visible
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-65",
  ],
  {
    variants: {
      /**
       * Visual intent for the row (styling only — not a Radix prop).
       * Destructive actions use `danger` (e.g. Delete).
       */
      tone: {
        default: "",
        danger: [
          "text-danger-text",
          "data-[highlighted]:bg-danger-subtle data-[highlighted]:text-danger-text",
        ],
      },
      /**
       * When true, reserves a leading slot for ItemIndicator (checkbox / radio).
       */
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      inset: false,
    },
  },
);

export type DropdownMenuItemVariantProps = VariantProps<
  typeof dropdownMenuItemVariants
>;

export type DropdownMenuItemTone = NonNullable<
  DropdownMenuItemVariantProps["tone"]
>;

// ── Label ────────────────────────────────────────────────────────────────────

export const dropdownMenuLabelVariants = cva(
  "text-label-sm text-fg-muted font-sans px-2 py-1.5 select-none",
);

// ── Separator ────────────────────────────────────────────────────────────────

export const dropdownMenuSeparatorVariants = cva(
  "bg-border-default -mx-1 my-1 h-px",
);

// ── ItemIndicator ────────────────────────────────────────────────────────────

export const dropdownMenuItemIndicatorVariants = cva(
  "absolute left-2 flex size-3.5 items-center justify-center [&_svg]:size-3.5",
);

// ── Arrow ────────────────────────────────────────────────────────────────────

export const dropdownMenuArrowVariants = cva("fill-bg-surface");

// ── Types ────────────────────────────────────────────────────────────────────

export type DropdownMenuProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;
export type DropdownMenuPortalProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Portal
>;
export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;
export type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>;
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
>;
export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;
export type DropdownMenuItemIndicatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.ItemIndicator
>;
export type DropdownMenuArrowProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Arrow
>;
export type DropdownMenuSubProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Sub
>;
export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
>;
export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;

export type DropdownMenuTriggerElement = ComponentRef<
  typeof DropdownMenuPrimitive.Trigger
>;
export type DropdownMenuContentElement = ComponentRef<
  typeof DropdownMenuPrimitive.Content
>;
export type DropdownMenuItemElement = ComponentRef<
  typeof DropdownMenuPrimitive.Item
>;
export type DropdownMenuCheckboxItemElement = ComponentRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;
export type DropdownMenuRadioItemElement = ComponentRef<
  typeof DropdownMenuPrimitive.RadioItem
>;
export type DropdownMenuLabelElement = ComponentRef<
  typeof DropdownMenuPrimitive.Label
>;
export type DropdownMenuSeparatorElement = ComponentRef<
  typeof DropdownMenuPrimitive.Separator
>;
export type DropdownMenuGroupElement = ComponentRef<
  typeof DropdownMenuPrimitive.Group
>;
export type DropdownMenuItemIndicatorElement = ComponentRef<
  typeof DropdownMenuPrimitive.ItemIndicator
>;
export type DropdownMenuArrowElement = ComponentRef<
  typeof DropdownMenuPrimitive.Arrow
>;
export type DropdownMenuSubTriggerElement = ComponentRef<
  typeof DropdownMenuPrimitive.SubTrigger
>;
export type DropdownMenuSubContentElement = ComponentRef<
  typeof DropdownMenuPrimitive.SubContent
>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Dropdown root — Radix `Root` unchanged (open state, modal mode).
 * All Radix props (`open`, `defaultOpen`, `onOpenChange`, `modal`, `dir`, …) pass through.
 */
export function Root(props: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

Root.displayName =
  DropdownMenuPrimitive.Root.displayName ?? "DropdownMenu.Root";

/**
 * Menu trigger — toggles the menu. Prefer `asChild` with {@link Button} / {@link IconButton}.
 */
export function Trigger({
  className,
  ref,
  ...props
}: DropdownMenuTriggerProps & { ref?: Ref<DropdownMenuTriggerElement> }) {
  return (
    <DropdownMenuPrimitive.Trigger {...props} ref={ref} className={className} />
  );
}

Trigger.displayName =
  DropdownMenuPrimitive.Trigger.displayName ?? "DropdownMenu.Trigger";

/**
 * Portal — renders content into `document.body` (or `container`).
 */
export function Portal(props: DropdownMenuPortalProps) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

Portal.displayName =
  DropdownMenuPrimitive.Portal.displayName ?? "DropdownMenu.Portal";

/**
 * Menu panel — surface menu recipe at `z-dropdown`.
 * Positioning (`side`, `align`, offsets) is pure Radix — pass through.
 */
export function Content({
  className,
  ref,
  ...props
}: DropdownMenuContentProps & { ref?: Ref<DropdownMenuContentElement> }) {
  return (
    <DropdownMenuPrimitive.Content
      {...props}
      ref={ref}
      className={cn(dropdownMenuContentVariants(), className)}
    />
  );
}

Content.displayName =
  DropdownMenuPrimitive.Content.displayName ?? "DropdownMenu.Content";

/**
 * Standard action row. Optional `tone="danger"` for destructive actions
 * (styling only — not a Radix prop).
 */
export function Item({
  className,
  tone,
  ref,
  ...props
}: DropdownMenuItemProps & {
  ref?: Ref<DropdownMenuItemElement>;
  /**
   * Row intent (styling only).
   * @default "default"
   */
  tone?: DropdownMenuItemTone;
}) {
  return (
    <DropdownMenuPrimitive.Item
      {...props}
      ref={ref}
      className={cn(dropdownMenuItemVariants({ tone }), className)}
    />
  );
}

Item.displayName =
  DropdownMenuPrimitive.Item.displayName ?? "DropdownMenu.Item";

/**
 * Checkbox-style item (multi-select toggles in a menu).
 * Compose with {@link ItemIndicator} for the leading mark.
 */
export function CheckboxItem({
  className,
  ref,
  ...props
}: DropdownMenuCheckboxItemProps & {
  ref?: Ref<DropdownMenuCheckboxItemElement>;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      {...props}
      ref={ref}
      className={cn(dropdownMenuItemVariants({ inset: true }), className)}
    />
  );
}

CheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName ?? "DropdownMenu.CheckboxItem";

/**
 * Radio group root for mutually exclusive menu options.
 */
export function RadioGroup(props: DropdownMenuRadioGroupProps) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

RadioGroup.displayName =
  DropdownMenuPrimitive.RadioGroup.displayName ?? "DropdownMenu.RadioGroup";

/**
 * Radio-style item. Compose with {@link ItemIndicator} for the leading mark.
 */
export function RadioItem({
  className,
  ref,
  ...props
}: DropdownMenuRadioItemProps & {
  ref?: Ref<DropdownMenuRadioItemElement>;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      {...props}
      ref={ref}
      className={cn(dropdownMenuItemVariants({ inset: true }), className)}
    />
  );
}

RadioItem.displayName =
  DropdownMenuPrimitive.RadioItem.displayName ?? "DropdownMenu.RadioItem";

/**
 * Non-interactive section label (not keyboard-focusable).
 */
export function Label({
  className,
  ref,
  ...props
}: DropdownMenuLabelProps & { ref?: Ref<DropdownMenuLabelElement> }) {
  return (
    <DropdownMenuPrimitive.Label
      {...props}
      ref={ref}
      className={cn(dropdownMenuLabelVariants(), className)}
    />
  );
}

Label.displayName =
  DropdownMenuPrimitive.Label.displayName ?? "DropdownMenu.Label";

/**
 * Visual divider between groups of items.
 */
export function Separator({
  className,
  ref,
  ...props
}: DropdownMenuSeparatorProps & {
  ref?: Ref<DropdownMenuSeparatorElement>;
}) {
  return (
    <DropdownMenuPrimitive.Separator
      {...props}
      ref={ref}
      className={cn(dropdownMenuSeparatorVariants(), className)}
    />
  );
}

Separator.displayName =
  DropdownMenuPrimitive.Separator.displayName ?? "DropdownMenu.Separator";

/**
 * Groups related items (no visual chrome by default).
 */
export function Group({
  className,
  ref,
  ...props
}: DropdownMenuGroupProps & { ref?: Ref<DropdownMenuGroupElement> }) {
  return (
    <DropdownMenuPrimitive.Group {...props} ref={ref} className={className} />
  );
}

Group.displayName =
  DropdownMenuPrimitive.Group.displayName ?? "DropdownMenu.Group";

/**
 * Leading mark for checkbox / radio items (CheckIcon / DotFilledIcon).
 */
export function ItemIndicator({
  className,
  ref,
  ...props
}: DropdownMenuItemIndicatorProps & {
  ref?: Ref<DropdownMenuItemIndicatorElement>;
}) {
  return (
    <DropdownMenuPrimitive.ItemIndicator
      {...props}
      ref={ref}
      className={cn(dropdownMenuItemIndicatorVariants(), className)}
    />
  );
}

ItemIndicator.displayName =
  DropdownMenuPrimitive.ItemIndicator.displayName ??
  "DropdownMenu.ItemIndicator";

/**
 * Optional arrow pointing at the trigger. Must be a child of Content.
 */
export function Arrow({
  className,
  ref,
  ...props
}: DropdownMenuArrowProps & { ref?: Ref<DropdownMenuArrowElement> }) {
  return (
    <DropdownMenuPrimitive.Arrow
      {...props}
      ref={ref}
      className={cn(dropdownMenuArrowVariants(), className)}
    />
  );
}

Arrow.displayName =
  DropdownMenuPrimitive.Arrow.displayName ?? "DropdownMenu.Arrow";

/**
 * Submenu root — open state for a nested menu.
 */
export function Sub(props: DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

Sub.displayName = DropdownMenuPrimitive.Sub.displayName ?? "DropdownMenu.Sub";

/**
 * Row that opens a submenu. Prefer a trailing chevron as children.
 */
export function SubTrigger({
  className,
  ref,
  ...props
}: DropdownMenuSubTriggerProps & {
  ref?: Ref<DropdownMenuSubTriggerElement>;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      {...props}
      ref={ref}
      className={cn(
        dropdownMenuItemVariants(),
        "data-[state=open]:bg-bg-surface-hover",
        className,
      )}
    />
  );
}

SubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName ?? "DropdownMenu.SubTrigger";

/**
 * Nested menu panel — same chrome as Content.
 */
export function SubContent({
  className,
  ref,
  ...props
}: DropdownMenuSubContentProps & {
  ref?: Ref<DropdownMenuSubContentElement>;
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      {...props}
      ref={ref}
      className={cn(dropdownMenuContentVariants(), className)}
    />
  );
}

SubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName ?? "DropdownMenu.SubContent";
