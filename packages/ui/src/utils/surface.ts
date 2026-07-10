import { cn } from "./cn";

/**
 * Elevation steps for floating / resting surfaces.
 * Maps to semantic shadow tokens (`shadow-sm` … `shadow-xl`).
 *
 * Typical use:
 * - `sm`  — resting cards on canvas
 * - `md`  — dropdown, select, popover, menu
 * - `lg`  — dialog / modal panel
 * - `xl`  — heavy command palette / takeovers
 */
export const SurfaceElevation = {
  none: "none",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

export type SurfaceElevation =
  (typeof SurfaceElevation)[keyof typeof SurfaceElevation];

export const surfaceElevationShadowClass = {
  [SurfaceElevation.none]: "shadow-none",
  [SurfaceElevation.sm]: "shadow-sm",
  [SurfaceElevation.md]: "shadow-md",
  [SurfaceElevation.lg]: "shadow-lg",
  [SurfaceElevation.xl]: "shadow-xl",
} as const satisfies Record<SurfaceElevation, string>;

/**
 * Outer padding for the surface shell.
 * Prefer section recipes (`surfaceSectionClass`) when header/body/footer split.
 */
export const SurfacePadding = {
  none: "none",
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export type SurfacePadding =
  (typeof SurfacePadding)[keyof typeof SurfacePadding];

export const surfacePaddingClass = {
  [SurfacePadding.none]: "",
  [SurfacePadding.sm]: "p-2",
  [SurfacePadding.md]: "p-4",
  [SurfacePadding.lg]: "p-6",
} as const satisfies Record<SurfacePadding, string>;

/**
 * Optional region padding for composed panels (dialog, card).
 * Full class strings so Tailwind always emits them.
 */
export const surfaceSectionClass = {
  /** Title row with bottom rule */
  header: "border-border-default border-b px-4 py-3",
  /** Main content */
  body: "p-4",
  /** Actions row with top rule */
  footer: "border-border-default border-t px-4 py-3",
  /** Compact list padding (menus, select options) */
  menu: "p-1",
} as const;

export interface SurfaceOptions {
  /**
   * Shadow elevation.
   * @default "md"
   */
  elevation?: SurfaceElevation;
  /**
   * Outer shell padding.
   * @default "none"
   */
  padding?: SurfacePadding;
  /**
   * 1px border using `border-border-default`.
   * Defaults to `true` for normal surfaces, `false` when `inverse`.
   */
  bordered?: boolean;
  /**
   * `rounded-md` corner radius.
   * @default true
   */
  rounded?: boolean;
  /**
   * Inverse panel (tooltips, dark chips) — `bg-bg-inverse` + on-inverse text.
   * @default false
   */
  inverse?: boolean;
  className?: string;
}

/**
 * Elevated panel chrome for floating UI (menus, dialogs, popovers, cards).
 *
 * Does **not** set position or z-index — pair with portals / {@link overlay}
 * and `zIndexClass("modal" | "dropdown" | …)`.
 *
 * @example
 * ```tsx
 * import { surface, surfaceClass, surfaceSectionClass } from "@design-system/ui/surface";
 *
 * <div className={surfaceClass.popover}>…</div>
 * <div className={surface({ elevation: "lg" })}>
 *   <div className={surfaceSectionClass.header}>Title</div>
 *   <div className={surfaceSectionClass.body}>…</div>
 * </div>
 * ```
 */
export function surface(options: SurfaceOptions = {}): string {
  const elevation = options.elevation ?? SurfaceElevation.md;
  const padding = options.padding ?? SurfacePadding.none;
  const inverse = options.inverse === true;
  const bordered = options.bordered ?? !inverse;
  const rounded = options.rounded !== false;

  return cn(
    inverse
      ? "bg-bg-inverse text-fg-on-inverse"
      : "bg-bg-surface text-fg-default",
    bordered && "border-border-default border",
    rounded && "rounded-md",
    surfaceElevationShadowClass[elevation],
    surfacePaddingClass[padding],
    options.className,
  );
}

/**
 * Named surface recipes for common product chrome.
 * Compose further with `className` / `surfaceSectionClass` as needed.
 */
export const surfaceClass = {
  /** Resting card on the page canvas */
  card: surface({
    elevation: SurfaceElevation.sm,
    padding: SurfacePadding.md,
  }),
  /** Dropdown, select listbox, popover panel */
  popover: surface({ elevation: SurfaceElevation.md }),
  /** Compact menu shell (add items inside) */
  menu: surface({
    elevation: SurfaceElevation.md,
    className: surfaceSectionClass.menu,
  }),
  /** Modal / dialog panel (position + z-index separately) */
  dialog: surface({ elevation: SurfaceElevation.lg }),
  /** Inverse floating label (tooltip body) */
  inverse: surface({
    elevation: SurfaceElevation.md,
    inverse: true,
    padding: SurfacePadding.sm,
  }),
} as const;
