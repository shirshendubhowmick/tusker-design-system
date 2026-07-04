import type { FontFamilyName } from './families';
import type {
  FontSizeName,
  FontWeightName,
  LineHeightName,
  LetterSpacingName,
} from './scale';

/**
 * Layer 3 — Semantic text styles.
 *
 * Composite tokens: family + size + weight + leading + tracking.
 * Prefer these for product UI over ad-hoc size/weight combos.
 */

export type TextStyle = {
  name: string;
  description: string;
  group: 'display' | 'heading' | 'body' | 'label' | 'code' | 'metric';
  family: FontFamilyName;
  size: FontSizeName;
  weight: FontWeightName;
  leading: LineHeightName;
  tracking: LetterSpacingName;
  /** Optional text transform for docs / CSS. */
  transform?: 'none' | 'uppercase';
};

export const textStyles = [
  // ── Display (rare, empty states / marketing surfaces inside app) ──
  {
    name: 'display-lg',
    group: 'display',
    description: 'Hero / empty-state display',
    family: 'sans',
    size: '4xl',
    weight: 'semibold',
    leading: 'tight',
    tracking: 'tighter',
  },
  {
    name: 'display-md',
    group: 'display',
    description: 'Large promotional title',
    family: 'sans',
    size: '3xl',
    weight: 'semibold',
    leading: 'tight',
    tracking: 'tighter',
  },

  // ── Headings ──────────────────────────────────────────────────────
  {
    name: 'heading-xl',
    group: 'heading',
    description: 'Page title',
    family: 'sans',
    size: '2xl',
    weight: 'semibold',
    leading: 'tight',
    tracking: 'tight',
  },
  {
    name: 'heading-lg',
    group: 'heading',
    description: 'Primary section heading',
    family: 'sans',
    size: 'xl',
    weight: 'semibold',
    leading: 'tight',
    tracking: 'tight',
  },
  {
    name: 'heading-md',
    group: 'heading',
    description: 'Card / panel title',
    family: 'sans',
    size: 'lg',
    weight: 'semibold',
    leading: 'snug',
    tracking: 'normal',
  },
  {
    name: 'heading-sm',
    group: 'heading',
    description: 'Subsection / list group title',
    family: 'sans',
    size: 'md',
    weight: 'semibold',
    leading: 'snug',
    tracking: 'normal',
  },
  {
    name: 'heading-xs',
    group: 'heading',
    description: 'Overline / small heading in dense UI',
    family: 'sans',
    size: 'sm',
    weight: 'semibold',
    leading: 'snug',
    tracking: 'normal',
  },

  // ── Body ──────────────────────────────────────────────────────────
  {
    name: 'body-lg',
    group: 'body',
    description: 'Comfortable reading (dialogs, docs snippets)',
    family: 'sans',
    size: 'md',
    weight: 'regular',
    leading: 'relaxed',
    tracking: 'normal',
  },
  {
    name: 'body-md',
    group: 'body',
    description: 'Default product body (14px tool density)',
    family: 'sans',
    size: 'sm',
    weight: 'regular',
    leading: 'normal',
    tracking: 'normal',
  },
  {
    name: 'body-sm',
    group: 'body',
    description: 'Secondary copy, helper text under fields',
    family: 'sans',
    size: 'xs',
    weight: 'regular',
    leading: 'normal',
    tracking: 'normal',
  },
  {
    name: 'body-md-medium',
    group: 'body',
    description: 'Emphasized body / strong paragraph lead',
    family: 'sans',
    size: 'sm',
    weight: 'medium',
    leading: 'normal',
    tracking: 'normal',
  },

  // ── Labels / UI chrome ────────────────────────────────────────────
  {
    name: 'label-lg',
    group: 'label',
    description: 'Form labels, nav items',
    family: 'sans',
    size: 'sm',
    weight: 'medium',
    leading: 'none',
    tracking: 'normal',
  },
  {
    name: 'label-md',
    group: 'label',
    description: 'Compact labels, tabs, menu items',
    family: 'sans',
    size: 'xs',
    weight: 'medium',
    leading: 'none',
    tracking: 'normal',
  },
  {
    name: 'label-sm',
    group: 'label',
    description: 'Badges, chips, table headers',
    family: 'sans',
    size: '2xs',
    weight: 'medium',
    leading: 'none',
    tracking: 'wide',
  },
  {
    name: 'label-overline',
    group: 'label',
    description: 'Eyebrow / category overline',
    family: 'sans',
    size: '2xs',
    weight: 'semibold',
    leading: 'none',
    tracking: 'wider',
    transform: 'uppercase',
  },

  // ── Code ──────────────────────────────────────────────────────────
  {
    name: 'code-md',
    group: 'code',
    description: 'Inline code, file paths',
    family: 'mono',
    size: 'sm',
    weight: 'regular',
    leading: 'normal',
    tracking: 'normal',
  },
  {
    name: 'code-sm',
    group: 'code',
    description: 'Dense code, tokens, short IDs',
    family: 'mono',
    size: 'xs',
    weight: 'regular',
    leading: 'normal',
    tracking: 'normal',
  },
  {
    name: 'code-block',
    group: 'code',
    description: 'Code blocks and log lines',
    family: 'mono',
    size: 'xs',
    weight: 'regular',
    leading: 'relaxed',
    tracking: 'normal',
  },

  // ── Metrics (dashboards) ──────────────────────────────────────────
  {
    name: 'metric-lg',
    group: 'metric',
    description: 'KPI / big number',
    family: 'sans',
    size: '3xl',
    weight: 'semibold',
    leading: 'none',
    tracking: 'tight',
  },
  {
    name: 'metric-md',
    group: 'metric',
    description: 'Secondary stat',
    family: 'sans',
    size: '2xl',
    weight: 'semibold',
    leading: 'none',
    tracking: 'tight',
  },
  {
    name: 'metric-sm',
    group: 'metric',
    description: 'Compact stat in cards',
    family: 'sans',
    size: 'xl',
    weight: 'semibold',
    leading: 'none',
    tracking: 'normal',
  },
] as const satisfies readonly TextStyle[];

export type TextStyleName = (typeof textStyles)[number]['name'];

export const textStyleGroups = [
  'display',
  'heading',
  'body',
  'label',
  'code',
  'metric',
] as const;

export type TextStyleGroup = (typeof textStyleGroups)[number];
