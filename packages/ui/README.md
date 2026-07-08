# @design-system/ui

React + TypeScript design system for a **Dev tool SaaS** — tokens, utilities, and helpers built with **Tailwind CSS v4** and **Radix Colors**.

- **ESM-first**, tree-shakeable JS API
- **Compiled stylesheet** with semantic tokens (color, type, shadow, z-index, breakpoints)
- **Light / dark** via `.dark` / `data-theme`
- **Storybook** for foundations documentation

Package name: `@design-system/ui`

---

## Installation

This package is consumed only via the monorepo workspace. From the repo root:

```bash
pnpm install
pnpm build
```

In an app under `apps/`, depend on it with:

```json
{
  "dependencies": {
    "@design-system/ui": "workspace:*"
  }
}
```

The app must also provide these **peer dependencies** (same idea as React — one shared install for app + design system):

| Peer                       | Version    |
| -------------------------- | ---------- |
| `react` / `react-dom`      | ^18 or ^19 |
| `class-variance-authority` | ^0.7       |

```json
// apps/web/package.json (example)
{
  "dependencies": {
    "@design-system/ui": "workspace:*",
    "class-variance-authority": "^0.7.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

Use `cn` from this package for class merging. For variants, import `cva` / `VariantProps` from the app’s `class-variance-authority` peer (same pattern as importing `react` directly).

---

## Quick start

### 1. Import styles once at the app root

Styles are **opt-in** and separate from JS so unused modules can be tree-shaken.

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

**Next.js (Pages Router)**

```tsx
// pages/_app.tsx
import "@design-system/ui/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### 2. Use tokens in UI

The stylesheet ships **ready-to-use utility classes** (semantic colors, type styles, shadows, z-index, breakpoints). You do **not** need to reconfigure Tailwind in the app just to use these classes—importing `styles.css` is enough.

```tsx
// src/App.tsx
import { breakpoints, cn, resolveBreakpoint } from "@design-system/ui";

export function App() {
  return (
    <div className="bg-bg-canvas text-fg-default min-h-screen">
      <header className="z-sticky border-border-default bg-bg-surface/95 sticky top-0 border-b shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-heading-sm text-fg-default">Deployments</h1>
          <button
            type="button"
            className={cn(
              "bg-accent-solid rounded-md px-3 py-1.5",
              "text-label-lg text-fg-on-accent shadow-sm",
              "hover:bg-accent-solid-hover",
              "focus-visible:shadow-focus",
            )}
          >
            New deploy
          </button>
        </div>
      </header>

      <main className="tablet:grid-cols-2 desktop:grid-cols-3 mx-auto grid max-w-5xl gap-4 p-4">
        <article className="border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm">
          <p className="text-label-md text-fg-muted">Production</p>
          <p className="text-metric-sm text-fg-default mt-1">99.98%</p>
          <p className="text-body-sm text-success-text mt-2">
            All systems healthy
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

### Do I need Tailwind in the consuming app?

| Goal                                                                                 | What to do                                                                                                  |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Use design-system utilities only (`bg-bg-canvas`, `text-heading-lg`, `shadow-md`, …) | Import `@design-system/ui/styles.css` — **no app Tailwind required**                                        |
| Also write custom Tailwind in the app                                                | Install Tailwind in the app as usual; **still import** the design-system stylesheet for DS tokens/utilities |

The package ships a **precompiled** CSS bundle. App-level Tailwind does not need to scan this package for those utilities to work.

### TypeScript

Types ship with the package (`dist/index.d.ts`). Ensure the app uses a modern `moduleResolution` (e.g. `bundler` or `node16`+):

```json
// tsconfig.json (app)
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true
  }
}
```

### Vite (consuming app)

No special `optimizeDeps` is required for the CSS path. For linked workspace packages you may want:

```ts
// vite.config.ts (app)
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // allow importing a linked local package outside app root if needed
      allow: [".."],
    },
  },
});
```

### Next.js

- Import CSS only from the root layout / `_app` (not inside client components repeatedly).
- Use `suppressHydrationWarning` on `<html>` if you set `class="dark"` from a client script before paint.

### Tree-shaking

```tsx
// ✅ Named imports — unused token modules can be dropped by the app bundler
import { breakpoints, cn } from "@design-system/ui";
// ❌ Don't rely on the root JS entry to inject CSS (it won't)
import "@design-system/ui";
// ✅ Styles only when you need them
import "@design-system/ui/styles.css";
```

- Package is **ESM-first** with `preserveModules` output.
- `sideEffects` lists **CSS only** so pure JS can be eliminated.
- Prefer `import` over CJS `require` for best shaking.

---

## Using the JS API

```tsx
import {
  // layout
  breakpoints,
  cn,
  fontFamilies,
  palette,
  resolveBreakpoint,
  // color system metadata
  semanticColorTokens,
  // elevation / stacking (token metadata)
  shadowTokens,
  // typography metadata
  textStyles,
  zIndexTokens,
} from "@design-system/ui";

// Classnames
const className = cn(
  "rounded-md bg-bg-surface p-4",
  "tablet:p-6",
  condition && "shadow-md",
);

// Runtime breakpoint helper (e.g. analytics / layout logic)
const tier = resolveBreakpoint(window.innerWidth); // 'mobile' | 'tablet' | 'desktop'

// Inspect token metadata (docs, theme tooling, Storybook-style UIs)
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
pnpm build        # tokens → JS (tree-shakeable) + design-system.css
pnpm typecheck
pnpm build-storybook
```

Or scoped to this package:

```bash
pnpm --filter @design-system/ui storybook
pnpm --filter @design-system/ui build
```

| Command                       | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `pnpm tokens:generate`        | Generate token CSS from TypeScript sources   |
| `pnpm tokens:check`           | Fail if generated CSS is stale (CI-friendly) |
| `pnpm test`                   | Run Vitest (token catalog + codegen)         |
| `pnpm test:watch`             | Vitest watch mode                            |
| `pnpm dev` / `pnpm storybook` | Generate tokens + Storybook dev server       |
| `pnpm build`                  | Generate tokens + `tsc` + Vite lib + styles  |
| `pnpm build-storybook`        | Generate tokens + static Storybook           |
| `pnpm typecheck`              | TypeScript only                              |

### Tokens (TypeScript is the source of truth)

Edit **only** the `.ts` modules under `src/tokens/`. CSS under those folders is **generated** — do not hand-edit it.

```bash
# after changing any token .ts file
pnpm tokens:generate
```

`build`, `storybook`, and `dev` run `tokens:generate` automatically.

Hand-written CSS that is **not** generated:

- `src/styles/index.css` — Tailwind entry, Radix imports, base layer, radius

### Project layout

```
packages/ui/
  scripts/
    generate-tokens.mts      # TS → CSS codegen
  src/
    tokens/colors/           # palette / modes / semantic (*.ts source, *.css generated)
    tokens/typography/       # families / scales / text styles
    tokens/breakpoints/      # mobile / tablet / desktop
    tokens/z-index/          # semantic stacking layers
    tokens/shadows/          # elevation + top shadows
    styles/                  # Tailwind entry (hand-written) + token CSS imports
    lib/                     # cn helper
    index.ts                 # public JS API (no CSS side effects)
  stories/
    foundations/             # Storybook stories
  .storybook/
  vite.config.ts             # lib | styles | storybook modes
```

### TypeScript (package)

This package extends the monorepo base config:

| File                       | Role                                                                    |
| -------------------------- | ----------------------------------------------------------------------- |
| `../../tsconfig.base.json` | Shared strict compiler options                                          |
| `tsconfig.json`            | Single project config: `src/`, stories, Storybook, Vite/Vitest, scripts |

```bash
pnpm typecheck   # tsc --noEmit -p tsconfig.json
```

### Stack (maintainers)

- pnpm workspaces · TypeScript 6 · React 19 · Tailwind CSS v4 · Vite 8 · Storybook 10 · Radix Colors

---

## License

Private / unpublished unless otherwise specified.
