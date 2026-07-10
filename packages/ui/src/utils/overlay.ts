import { type ZIndexName, zIndexClass } from "../tokens/z-index";
import { cn } from "./cn";

/** Z-index layers that commonly host a scrim or catch layer. */
export type OverlayZIndex = Extract<
  ZIndexName,
  "overlay" | "modal" | "dropdown"
>;

export interface OverlayOptions {
  /**
   * Stacking layer. Default scrim sits at `overlay`; dialog content uses `modal`.
   * @default "overlay"
   */
  z?: OverlayZIndex;
  /**
   * Cover the viewport (`fixed inset-0`).
   * @default true
   */
  fixed?: boolean;
  /**
   * Dimmed fill via `bg-overlay-scrim` (semantic black alpha).
   * @default true
   */
  scrim?: boolean;
  className?: string;
}

/**
 * Full-viewport overlay layer — typically the dimmed scrim behind a dialog/drawer.
 *
 * Pair with a surface panel at a higher z (`z-modal`) for the actual content.
 *
 * @example
 * ```tsx
 * import { overlay, overlayClass } from "@design-system/ui/overlay";
 * import { surfaceClass } from "@design-system/ui/surface";
 * import { zIndexClass } from "@design-system/ui/tokens";
 *
 * <>
 *   <div className={overlayClass.scrim} />
 *   <div className={cn(surfaceClass.dialog, zIndexClass("modal"), "fixed …")}>
 *     …
 *   </div>
 * </>
 * ```
 */
export function overlay(options: OverlayOptions = {}): string {
  const z = options.z ?? "overlay";
  const fixed = options.fixed !== false;
  const scrim = options.scrim !== false;

  return cn(
    fixed && "fixed inset-0",
    zIndexClass(z),
    scrim && "bg-overlay-scrim",
    options.className,
  );
}

/**
 * Named overlay recipes.
 */
export const overlayClass = {
  /** Full-viewport dimmed scrim (`z-overlay` + `bg-overlay-scrim`) */
  scrim: overlay(),
  /**
   * Transparent catch layer for outside-click without dimming
   * (e.g. some menus / dismiss layers).
   */
  catch: overlay({ scrim: false }),
} as const;
