# @design-system/ui

React + TypeScript design system for a **Dev tool SaaS** — tokens, utilities, and components built with **Tailwind CSS v4** and **Radix Colors**.

- **JIT source** — apps import raw `.ts`/`.tsx` (no package `dist` build)
- **Per-component `exports`** — no root barrel (`@design-system/ui/Button`, not `@design-system/ui`)
- **Semantic token CSS** (color, type, shadow, z-index, breakpoints)
- **Light / dark** via `.dark` / `data-theme`
- **Storybook** for foundations documentation

Package name: `@design-system/ui` (private workspace package)

---

## Installation

This package is consumed only via the monorepo workspace. From the repo root:

```bash
pnpm install
```

No design-system library build step. In an app under `apps/`:

```json
// apps/web/package.json (example)
{
  "dependencies": {
    "@design-system/ui": "workspace:*",
    "class-variance-authority": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

| Peer                       | Source     |
| -------------------------- | ---------- |
| `react` / `react-dom`      | `catalog:` |
| `class-variance-authority` | `catalog:` |

### Public subpaths

| Import                         | Path                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `@design-system/ui/Button`     | Component public API (`src/components/Button/index.ts`) |
| `@design-system/ui/tokens`     | Token metadata + helpers                                |
| `@design-system/ui/cn`         | Classname merger                                        |
| `@design-system/ui/styles.css` | Tailwind entry + token CSS (source)                     |

Deep imports into component internals are blocked by `exports` (and eslint inside the package).

### Consumer obligations (ADR-001) — summary

Full contract: **[`docs/consuming-design-system.md`](../../docs/consuming-design-system.md)** · scaffold checklist: **[`apps/README.md`](../../apps/README.md)**

| Obligation            | Example                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Transpile DS source   | Next `transpilePackages: ["@design-system/ui"]`; Vite usually OK (+ `ssr.noExternal` if SSR)            |
| Test runner whitelist | Vitest `server.deps.inline: ["@design-system/ui"]` — silent CI failure if missed                        |
| TypeScript            | Extend root `tsconfig.json` (`moduleResolution: "bundler"`) — typechecks DS **source**                  |
| Styles                | Import `@design-system/ui/styles.css` once; process with Tailwind v4; `@source` app + `packages/ui/src` |
| Peers                 | `react`, `react-dom`, `class-variance-authority` via `catalog:`                                         |
| `sideEffects`         | Package declares `["**/*.css"]` so style imports are kept                                               |

---

## Quick start

### 1. Import styles once at the app root

Styles are **opt-in** and separate from JS. `styles.css` is **source** (not a prebuilt bundle) — process it with Tailwind v4 in the app (Vite plugin / PostCSS).

**Vite + React**

```tsx
// src/main.tsx
import "@design-system/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Next.js (App Router)**

```tsx
// app/layout.tsx
import "@design-system/ui/styles.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-bg-canvas text-fg-default min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 2. Import components and utilities by subpath

```tsx
// src/App.tsx
import { Button } from "@design-system/ui/Button";
import { cn } from "@design-system/ui/cn";
import { breakpoints, resolveBreakpoint } from "@design-system/ui/tokens";

export function App() {
  return (
    <div className="bg-bg-canvas text-fg-default min-h-screen">
      <header className="z-sticky border-border-default bg-bg-surface/95 sticky top-0 border-b shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-heading-sm text-fg-default">Deployments</h1>
          <Button color="primary" size="md">
            New deploy
          </Button>
        </div>
      </header>

      <main className="tablet:grid-cols-2 desktop:grid-cols-3 mx-auto grid max-w-5xl gap-4 p-4">
        <article className="border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm">
          <p className="text-label-md text-fg-muted">Production</p>
          <p className="text-metric-sm text-fg-default mt-1">99.98%</p>
          <p className={cn("text-body-sm text-success-text mt-2")}>
            All systems healthy ({breakpoints.tablet}px+)
          </p>
        </article>
      </main>
    </div>
  );
}
```

### 3. Enable dark mode

Add the `dark` class (or `data-theme="dark"`) on a root element—usually `<html>`:

```tsx
// Toggle example
function ThemeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    // optional mirror for scoped theming:
    document.documentElement.dataset.theme =
      document.documentElement.classList.contains("dark") ? "dark" : "light";
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-label-md text-accent-text"
    >
      Toggle theme
    </button>
  );
}
```

```html
<!-- SSR / static default -->
<html class="light" data-theme="light">
  <!-- or -->
  <html class="dark" data-theme="dark"></html>
</html>
```

Nested islands are supported: a `.light` region can sit inside a dark app and re-assert light tokens.

---

## Configuration notes

Canonical, copy-pasteable configs live in **[`docs/consuming-design-system.md`](../../docs/consuming-design-system.md)**. Short form below.

### Styles & Tailwind v4

`styles.css` is **source** (Tailwind entry + Radix + generated tokens). No prebuilt CSS bundle.

```css
/* apps/<name>/src/index.css */
@import "@design-system/ui/styles.css";

@source "./**/*.{ts,tsx}";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

| Goal                                | What to do                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Use DS components + token utilities | Import the CSS above; run Tailwind v4 in the **app** (`@tailwindcss/vite` or `@tailwindcss/postcss`) |
| App-only custom utilities           | Same pipeline; add classes in the app — still `@source` both trees                                   |
| Skip scanning DS `src`              | **Don’t** — component `className`s live in the package; utilities won’t emit                         |

### TypeScript

Extend monorepo root `tsconfig.json` (`moduleResolution: "bundler"`, `module: "preserve"`, `verbatimModuleSyntax: true`).

### Next.js

```js
// next.config.mjs
export default {
  transpilePackages: ["@design-system/ui"],
};
```

- Import CSS only from the root layout / `_app` (via your `globals.css` that `@import`s the DS entry).
- `suppressHydrationWarning` on `<html>` if you set `class="dark"` before paint.

### Vite

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssr: { noExternal: ["@design-system/ui"] },
});
```

### Vitest (required)

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    server: {
      deps: { inline: ["@design-system/ui"] },
    },
  },
});
```

### Tree-shaking / import style

```tsx
// ✅ Per-component / fixed subpaths
import { Button } from "@design-system/ui/Button";
import { cn } from "@design-system/ui/cn";
import { breakpoints } from "@design-system/ui/tokens";
import "@design-system/ui/styles.css";

// ❌ No root barrel
import { Button } from "@design-system/ui";
// ❌ No deep internals
import { Button } from "@design-system/ui/src/components/Button/Button";
```

`sideEffects` is `["**/*.css"]` so pure JS can be eliminated by the consumer bundler; CSS side-effect imports are kept.

---

## Using the JS API

```tsx
import { cn } from "@design-system/ui/cn";
import {
  breakpoints,
  fontFamilies,
  palette,
  resolveBreakpoint,
  semanticColorTokens,
  shadowTokens,
  textStyles,
  zIndexTokens,
} from "@design-system/ui/tokens";

const className = cn(
  "rounded-md bg-bg-surface p-4",
  "tablet:p-6",
  condition && "shadow-md",
);

const tier = resolveBreakpoint(window.innerWidth); // 'mobile' | 'tablet' | 'desktop'

console.log(shadowTokens.sm.utility); // "shadow-sm"
console.log(zIndexTokens.modal.value); // 400
```

---

## Design tokens (reference)

### Color

Prefer **semantic** utilities:

| Category   | Examples                                                         |
| ---------- | ---------------------------------------------------------------- |
| Background | `bg-bg-canvas`, `bg-bg-subtle`, `bg-bg-surface`, `bg-bg-inverse` |
| Foreground | `text-fg-default`, `text-fg-muted`, `text-fg-on-accent`          |
| Border     | `border-border-default`, `border-border-muted`                   |
| Accent     | `bg-accent-solid`, `text-accent-text`, `bg-accent-subtle`        |
| Status     | `bg-success-solid`, `text-warning-text`, `bg-danger-subtle`      |
| Focus      | `ring-focus-ring`, `shadow-focus`                                |

Primitives (when needed): `bg-gray-1`…`12`, `bg-brand-9`, `text-green-11`, …

Palette: **gray**←slate · **brand**←indigo · green · amber · red · blue.

### Typography

| Style    | Example class                                                 |
| -------- | ------------------------------------------------------------- |
| Headings | `text-heading-xl` … `text-heading-xs`                         |
| Body     | `text-body-lg`, `text-body-md` (default 14px), `text-body-sm` |
| Labels   | `text-label-lg`, `text-label-md`, `text-label-overline`       |
| Code     | `text-code-md`, `text-code-sm`, `text-code-block`             |
| Metrics  | `text-metric-lg`, `text-metric-md`, `text-metric-sm`          |

Families: `font-sans` (Inter) · `font-mono` (JetBrains Mono).

### Breakpoints (mobile-first)

| Tier    | Min width | Variant              |
| ------- | --------- | -------------------- |
| mobile  | 0         | _(base — no prefix)_ |
| tablet  | 768px     | `tablet:`            |
| desktop | 1024px    | `desktop:`           |

Default Tailwind `sm` / `md` / `lg` screens are **replaced** by these names in the shipped CSS.

```tsx
<div className="tablet:flex-row desktop:gap-8 flex flex-col gap-4">
  <aside className="desktop:block hidden">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Z-index

| Token    | Value | Class        |
| -------- | ----- | ------------ |
| base     | 0     | `z-base`     |
| raised   | 10    | `z-raised`   |
| dropdown | 100   | `z-dropdown` |
| sticky   | 200   | `z-sticky`   |
| overlay  | 300   | `z-overlay`  |
| modal    | 400   | `z-modal`    |
| toast    | 500   | `z-toast`    |
| tooltip  | 600   | `z-tooltip`  |

### Shadows

| Direction | Classes                                         | Use                           |
| --------- | ----------------------------------------------- | ----------------------------- |
| Down      | `shadow-xs` … `shadow-xl`                       | Cards, menus, modals          |
| Up (top)  | `shadow-top-xs` … `shadow-top-lg`               | Bottom sheets, sticky footers |
| Special   | `shadow-inner`, `shadow-border`, `shadow-focus` | Wells, outline, focus         |

```tsx
<div className="rounded-lg border border-border-default bg-bg-surface shadow-sm">Card</div>
<div className="fixed inset-x-0 bottom-0 z-modal shadow-top-md">Bottom sheet</div>
```

---

## Developing this package

From the **monorepo root**:

```bash
pnpm install
pnpm storybook    # http://localhost:6006 — foundations docs
pnpm typecheck
pnpm test
pnpm build-storybook
```

Or scoped to this package:

```bash
pnpm --filter @design-system/ui storybook
pnpm --filter @design-system/ui test
```

| Command                               | Description                                                      |
| ------------------------------------- | ---------------------------------------------------------------- |
| `pnpm tokens:generate`                | Generate token CSS from TypeScript sources                       |
| `pnpm tokens:check`                   | Fail if generated CSS is stale (CI-friendly)                     |
| `pnpm exports:generate`               | Regenerate `package.json` `exports` from components              |
| `pnpm exports:check`                  | Fail if `exports` are stale                                      |
| `pnpm test`                           | Vitest unit project (jsdom/node) — default CI                    |
| `pnpm test:unit`                      | Same as `test` (explicit)                                        |
| `pnpm test:storybook`                 | Storybook + axe in light **and** dark (ADR-003 L1; on-demand CI) |
| `pnpm test:storybook:light` / `:dark` | One color mode only                                              |
| `pnpm test:watch`                     | Vitest watch mode                                                |
| `pnpm storybook`                      | Generate tokens/exports + Storybook dev server                   |
| `pnpm build-storybook`                | Generate tokens/exports + static Storybook                       |
| `pnpm typecheck`                      | TypeScript only (no emit / no lib build)                         |

There is **no** package `dev` script — Storybook is opt-in via `pnpm storybook` (root or filter). App `pnpm dev` does not start Storybook.

### Tokens (TypeScript is the source of truth)

Edit **only** the `.ts` modules under `src/tokens/`. CSS under those folders is **generated** — do not hand-edit it.

```bash
# after changing any token .ts file
pnpm tokens:generate
```

`storybook` / `build-storybook` run `tokens:generate` and `exports:generate` first.  
App `dev` / `build` (via Turbo) also run those tasks on this package as upstream deps.

### Public exports

Adding a component is deliberate: create `src/components/<Name>/index.ts`, then run `pnpm exports:generate` (pre-commit does this when `index.ts` changes). Do not hand-edit the `exports` field.

### Project layout

```
packages/ui/
  scripts/
    generate-tokens.mts      # TS → CSS codegen
    gen-exports.mts          # components → package.json exports
  src/
    components/Button/       # index.ts public; Button.tsx internal
    tokens/                  # index.ts public; categories underneath
    styles/                  # Tailwind entry (hand-written) + token CSS imports
    utils/cn.ts              # public via @design-system/ui/cn
  stories/
    foundations/             # Storybook stories
  .storybook/
  vite.config.ts             # Storybook only (no lib dist build)
```

### TypeScript (package)

This package extends the monorepo root config (`moduleResolution: "bundler"`, `module: "preserve"`, `verbatimModuleSyntax: true` — ADR-001):

| File                  | Role                                                                    |
| --------------------- | ----------------------------------------------------------------------- |
| `../../tsconfig.json` | Shared strict options + exports-aware resolution (empty root project)   |
| `tsconfig.json`       | Single project config: `src/`, stories, Storybook, Vite/Vitest, scripts |

```bash
pnpm typecheck   # tsc --noEmit -p tsconfig.json
```

### Stack (maintainers)

- pnpm workspaces · TypeScript 6 · React 19 · Tailwind CSS v4 · Vite 8 · Storybook 10 · Radix Colors

---

## License

Private / unpublished unless otherwise specified.
