# Apps

Consuming applications for `@design-system/ui`. Workspace glob: `apps/*` (see root `pnpm-workspace.yaml`).

The design system is **JIT** (ADR-001): apps import package **source** via subpath `exports`. Full contract:

→ **[docs/consuming-design-system.md](../docs/consuming-design-system.md)**

---

## Packages

| App             | Package              | Role                                                |
| --------------- | -------------------- | --------------------------------------------------- |
| [`web/`](./web) | `@design-system/web` | Minimal Vite + React consumer proving JIT (Phase 5) |

```bash
# from monorepo root
pnpm --filter @design-system/web dev      # http://localhost:5173
pnpm --filter @design-system/web build
pnpm --filter @design-system/web test
pnpm --filter @design-system/web typecheck
```

Or via Turbo (packages that define the script):

```bash
pnpm dev          # app dev servers only (Storybook is NOT included)
pnpm storybook    # explicit: @design-system/ui Storybook
pnpm build        # apps only (DS has no build); runs token/export codegen first
pnpm typecheck
pnpm test
```

`turbo` `dev` / `build` for apps depend on the design system’s `tokens:generate` and `exports:generate` (via `dependsOn: ["^…"]`), so generated CSS and package `exports` are fresh before the app starts or ships.

---

## Scaffold checklist

When adding `apps/<name>`:

### 1. Package

```json
{
  "name": "@design-system/<name>",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "…",
    "build": "…",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "@design-system/ui": "workspace:*",
    "class-variance-authority": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

Turbo picks up `build` / `dev` / `typecheck` / `test` when those scripts exist (`turbo.json`). The UI package has **no** `build` script.

### 2. TypeScript

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "noEmit": true
  },
  "include": ["src"]
}
```

### 3. Bundler — transpile DS source

| Stack   | Required setting                                                       |
| ------- | ---------------------------------------------------------------------- |
| Next.js | `transpilePackages: ["@design-system/ui"]`                             |
| Vite    | usually OK; set `ssr.noExternal: ["@design-system/ui"]` if SSR         |
| Vitest  | `test.server.deps.inline: ["@design-system/ui"]` (or `ssr.noExternal`) |
| Jest    | Do not ignore `@design-system/ui` in `transformIgnorePatterns`         |

### 4. Styles (Tailwind v4)

```css
/* src/index.css or app/globals.css */
@import "@design-system/ui/styles.css";

@source "./**/*.{ts,tsx}";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

Wire Tailwind in the app (`@tailwindcss/vite` or `@tailwindcss/postcss`). Import that CSS once at the app root.

### 5. Use subpath imports

```ts
import { Button } from "@design-system/ui/Button";
import { cn } from "@design-system/ui/cn";
import { breakpoints } from "@design-system/ui/tokens";
```

### 6. Install & verify

```bash
# from monorepo root
pnpm install
pnpm typecheck
pnpm --filter @design-system/<name> dev
pnpm --filter @design-system/<name> test
```

---

## Layout

```
apps/
  README.md
  web/                 # @design-system/web — reference JIT consumer
    package.json
    tsconfig.json      # extends ../../tsconfig.json
    vite.config.ts
    vitest.config.ts
    index.html
    src/
```

Reference implementation: **`apps/web`** (Vite + React 19 + Tailwind v4).
