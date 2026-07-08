import type { Meta, StoryObj } from "@storybook/react";

import { type ColorMode, colorModeMeta } from "../../src/tokens/colors";
import {
  type ZIndexName,
  zIndexClass,
  zIndexCssVar,
  zIndexOrder,
  zIndexTokens,
} from "../../src/tokens/z-index";

/** Explicit map so Tailwind keeps the utilities. */
const zClass: Record<ZIndexName, string> = {
  base: "z-base",
  raised: "z-raised",
  dropdown: "z-dropdown",
  sticky: "z-sticky",
  overlay: "z-overlay",
  modal: "z-modal",
  toast: "z-toast",
  tooltip: "z-tooltip",
};

const layerColor: Record<ZIndexName, string> = {
  base: "bg-gray-3 border-border-default",
  raised: "bg-gray-5 border-border-strong",
  dropdown: "bg-brand-3 border-brand-7",
  sticky: "bg-cyan-3 border-cyan-7",
  overlay: "bg-gray-a8 border-gray-8",
  modal: "bg-bg-surface border-border-default",
  toast: "bg-success-subtle border-success-border",
  tooltip: "bg-bg-inverse border-border-strong",
};

const layerText: Record<ZIndexName, string> = {
  base: "text-fg-default",
  raised: "text-fg-default",
  dropdown: "text-brand-12",
  sticky: "text-cyan-12",
  overlay: "text-fg-default",
  modal: "text-fg-default",
  toast: "text-success-text",
  tooltip: "text-fg-on-inverse",
};

function ZIndexDoc({ theme }: { theme: ColorMode }) {
  const modeMeta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-3xl p-6 text-left">
      <header className="border-border-default mb-8 border-b pb-6">
        <p className="text-label-overline text-accent-text mb-1">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Z-index</h1>
          <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize">
            {theme} · .{modeMeta.className}
          </span>
        </div>
        <p className="text-body-md text-fg-muted mt-2">
          Semantic stacking layers for modals, menus, sticky chrome, and toasts.
          Prefer{" "}
          <code className="bg-bg-surface-active text-code-sm text-fg-default rounded px-1">
            z-modal
          </code>{" "}
          over arbitrary numbers. Theme still switches via the toolbar.
        </p>
      </header>

      {/* Live stacking demo */}
      <section className="mb-10">
        <h2 className="text-heading-md text-fg-default mb-2">
          Stacking preview
        </h2>
        <p className="text-body-sm text-fg-muted mb-4">
          Cards share one positioning context and use each semantic layer.
          Higher layers paint on top (offset so every card stays visible).
        </p>
        <div className="border-border-default bg-bg-subtle relative h-112 overflow-hidden rounded-xl border">
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
                <p className="mt-0.5 font-mono text-xs opacity-90">
                  value {token.value}
                </p>
                <p className="mt-1 text-xs leading-snug opacity-90">
                  {token.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scale table */}
      <section className="mb-10">
        <h2 className="text-heading-md text-fg-default mb-3">
          Scale (low → high)
        </h2>
        <div className="border-border-default overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-fg-muted text-xs font-semibold tracking-wide uppercase">
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
                  <tr
                    key={name}
                    className="border-border-default border-t align-top"
                  >
                    <td className="text-fg-default px-3 py-2.5 font-mono text-xs font-semibold">
                      {name}
                    </td>
                    <td className="text-fg-default px-3 py-2.5 font-mono text-xs">
                      {token.value}
                    </td>
                    <td className="text-accent-text px-3 py-2.5 font-mono text-xs">
                      {zIndexClass(name)}
                    </td>
                    <td className="text-fg-muted px-3 py-2.5 font-mono text-xs">
                      {zIndexCssVar(name)}
                    </td>
                    <td className="text-fg-muted px-3 py-2.5 text-xs">
                      {token.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-heading-md text-fg-default mb-3">Usage</h2>
        <pre className="border-border-default bg-bg-subtle text-code-sm text-fg-default overflow-x-auto rounded-lg border p-3">
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
        <ul className="text-body-sm text-fg-muted mt-4 list-disc space-y-2 pl-5">
          <li>
            Parent stacking contexts (
            <code className="text-code-sm text-fg-default">transform</code>,{" "}
            <code className="text-code-sm text-fg-default">opacity &lt; 1</code>
            , <code className="text-code-sm text-fg-default">filter</code>) can
            trap children — prefer portaling modals/toasts to{" "}
            <code className="text-code-sm text-fg-default">document.body</code>.
          </li>
          <li>
            Need a new layer? Add it to{" "}
            <code className="text-code-sm text-fg-default">zIndexTokens</code>{" "}
            between neighbors — don’t invent one-off values in components.
          </li>
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Z-Index",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <ZIndexDoc theme={theme} />;
  },
};
