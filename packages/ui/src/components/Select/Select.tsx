import * as SelectPrimitive from "@radix-ui/react-select";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

import {
  ControlSize,
  controlGlyphSvgClass,
  controlHeightClass,
} from "../../tokens/control";
import { zIndexClass } from "../../tokens/z-index";
import { cn } from "../../utils/cn";
import { FocusRingIntent, focusRingClass } from "../../utils/focus-ring";
import { surfaceClass } from "../../utils/surface";

/**
 * Select — styled re-export of `@radix-ui/react-select`.
 *
 * **API contract (ADR-002):** same public surface as Radix (`Root`, `Trigger`,
 * `Value`, `Icon`, `Portal`, `Content`, `Viewport`, `Item`, `ItemText`,
 * `ItemIndicator`, `Group`, `Label`, `Separator`, `ScrollUpButton`,
 * `ScrollDownButton`, `Arrow`, `createSelectScope`, …). Consumers use Radix
 * docs for behavior; import from `@design-system/ui/Select`. DS only merges
 * default styles (+ optional `size` / `color` / `fullWidth` on Trigger).
 *
 * Floating chrome uses shared recipes:
 * - Content → {@link surfaceClass.popover} + `z-dropdown` (list padding on Viewport)
 * - Trigger → Input-aligned field chrome + {@link focusRingClass}.self intents
 *
 * @see https://www.radix-ui.com/primitives/docs/components/select
 */

// ── Trigger ──────────────────────────────────────────────────────────────────

/**
 * Trigger field chrome (styling only — not Radix props).
 * Aligns with {@link Input} height, border, and validation ring intents.
 */
export const selectTriggerVariants = cva(
  [
    "inline-flex min-w-0 items-center justify-between gap-2",
    "rounded-md border bg-bg-surface font-sans",
    "text-fg-default outline-none",
    "transition-[color,background-color,border-color,box-shadow]",
    "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-65 disabled:bg-bg-surface-hover",
    // Placeholder text when Value has no selection
    "data-[placeholder]:text-fg-muted",
  ],
  {
    variants: {
      /**
       * Validation / intent border + focus ring (same mapping as Input).
       */
      color: {
        default: [
          "border-border-default",
          "enabled:hover:border-border-hover",
          "focus-visible:border-accent-border",
          focusRingClass.self[FocusRingIntent.default],
        ],
        success: [
          "border-success-border",
          "enabled:hover:border-success-solid",
          "focus-visible:border-success-solid",
          focusRingClass.self[FocusRingIntent.success],
        ],
        danger: [
          "border-danger-border",
          "enabled:hover:border-danger-solid",
          "focus-visible:border-danger-solid",
          focusRingClass.self[FocusRingIntent.danger],
        ],
        warning: [
          "border-warning-border",
          "enabled:hover:border-warning-solid",
          "focus-visible:border-warning-solid",
          focusRingClass.self[FocusRingIntent.warning],
        ],
      },
      size: {
        [ControlSize.sm]: cn(
          controlHeightClass.sm,
          "px-2.5 text-body-sm",
          controlGlyphSvgClass.sm,
        ),
        [ControlSize.md]: cn(
          controlHeightClass.md,
          "px-3 text-body-md",
          controlGlyphSvgClass.md,
        ),
        [ControlSize.lg]: cn(
          controlHeightClass.lg,
          "px-3.5 text-body-md",
          controlGlyphSvgClass.lg,
        ),
      },
      fullWidth: {
        true: "flex w-full",
        false: "inline-flex w-auto",
      },
    },
    defaultVariants: {
      color: "default",
      size: ControlSize.md,
      fullWidth: true,
    },
  },
);

export type SelectTriggerVariantProps = VariantProps<
  typeof selectTriggerVariants
>;

export type SelectTriggerColor = NonNullable<
  SelectTriggerVariantProps["color"]
>;
export type SelectTriggerSize = NonNullable<SelectTriggerVariantProps["size"]>;

// ── Icon ─────────────────────────────────────────────────────────────────────

export const selectIconVariants = cva(
  "text-fg-muted shrink-0 opacity-80 [&_svg]:size-[1em]",
);

// ── Content ──────────────────────────────────────────────────────────────────

/**
 * Listbox panel. Prefer `position="popper"` in product so the panel aligns to
 * the trigger; Radix default remains `item-aligned`.
 */
export const selectContentVariants = cva([
  // Popover elevation; list padding lives on Viewport so scroll buttons sit outside
  surfaceClass.popover,
  zIndexClass("dropdown"),
  "outline-none",
  "overflow-hidden",
  // Match trigger width when position=popper (Radix CSS vars)
  "min-w-[var(--radix-select-trigger-width)]",
  "max-h-[var(--radix-select-content-available-height)]",
]);

export type SelectContentVariantProps = VariantProps<
  typeof selectContentVariants
>;

// ── Viewport ─────────────────────────────────────────────────────────────────

export const selectViewportVariants = cva("p-1");

// ── Item ─────────────────────────────────────────────────────────────────────

export const selectItemVariants = cva([
  "relative flex w-full cursor-pointer items-center gap-2",
  "rounded-sm py-1.5 pr-2 pl-8",
  "text-label-md text-fg-default font-sans select-none outline-none",
  // Keyboard / pointer highlight (Radix `data-highlighted`)
  "data-[highlighted]:bg-bg-surface-hover data-[highlighted]:text-fg-default",
  // Selected value (Radix `data-state=checked`) — soft brand row + check mark color
  "data-[state=checked]:bg-accent-subtle data-[state=checked]:text-accent-text",
  // Selected + highlighted: stay on brand soft, slightly stronger fill
  "data-[highlighted]:data-[state=checked]:bg-accent-subtle-hover data-[highlighted]:data-[state=checked]:text-accent-text",
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-65",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
]);

export type SelectItemVariantProps = VariantProps<typeof selectItemVariants>;

// ── ItemIndicator ────────────────────────────────────────────────────────────

export const selectItemIndicatorVariants = cva(
  "absolute left-2 flex size-3.5 items-center justify-center [&_svg]:size-3.5",
);

// ── Label ────────────────────────────────────────────────────────────────────

export const selectLabelVariants = cva(
  "text-label-sm text-fg-muted font-sans px-2 py-1.5 select-none",
);

// ── Separator ────────────────────────────────────────────────────────────────

export const selectSeparatorVariants = cva("bg-border-default -mx-1 my-1 h-px");

// ── Scroll buttons ───────────────────────────────────────────────────────────

export const selectScrollButtonVariants = cva(
  "flex cursor-default items-center justify-center py-1 text-fg-muted [&_svg]:size-3.5",
);

// ── Arrow ────────────────────────────────────────────────────────────────────

export const selectArrowVariants = cva("fill-bg-surface");

// ── Types ────────────────────────────────────────────────────────────────────

export type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
export type SelectTriggerProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
>;
export type SelectValueProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Value
>;
export type SelectIconProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Icon
>;
export type SelectPortalProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Portal
>;
export type SelectContentProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
>;
export type SelectViewportProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Viewport
>;
export type SelectItemProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
>;
export type SelectItemTextProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ItemText
>;
export type SelectItemIndicatorProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ItemIndicator
>;
export type SelectGroupProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Group
>;
export type SelectLabelProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Label
>;
export type SelectSeparatorProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
>;
export type SelectScrollUpButtonProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollUpButton
>;
export type SelectScrollDownButtonProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollDownButton
>;
export type SelectArrowProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Arrow
>;

export type SelectTriggerElement = ComponentRef<typeof SelectPrimitive.Trigger>;
export type SelectValueElement = ComponentRef<typeof SelectPrimitive.Value>;
export type SelectIconElement = ComponentRef<typeof SelectPrimitive.Icon>;
export type SelectContentElement = ComponentRef<typeof SelectPrimitive.Content>;
export type SelectViewportElement = ComponentRef<
  typeof SelectPrimitive.Viewport
>;
export type SelectItemElement = ComponentRef<typeof SelectPrimitive.Item>;
export type SelectItemTextElement = ComponentRef<
  typeof SelectPrimitive.ItemText
>;
export type SelectItemIndicatorElement = ComponentRef<
  typeof SelectPrimitive.ItemIndicator
>;
export type SelectGroupElement = ComponentRef<typeof SelectPrimitive.Group>;
export type SelectLabelElement = ComponentRef<typeof SelectPrimitive.Label>;
export type SelectSeparatorElement = ComponentRef<
  typeof SelectPrimitive.Separator
>;
export type SelectScrollUpButtonElement = ComponentRef<
  typeof SelectPrimitive.ScrollUpButton
>;
export type SelectScrollDownButtonElement = ComponentRef<
  typeof SelectPrimitive.ScrollDownButton
>;
export type SelectArrowElement = ComponentRef<typeof SelectPrimitive.Arrow>;

// ── Parts ────────────────────────────────────────────────────────────────────

/**
 * Select root — Radix `Root` unchanged (value, open, form attrs).
 */
export function Root(props: SelectProps) {
  return <SelectPrimitive.Root {...props} />;
}

Root.displayName = SelectPrimitive.Root.displayName ?? "Select.Root";

/**
 * Opens the listbox. Optional DS `size` / `color` / `fullWidth` (styling only).
 * Compose `Value` + `Icon` as children.
 */
export function Trigger({
  className,
  color,
  size,
  fullWidth,
  ref,
  ...props
}: SelectTriggerProps & {
  ref?: Ref<SelectTriggerElement>;
  /**
   * Validation / intent chrome (styling only).
   * @default "default"
   */
  color?: SelectTriggerColor;
  /**
   * Control height (styling only). Shared {@link ControlSize}.
   * @default "md"
   */
  size?: SelectTriggerSize;
  /**
   * Stretch to parent width (styling only).
   * @default true
   */
  fullWidth?: boolean;
}) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      ref={ref}
      className={cn(
        selectTriggerVariants({ color, size, fullWidth }),
        className,
      )}
    />
  );
}

Trigger.displayName = SelectPrimitive.Trigger.displayName ?? "Select.Trigger";

/**
 * Displays the selected item text, or `placeholder` when empty.
 */
export function Value({
  className,
  ref,
  ...props
}: SelectValueProps & { ref?: Ref<SelectValueElement> }) {
  return (
    <SelectPrimitive.Value
      {...props}
      ref={ref}
      className={cn("line-clamp-1 text-left", className)}
    />
  );
}

Value.displayName = SelectPrimitive.Value.displayName ?? "Select.Value";

/**
 * Trailing glyph slot (typically ChevronDownIcon from `@radix-ui/react-icons`).
 */
export function Icon({
  className,
  ref,
  ...props
}: SelectIconProps & { ref?: Ref<SelectIconElement> }) {
  return (
    <SelectPrimitive.Icon
      {...props}
      ref={ref}
      className={cn(selectIconVariants(), className)}
    />
  );
}

Icon.displayName = SelectPrimitive.Icon.displayName ?? "Select.Icon";

/**
 * Portal — renders content into `document.body` (or `container`).
 */
export function Portal(props: SelectPortalProps) {
  return <SelectPrimitive.Portal {...props} />;
}

Portal.displayName = SelectPrimitive.Portal.displayName ?? "Select.Portal";

/**
 * Listbox panel at `z-dropdown`. Prefer `position="popper"` + `sideOffset={4}`
 * in product compositions.
 */
export function Content({
  className,
  position,
  ref,
  ...props
}: SelectContentProps & { ref?: Ref<SelectContentElement> }) {
  return (
    <SelectPrimitive.Content
      {...props}
      ref={ref}
      position={position}
      className={cn(
        selectContentVariants(),
        // Subtle offset when consumers use popper (product default in stories)
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
    />
  );
}

Content.displayName = SelectPrimitive.Content.displayName ?? "Select.Content";

/**
 * Scrollable option list region inside Content.
 */
export function Viewport({
  className,
  ref,
  ...props
}: SelectViewportProps & { ref?: Ref<SelectViewportElement> }) {
  return (
    <SelectPrimitive.Viewport
      {...props}
      ref={ref}
      className={cn(selectViewportVariants(), className)}
    />
  );
}

Viewport.displayName =
  SelectPrimitive.Viewport.displayName ?? "Select.Viewport";

/**
 * Option row. Requires `value`. Compose with ItemText + ItemIndicator.
 */
export function Item({
  className,
  ref,
  ...props
}: SelectItemProps & { ref?: Ref<SelectItemElement> }) {
  return (
    <SelectPrimitive.Item
      {...props}
      ref={ref}
      className={cn(selectItemVariants(), className)}
    />
  );
}

Item.displayName = SelectPrimitive.Item.displayName ?? "Select.Item";

/**
 * Visible label of an Item (also used for typeahead).
 */
export function ItemText({
  className,
  ref,
  ...props
}: SelectItemTextProps & { ref?: Ref<SelectItemTextElement> }) {
  return (
    <SelectPrimitive.ItemText {...props} ref={ref} className={className} />
  );
}

ItemText.displayName =
  SelectPrimitive.ItemText.displayName ?? "Select.ItemText";

/**
 * Leading mark for the selected item (e.g. CheckIcon).
 */
export function ItemIndicator({
  className,
  ref,
  ...props
}: SelectItemIndicatorProps & {
  ref?: Ref<SelectItemIndicatorElement>;
}) {
  return (
    <SelectPrimitive.ItemIndicator
      {...props}
      ref={ref}
      className={cn(selectItemIndicatorVariants(), className)}
    />
  );
}

ItemIndicator.displayName =
  SelectPrimitive.ItemIndicator.displayName ?? "Select.ItemIndicator";

/**
 * Groups related items (pair with Label).
 */
export function Group({
  className,
  ref,
  ...props
}: SelectGroupProps & { ref?: Ref<SelectGroupElement> }) {
  return <SelectPrimitive.Group {...props} ref={ref} className={className} />;
}

Group.displayName = SelectPrimitive.Group.displayName ?? "Select.Group";

/**
 * Non-interactive group heading.
 */
export function Label({
  className,
  ref,
  ...props
}: SelectLabelProps & { ref?: Ref<SelectLabelElement> }) {
  return (
    <SelectPrimitive.Label
      {...props}
      ref={ref}
      className={cn(selectLabelVariants(), className)}
    />
  );
}

Label.displayName = SelectPrimitive.Label.displayName ?? "Select.Label";

/**
 * Visual divider between groups.
 */
export function Separator({
  className,
  ref,
  ...props
}: SelectSeparatorProps & { ref?: Ref<SelectSeparatorElement> }) {
  return (
    <SelectPrimitive.Separator
      {...props}
      ref={ref}
      className={cn(selectSeparatorVariants(), className)}
    />
  );
}

Separator.displayName =
  SelectPrimitive.Separator.displayName ?? "Select.Separator";

/**
 * Appears when the list can scroll up. Pass a chevron icon as children.
 */
export function ScrollUpButton({
  className,
  ref,
  ...props
}: SelectScrollUpButtonProps & {
  ref?: Ref<SelectScrollUpButtonElement>;
}) {
  return (
    <SelectPrimitive.ScrollUpButton
      {...props}
      ref={ref}
      className={cn(selectScrollButtonVariants(), className)}
    />
  );
}

ScrollUpButton.displayName =
  SelectPrimitive.ScrollUpButton.displayName ?? "Select.ScrollUpButton";

/**
 * Appears when the list can scroll down. Pass a chevron icon as children.
 */
export function ScrollDownButton({
  className,
  ref,
  ...props
}: SelectScrollDownButtonProps & {
  ref?: Ref<SelectScrollDownButtonElement>;
}) {
  return (
    <SelectPrimitive.ScrollDownButton
      {...props}
      ref={ref}
      className={cn(selectScrollButtonVariants(), className)}
    />
  );
}

ScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName ?? "Select.ScrollDownButton";

/**
 * Optional arrow. Must be a child of Content.
 */
export function Arrow({
  className,
  ref,
  ...props
}: SelectArrowProps & { ref?: Ref<SelectArrowElement> }) {
  return (
    <SelectPrimitive.Arrow
      {...props}
      ref={ref}
      className={cn(selectArrowVariants(), className)}
    />
  );
}

Arrow.displayName = SelectPrimitive.Arrow.displayName ?? "Select.Arrow";
