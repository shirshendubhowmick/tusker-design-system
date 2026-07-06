import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import {
  type BreakpointName,
  breakpointOrder,
  breakpoints,
  designSystemViewports,
  formatBreakpointRange,
  resolveBreakpoint,
  storybookViewportNotes,
} from "../../src/tokens/breakpoints";
import { type ColorMode, colorModeMeta } from "../../src/tokens/colors";

function useViewportWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    // Initial width comes from useState; only subscribe to resizes here.
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

function BreakpointCard({
  name,
  active,
}: {
  name: BreakpointName;
  active: boolean;
}) {
  const bp = breakpoints[name];
  const variant = bp.tailwindVariant;

  return (
    <div
      className={
        active
          ? "border-accent-border bg-accent-subtle rounded-lg border-2 p-4 shadow-sm"
          : "border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm"
      }
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-heading-sm text-fg-default capitalize">{name}</h3>
        {active ? (
          <span className="bg-accent-solid text-fg-on-accent rounded-md px-2 py-0.5 text-xs font-semibold">
            Active viewport
          </span>
        ) : (
          <span className="border-border-default bg-bg-subtle text-fg-muted rounded-md border px-2 py-0.5 text-xs font-medium">
            Inactive
          </span>
        )}
      </div>

      <p className="text-body-sm text-fg-muted">{bp.description}</p>

      <dl className="border-border-default bg-bg-subtle mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-md border px-3 py-2.5">
        <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
          Range
        </dt>
        <dd className="text-fg-default font-mono text-xs font-medium">
          {formatBreakpointRange(name)}
        </dd>

        <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
          Min width
        </dt>
        <dd className="text-fg-default font-mono text-xs font-medium">
          {bp.minWidthPx}px · {bp.minWidthRem}
        </dd>

        <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
          CSS var
        </dt>
        <dd className="text-fg-default font-mono text-xs font-medium">
          {bp.cssVar}
        </dd>

        <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
          Variant
        </dt>
        <dd className="text-fg-default font-mono text-xs font-medium">
          {variant ? `${variant}:` : "base (no prefix)"}
        </dd>

        <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
          Media
        </dt>
        <dd className="text-fg-default font-mono text-xs font-medium">
          {bp.minWidthPx === 0
            ? "default styles (always applied)"
            : `@media (min-width: ${bp.minWidthRem})`}
        </dd>
      </dl>
    </div>
  );
}

function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <p className="text-body-sm text-fg-muted">
        Resize the Storybook viewport (or browser window). Layout and labels
        update with the active tier.
      </p>

      {/* Stack on mobile → row from tablet */}
      <div className="tablet:flex-row tablet:items-stretch flex flex-col gap-3">
        <div className="border-border-default bg-bg-subtle flex-1 rounded-lg border p-4">
          <p className="text-label-md text-fg-muted">Layout</p>
          <p className="text-body-md text-fg-default mt-1 font-semibold">
            <span className="tablet:hidden">Column stack (mobile)</span>
            <span className="tablet:inline desktop:hidden hidden">
              Row · two columns (tablet)
            </span>
            <span className="desktop:inline hidden">
              Row · three columns (desktop)
            </span>
          </p>
        </div>
        <div className="border-border-default bg-bg-subtle tablet:max-w-none flex-1 rounded-lg border p-4">
          <p className="text-label-md text-fg-muted">Nav chrome</p>
          <p className="text-body-md text-fg-default desktop:hidden mt-1 font-semibold">
            Compact / drawer pattern
          </p>
          <p className="text-body-md text-fg-default desktop:block mt-1 hidden font-semibold">
            Persistent sidebar + top bar
          </p>
        </div>
        <div className="border-border-default bg-bg-subtle desktop:block hidden flex-1 rounded-lg border p-4">
          <p className="text-label-md text-fg-muted">Desktop only</p>
          <p className="text-body-md text-fg-default mt-1 font-semibold">
            Extra panel (hidden below desktop)
          </p>
        </div>
      </div>

      {/* Visibility legend */}
      <div className="tablet:grid-cols-3 grid gap-2">
        <div className="border-border-default bg-bg-canvas text-fg-default rounded-md border px-3 py-2 text-center text-xs font-medium">
          Always visible
        </div>
        <div className="border-border-default bg-bg-canvas text-fg-default tablet:block hidden rounded-md border px-3 py-2 text-center text-xs font-medium">
          tablet:block and up
        </div>
        <div className="border-border-default bg-bg-canvas text-fg-default desktop:block hidden rounded-md border px-3 py-2 text-center text-xs font-medium">
          desktop:block and up
        </div>
      </div>

      <pre className="border-border-default bg-bg-subtle text-code-sm text-fg-default overflow-x-auto rounded-lg border p-3">
        {`<div className="flex flex-col gap-3 tablet:flex-row desktop:gap-8">
  <aside className="hidden desktop:block">Sidebar</aside>
  <main className="flex-1">…</main>
</div>`}
      </pre>
    </div>
  );
}

function BreakpointsDoc({ theme }: { theme: ColorMode }) {
  const width = useViewportWidth();
  const active = resolveBreakpoint(width);
  const modeMeta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-3xl p-6 text-left">
      <header className="border-border-default mb-8 border-b pb-6">
        <p className="text-label-overline text-accent-text mb-1">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Breakpoints</h1>
          <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize">
            {theme} · .{modeMeta.className}
          </span>
        </div>
        <p className="text-body-md text-fg-muted mt-2">
          Three mobile-first tiers for a Dev tool SaaS layout. Base styles are{" "}
          <strong className="text-fg-default font-semibold">mobile</strong>
          layer up with{" "}
          <code className="bg-bg-surface-active text-code-sm text-fg-default rounded px-1">
            tablet:
          </code>{" "}
          and{" "}
          <code className="bg-bg-surface-active text-code-sm text-fg-default rounded px-1">
            desktop:
          </code>
          . Switch sizes with the Storybook{" "}
          <strong className="text-fg-default font-semibold">viewport</strong>{" "}
          toolbar (Mobile / Tablet / Desktop) — the same tokens as the design
          system.
        </p>

        <div className="border-border-default bg-bg-subtle mt-4 rounded-lg border px-4 py-3">
          <p className="text-label-md text-fg-muted">Current viewport</p>
          <p className="text-fg-default mt-1 font-mono text-lg font-semibold">
            {width}px →{" "}
            <span className="text-accent-text capitalize">{active}</span>
          </p>
        </div>
      </header>

      <section className="mb-10 space-y-3">
        <h2 className="text-heading-md text-fg-default">Tiers</h2>
        {breakpointOrder.map((name) => (
          <BreakpointCard key={name} name={name} active={name === active} />
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-heading-md text-fg-default mb-2">
          Storybook viewport toolbar
        </h2>
        <p className="text-body-sm text-fg-muted mb-4">
          The toolbar lists only these three options (configured in{" "}
          <code className="text-code-sm text-fg-default">
            .storybook/preview.tsx
          </code>{" "}
          from{" "}
          <code className="text-code-sm text-fg-default">
            designSystemViewports
          </code>
          ).
        </p>
        <div className="border-border-default overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-fg-muted text-xs font-semibold tracking-wide uppercase">
              <tr>
                <th className="px-3 py-2">Toolbar</th>
                <th className="px-3 py-2">Width × height</th>
                <th className="px-3 py-2">Tier range</th>
                <th className="px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="text-fg-default">
              {breakpointOrder.map((name) => {
                const vp = designSystemViewports[name];
                const note = storybookViewportNotes[name];
                return (
                  <tr key={name} className="border-border-default border-t">
                    <td className="px-3 py-2 font-medium capitalize">
                      {vp.name}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {vp.styles.width} × {vp.styles.height}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{note.tier}</td>
                    <td className="text-fg-muted px-3 py-2 text-xs">
                      {note.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-heading-md text-fg-default mb-3">
          Responsive demo
        </h2>
        <ResponsiveDemo />
      </section>

      <section>
        <h2 className="text-heading-md text-fg-default mb-3">Usage</h2>
        <ul className="text-body-sm text-fg-muted list-disc space-y-2 pl-5">
          <li>
            <strong className="text-fg-default">Mobile-first:</strong> write
            mobile styles with no prefix, then override at larger tiers.
          </li>
          <li>
            Default Tailwind{" "}
            <code className="text-code-sm text-fg-default">sm:</code> /{" "}
            <code className="text-code-sm text-fg-default">md:</code> /{" "}
            <code className="text-code-sm text-fg-default">lg:</code> variants
            are <strong className="text-fg-default">removed</strong> — use{" "}
            <code className="text-code-sm text-fg-default">tablet:</code> and{" "}
            <code className="text-code-sm text-fg-default">desktop:</code> only.
          </li>
          <li>
            Prefer layout changes (stack → row, hide sidebar) over unrelated
            visual rewrites per breakpoint.
          </li>
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Breakpoints",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <BreakpointsDoc theme={theme} />;
  },
};
