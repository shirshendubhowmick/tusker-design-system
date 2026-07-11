/**
 * Generate token CSS from TypeScript sources (single source of truth).
 *
 * Usage (from packages/ui):
 *   pnpm tokens:generate
 *
 * Do not hand-edit the generated *.css files under src/tokens/.
 */
import * as radixColors from "@radix-ui/colors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { breakpoints } from "../src/tokens/breakpoints/scale.ts";
import { colorModeCssSelectors } from "../src/tokens/colors/modes.ts";
import {
  type PaletteName,
  RADIX_STEPS,
  type RadixStep,
  overlays,
  palette,
} from "../src/tokens/colors/palette.ts";
import {
  type SemanticRef,
  semanticColorTokens,
} from "../src/tokens/colors/semantic.ts";
import { shadowTokens } from "../src/tokens/shadows/scale.ts";
import { fontFamilies } from "../src/tokens/typography/families.ts";
import {
  fontSizeAliases,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "../src/tokens/typography/scale.ts";
import { textStyles } from "../src/tokens/typography/semantic.ts";
import { zIndexOrder, zIndexTokens } from "../src/tokens/z-index/scale.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensRoot = join(__dirname, "../src/tokens");

// ── Mix → hex (codegen only; Tailwind @theme cannot host color-mix) ──

type BlueScale = Record<RadixStep, string>;

function loadCustomBlueScales(): { light: BlueScale; dark: BlueScale } {
  const css = readFileSync(join(tokensRoot, "colors/blue.css"), "utf8");
  const darkIdx = css.search(/\.dark\b/);
  const lightPart = darkIdx === -1 ? css : css.slice(0, darkIdx);
  const darkPart = darkIdx === -1 ? "" : css.slice(darkIdx);

  function parseBlock(block: string): BlueScale {
    const out = {} as BlueScale;
    for (const match of block.matchAll(
      /--blue-(\d+):\s*(#[0-9A-Fa-f]{3,8})\b/g,
    )) {
      const step = Number(match[1]) as RadixStep;
      const raw = match[2];
      if (raw && step >= 1 && step <= 12) {
        out[step] = raw.toLowerCase();
      }
    }
    return out;
  }

  return { light: parseBlock(lightPart), dark: parseBlock(darkPart) };
}

const customBlue = loadCustomBlueScales();

function parseHexRgb(hex: string): [number, number, number] {
  let h = hex.trim().toLowerCase().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length === 8) h = h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
}

function mixHex(a: string, b: string, aPercent: number): string {
  const t = aPercent / 100;
  const ca = parseHexRgb(a);
  const cb = parseHexRgb(b);
  const mixed = [
    ca[0] * t + cb[0] * (1 - t),
    ca[1] * t + cb[1] * (1 - t),
    ca[2] * t + cb[2] * (1 - t),
  ];
  return `#${mixed
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function resolvePaletteStepHex(
  paletteName: PaletteName,
  step: RadixStep,
  mode: "light" | "dark",
): string {
  const radixName = palette[paletteName].radix;
  if (radixName === "blue") {
    return customBlue[mode][step];
  }
  const scaleKey = mode === "dark" ? `${radixName}Dark` : radixName;
  const scale = (radixColors as Record<string, Record<string, string>>)[
    scaleKey
  ];
  const value = scale?.[`${radixName}${step}`];
  if (!value?.startsWith("#")) {
    throw new Error(`Missing hex for ${scaleKey}.${radixName}${step}`);
  }
  return value.toLowerCase();
}

function resolveMixToHex(
  ref: Extract<SemanticRef, { kind: "mix" }>,
  mode: "light" | "dark",
): string {
  const aHex = resolvePaletteStepHex(ref.a.palette, ref.a.step, mode);
  const bHex =
    "kind" in ref.b
      ? ref.b.kind === "black"
        ? "#000000"
        : "#ffffff"
      : resolvePaletteStepHex(ref.b.palette, ref.b.step, mode);
  return mixHex(aHex, bHex, ref.aPercent);
}

/** When true, only verify generated files match (exit 1 on drift). */
const checkOnly = process.argv.includes("--check");

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
  const pad = " ".repeat(spaces);
  return lines.map((l) => (l.length ? pad + l : l)).join("\n");
}

function joinSelectors(selectors: readonly string[]): string {
  return selectors.join(",\n");
}

function paletteStepVar(
  paletteName: keyof typeof palette,
  step: number,
): string {
  const radix = palette[paletteName].radix;
  return `var(--${radix}-${step})`;
}

/**
 * Emit CSS for a semantic ref.
 *
 * `mix` refs are resolved to concrete hex at codegen time. Tailwind v4's
 * `@theme` color-mix polyfill crashes on `color-mix(... var(--scale) ..., black)`
 * (`Cannot read properties of undefined (reading 'kind')`). Hex keeps
 * utilities stable; the TS catalog still expresses mixes from the scale.
 */
function refToCss(ref: SemanticRef, mode: "light" | "dark" = "light"): string {
  if ("kind" in ref && ref.kind === "fixed") return ref.value;
  if ("kind" in ref && ref.kind === "overlay") {
    return `var(--${ref.name}-a${ref.step})`;
  }
  if ("kind" in ref && ref.kind === "mix") {
    return resolveMixToHex(ref, mode);
  }
  return paletteStepVar(ref.palette, ref.step);
}

/** Emit a box-shadow value; split multi-layer values across lines. */
function shadowDecl(cssVar: string, value: string): string[] {
  const resolved = value === "none" ? "0 0 #0000" : value;
  // Avoid splitting inside color-mix(...) or similar functions.
  if (resolved.includes("color-mix(") || !resolved.includes(", ")) {
    return [`${cssVar}: ${resolved};`];
  }
  const layers = resolved.split(", ").map((s) => s.trim());
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
      if (part.includes(" ") || part === "Segoe UI") return `'${part}'`;
      // Single-word product fonts
      if (/^[A-Z]/.test(part) || part.includes("Mono")) return `'${part}'`;
      return part;
    })
    .join(", ");
}

// ── Colors: primitives ──────────────────────────────────────────────

function generateColorPrimitives(): string {
  const lines: string[] = [
    "/*",
    "  Layer 2 — Product palette primitives (Tailwind registration)",
    "",
    "  Solid + alpha scales for each product palette → Radix source.",
    "  Utilities: bg-gray-1 … text-brand-11, bg-gray-a3, …",
    "*/",
    "",
    "@theme {",
  ];

  // Overlays
  for (const name of Object.keys(overlays) as (keyof typeof overlays)[]) {
    lines.push(`  /* Overlay: ${name} */`);
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-a${step}: var(--${name}-a${step});`);
    }
    lines.push("");
  }

  lines.push("  /* Product palettes (defaults = light bindings). */");
  for (const [name, meta] of Object.entries(palette)) {
    lines.push(`  /* ${name} ← ${meta.radix} (${meta.role}) */`);
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-${step}: var(--${meta.radix}-${step});`);
    }
    for (const step of RADIX_STEPS) {
      lines.push(`  --color-${name}-a${step}: var(--${meta.radix}-a${step});`);
    }
    lines.push("");
  }

  // Drop trailing blank inside before close
  while (lines[lines.length - 1] === "") lines.pop();
  lines.push("}");
  return lines.join("\n") + "\n";
}

// ── Colors: semantic @theme (light defaults) ────────────────────────

function isMixRef(ref: SemanticRef): boolean {
  return "kind" in ref && ref.kind === "mix";
}

/** Token uses mix in either mode — needs a non-@theme backing var for Tailwind. */
function tokenUsesMix(token: (typeof semanticColorTokens)[number]): boolean {
  return isMixRef(token.light) || isMixRef(token.dark);
}

/** Private backing custom property for mix-resolved colors (not a Tailwind theme key). */
function mixBackingVar(tokenName: string): string {
  return `--_ds-${tokenName}`;
}

function generateColorSemanticTheme(): string {
  const lines: string[] = [
    "/*",
    "  Layer 3 — Semantic colors (Tailwind registration + LIGHT defaults)",
    "",
    "  Defaults use direct Radix vars so mode switches that update those",
    "  vars immediately affect utilities. Dark remaps live in semantic-dark.css.",
    "",
    "  Mix-derived tokens (darkened solids / blended text) register as",
    "  var(--_ds-*) only. Concrete hex lives outside @theme — Tailwind v4's",
    "  color-mix polyfill crashes when a theme color is a resolved hex used",
    "  inside utility color-mix() (e.g. Button bare tertiary hover).",
    "*/",
    "",
    "@theme {",
  ];

  let lastGroup = "";
  for (const token of semanticColorTokens) {
    if (token.group !== lastGroup) {
      if (lastGroup) lines.push("");
      lines.push(`  /* ${token.group} */`);
      lastGroup = token.group;
    }
    if (tokenUsesMix(token)) {
      lines.push(`  --color-${token.name}: var(${mixBackingVar(token.name)});`);
    } else {
      lines.push(`  --color-${token.name}: ${refToCss(token.light, "light")};`);
    }
  }

  lines.push("}");

  // Light defaults for mix backing vars (always on :root).
  const mixTokens = semanticColorTokens.filter(tokenUsesMix);
  if (mixTokens.length > 0) {
    lines.push("");
    lines.push("/* Mix backing values (light). Not @theme — see header. */");
    lines.push(":root {");
    for (const token of mixTokens) {
      lines.push(
        `  ${mixBackingVar(token.name)}: ${refToCss(token.light, "light")};`,
      );
    }
    lines.push("}");
  }

  return lines.join("\n") + "\n";
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

function generateSemanticRebindLines(mode: "light" | "dark"): string[] {
  return semanticColorTokens.map((token) => {
    const value = refToCss(token[mode], mode);
    // Mix tokens: only rebind the backing var; --color-* stays var(--_ds-*).
    if (tokenUsesMix(token)) {
      return `${mixBackingVar(token.name)}: ${value};`;
    }
    return `--color-${token.name}: ${value};`;
  });
}

function generateColorModeScopes(): string {
  const darkSel = joinSelectors(colorModeCssSelectors.dark);
  const lightSel = joinSelectors(colorModeCssSelectors.light);

  const darkBody = [
    "color-scheme: dark;",
    "",
    "/* Product primitives → Radix (dark scale active on this scope) */",
    ...generatePaletteRebindLines(),
    "",
    "/* Semantic — dark mappings */",
    ...generateSemanticRebindLines("dark"),
  ];

  const lightBody = [
    "color-scheme: light;",
    "",
    "/* Product primitives → Radix */",
    ...generatePaletteRebindLines(),
    "",
    "/* Semantic — light mappings */",
    ...generateSemanticRebindLines("light"),
  ];

  return [
    "/*",
    "  Layer 3 — Explicit LIGHT / DARK semantic (and primitive) rebinding",
    "",
    "  Theme tokens registered via @theme live on :root. Nested mode scopes",
    "  and html.dark re-declare tokens so backgrounds / foregrounds flip.",
    "*/",
    "",
    "/* ─── DARK ───────────────────────────────────────────────────────────── */",
    `${darkSel} {`,
    indent(darkBody),
    "}",
    "",
    "/* ─── LIGHT (nested islands + explicit re-assert) ────────────────────── */",
    `${lightSel} {`,
    indent(lightBody),
    "}",
    "",
  ].join("\n");
}

// ── Shadows ─────────────────────────────────────────────────────────

function generateShadowPrimitives(): string {
  const lightSel = joinSelectors(colorModeCssSelectors.lightWithRoot);
  const varLines: string[] = [];

  for (const token of Object.values(shadowTokens)) {
    varLines.push(...shadowDecl(token.cssVar, token.light));
    varLines.push("");
  }
  while (varLines[varLines.length - 1] === "") varLines.pop();

  const utilities = Object.values(shadowTokens)
    .map((t) => `@utility ${t.utility} {\n  box-shadow: var(${t.cssVar});\n}`)
    .join("\n\n");

  return [
    "/*",
    "  Box shadows — CSS variables + @utility (not @theme shadow values)",
    "",
    "  Why: Tailwind v4 resolves @theme --shadow-* into baked hex inside",
    "  utilities, so .dark { --shadow-sm: … } would not affect them.",
    "  Custom utilities read live CSS variables instead.",
    "*/",
    "",
    "/* Light defaults */",
    `${lightSel} {`,
    indent(varLines),
    "}",
    "",
    "/*",
    "  Clear default Tailwind shadow scale so only our product tokens exist.",
    "*/",
    "@theme {",
    "  --shadow-*: initial;",
    "}",
    "",
    "/* Utilities that always read the live CSS variable (theme-aware). */",
    utilities,
    "",
  ].join("\n");
}

function generateShadowDark(): string {
  const darkSel = joinSelectors(colorModeCssSelectors.dark);
  const varLines: string[] = [];

  for (const token of Object.values(shadowTokens)) {
    varLines.push(...shadowDecl(token.cssVar, token.dark));
    varLines.push("");
  }
  while (varLines[varLines.length - 1] === "") varLines.pop();

  return [
    "/*",
    "  Dark mode shadows — strong black occlusion for near-black surfaces.",
    "*/",
    "",
    `${darkSel} {`,
    indent(varLines),
    "}",
    "",
  ].join("\n");
}

// ── Z-index ─────────────────────────────────────────────────────────

function generateZIndex(): string {
  const scaleComment = zIndexOrder
    .map((name) => `${name}(${zIndexTokens[name].value})`)
    .join(" < ");

  const lines = zIndexOrder.map(
    (name) => `  --z-index-${name}: ${zIndexTokens[name].value};`,
  );

  return [
    "/*",
    "  Semantic z-index tokens → Tailwind utilities",
    "",
    "  Usage:",
    '    className="relative z-dropdown"',
    '    className="fixed inset-0 z-overlay"',
    "    style={{ zIndex: 'var(--z-index-toast)' }}",
    "",
    `  Scale (low → high): ${scaleComment}`,
    "*/",
    "",
    "@theme {",
    ...lines,
    "}",
    "",
  ].join("\n");
}

// ── Breakpoints ─────────────────────────────────────────────────────

function generateBreakpoints(): string {
  const lines: string[] = [
    "/*",
    "  Breakpoints (mobile-first)",
    "",
    "  Product tiers replace Tailwind’s default sm/md/lg/… scale.",
    "*/",
    "",
    "@theme {",
    "  /* Clear default Tailwind screens so only our tiers exist as variants. */",
    "  --breakpoint-*: initial;",
    "",
  ];

  for (const bp of Object.values(breakpoints)) {
    const variantNote =
      bp.tailwindVariant == null
        ? "base tier — no min-width variant"
        : `variant: ${bp.tailwindVariant}:`;
    lines.push(`  /* ${bp.name}: ≥ ${bp.minWidthPx}px (${variantNote}) */`);
    lines.push(`  ${bp.cssVar}: ${bp.minWidthRem};`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

// ── Typography primitives ───────────────────────────────────────────

function generateTypographyPrimitives(): string {
  const lines: string[] = [
    "/*",
    "  Layer 2 — Typography primitives for Tailwind v4",
    "",
    "  Families, sizes, weights, leading, tracking.",
    "*/",
    "",
    "@theme {",
    "  /* Families */",
  ];

  for (const [name, fam] of Object.entries(fontFamilies)) {
    lines.push(`  --font-${name}: ${formatFontStack(fam.stack)};`);
  }

  lines.push("", "  /* Sizes (+ default line-heights for text-* utilities) */");
  for (const [name, size] of Object.entries(fontSizes)) {
    lines.push(`  --text-${name}: ${size.rem};`);
    lines.push(`  --text-${name}--line-height: ${size.defaultLineHeight};`);
    lines.push("");
  }

  lines.push("  /* Size aliases */");
  for (const [alias, target] of Object.entries(fontSizeAliases)) {
    const size = fontSizes[target];
    lines.push(`  --text-${alias}: ${size.rem};`);
    lines.push(`  --text-${alias}--line-height: ${size.defaultLineHeight};`);
  }

  lines.push("", "  /* Weights */");
  for (const [name, w] of Object.entries(fontWeights)) {
    lines.push(`  --font-weight-${name}: ${w.value};`);
  }

  lines.push("", "  /* Line height */");
  for (const [name, lh] of Object.entries(lineHeights)) {
    lines.push(`  --leading-${name}: ${lh.value};`);
  }

  lines.push("", "  /* Letter spacing */");
  for (const [name, tr] of Object.entries(letterSpacings)) {
    // Prefer 0em over bare 0 for tracking-normal consistency with CSS norms
    const value = tr.value === "0" ? "0em" : tr.value;
    lines.push(`  --tracking-${name}: ${value};`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

// ── Typography semantic utilities ───────────────────────────────────

function generateTypographySemantic(): string {
  const blocks: string[] = [
    "/*",
    "  Layer 3 — Semantic text style utilities",
    "",
    '  Usage: className="text-heading-lg text-fg-default"',
    "*/",
    "",
  ];

  for (const style of textStyles) {
    const props = [
      `  font-family: var(--font-${style.family});`,
      `  font-size: var(--text-${style.size});`,
      `  line-height: var(--leading-${style.leading});`,
      `  font-weight: var(--font-weight-${style.weight});`,
      `  letter-spacing: var(--tracking-${style.tracking});`,
    ];
    if ("transform" in style && style.transform === "uppercase") {
      props.push("  text-transform: uppercase;");
    }
    if (style.group === "metric") {
      props.push("  font-variant-numeric: tabular-nums;");
    }

    blocks.push(`@utility text-${style.name} {`);
    blocks.push(...props);
    blocks.push("}", "");
  }

  return blocks.join("\n");
}

// ── Main ────────────────────────────────────────────────────────────

function main(): void {
  console.log(
    checkOnly
      ? "Checking token CSS is up to date with TypeScript sources…"
      : "Generating token CSS from TypeScript sources…",
  );

  write("colors/primitives.css", generateColorPrimitives());
  write("colors/semantic.css", generateColorSemanticTheme());
  write("colors/semantic-dark.css", generateColorModeScopes());
  write("shadows/primitives.css", generateShadowPrimitives());
  write("shadows/dark.css", generateShadowDark());
  write("z-index/primitives.css", generateZIndex());
  write("breakpoints/primitives.css", generateBreakpoints());
  write("typography/primitives.css", generateTypographyPrimitives());
  write("typography/semantic.css", generateTypographySemantic());

  if (checkOnly) {
    let drifted = 0;
    for (const { relPath, content } of pendingWrites) {
      const abs = join(tokensRoot, relPath);
      if (!existsSync(abs)) {
        console.error(`  missing: src/tokens/${relPath}`);
        drifted++;
        continue;
      }
      const current = readFileSync(abs, "utf8");
      if (current !== content) {
        console.error(`  out of date: src/tokens/${relPath}`);
        drifted++;
      } else {
        console.log(`  ok: src/tokens/${relPath}`);
      }
    }
    if (drifted > 0) {
      console.error(
        `\n${drifted} file(s) out of date. Run: pnpm tokens:generate`,
      );
      process.exit(1);
    }
    console.log("All generated token CSS files are up to date.");
    return;
  }

  for (const { relPath, content } of pendingWrites) {
    const abs = join(tokensRoot, relPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content, "utf8");
    console.log(`  wrote src/tokens/${relPath}`);
  }

  console.log("Done.");
}

main();
