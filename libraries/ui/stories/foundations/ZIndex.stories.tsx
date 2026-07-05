import type { Meta, StoryObj } from '@storybook/react';
import {
  zIndexTokens,
  zIndexOrder,
  zIndexClass,
  zIndexCssVar,
  type ZIndexName,
} from '../../src/tokens/z-index';
import { colorModeMeta, type ColorMode } from '../../src/tokens/colors';

/** Explicit map so Tailwind keeps the utilities. */
const zClass: Record<ZIndexName, string> = {
  base: 'z-base',
  raised: 'z-raised',
  dropdown: 'z-dropdown',
  sticky: 'z-sticky',
  overlay: 'z-overlay',
  modal: 'z-modal',
  toast: 'z-toast',
  tooltip: 'z-tooltip',
};

const layerColor: Record<ZIndexName, string> = {
  base: 'bg-gray-3 border-border-default',
  raised: 'bg-gray-5 border-border-strong',
  dropdown: 'bg-brand-3 border-brand-7',
  sticky: 'bg-blue-3 border-blue-7',
  overlay: 'bg-gray-a8 border-gray-8',
  modal: 'bg-bg-surface border-border-default',
  toast: 'bg-success-subtle border-success-border',
  tooltip: 'bg-bg-inverse border-border-strong',
};

const layerText: Record<ZIndexName, string> = {
  base: 'text-fg-default',
  raised: 'text-fg-default',
  dropdown: 'text-brand-12',
  sticky: 'text-blue-12',
  overlay: 'text-fg-default',
  modal: 'text-fg-default',
  toast: 'text-success-text',
  tooltip: 'text-fg-on-inverse',
};

function ZIndexDoc({ theme }: { theme: ColorMode }) {
  const modeMeta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-3xl p-6 text-left">
      <header className="mb-8 border-b border-border-default pb-6">
        <p className="mb-1 text-label-overline text-accent-text">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Z-index</h1>
          <span className="rounded-md border border-border-default bg-bg-subtle px-2 py-0.5 font-mono text-xs font-medium capitalize text-fg-default">
            {theme} · .{modeMeta.className}
          </span>
        </div>
        <p className="mt-2 text-body-md text-fg-muted">
          Semantic stacking layers for modals, menus, sticky chrome, and toasts. Prefer{' '}
          <code className="rounded bg-bg-surface-active px-1 text-code-sm text-fg-default">
            z-modal
          </code>{' '}
          over arbitrary numbers. Theme still switches via the toolbar.
        </p>
      </header>

      {/* Live stacking demo */}
      <section className="mb-10">
        <h2 className="mb-2 text-heading-md text-fg-default">Stacking preview</h2>
        <p className="mb-4 text-body-sm text-fg-muted">
          Cards share one positioning context and use each semantic layer. Higher layers paint on
          top (offset so every card stays visible).
        </p>
        <div className="relative h-[28rem] overflow-hidden rounded-xl border border-border-default bg-bg-subtle">
          {zIndexOrder.map((name, index) => {
            const token = zIndexTokens[name];
            const offset = 16 + index * 36;
            return (
              <div
                key={name}
                className={`absolute w-64 rounded-lg border-2 p-3 shadow-sm ${zClass[name]} ${layerColor[name]} ${layerText[name]}`}
                style={{ top: offset, left: offset }}
              >
                <p className="font-mono text-sm font-semibold">z-{name}</p>
                <p className="mt-0.5 font-mono text-xs opacity-90">value {token.value}</p>
                <p className="mt-1 text-xs leading-snug opacity-90">{token.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scale table */}
      <section className="mb-10">
        <h2 className="mb-3 text-heading-md text-fg-default">Scale (low → high)</h2>
        <div className="overflow-hidden rounded-lg border border-border-default">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <tr>
                <th className="px-3 py-2">Token</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Utility</th>
                <th className="px-3 py-2">CSS variable</th>
                <th className="px-3 py-2">Use for</th>
              </tr>
            </thead>
            <tbody>
              {zIndexOrder.map((name) => {
                const token = zIndexTokens[name];
                return (
                  <tr key={name} className="border-t border-border-default align-top">
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-fg-default">
                      {name}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-fg-default">{token.value}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-accent-text">
                      {zIndexClass(name)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-fg-muted">
                      {zIndexCssVar(name)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-fg-muted">{token.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="mb-3 text-heading-md text-fg-default">Usage</h2>
        <pre className="overflow-x-auto rounded-lg border border-border-default bg-bg-subtle p-3 text-code-sm text-fg-default">
{`{/* Backdrop under the dialog */}
<div className="fixed inset-0 z-overlay bg-overlay-scrim" />

{/* Dialog surface */}
<div className="fixed inset-0 z-modal flex items-center justify-center">
  <div className="rounded-lg bg-bg-surface p-6 shadow-sm">…</div>
</div>

{/* Menu anchored to a control */}
<div className="relative">
  <button type="button">Open</button>
  <ul className="absolute z-dropdown mt-1 …">…</ul>
</div>

{/* Sticky table header */}
<th className="sticky top-0 z-sticky bg-bg-subtle">Name</th>`}
        </pre>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-body-sm text-fg-muted">
          <li>
            Parent stacking contexts (<code className="text-code-sm text-fg-default">transform</code>
            , <code className="text-code-sm text-fg-default">opacity &lt; 1</code>,{' '}
            <code className="text-code-sm text-fg-default">filter</code>) can trap children — prefer
            portaling modals/toasts to <code className="text-code-sm text-fg-default">document.body</code>
            .
          </li>
          <li>
            Need a new layer? Add it to{' '}
            <code className="text-code-sm text-fg-default">zIndexTokens</code> between neighbors —
            don’t invent one-off values in components.
          </li>
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Z-Index',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === 'dark' ? 'dark' : 'light';
    return <ZIndexDoc theme={theme} />;
  },
};
