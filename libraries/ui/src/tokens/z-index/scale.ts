/**
 * Semantic z-index scale for layered UI (Dev tool SaaS).
 *
 * Prefer these names over raw numbers so stacking order stays consistent
 * across modals, popovers, sticky chrome, and toasts.
 *
 * Order (low → high):
 *   base < raised < dropdown < sticky < overlay < modal < toast < tooltip
 *
 * Notes:
 * - Use the **lowest** layer that works; don’t jump to `modal` for a menu.
 * - Portaled content (dialogs, toasts) should still use these tokens so they
 *   stack correctly relative to each other.
 * - Avoid `z-max` / arbitrary huge values — extend this scale instead.
 */

export const zIndexTokens = {
  /**
   * Default document flow / unlayered surfaces.
   * Rarely set explicitly — useful for resetting a raised child.
   */
  base: {
    name: 'base',
    value: 0,
    description: 'Default stacking context / reset to document flow',
  },
  /**
   * Slightly elevated cards, active rows, or local focus rings that must sit
   * above siblings but below menus and chrome.
   */
  raised: {
    name: 'raised',
    value: 10,
    description: 'Local elevation (cards, active list rows, inline affordances)',
  },
  /**
   * Menus, selects, combobox lists, date pickers anchored to a control.
   */
  dropdown: {
    name: 'dropdown',
    value: 100,
    description: 'Menus, select panels, combobox popovers',
  },
  /**
   * Sticky table headers, sticky side nav sections, pinned columns.
   * Above page content and most dropdowns that stay in-flow of the main pane.
   */
  sticky: {
    name: 'sticky',
    value: 200,
    description: 'Sticky headers, pinned columns, persistent in-page chrome',
  },
  /**
   * Dimmed scrim behind modals / drawers (not the dialog surface itself).
   */
  overlay: {
    name: 'overlay',
    value: 300,
    description: 'Modal / drawer backdrop scrim',
  },
  /**
   * Modal dialogs, full-screen drawers, command palettes that block the page.
   */
  modal: {
    name: 'modal',
    value: 400,
    description: 'Dialogs, drawers, command palette surfaces',
  },
  /**
   * Transient notifications — above modals so errors remain visible.
   */
  toast: {
    name: 'toast',
    value: 500,
    description: 'Toasts and global notifications',
  },
  /**
   * Tooltips and cursors — highest so they can appear over any surface.
   */
  tooltip: {
    name: 'tooltip',
    value: 600,
    description: 'Tooltips, hover cards, cursor-following hints',
  },
} as const;

export type ZIndexName = keyof typeof zIndexTokens;

/** Low → high stacking order for docs and validation. */
export const zIndexOrder = [
  'base',
  'raised',
  'dropdown',
  'sticky',
  'overlay',
  'modal',
  'toast',
  'tooltip',
] as const satisfies readonly ZIndexName[];

/** Tailwind utility for a semantic layer, e.g. `z-modal`. */
export function zIndexClass(name: ZIndexName): `z-${ZIndexName}` {
  return `z-${name}`;
}

/** CSS variable name, e.g. `--z-index-modal`. */
export function zIndexCssVar(name: ZIndexName): string {
  return `--z-index-${name}`;
}
