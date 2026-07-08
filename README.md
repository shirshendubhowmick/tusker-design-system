# Design System Monorepo

pnpm + Turborepo monorepo for the design system and consuming applications.

## Structure

```
.
├── apps/                 # Applications (consumers of the design system)
├── packages/             # Shared packages
│   └── ui/               # @design-system/ui — tokens, utilities, Storybook
├── package.json          # Root workspace scripts (proxy through turbo)
├── pnpm-workspace.yaml   # workspaces + catalog: pins (react, react-dom, …)
├── turbo.json            # Task graph, caching, dependency ordering
└── tsconfig.json         # Shared TS options + empty root project (IDE)
```

### TypeScript

Shared options live in root **`tsconfig.json`** (ADR-001 Decision D). The root file includes no sources (IDE / empty project only). Every package and app must **extend** it so deep imports fail at `tsc`, not only at the bundler:

| Option                 | Value         | Why                                                        |
| ---------------------- | ------------- | ---------------------------------------------------------- |
| `moduleResolution`     | `"bundler"`   | Honors package `exports` at typecheck time                 |
| `module`               | `"preserve"`  | Consumer bundler owns emit/transform                       |
| `verbatimModuleSyntax` | `true`        | Forces `import type` / `export type` for type-only symbols |
| `jsx`                  | `"react-jsx"` | Automatic JSX runtime                                      |
| `strict`               | `true`        | Baseline strictness                                        |

Workspace packages extend the root config and only override what they need (DOM libs, includes, etc.):

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": { "lib": ["ES2023", "DOM", "DOM.Iterable"] },
  "include": ["src"]
}
```

Add a new app the same way under `apps/*/tsconfig.json`.

| Workspace | Path          | Package                              |
| --------- | ------------- | ------------------------------------ |
| Packages  | `packages/ui` | [`@design-system/ui`](./packages/ui) |
| Apps      | `apps/*`      | _(add app packages here)_            |

## Requirements

| Requirement | Version                              |
| ----------- | ------------------------------------ |
| Node.js     | ≥ 24 (see `.nvmrc`)                  |
| pnpm        | ≥ 11 (`packageManager`: pnpm@11.7.0) |

## Getting started

```bash
# Install all workspace dependencies
pnpm install

# Run Storybook for foundations docs (no design-system lib build — JIT source)
pnpm storybook
```

The design system ships **raw TypeScript** (ADR-001). Apps import subpaths like `@design-system/ui/Button`; only **apps** define a `build` task.

### Useful root scripts

Orchestrated tasks (`dev`, `build`, `test`, `typecheck`) run via **Turborepo**. Package-local scripts (Storybook, token/export codegen) still use `pnpm --filter`.

| Command                             | Description                                                 |
| ----------------------------------- | ----------------------------------------------------------- |
| `pnpm install`                      | Install dependencies for all workspaces                     |
| `pnpm tokens:generate`              | Generate token CSS from TypeScript (single source of truth) |
| `pnpm tokens:check`                 | Fail if generated token CSS is stale                        |
| `pnpm exports:generate`             | Regenerate `@design-system/ui` package `exports` map        |
| `pnpm exports:check`                | Fail if package `exports` are stale                         |
| `pnpm test`                         | `turbo run test` — Vitest across packages                   |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (flat config at repo root; monorepo-wide)            |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                      |
| `pnpm build`                        | `turbo run build` — **app** builds only (DS has no build)   |
| `pnpm storybook` / `pnpm dev`       | Storybook dev server (`dev` via turbo)                      |
| `pnpm typecheck`                    | `turbo run typecheck` across packages                       |
| `pnpm build-storybook`              | Static Storybook build                                      |

Shared runtime peers (`react`, `react-dom`, `class-variance-authority`) are pinned in `pnpm-workspace.yaml` under `catalog:` and referenced as `"catalog:"` in package manifests so every workspace resolves the same version.

### Lint & format

Configured at the monorepo root (packages share these configs):

| File                           | Role                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| `eslint.config.mjs`            | ESLint 10 flat config (TypeScript, `@eslint-react`, Prettier-compatible) |
| `.prettierrc.json`             | Prettier 3 options                                                       |
| `.prettierignore`              | Build output, lockfile, generated token CSS                              |
| `package.json` → `lint-staged` | Pre-commit tasks for staged files only                                   |
| `.husky/pre-commit`            | Runs `lint-staged`                                                       |

**Pre-commit (Husky + lint-staged)** runs on `git commit` after `pnpm install` (via the `prepare` script):

1. **Prettier** — format staged files
2. **ESLint** — check staged JS/TS (no autofix; fails on errors/warnings)
3. **Token CSS** — if token sources or the generator change, run `pnpm tokens:generate` and stage the updated CSS
4. **Package exports** — if a component `index.ts` or `gen-exports` changes, regenerate `package.json` `exports`

Skip hooks only when necessary: `git commit --no-verify` (avoid for normal work).

### Working with a single package

```bash
pnpm --filter @design-system/ui storybook
pnpm --filter @design-system/ui test
pnpm --filter @design-system/ui exports:generate
```

### Adding an app

```bash
mkdir -p apps/web
# scaffold your app under apps/web, then:
pnpm install
```

In the app `package.json`:

```json
{
  "dependencies": {
    "@design-system/ui": "workspace:*",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

Use `catalog:` for React (and other catalog-pinned peers) so the app and design system never diverge.

See [`packages/ui/README.md`](./packages/ui/README.md) for usage, tokens, and the JS API.
