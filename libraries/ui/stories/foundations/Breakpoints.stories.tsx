import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  breakpoints,
  breakpointOrder,
  resolveBreakpoint,
  formatBreakpointRange,
  designSystemViewports,
  storybookViewportNotes,
  type BreakpointName,
} from '../../src/tokens/breakpoints';
import { colorModeMeta, type ColorMode } from '../../src/tokens/colors';

function useViewportWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    // Initial width comes from useState; only subscribe to resizes here.
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

function BreakpointCard({ name, active }: { name: BreakpointName; active: boolean }) {
  const bp = breakpoints[name];
  const variant = bp.tailwindVariant;

  return (
    <div
      className={
        active
          ? 'rounded-lg border-2 border-accent-border bg-accent-subtle p-4 shadow-sm'
          : 'rounded-lg border border-border-default bg-bg-canvas p-4 shadow-sm'
      }
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-heading-sm capitalize text-fg-default">{name}</h3>
        {active ? (
          <span className="rounded-md bg-accent-solid px-2 py-0.5 text-xs font-semibold text-fg-on-accent">
            Active viewport
          </span>
        ) : (
          <span className="rounded-md border border-border-default bg-bg-subtle px-2 py-0.5 text-xs font-medium text-fg-muted">
            Inactive
          </span>
        )}
      </div>

      <p className="text-body-sm text-fg-muted">{bp.description}</p>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-md border border-border-default bg-bg-subtle px-3 py-2.5">
        <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Range
        </dt>
        <dd className="font-mono text-xs font-medium text-fg-default">
          {formatBreakpointRange(name)}
        </dd>

        <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Min width
        </dt>
        <dd className="font-mono text-xs font-medium text-fg-default">
          {bp.minWidthPx}px · {bp.minWidthRem}
        </dd>

        <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          CSS var
        </dt>
        <dd className="font-mono text-xs font-medium text-fg-default">{bp.cssVar}</dd>

        <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Variant
        </dt>
        <dd className="font-mono text-xs font-medium text-fg-default">
          {variant ? `${variant}:` : 'base (no prefix)'}
        </dd>

        <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Media
        </dt>
        <dd className="font-mono text-xs font-medium text-fg-default">
          {bp.minWidthPx === 0
            ? 'default styles (always applied)'
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
        Resize the Storybook viewport (or browser window). Layout and labels update with
        the active tier.
      </p>

      {/* Stack on mobile → row from tablet */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-stretch">
        <div className="flex-1 rounded-lg border border-border-default bg-bg-subtle p-4">
          <p className="text-label-md text-fg-muted">Layout</p>
          <p className="mt-1 text-body-md font-semibold text-fg-default">
            <span className="tablet:hidden">Column stack (mobile)</span>
            <span className="hidden tablet:inline desktop:hidden">
              Row · two columns (tablet)
            </span>
            <span className="hidden desktop:inline">Row · three columns (desktop)</span>
          </p>
        </div>
        <div className="flex-1 rounded-lg border border-border-default bg-bg-subtle p-4 tablet:max-w-none">
          <p className="text-label-md text-fg-muted">Nav chrome</p>
          <p className="mt-1 text-body-md font-semibold text-fg-default desktop:hidden">
            Compact / drawer pattern
          </p>
          <p className="mt-1 hidden text-body-md font-semibold text-fg-default desktop:block">
            Persistent sidebar + top bar
          </p>
        </div>
        <div className="hidden flex-1 rounded-lg border border-border-default bg-bg-subtle p-4 desktop:block">
          <p className="text-label-md text-fg-muted">Desktop only</p>
          <p className="mt-1 text-body-md font-semibold text-fg-default">
            Extra panel (hidden below desktop)
          </p>
        </div>
      </div>

      {/* Visibility legend */}
      <div className="grid gap-2 tablet:grid-cols-3">
        <div className="rounded-md border border-border-default bg-bg-canvas px-3 py-2 text-center text-xs font-medium text-fg-default">
          Always visible
        </div>
        <div className="hidden rounded-md border border-border-default bg-bg-canvas px-3 py-2 text-center text-xs font-medium text-fg-default tablet:block">
          tablet:block and up
        </div>
        <div className="hidden rounded-md border border-border-default bg-bg-canvas px-3 py-2 text-center text-xs font-medium text-fg-default desktop:block">
          desktop:block and up
        </div>
      </div>

      <pre className="overflow-x-auto rounded-lg border border-border-default bg-bg-subtle p-3 text-code-sm text-fg-default">
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
      <header className="mb-8 border-b border-border-default pb-6">
        <p className="mb-1 text-label-overline text-accent-text">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Breakpoints</h1>
          <span className="rounded-md border border-border-default bg-bg-subtle px-2 py-0.5 font-mono text-xs font-medium capitalize text-fg-default">
            {theme} · .{modeMeta.className}
          </span>
        </div>
        <p className="mt-2 text-body-md text-fg-muted">
          Three mobile-first tiers for a Dev tool SaaS layout. Base styles are{' '}
          <strong className="font-semibold text-fg-default">mobile</strong>; layer up with{' '}
          <code className="rounded bg-bg-surface-active px-1 text-code-sm text-fg-default">
            tablet:
          </code>{' '}
          and{' '}
          <code className="rounded bg-bg-surface-active px-1 text-code-sm text-fg-default">
            desktop:
          </code>
          . Switch sizes with the Storybook{' '}
          <strong className="font-semibold text-fg-default">viewport</strong> toolbar
          (Mobile / Tablet / Desktop) — the same tokens as the design system.
        </p>

        <div className="mt-4 rounded-lg border border-border-default bg-bg-subtle px-4 py-3">
          <p className="text-label-md text-fg-muted">Current viewport</p>
          <p className="mt-1 font-mono text-lg font-semibold text-fg-default">
            {width}px → <span className="capitalize text-accent-text">{active}</span>
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
        <h2 className="mb-2 text-heading-md text-fg-default">
          Storybook viewport toolbar
        </h2>
        <p className="mb-4 text-body-sm text-fg-muted">
          The toolbar lists only these three options (configured in{' '}
          <code className="text-code-sm text-fg-default">.storybook/preview.tsx</code>{' '}
          from <code className="text-code-sm text-fg-default">designSystemViewports</code>
          ).
        </p>
        <div className="overflow-hidden rounded-lg border border-border-default">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-xs font-semibold uppercase tracking-wide text-fg-muted">
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
                  <tr key={name} className="border-t border-border-default">
                    <td className="px-3 py-2 font-medium capitalize">{vp.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {vp.styles.width} × {vp.styles.height}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{note.tier}</td>
                    <td className="px-3 py-2 text-xs text-fg-muted">{note.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-heading-md text-fg-default">Responsive demo</h2>
        <ResponsiveDemo />
      </section>

      <section>
        <h2 className="mb-3 text-heading-md text-fg-default">Usage</h2>
        <ul className="list-disc space-y-2 pl-5 text-body-sm text-fg-muted">
          <li>
            <strong className="text-fg-default">Mobile-first:</strong> write mobile styles
            with no prefix, then override at larger tiers.
          </li>
          <li>
            Default Tailwind <code className="text-code-sm text-fg-default">sm:</code> /{' '}
            <code className="text-code-sm text-fg-default">md:</code> /{' '}
            <code className="text-code-sm text-fg-default">lg:</code> variants are{' '}
            <strong className="text-fg-default">removed</strong> — use{' '}
            <code className="text-code-sm text-fg-default">tablet:</code> and{' '}
            <code className="text-code-sm text-fg-default">desktop:</code> only.
          </li>
          <li>
            Prefer layout changes (stack → row, hide sidebar) over unrelated visual
            rewrites per breakpoint.
          </li>
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Breakpoints',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === 'dark' ? 'dark' : 'light';
    return <BreakpointsDoc theme={theme} />;
  },
};
