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

| Workspace | Path | Package |
| --- | --- | --- |
| Libraries | `libraries/ui` | [`@design-system/ui`](./libraries/ui) |
| Apps | `apps/*` | _(add app packages here)_ |

## Requirements

| Requirement | Version |
| --- | --- |
| Node.js | ≥ 20.19 |
| pnpm | ≥ 9 |

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

| Command | Description |
| --- | --- |
| `pnpm install` | Install dependencies for all workspaces |
| `pnpm tokens:generate` | Generate token CSS from TypeScript (single source of truth) |
| `pnpm tokens:check` | Fail if generated token CSS is stale |
| `pnpm test` | Run package tests (Vitest) |
| `pnpm build` | Build `@design-system/ui` (runs token codegen first) |
| `pnpm storybook` / `pnpm dev` | Storybook dev server |
| `pnpm typecheck` | Typecheck all packages that define the script |
| `pnpm build-storybook` | Static Storybook build |

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
