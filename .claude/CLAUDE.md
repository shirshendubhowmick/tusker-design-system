# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

pnpm + Turborepo monorepo (Node ≥ 24, pnpm ≥ 11) for a design system targeting a Dev tool SaaS.
The only package so far is `packages/ui` (**`@design-system/ui`** — React 19 via `catalog:`, Tailwind v4, Radix Colors, Storybook 10). `apps/` is reserved for consuming applications (none yet).

Shared peers (`react`, `react-dom`, `class-variance-authority`) are pinned in `pnpm-workspace.yaml` `catalog:` — bump there, not per package.

## Commands

Orchestrated tasks go through **Turborepo** (`turbo.json`). Package-local scripts use `pnpm --filter`:

```bash
pnpm install               # install workspace deps
pnpm dev                   # turbo run dev → Storybook on :6006
pnpm build                 # turbo run build (package graph + cache)
pnpm test                  # turbo run test
pnpm typecheck             # turbo run typecheck
pnpm lint / lint:fix       # eslint from root (monorepo-wide)
pnpm tokens:generate       # regenerate CSS token files from TS sources
pnpm tokens:check          # verify generated CSS matches TS (CI-style drift check)
```

Single test (run from `packages/ui/`):

```bash
pnpm vitest run src/lib/cn.test.ts        # one file
pnpm vitest run -t "applies variant"      # by test name
pnpm test:watch                            # watch mode
```

Scripts run TypeScript directly with `node --experimental-strip-types` (no build step for `scripts/*.mts`).

Husky + lint-staged run prettier/eslint on commit and **auto-regenerate token CSS** when files under `packages/ui/src/tokens/**` or the generator script change.

## Architecture: token pipeline (the core thing to understand)

TypeScript modules under `packages/ui/src/tokens/**` are the **single source of truth**. `scripts/generate-tokens.mts` generates all `*.css` files under `src/tokens/` (they carry an `AUTO-GENERATED` banner — never hand-edit; run `pnpm tokens:generate` after editing token TS).

**Exception:** `src/tokens/colors/blue.css` is hand-authored (see below). `scripts/generate-tokens.test.ts` enforces that every CSS file under `src/tokens/` is either a declared codegen output (`GENERATED_CSS`) or a declared hand-authored file (`HAND_AUTHORED_CSS`) — new files must be added to one of those lists.

### Color system: three layers

1. **Palette selection** (`src/tokens/colors/palette.ts`) — maps product palette names to Radix scale names:
   `gray→slate` (neutral), `brand→blue` (custom navy), `green` (success), `amber` (warning), `red` (danger), `cyan` (info). Rebranding = change the Radix source here + the CSS imports in `src/styles/index.css`, then regenerate.
2. **Primitives** (generated `primitives.css`) — registers `--color-<palette>-<1..12>` and alpha `-a<step>` with Tailwind `@theme`, giving utilities like `bg-brand-9`, `bg-gray-a3`.
3. **Semantic tokens** (`semantic.ts` → generated `semantic.css` / `semantic-dark.css`) — every token has explicit light and dark primitive refs (`bg-canvas`, `fg-default`, `accent-solid`, `focus-ring`, …). **Components must use semantic utilities (`bg-accent-solid`, `text-fg-muted`), never raw palette steps.**

Radix step roles apply to every scale: 1–2 app backgrounds, 3–5 component surfaces, 6–8 borders/focus, 9–10 solid fills (9 default, 10 hover), 11–12 text.

### Brand color is a custom scale, not an npm Radix scale

`src/tokens/colors/blue.css` is a custom navy scale seeded from `#0D5BD8`, produced with the Radix custom-palette algorithm (parameters documented in the file header: gray `#8B8D98`, light bg `#FFFFFF`, dark bg `#111111`). It contains light + dark + alpha + P3 wide-gamut blocks. To change the brand color, regenerate **both appearances** at radix-ui.com/colors/custom (or rerun the algorithm from `radix-ui/website` `components/generate-radix-colors.tsx`) and replace the whole file — the variables must stay named `--blue-*`.

Deliberate hue decisions: brand hue ≈ 260° OKLCH (lower angles read "pure blue"; ≥ 264° reads purple). Info uses **cyan** (not Radix blue) so info UI never resembles brand CTAs; `sky` was rejected because its step-9 solid needs dark text while `fg-on-info` is white.

### Dark mode

Class/attribute based, no media query: `html.dark`, `.dark`, `.dark-theme`, `[data-theme='dark']`. The selector lists live **only** in `src/tokens/colors/modes.ts` and are shared by codegen. Generated `semantic-dark.css` re-declares both primitive and semantic vars per mode scope.

### Tailwind v4 specifics

- CSS-first config via `@theme` in generated files; no `tailwind.config.js`. Entry: `src/styles/index.css` (imports Radix scale CSS, then generated token layers).
- Shadows intentionally use `@utility` + live CSS variables instead of `@theme --shadow-*`, because Tailwind v4 bakes `@theme` shadow values into utilities, which would break dark-mode overrides.
- Default Tailwind breakpoint and shadow scales are cleared (`--breakpoint-*: initial`) and replaced with product tokens.

### Package build/output

`vite build` produces the JS lib (ESM + CJS + d.ts); `vite build --mode styles` produces `dist/design-system.css`, exported as `@design-system/ui/styles.css`. `react`, `react-dom`, and `class-variance-authority` are peer dependencies.

### Components & stories

Components live in `src/components/<Name>/` (cva variants, `cn` util = tailwind-merge), with colocated vitest + testing-library tests (jsdom). Storybook docs in `stories/foundations/` (Colors, Typography, Shadows, Breakpoints, ZIndex) and `stories/components/`; theme is switched via the Storybook toolbar globals.
