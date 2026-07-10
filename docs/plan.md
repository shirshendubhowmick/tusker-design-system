# Design system — next build plan

Living plan for what to build next. Context: the kit already has tokens, `ControlSize`, and a form/action core (`Button`, `IconButton`, `Input`, `FormField`, `Text`, `Spinner`). Upcoming interactive components will wrap **Radix primitives** (behavior from Radix, **styling + tokens** from the DS).

---

## Already in place

| Layer         | Notes                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| Foundations   | Colors (incl. brand blue), typography, shadows, breakpoints, z-index, dark mode |
| Control scale | Shared `ControlSize` (`sm` / `md` / `lg`) — heights, box lock, glyphs           |
| Focus ring    | `@design-system/ui/focus-ring` — self / within + intent tints                   |
| Components    | `Button`, `IconButton`, `Input`, `FormField`, `Text`, `Spinner`                 |
| Infra         | JIT exports, Storybook, sample `apps/web`, Vitest, Turbo, token codegen         |

Z-index scale is ready for overlays:

`base` → `raised` → `dropdown` → `sticky` → `overlay` → `modal` → `toast` → `tooltip`

---

## Principle: Radix for behavior, DS for chrome

Most Checkbox / Switch / Select / Dialog / Tooltip work is:

1. Compose the right Radix parts
2. Apply semantic tokens + CVA + `ControlSize`
3. Match focus, surface, and field layout patterns

**Do not** invent per-component focus rings, panel chrome, or form layouts. Build the shared layer first so Radix wrappers stay thin.

---

## Build first (before Radix components)

Shared chrome and composition. These are copied into every primitive if missing.

### 1. Shared focus ring helper — **done**

Extracted as `@design-system/ui/focus-ring` (`src/utils/focus-ring.ts`):

- Default: `focus-visible:shadow-focus` (self) or `focus-within:shadow-focus` (wrapper chrome)
- Intent tints (success / danger / warning) — same 3px geometry as `shadow-focus`
- CVA maps: `focusRingClass.self` / `focusRingClass.within`
- Wired into `Button` and `Input`

**Outcome:** Checkbox, Switch, Select trigger, Dialog close, etc. share one focus language.

### 2. Surface / elevated panel styles

Not necessarily a product `Card` — a small, reusable recipe for floating content:

- Background (surface / elevated)
- Border, radius, shadow
- Optional header / body padding

**Used by:** Select Content, Dropdown Menu, Dialog panel, Popover, command palette, etc.

### 3. Overlay / scrim styles

Backdrop for Dialog / Drawer:

- Dimmed scrim
- `z-overlay` (content sits at `z-modal` / peers)

**Outcome:** one scrim class or tiny primitive; no one-off backdrops per feature.

### 4. Form control layout for non-text fields

`FormField` is Input-shaped (label above control). Choice controls need:

- Horizontal row: control + label
- Optional description / error under the row

**Options:**

- Extend `FormField` (`orientation`, slotted control), or
- Thin `Field` / `ChoiceField` layout primitive

**Do this before Checkbox** so layout isn’t rebuilt twice.

### 5. Label primitive (thin)

DS `Label` using `Text` (+ required / disabled styles). FormField should compose it. Can sit on Radix Label later if useful for a11y wiring.

### 6. Separator

Minimal (CSS-only or Radix Separator with almost no logic). Menus, dialogs, toolbars, select groups.

### 7. Badge + Link

Pure styling, little or no Radix. High reuse in tables, menus, dialogs, and docs. Cheap wins after the layout primitives.

### 8. Package / peer conventions for Radix

Decide and document once:

- Which `@radix-ui/react-*` packages are **peerDependencies** vs dependencies
- Version policy
- Wrapper rule: re-export / compose Radix behavior; own only styles, tokens, `cn` / `cva`, and DS props

Capture in `packages/ui/README.md` (or a short ADR) so every new component looks the same.

---

## Suggested build order

```
1. Focus ring util ✅
2. Surface + Overlay recipes
3. Field layout (choice / horizontal)  ± Label
4. Separator
5. Badge / Link (optional but cheap)
6. Peer/deps + wrapper conventions (can start earlier; finish before first Radix PR)
7. Then Radix components (below)
```

**Minimum before first Radix control:** focus ring ✅ + choice-field layout.  
**Minimum before first overlay (Dialog / Drawer):** surface + scrim.

---

## Then: Radix-backed components

Order optimized for Dev-tool SaaS reuse and dependency on the foundations above.

| Order | Component          | Depends on                       | Notes                                                        |
| ----: | ------------------ | -------------------------------- | ------------------------------------------------------------ |
|     1 | **Checkbox**       | Focus, choice field, ControlSize | Settings, filters, tables                                    |
|     2 | **Switch**         | Same as Checkbox                 | Settings toggles                                             |
|     3 | **Radio Group**    | Same                             | Mutually exclusive choices                                   |
|     4 | **Select**         | Focus, surface, ControlSize      | Biggest remaining input gap; Combobox later if search needed |
|     5 | **Alert** (inline) | Text, semantic colors            | Can be non-Radix; status banners / form feedback             |
|     6 | **Dialog**         | Surface, scrim, z-modal, focus   | Confirm / delete / multi-step                                |
|     7 | **Tooltip**        | z-tooltip, surface-ish           | Especially for IconButton                                    |
|     8 | **Dropdown Menu**  | Surface, z-dropdown, Separator   | Toolbars, row actions                                        |
|     9 | **Toast**          | z-toast, portal                  | Async / mutation feedback (after Alert + Dialog patterns)    |

Optional later overlays: **Popover**, **Drawer**, **Combobox** (Select + search).

---

## Explicitly defer

| Item                               | Why                                                   |
| ---------------------------------- | ----------------------------------------------------- |
| Full **Table** / DataList          | Needs Badge, Checkbox, density, more primitives first |
| **Date picker**                    | Heavy; few teams need it early                        |
| **Nav shell** / app chrome         | Product-specific; not DS foundations                  |
| **Charts**                         | Out of scope for core kit                             |
| Rebuilding tokens / monorepo infra | Done (ADR-001); only revisit for external packaging   |

---

## Working rules (for implementers)

1. **Semantic tokens only** in components (`bg-accent-solid`, `text-fg-muted`) — never raw palette steps.
2. **ControlSize** for interactive hit targets (`sm` / `md` / `lg`); don’t re-encode `h-8` / `h-9` / `h-10`.
3. **Focus rings** via `focusRing()` / `focusRingClass` — don’t invent per-component ring shadows.
4. **Radix owns behavior** (keyboard, focus trap, a11y); DS owns look and product API.
5. **Colocate** tests + Storybook matrix (variant × size × state) like Button / Spinner.
6. **JIT export** — new public component = `src/components/<Name>/index.ts` + `pnpm exports:generate`.
7. Prefer **thin wrappers**; push shared chrome into utils/recipes, not copy-paste CVA blocks.

---

## Quick reference — “what should I open a PR for?”

| If you need…                | Build                                             |
| --------------------------- | ------------------------------------------------- |
| Consistent focus everywhere | Focus ring helper (§1) ✅                         |
| Menus / dialogs / selects   | Surface + Overlay (§2–3)                          |
| Checkbox / Switch soon      | Choice field layout + Label (§4–5), then Checkbox |
| Dense option lists          | Select (after surface + focus)                    |
| Confirm destructive actions | Dialog (after surface + scrim)                    |
| Icon-only affordances       | Tooltip (after z-index usage is proven in Dialog) |

---

## Related docs

- [ADR-001](./adr/adr_2026-07-08_001.md) — monorepo, JIT consumption, exports
- [Consuming the design system](./consuming-design-system.md)
- [packages/ui README](../packages/ui/README.md)

Update this file when a foundation item ships or priorities change.
