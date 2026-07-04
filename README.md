# Design System

React + TypeScript component library for a **Dev tool SaaS**, styled with **Tailwind CSS** and **Radix Colors**.

## Stack

- **pnpm** — package manager
- **TypeScript** — type safety
- **React 19** — UI runtime (peer dependency)
- **Tailwind CSS v4** — utility styling
- **Radix Colors** — accessible light/dark color scales
- **Vite** — library bundler
- **Storybook 10** — component docs & playground

## Color system (3 layers)

```
Radix scales  →  product primitives  →  semantic tokens
(slate, …)       (gray, brand, …)       (bg-canvas, accent-solid, …)
```

### 1. Palette picks

| Product name | Radix scale | Role |
| --- | --- | --- |
| `gray` | **slate** | Neutral chrome |
| `brand` | **indigo** | Primary / accent |
| `green` | green | Success |
| `amber` | amber | Warning |
| `red` | red | Danger |
| `blue` | blue | Info (not brand) |

### 2. Primitives

Utilities: `bg-gray-1` … `bg-gray-12`, `text-brand-11`, `border-red-7`, alpha `bg-gray-a3`.

Steps follow Radix: **1–2** backgrounds · **3–5** surfaces · **6–8** borders · **9–10** solids · **11–12** text.

### 3. Semantic tokens (prefer these)

```tsx
<div className="bg-bg-canvas text-fg-default border border-border-default">
  <button className="bg-accent-solid text-fg-on-accent hover:bg-accent-solid-hover">
    Deploy
  </button>
  <span className="text-success-text">Healthy</span>
</div>
```

| Category | Examples |
| --- | --- |
| Background | `bg-canvas`, `bg-subtle`, `bg-surface`, `bg-surface-hover` |
| Foreground | `fg-default`, `fg-muted`, `fg-subtle`, `fg-on-accent` |
| Border | `border-default`, `border-muted`, `border-strong` |
| Accent | `accent-solid`, `accent-subtle`, `accent-text` |
| Status | `success-*`, `warning-*`, `danger-*`, `info-*` |
| Focus | `focus-ring` |

### Light & dark modes

Both modes are first-class:

1. **Primitives** — Radix light + dark CSS (`slate.css` / `slate-dark.css`, …). Class `.dark` (or `.dark-theme`) swaps underlying scale values.
2. **Semantic tokens** — each token has explicit `light` and `dark` refs in `semantic.ts`.
   - Defaults: same step in both modes (e.g. `fg-default` → `gray.12`).
   - Overrides where product needs it (e.g. `bg-surface` light=`gray.2` / dark=`gray.3`; `overlay-scrim` darker in dark).
3. **CSS** — light defaults in `semantic.css` (`@theme`); dark (and nested `.light`) in `semantic-dark.css`.

```html
<html class="dark">…</html>
```

Source of truth:

- `src/tokens/colors/palette.ts` — scale choices
- `src/tokens/colors/modes.ts` — mode contract
- `src/tokens/colors/primitives.css` — primitive CSS variables
- `src/tokens/colors/semantic.ts` — light + dark semantic map
- `src/tokens/colors/semantic.css` / `semantic-dark.css` — CSS application

## Typography (3 layers)

```
typefaces  →  scales (size/weight/leading/tracking)  →  semantic text styles
(sans/mono)   (sm=14px default body, …)                 (heading-lg, body-md, code-sm, …)
```

| Layer | Details |
| --- | --- |
| Families | `font-sans` (Inter), `font-mono` (JetBrains Mono) |
| Sizes | `text-2xs` … `text-4xl` (body default **14px** / `sm`) |
| Weights | `font-regular` 400 · `medium` 500 · `semibold` 600 · `bold` 700 |
| Semantic | `text-heading-lg`, `text-body-md`, `text-label-sm`, `text-code-sm`, `text-metric-lg`, … |

```tsx
<h1 className="text-heading-xl text-fg-default">Deployments</h1>
<p className="text-body-md text-fg-muted">Last 24 hours of production activity.</p>
<code className="text-code-sm text-fg-default">git push origin main</code>
```

Source: `src/tokens/typography/` (`families.ts`, `scale.ts`, `semantic.ts` + CSS).


## Breakpoints

Mobile-first tiers (default Tailwind `sm` / `md` / `lg` are replaced):

| Tier | Min width | Tailwind |
| --- | --- | --- |
| **mobile** | 0 | base styles (no prefix) |
| **tablet** | 768px (`48rem`) | `tablet:` |
| **desktop** | 1024px (`64rem`) | `desktop:` |

```tsx
<div className="flex flex-col gap-4 tablet:flex-row desktop:gap-8">
  <aside className="hidden desktop:block">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

Source: `src/tokens/breakpoints/`.


## Z-index

Semantic stacking layers (prefer these over raw numbers):

| Token | Value | Utility |
| --- | --- | --- |
| `base` | 0 | `z-base` |
| `raised` | 10 | `z-raised` |
| `dropdown` | 100 | `z-dropdown` |
| `sticky` | 200 | `z-sticky` |
| `overlay` | 300 | `z-overlay` |
| `modal` | 400 | `z-modal` |
| `toast` | 500 | `z-toast` |
| `tooltip` | 600 | `z-tooltip` |

```tsx
<div className="fixed inset-0 z-overlay bg-overlay-scrim" />
<div className="fixed z-modal">…dialog…</div>
```

Source: `src/tokens/z-index/`.


## Shadows

Elevation + focus shadows (light/dark values differ slightly):

| Token | Utility | Typical use |
| --- | --- | --- |
| `xs` – `xl` | `shadow-xs` … `shadow-xl` | Downward elevation |
| `top-xs` – `top-lg` | `shadow-top-xs` … `shadow-top-lg` | Upward (bottom sheets, sticky footers) |
| `sm` | `shadow-sm` | Cards / panels |
| `md` | `shadow-md` | Dropdowns, toasts |
| `lg` | `shadow-lg` | Modals / side drawers |
| `top-sm` / `top-md` | `shadow-top-sm` / `shadow-top-md` | Bottom sheets |
| `inner` | `shadow-inner` | Recessed wells |
| `border` | `shadow-border` | 1px outline via shadow |
| `focus` | `shadow-focus` | Focus ring |

```tsx
<div className="rounded-lg bg-bg-surface shadow-sm">Card</div>
<div className="z-dropdown shadow-md">Menu</div>
<div className="z-modal shadow-lg">Dialog</div>
<div className="fixed inset-x-0 bottom-0 z-modal shadow-top-md">Bottom sheet</div>
```

Source: `src/tokens/shadows/`.

## Getting started

```bash
pnpm install
pnpm storybook   # http://localhost:6006
pnpm build       # emit library to dist/
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm storybook` / `pnpm dev` | Start Storybook |
| `pnpm build` | Typecheck + build the library |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm typecheck` | Run TypeScript only |

## Usage

```tsx
import '@design-system/ui/styles.css';
// Tokens are available as Tailwind utilities after importing styles:
// bg-bg-canvas, text-fg-default, bg-accent-solid, …
```

## Project layout

```
src/
  tokens/colors/           # palette → primitives → semantic
  tokens/typography/       # families → scales → text styles
  tokens/breakpoints/      # mobile / tablet / desktop
  tokens/z-index/          # semantic stacking layers
  tokens/shadows/          # elevation + focus shadows
  styles/                  # Tailwind entry + token imports
  lib/                     # cn, …
  index.ts
stories/
  foundations/             # Storybook foundation stories
.storybook/
```
