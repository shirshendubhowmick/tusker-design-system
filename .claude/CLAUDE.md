# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

pnpm + Turborepo monorepo (Node ≥ 24, pnpm ≥ 11) for a design system targeting a Dev tool SaaS.
Packages: `packages/ui` (**`@design-system/ui`** — React 19 via `catalog:`, Tailwind v4, Radix Colors, Storybook 10). Reference consumer: `apps/web` (**`@design-system/web`** — Vite JIT app proving ADR-001).

Shared peers (`react`, `react-dom`, `class-variance-authority`) are pinned in `pnpm-workspace.yaml` `catalog:` — bump there, not per package.

Shared TS config (root `tsconfig.json`, ADR-001 Decision D): `moduleResolution: "bundler"`, `module: "preserve"`, `verbatimModuleSyntax: true`. Root file is an empty IDE project; packages/apps extend it and add their own `include`. Use `import type` / `export type` for type-only symbols.

**Architecture decisions live in `docs/adr/`** — ADR-001 (monorepo, JIT, exports), ADR-002 (shared chrome + component authoring rules), ADR-003 (accessibility testing strategy, _proposed_). Read the relevant ADR before changing infra, adding a component, or touching the a11y setup.

## Commands

Orchestrated tasks go through **Turborepo** (`turbo.json`). Package-local scripts use `pnpm --filter`:

```bash
pnpm install               # install workspace deps
pnpm dev                   # turbo run dev → app dev servers only (e.g. apps/web)
pnpm storybook             # Storybook for @design-system/ui (explicit; not via dev)
pnpm build                 # turbo run build — apps only (DS is JIT, no lib build)
pnpm test                  # turbo run test
pnpm typecheck             # turbo run typecheck
pnpm lint / lint:fix       # eslint from root (monorepo-wide)
pnpm tokens:generate       # regenerate CSS token files from TS sources
pnpm tokens:check          # verify generated CSS matches TS (CI-style drift check)
pnpm exports:generate      # regenerate @design-system/ui package.json exports
pnpm exports:check         # verify exports map matches components/*/index.ts
```

CI (`.github/workflows/ci.yml`): frozen install → `tokens:check` → `exports:check` → format → lint → typecheck → test → app `build`. No DS lib build.

**Public API (ADR-001 JIT):** no root barrel. Consumers import subpaths only:

- Components — `@design-system/ui/<Name>` → `src/components/<Name>/index.ts` (per-component: `Button`, `IconButton`, `Input`, `Field`, `Label`, `FormField`, `Text`, `Spinner`, `Badge`)
- Shared recipes (utils) — `@design-system/ui/cn`, `/focus-ring`, `/surface`, `/overlay` → `src/utils/*.ts` (see ADR-002)
- `@design-system/ui/tokens` → `src/tokens/index.ts`
- `@design-system/ui/styles.css` → `src/styles/index.css`

`scripts/gen-exports.mts` owns the `exports` map (run via pre-commit / `exports:check` in CI). Do not hand-edit `exports` in `package.json`. Components must only be reached via their public `index.ts` (eslint `import-x/no-internal-modules` backstop).

### Consuming apps (JIT contract)

Full write-up: `docs/consuming-design-system.md`. Scaffold checklist: `apps/README.md`.

Every app **must**:

1. Depend on `@design-system/ui: workspace:*` + peers via `catalog:`
2. Transpile the package (Next: `transpilePackages`; Vite: usually automatic / `ssr.noExternal`)
3. Whitelist it in the test runner (Vitest `server.deps.inline` — silent CI-red if missed)
4. Import `@design-system/ui/styles.css` once and process with Tailwind v4; `@source` both the app and `packages/ui/src` so component class names emit
5. Extend root `tsconfig.json` (typechecks DS **source**)

Token CSS remains codegen (`tokens:generate` / `tokens:check`); that is not a lib build. Package `sideEffects: ["**/*.css"]` must stay.

Single test (run from `packages/ui/`):

```bash
pnpm vitest run src/utils/cn.test.ts      # one file
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

### Package consumption (JIT — no lib dist)

Apps import **source** via package `exports` (generated by `scripts/gen-exports.mts`). There is no `vite` library build and no root barrel. Vite is Storybook-only. `react`, `react-dom`, and `class-variance-authority` are peer dependencies (`catalog:`).

### Components & stories

Components live in `src/components/<Name>/` (`index.ts` public face, implementation files internal; cva variants, `cn` in `src/utils` = tailwind-merge), with colocated vitest + testing-library tests (jsdom). Storybook docs in `stories/foundations/` (Colors, Typography, Shadows, Breakpoints, ZIndex) and `stories/components/`; theme is switched via the Storybook toolbar globals.

### Component authoring rules (ADR-002 — binding)

Every new component, including future Radix wrappers, follows the shared-chrome contract. Do **not** reinvent these per component:

- **Semantic tokens only** (`bg-accent-solid`, `text-fg-muted`) — never raw palette steps.
- **Focus rings** via `focusRing()` / `focusRingClass` (`@design-system/ui/focus-ring`) — no per-component ring shadows.
- **Floating chrome** (menus, dialogs, popovers) via `surface()` / `overlay()` (`/surface`, `/overlay`) — no ad-hoc panel/scrim classes.
- **Hit targets** use the shared `ControlSize` scale (`sm`/`md`/`lg`) — do not hardcode `h-8`/`h-9`/`h-10`.
- **Radix owns behavior** (keyboard, focus trap, a11y primitives); the DS owns look, tokens, and product API — keep wrappers thin.
- **JIT export** — new public component = `src/components/<Name>/index.ts`, then `pnpm exports:generate` (never hand-edit `exports`).

Code review treats local focus/panel CSS or raw palette steps as drift. Full rationale + what's shipped: `docs/adr/adr_2026-07-11_002.md`.
