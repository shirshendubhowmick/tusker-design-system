# `@design-system/web`

Minimal **Vite + React 19 + Tailwind v4** app that consumes `@design-system/ui` as **JIT source** (ADR-001 Phase 5).

## Purpose

Prove the consumer contract end-to-end:

- Subpath imports (`Button`, `cn`, `tokens`, `styles.css`)
- App typechecks DS **source** (extends monorepo `tsconfig.json`)
- Vite transforms the workspace package
- Vitest inlines `@design-system/ui`
- Tailwind processes `@design-system/ui/styles.css` and `@source`s package `src`
- `pnpm build` runs **only** on this app (UI package has no `build` script)

Full contract: [`docs/consuming-design-system.md`](../../docs/consuming-design-system.md).

## Commands

From monorepo root:

```bash
pnpm dev                                    # turbo: app dev only (not Storybook)
pnpm --filter @design-system/web dev        # same, filtered
pnpm --filter @design-system/web build
pnpm --filter @design-system/web test
pnpm --filter @design-system/web typecheck
pnpm storybook                              # explicit DS Storybook (packages/ui)
```

Turbo runs `@design-system/ui#tokens:generate` and `#exports:generate` before this app’s `dev` / `build`.

## Layout

```
apps/web/
  index.html
  vite.config.ts       # react + @tailwindcss/vite; ssr.noExternal
  vitest.config.ts     # server.deps.inline: ["@design-system/ui"]
  src/
    index.css          # @import DS styles + @source app + packages/ui/src
    App.tsx            # Button / cn / tokens demo
    App.test.tsx
```
