# Consuming `@design-system/ui` (JIT contract)

ADR-001 Decision B: the design system ships **raw TypeScript/CSS source**. Apps transpile and typecheck that source; there is **no package `dist` build**.

This document is the contract every app under `apps/*` must satisfy. Copy the checklist in [`apps/README.md`](../apps/README.md) when scaffolding a new app.

---

## 1. Dependencies

```json
{
  "dependencies": {
    "@design-system/ui": "workspace:*",
    "class-variance-authority": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

| Requirement      | Why                                                                          |
| ---------------- | ---------------------------------------------------------------------------- |
| `workspace:*`    | Same monorepo; no registry publish                                           |
| `catalog:` peers | One React / CVA version across DS + apps (avoids duplicate-React hooks bugs) |
| App owns React   | DS lists them as **peer** dependencies only                                  |

---

## 2. Public imports only

```ts
import { Button } from "@design-system/ui/Button";
import { cn } from "@design-system/ui/cn";
import "@design-system/ui/styles.css";
import { breakpoints } from "@design-system/ui/tokens";
```

| Allowed                         | Forbidden                                    |
| ------------------------------- | -------------------------------------------- |
| `@design-system/ui/<Component>` | `@design-system/ui` (no root barrel)         |
| `@design-system/ui/tokens`      | `@design-system/ui/src/...`                  |
| `@design-system/ui/cn`          | `@design-system/ui/components/Button/Button` |
| `@design-system/ui/styles.css`  | Deep paths into token CSS internals          |

`package.json` `exports` + root `moduleResolution: "bundler"` make forbidden paths fail at resolve / `tsc`.

---

## 3. TypeScript

Extend the monorepo root config (ADR-001 Decision D):

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

Consequences:

- The app typechecks **DS source**. A DS type error fails the app’s `typecheck`.
- Keep `moduleResolution: "bundler"` (from root) so `exports` are enforced.
- Do not point paths at `packages/ui/src` manually — use package subpaths.

---

## 4. Transpile the package (bundler)

Modern bundlers must compile the workspace package’s `.ts`/`.tsx`. Next does **not** transpile `node_modules` / workspace packages by default.

### Next.js

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@design-system/ui"],
};

export default nextConfig;
```

### Vite

Vite already transforms linked workspace source when imported. Prefer explicit SSR/noExternal if you SSR:

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssr: {
    // ensure DS is bundled/transformed under SSR, not treated as external CJS
    noExternal: ["@design-system/ui"],
  },
});
```

### Other bundlers

Equivalent of “include this package in the app transform pipeline” is required. Plain Node / `ts-node` without a bundler is **out of scope** (ADR revisit trigger).

---

## 5. Test runner whitelist (silent CI-red trap)

Test runners often refuse to transform `node_modules`. Workspace packages resolve under `node_modules/@design-system/ui` and hit the same trap.

### Vitest

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    server: {
      deps: {
        // transpile JIT DS source inside tests
        inline: ["@design-system/ui"],
      },
    },
  },
});
```

If you use Vite SSR options instead / as well:

```ts
export default defineConfig({
  ssr: {
    noExternal: ["@design-system/ui"],
  },
});
```

### Jest

```js
// jest.config.js
module.exports = {
  // do NOT ignore the DS package
  transformIgnorePatterns: ["/node_modules/(?!(@design-system/ui)/)"],
};
```

Symptom if missing: syntax errors on `import type`, JSX, or TS in CI only when tests import DS components.

---

## 6. Styles & Tailwind v4

### Decision (this monorepo)

1. **Import the DS stylesheet** once at the app root: `@design-system/ui/styles.css`.
2. That file is the **source** Tailwind entry (`@import "tailwindcss"`, Radix scales, generated token layers). There is **no** prebuilt `dist/design-system.css`.
3. Process it with **Tailwind CSS v4** in the app (`@tailwindcss/vite` or `@tailwindcss/postcss`).
4. **Register content sources** so class names used inside DS components (and the app) are detected:

```css
/* apps/<name>/src/index.css (or app/globals.css) */
@import "@design-system/ui/styles.css";

/* App sources */
@source "./**/*.{ts,tsx}";

/* Design-system components / stories not required for prod — scan package src */
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

Adjust the relative `@source` path to match the app folder depth (`apps/web` → `../../../packages/ui/src/...`).

| Do                                                                                              | Don’t                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| One root CSS import of `@design-system/ui/styles.css`                                           | Import CSS from every component file                                          |
| Let the **app** own Tailwind/PostCSS plugins                                                    | Expect a compiled CSS file from the DS package                                |
| `@source` the DS `src` tree                                                                     | Assume scanning only `apps/**` is enough (Button classes live in the package) |
| Add a second bare `@import "tailwindcss"` in the app **unless** you intentionally own the entry | Double-entry without understanding cascade/layers                             |

`sideEffects: ["**/*.css"]` on the package ensures CSS imports are not tree-shaken away.

### Vite app entry

```tsx
// src/main.tsx
// which @imports the DS styles + @source
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### Next.js App Router

```tsx
// app/layout.tsx
// @import "@design-system/ui/styles.css" + @source
import type { ReactNode } from "react";

import "./globals.css";

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

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## 7. HMR / dev loop

Because apps compile DS source:

- Edits under `packages/ui/src` should hot-reload in the app (bundler dependent).
- Token **CSS** still comes from codegen: after editing token `.ts` files run `pnpm tokens:generate` (or rely on pre-commit). Stale generated CSS is a product bug, not a bundler issue. CI should run `pnpm tokens:check`.

---

## 8. What the DS does _not_ do for you

| Not provided         | App responsibility               |
| -------------------- | -------------------------------- |
| `dist/` JS build     | Transpile via bundler            |
| Prebuilt CSS bundle  | Tailwind v4 pipeline + `@source` |
| Root barrel export   | Per-component / fixed subpaths   |
| Own React copy       | `catalog:` peers                 |
| Non-bundler runtimes | Out of scope (new ADR if needed) |

---

## 9. Quick verification checklist

After wiring an app:

- [ ] `pnpm typecheck` — app + DS source clean; deep import fails if you try one
- [ ] App dev server renders `<Button />` with correct styles
- [ ] Edit `packages/ui/src/components/Button/Button.tsx` → HMR updates the app
- [ ] App test file importing `@design-system/ui/Button` passes in CI
- [ ] `pnpm tokens:check` and `pnpm exports:check` still green at repo root

See also: [ADR-001](./adr/adr_2026-07-08_001.md), [`packages/ui/README.md`](../packages/ui/README.md).
