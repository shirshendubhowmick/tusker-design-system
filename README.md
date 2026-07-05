# Design System Monorepo

pnpm workspace monorepo for the design system and consuming applications.

## Structure

```
.
├── apps/                 # Applications (consumers of the design system)
├── libraries/            # Shared libraries
│   └── ui/               # @design-system/ui — tokens, utilities, Storybook
├── package.json          # Root workspace scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json    # Shared TypeScript compiler options
└── tsconfig.json         # Root TS entry (extends base; packages extend base too)
```

### TypeScript

Shared options live in **`tsconfig.base.json`**. Workspace packages extend it and only override what they need (DOM libs, `rootDir`, includes, etc.):

```json
// libraries/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "lib": ["ES2022", "DOM", "DOM.Iterable"] },
  "include": ["src"]
}
```

Add a new app the same way under `apps/*/tsconfig.json`.

| Workspace | Path           | Package                               |
| --------- | -------------- | ------------------------------------- |
| Libraries | `libraries/ui` | [`@design-system/ui`](./libraries/ui) |
| Apps      | `apps/*`       | _(add app packages here)_             |

## Requirements

| Requirement | Version                              |
| ----------- | ------------------------------------ |
| Node.js     | ≥ 24 (see `.nvmrc`)                  |
| pnpm        | ≥ 11 (`packageManager`: pnpm@11.7.0) |

## Getting started

```bash
# Install all workspace dependencies
pnpm install

# Build the design system library
pnpm build

# Run Storybook for foundations docs
pnpm storybook
```

### Useful root scripts

| Command                             | Description                                                 |
| ----------------------------------- | ----------------------------------------------------------- |
| `pnpm install`                      | Install dependencies for all workspaces                     |
| `pnpm tokens:generate`              | Generate token CSS from TypeScript (single source of truth) |
| `pnpm tokens:check`                 | Fail if generated token CSS is stale                        |
| `pnpm test`                         | Run package tests (Vitest)                                  |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (flat config at repo root)                           |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                      |
| `pnpm build`                        | Build `@design-system/ui` (runs token codegen first)        |
| `pnpm storybook` / `pnpm dev`       | Storybook dev server                                        |
| `pnpm typecheck`                    | Typecheck all packages that define the script               |
| `pnpm build-storybook`              | Static Storybook build                                      |

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

Skip hooks only when necessary: `git commit --no-verify` (avoid for normal work).

### Working with a single package

```bash
pnpm --filter @design-system/ui build
pnpm --filter @design-system/ui storybook
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
    "@design-system/ui": "workspace:*"
  }
}
```

See [`libraries/ui/README.md`](./libraries/ui/README.md) for usage, tokens, and the JS API.
