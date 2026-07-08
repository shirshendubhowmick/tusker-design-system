import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { breakpoints } from "../src/tokens/breakpoints/scale";
import { RADIX_STEPS, palette } from "../src/tokens/colors/palette";
import { semanticColorTokens } from "../src/tokens/colors/semantic";
import { shadowTokens } from "../src/tokens/shadows/scale";
import { fontSizeAliases, fontSizes } from "../src/tokens/typography/scale";
import { textStyles } from "../src/tokens/typography/semantic";
import { zIndexTokens } from "../src/tokens/z-index/scale";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensRoot = join(root, "src/tokens");

const GENERATED_CSS = [
  "colors/primitives.css",
  "colors/semantic.css",
  "colors/semantic-dark.css",
  "shadows/primitives.css",
  "shadows/dark.css",
  "z-index/primitives.css",
  "breakpoints/primitives.css",
  "typography/primitives.css",
  "typography/semantic.css",
] as const;

/** Hand-authored CSS under tokens/ (e.g. custom Radix scales) — never codegen output. */
const HAND_AUTHORED_CSS = ["colors/blue.css"] as const;

function readTokenCss(rel: string): string {
  return readFileSync(join(tokensRoot, rel), "utf8");
}

describe("token CSS codegen (TS → CSS)", () => {
  it("marks every generated file as AUTO-GENERATED", () => {
    for (const rel of GENERATED_CSS) {
      const css = readTokenCss(rel);
      expect(css, rel).toMatch(/AUTO-GENERATED/);
      expect(css, rel).toMatch(/pnpm tokens:generate/);
    }
  });

  it("passes tokens:check (generated CSS matches TS sources)", () => {
    expect(() =>
      execFileSync(
        process.execPath,
        [
          "--experimental-strip-types",
          "./scripts/generate-tokens.mts",
          "--check",
        ],
        { cwd: root, stdio: "pipe" },
      ),
    ).not.toThrow();
  });

  it("emits semantic color variables for every catalog token (light @theme)", () => {
    const css = readTokenCss("colors/semantic.css");
    for (const token of semanticColorTokens) {
      expect(css).toContain(`--color-${token.name}:`);
    }
  });

  it("emits product palette steps for every palette × radix step", () => {
    const css = readTokenCss("colors/primitives.css");
    for (const name of Object.keys(palette)) {
      for (const step of RADIX_STEPS) {
        expect(css).toContain(`--color-${name}-${step}:`);
        expect(css).toContain(`--color-${name}-a${step}:`);
      }
    }
  });

  it("emits shadow variables and utilities for every shadow token", () => {
    const light = readTokenCss("shadows/primitives.css");
    const dark = readTokenCss("shadows/dark.css");
    for (const token of Object.values(shadowTokens)) {
      expect(light).toContain(`${token.cssVar}:`);
      expect(dark).toContain(`${token.cssVar}:`);
      expect(light).toContain(`@utility ${token.utility}`);
    }
  });

  it("emits z-index and breakpoint theme tokens", () => {
    const z = readTokenCss("z-index/primitives.css");
    for (const [name, token] of Object.entries(zIndexTokens)) {
      expect(z).toContain(`--z-index-${name}: ${token.value};`);
    }

    const bp = readTokenCss("breakpoints/primitives.css");
    for (const b of Object.values(breakpoints)) {
      expect(bp).toContain(`${b.cssVar}: ${b.minWidthRem};`);
    }
  });

  it("emits typography size steps, aliases, and semantic utilities", () => {
    const prim = readTokenCss("typography/primitives.css");
    for (const name of Object.keys(fontSizes)) {
      expect(prim).toContain(`--text-${name}:`);
      expect(prim).toContain(`--text-${name}--line-height:`);
    }
    for (const alias of Object.keys(fontSizeAliases)) {
      expect(prim).toContain(`--text-${alias}:`);
    }

    const sem = readTokenCss("typography/semantic.css");
    for (const style of textStyles) {
      expect(sem).toContain(`@utility text-${style.name}`);
    }
  });

  it("keeps hand-authored token CSS free of the AUTO-GENERATED banner", () => {
    for (const rel of HAND_AUTHORED_CSS) {
      expect(readTokenCss(rel), rel).not.toMatch(/AUTO-GENERATED/);
    }
  });

  it("does not leave unknown token CSS files among known outputs", () => {
    // Guard: every .css under tokens/ must be either codegen output or a
    // declared hand-authored file (styles/index.css lives outside tokens/).
    function walk(dir: string, acc: string[] = []): string[] {
      for (const name of readdirSync(dir)) {
        const abs = join(dir, name);
        if (statSync(abs).isDirectory()) walk(abs, acc);
        else if (name.endsWith(".css")) {
          acc.push(abs.slice(tokensRoot.length + 1).replace(/\\/g, "/"));
        }
      }
      return acc;
    }

    const onDisk = walk(tokensRoot).sort();
    expect(onDisk).toEqual([...GENERATED_CSS, ...HAND_AUTHORED_CSS].sort());
  });
});
