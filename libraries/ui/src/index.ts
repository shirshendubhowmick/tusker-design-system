/**
 * Public JS API — no side-effect imports.
 *
 * Styles are opt-in so unused token/modules can be tree-shaken:
 *   import '@design-system/ui/styles.css'
 */

export { cn, type ClassValue } from "./lib/cn";

export {
  palette,
  overlays,
  RADIX_STEPS,
  colorModes,
  colorModeCssSelectors,
  colorModeMeta,
  colorModeActivation,
  semanticColorTokens,
  semanticColorGroups,
  formatSemanticRef,
  getSemanticRef,
  hasModeOverride,
} from "./tokens/colors";
export type {
  PaletteName,
  PaletteRole,
  RadixStep,
  ColorMode,
  SemanticColorName,
  SemanticColorGroup,
  SemanticRef,
  SemanticToken,
} from "./tokens/colors";

export {
  fontFamilies,
  fontSizes,
  fontSizeAliases,
  fontWeights,
  lineHeights,
  letterSpacings,
  textStyles,
  textStyleGroups,
} from "./tokens/typography";
export type {
  FontFamilyName,
  FontSizeName,
  FontWeightName,
  LineHeightName,
  LetterSpacingName,
  TextStyle,
  TextStyleName,
  TextStyleGroup,
} from "./tokens/typography";

export {
  breakpoints,
  breakpointOrder,
  resolveBreakpoint,
  formatBreakpointRange,
  designSystemViewports,
  defaultStorybookViewport,
  storybookViewportNotes,
} from "./tokens/breakpoints";
export type {
  BreakpointName,
  DesignSystemViewport,
} from "./tokens/breakpoints";

export {
  zIndexTokens,
  zIndexOrder,
  zIndexClass,
  zIndexCssVar,
} from "./tokens/z-index";
export type { ZIndexName } from "./tokens/z-index";

export {
  shadowTokens,
  shadowElevationOrder,
  shadowTopOrder,
  shadowOrder,
  shadowGroups,
} from "./tokens/shadows";
export type {
  ShadowName,
  ShadowToken,
  ShadowGroup,
  ShadowModeValues,
} from "./tokens/shadows";
