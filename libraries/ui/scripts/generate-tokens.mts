/**
 * Generate token CSS from TypeScript sources (single source of truth).
 *
 * Usage (from libraries/ui):
 *   pnpm tokens:generate
 *
 * Do not hand-edit the generated *.css files under src/tokens/.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { palette, overlays, RADIX_STEPS } from '../src/tokens/colors/palette.ts';
import { colorModeCssSelectors } from '../src/tokens/colors/modes.ts';
import { semanticColorTokens, type SemanticRef } from '../src/tokens/colors/semantic.ts';
import { shadowTokens } from '../src/tokens/shadows/scale.ts';
import { zIndexTokens, zIndexOrder } from '../src/tokens/z-index/scale.ts';
import { breakpoints } from '../src/tokens/breakpoints/scale.ts';
import { fontFamilies } from '../src/tokens/typography/families.ts';
import {
  fontSizes,
  fontSizeAliases,
  fontWeights,
  lineHeights,
  letterSpacings,
} from '../src/tokens/typography/scale.ts';
import { textStyles } from '../src/tokens/typography/semantic.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensRoot = join(__dirname, '../src/tokens');

/** When true, only verify generated files match (exit 1 on drift). */
const checkOnly = process.argv.includes('--check');

const BANNER = `/*
  AUTO-GENERATED — do not edit by hand.
  Source: TypeScript token modules under src/tokens/
  Regenerate: pnpm tokens:generate
*/
`;

const pendingWrites: { relPath: string; content: string }[] = [];

function write(relPath: string, body: string): void {
  const content = `${BANNER}\n${body.trimStart()}\n`;
  pendingWrites.push({ relPath, content });
}

function indent(lines: string[], spaces = 2): string {
  const pad = ' '.repeat(spaces);
  return lines.map((l) => (l.length ? pad + l : l)).join('\n');
}

function joinSelectors(selectors: readonly string[]): string {
  return selectors.join(',\n');
}

function refToCss(ref: SemanticRef): string {
  if ('kind' in ref && ref.kind === 'fixed') return ref.value;
  if ('kind' in ref && ref.kind === 'overlay') {
    return `var(--${ref.name}-a${ref.step})`;
  }
  const radix = palette[ref.palette].radix;
  return `var(--${radix}-${ref.step})`;
}

/** Emit a box-shadow value; split multi-layer values across lines. */
function shadowDecl(cssVar: string, value: string): string[] {
  const resolved = value === 'none' ? '0 0 #0000' : value;
  // Avoid splitting inside color-mix(...) or similar functions.
  if (resolved.includes('color-mix(') || !resolved.includes(', ')) {
    return [`${cssVar}: ${resolved};`];
  }
  const layers = resolved.split(', ').map((s) => s.trim());
  return [
    `${cssVar}:`,
    `  ${layers[0]},`,
    ...layers.slice(1, -1).map((l) => `  ${l},`),
    `  ${layers[layers.length - 1]};`,
  ];
}

function formatFontStack(stack: readonly string[]): string {
  return stack
    .map((part) => {
      // Quote multi-word family names that aren't CSS keywords / generics.
      if (
        /^(ui-|system-ui|sans-serif|monospace|serif|cursive|fantasy|-apple-system)/.test(
          part,
        )
      ) {
        return part;
      }
      if (part.includes(' ') || part === 'Segoe UI') return `'${part}'`;
      // Single-word product fonts
      if (/^[A-Z]/.test(part) || part.includes('Mono')) return `'${part}'`;
      return part;
    })
    .join(', ');
}

// ── Colors: primitives ──────────────────────────────────────────────

function generateColorPrimitives(): string {
  const lines: string[] = [
    '/*',
    '  Layer 2 — Product palette primitives (Tailwind registration)',
    '',
    '  Solid + alpha scales for each product palette → Radix source.',
    '  Utilities: bg-gray-1 … text-brand-11, bg-gray-a3, …',
    '*/',
    '',
    '@theme {',
  ];

  // Overlays
  for (const name of Object.keys(overlays) as (keyof typeof overlays)[]) {
    lines.push(`  /* Overlay: ${name} */`);
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-a${step}: var(--${name}-a${step});`);
    }
    lines.push('');
  }

  lines.push('  /* Product palettes (defaults = light bindings). */');
  for (const [name, meta] of Object.entries(palette)) {
    lines.push(`  /* ${name} ← ${meta.radix} (${meta.role}) */`);
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-${step}: var(--${meta.radix}-${step});`);
    }
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-a${step}: var(--${meta.radix}-a${step});`);
    }
    lines.push('');
  }

  // Drop trailing blank inside before close
  while (lines[lines.length - 1] === '') lines.pop();
  lines.push('}');
  return lines.join('\n') + '\n';
}

// ── Colors: semantic @theme (light defaults) ────────────────────────

function generateColorSemanticTheme(): string {
  const lines: string[] = [
    '/*',
    '  Layer 3 — Semantic colors (Tailwind registration + LIGHT defaults)',
    '',
    '  Defaults use direct Radix vars so mode switches that update those',
    '  vars immediately affect utilities. Dark remaps live in semantic-dark.css.',
    '*/',
    '',
    '@theme {',
  ];

  let lastGroup = '';
  for (const token of semanticColorTokens) {
    if (token.group !== lastGroup) {
      if (lastGroup) lines.push('');
      lines.push(`  /* ${token.group} */`);
      lastGroup = token.group;
    }
    lines.push(`  --color-${token.name}: ${refToCss(token.light)};`);
  }

  lines.push('}');
  return lines.join('\n') + '\n';
}

// ── Colors: mode scopes ─────────────────────────────────────────────

function generatePaletteRebindLines(): string[] {
  const lines: string[] = [];
  for (const [name, meta] of Object.entries(palette)) {
    for (const step of RADIX_STEPS) {
      lines.push(`--color-${name}-${step}: var(--${meta.radix}-${step});`);
    }
  }
  return lines;
}

function generateSemanticRebindLines(mode: 'light' | 'dark'): string[] {
  return semanticColorTokens.map(
    (token) => `--color-${token.name}: ${refToCss(token[mode])};`,
  );
}

function generateColorModeScopes(): string {
  const darkSel = joinSelectors(colorModeCssSelectors.dark);
  const lightSel = joinSelectors(colorModeCssSelectors.light);

  const darkBody = [
    'color-scheme: dark;',
    '',
    '/* Product primitives → Radix (dark scale active on this scope) */',
    ...generatePaletteRebindLines(),
    '',
    '/* Semantic — dark mappings */',
    ...generateSemanticRebindLines('dark'),
  ];

  const lightBody = [
    'color-scheme: light;',
    '',
    '/* Product primitives → Radix */',
    ...generatePaletteRebindLines(),
    '',
    '/* Semantic — light mappings */',
    ...generateSemanticRebindLines('light'),
  ];

  return [
    '/*',
    '  Layer 3 — Explicit LIGHT / DARK semantic (and primitive) rebinding',
    '',
    '  Theme tokens registered via @theme live on :root. Nested mode scopes',
    '  and html.dark re-declare tokens so backgrounds / foregrounds flip.',
    '*/',
    '',
    '/* ─── DARK ───────────────────────────────────────────────────────────── */',
    `${darkSel} {`,
    indent(darkBody),
    '}',
    '',
    '/* ─── LIGHT (nested islands + explicit re-assert) ────────────────────── */',
    `${lightSel} {`,
    indent(lightBody),
    '}',
    '',
  ].join('\n');
}

// ── Shadows ─────────────────────────────────────────────────────────

function generateShadowPrimitives(): string {
  const lightSel = joinSelectors(colorModeCssSelectors.lightWithRoot);
  const varLines: string[] = [];

  for (const token of Object.values(shadowTokens)) {
    varLines.push(...shadowDecl(token.cssVar, token.light));
    varLines.push('');
  }
  while (varLines[varLines.length - 1] === '') varLines.pop();

  const utilities = Object.values(shadowTokens)
    .map((t) => `@utility ${t.utility} {\n  box-shadow: var(${t.cssVar});\n}`)
    .join('\n\n');

  return [
    '/*',
    '  Box shadows — CSS variables + @utility (not @theme shadow values)',
    '',
    '  Why: Tailwind v4 resolves @theme --shadow-* into baked hex inside',
    '  utilities, so .dark { --shadow-sm: … } would not affect them.',
    '  Custom utilities read live CSS variables instead.',
    '*/',
    '',
    '/* Light defaults */',
    `${lightSel} {`,
    indent(varLines),
    '}',
    '',
    '/*',
    '  Clear default Tailwind shadow scale so only our product tokens exist.',
    '*/',
    '@theme {',
    '  --shadow-*: initial;',
    '}',
    '',
    '/* Utilities that always read the live CSS variable (theme-aware). */',
    utilities,
    '',
  ].join('\n');
}

function generateShadowDark(): string {
  const darkSel = joinSelectors(colorModeCssSelectors.dark);
  const varLines: string[] = [];

  for (const token of Object.values(shadowTokens)) {
    varLines.push(...shadowDecl(token.cssVar, token.dark));
    varLines.push('');
  }
  while (varLines[varLines.length - 1] === '') varLines.pop();

  return [
    '/*',
    '  Dark mode shadows — strong black occlusion for near-black surfaces.',
    '*/',
    '',
    `${darkSel} {`,
    indent(varLines),
    '}',
    '',
  ].join('\n');
}

// ── Z-index ─────────────────────────────────────────────────────────

function generateZIndex(): string {
  const scaleComment = zIndexOrder
    .map((name) => `${name}(${zIndexTokens[name].value})`)
    .join(' < ');

  const lines = zIndexOrder.map(
    (name) => `  --z-index-${name}: ${zIndexTokens[name].value};`,
  );

  return [
    '/*',
    '  Semantic z-index tokens → Tailwind utilities',
    '',
    '  Usage:',
    '    className="relative z-dropdown"',
    '    className="fixed inset-0 z-overlay"',
    "    style={{ zIndex: 'var(--z-index-toast)' }}",
    '',
    `  Scale (low → high): ${scaleComment}`,
    '*/',
    '',
    '@theme {',
    ...lines,
    '}',
    '',
  ].join('\n');
}

// ── Breakpoints ─────────────────────────────────────────────────────

function generateBreakpoints(): string {
  const lines: string[] = [
    '/*',
    '  Breakpoints (mobile-first)',
    '',
    '  Product tiers replace Tailwind’s default sm/md/lg/… scale.',
    '*/',
    '',
    '@theme {',
    '  /* Clear default Tailwind screens so only our tiers exist as variants. */',
    '  --breakpoint-*: initial;',
    '',
  ];

  for (const bp of Object.values(breakpoints)) {
    const variantNote =
      bp.tailwindVariant == null
        ? 'base tier — no min-width variant'
        : `variant: ${bp.tailwindVariant}:`;
    lines.push(`  /* ${bp.name}: ≥ ${bp.minWidthPx}px (${variantNote}) */`);
    lines.push(`  ${bp.cssVar}: ${bp.minWidthRem};`);
  }

  lines.push('}', '');
  return lines.join('\n');
}

// ── Typography primitives ───────────────────────────────────────────

function generateTypographyPrimitives(): string {
  const lines: string[] = [
    '/*',
    '  Layer 2 — Typography primitives for Tailwind v4',
    '',
    '  Families, sizes, weights, leading, tracking.',
    '*/',
    '',
    '@theme {',
    '  /* Families */',
  ];

  for (const [name, fam] of Object.entries(fontFamilies)) {
    lines.push(`  --font-${name}: ${formatFontStack(fam.stack)};`);
  }

  lines.push('', '  /* Sizes (+ default line-heights for text-* utilities) */');
  for (const [name, size] of Object.entries(fontSizes)) {
    lines.push(`  --text-${name}: ${size.rem};`);
    lines.push(`  --text-${name}--line-height: ${size.defaultLineHeight};`);
    lines.push('');
  }

  lines.push('  /* Size aliases */');
  for (const [alias, target] of Object.entries(fontSizeAliases)) {
    const size = fontSizes[target];
    lines.push(`  --text-${alias}: ${size.rem};`);
    lines.push(`  --text-${alias}--line-height: ${size.defaultLineHeight};`);
  }

  lines.push('', '  /* Weights */');
  for (const [name, w] of Object.entries(fontWeights)) {
    lines.push(`  --font-weight-${name}: ${w.value};`);
  }

  lines.push('', '  /* Line height */');
  for (const [name, lh] of Object.entries(lineHeights)) {
    lines.push(`  --leading-${name}: ${lh.value};`);
  }

  lines.push('', '  /* Letter spacing */');
  for (const [name, tr] of Object.entries(letterSpacings)) {
    // Prefer 0em over bare 0 for tracking-normal consistency with CSS norms
    const value = tr.value === '0' ? '0em' : tr.value;
    lines.push(`  --tracking-${name}: ${value};`);
  }

  lines.push('}', '');
  return lines.join('\n');
}

// ── Typography semantic utilities ───────────────────────────────────

function generateTypographySemantic(): string {
  const blocks: string[] = [
    '/*',
    '  Layer 3 — Semantic text style utilities',
    '',
    '  Usage: className="text-heading-lg text-fg-default"',
    '*/',
    '',
  ];

  for (const style of textStyles) {
    const props = [
      `  font-family: var(--font-${style.family});`,
      `  font-size: var(--text-${style.size});`,
      `  line-height: var(--leading-${style.leading});`,
      `  font-weight: var(--font-weight-${style.weight});`,
      `  letter-spacing: var(--tracking-${style.tracking});`,
    ];
    if ('transform' in style && style.transform === 'uppercase') {
      props.push('  text-transform: uppercase;');
    }
    if (style.group === 'metric') {
      props.push('  font-variant-numeric: tabular-nums;');
    }

    blocks.push(`@utility text-${style.name} {`);
    blocks.push(...props);
    blocks.push('}', '');
  }

  return blocks.join('\n');
}

// ── Main ────────────────────────────────────────────────────────────

function main(): void {
  console.log(
    checkOnly
      ? 'Checking token CSS is up to date with TypeScript sources…'
      : 'Generating token CSS from TypeScript sources…',
  );

  write('colors/primitives.css', generateColorPrimitives());
  write('colors/semantic.css', generateColorSemanticTheme());
  write('colors/semantic-dark.css', generateColorModeScopes());
  write('shadows/primitives.css', generateShadowPrimitives());
  write('shadows/dark.css', generateShadowDark());
  write('z-index/primitives.css', generateZIndex());
  write('breakpoints/primitives.css', generateBreakpoints());
  write('typography/primitives.css', generateTypographyPrimitives());
  write('typography/semantic.css', generateTypographySemantic());

  if (checkOnly) {
    let drifted = 0;
    for (const { relPath, content } of pendingWrites) {
      const abs = join(tokensRoot, relPath);
      if (!existsSync(abs)) {
        console.error(`  missing: src/tokens/${relPath}`);
        drifted++;
        continue;
      }
      const current = readFileSync(abs, 'utf8');
      if (current !== content) {
        console.error(`  out of date: src/tokens/${relPath}`);
        drifted++;
      } else {
        console.log(`  ok: src/tokens/${relPath}`);
      }
    }
    if (drifted > 0) {
      console.error(`\n${drifted} file(s) out of date. Run: pnpm tokens:generate`);
      process.exit(1);
    }
    console.log('All generated token CSS files are up to date.');
    return;
  }

  for (const { relPath, content } of pendingWrites) {
    const abs = join(tokensRoot, relPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content, 'utf8');
    console.log(`  wrote src/tokens/${relPath}`);
  }

  console.log('Done.');
}

main();
