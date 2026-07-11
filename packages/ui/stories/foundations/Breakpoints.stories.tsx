import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
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
        <Text
          as="h3"
          variant={TextVariant.heading}
          size={TextSize.sm}
          className="capitalize"
        >
          {name}
        </Text>
        {active ? (
          <Text
            as="span"
            color={TextColor.onAccent}
            className="bg-accent-solid rounded-md px-2 py-0.5 text-xs font-semibold"
          >
            Active viewport
          </Text>
        ) : (
          <Text
            as="span"
            color={TextColor.muted}
            className="border-border-default bg-bg-subtle rounded-md border px-2 py-0.5 text-xs font-medium"
          >
            Inactive
          </Text>
        )}
      </div>

      <Text
        as="p"
        variant={TextVariant.body}
        size={TextSize.sm}
        color={TextColor.muted}
      >
        {bp.description}
      </Text>

      <dl className="border-border-default bg-bg-subtle mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-md border px-3 py-2.5">
        <Text
          as="dt"
          color={TextColor.muted}
          className="text-xs font-semibold tracking-wide uppercase"
        >
          Range
        </Text>
        <Text as="dd" className="font-mono text-xs font-medium">
          {formatBreakpointRange(name)}
        </Text>

        <Text
          as="dt"
          color={TextColor.muted}
          className="text-xs font-semibold tracking-wide uppercase"
        >
          Min width
        </Text>
        <Text as="dd" className="font-mono text-xs font-medium">
          {bp.minWidthPx}px · {bp.minWidthRem}
        </Text>

        <Text
          as="dt"
          color={TextColor.muted}
          className="text-xs font-semibold tracking-wide uppercase"
        >
          CSS var
        </Text>
        <Text as="dd" className="font-mono text-xs font-medium">
          {bp.cssVar}
        </Text>

        <Text
          as="dt"
          color={TextColor.muted}
          className="text-xs font-semibold tracking-wide uppercase"
        >
          Variant
        </Text>
        <Text as="dd" className="font-mono text-xs font-medium">
          {variant ? `${variant}:` : "base (no prefix)"}
        </Text>

        <Text
          as="dt"
          color={TextColor.muted}
          className="text-xs font-semibold tracking-wide uppercase"
        >
          Media
        </Text>
        <Text as="dd" className="font-mono text-xs font-medium">
          {bp.minWidthPx === 0
            ? "default styles (always applied)"
            : `@media (min-width: ${bp.minWidthRem})`}
        </Text>
      </dl>
    </div>
  );
}

function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <Text
        as="p"
        variant={TextVariant.body}
        size={TextSize.sm}
        color={TextColor.muted}
      >
        Resize the Storybook viewport (or browser window). Layout and labels
        update with the active tier.
      </Text>

      {/* Stack on mobile → row from tablet */}
      <div className="tablet:flex-row tablet:items-stretch flex flex-col gap-3">
        <div className="border-border-default bg-bg-subtle flex-1 rounded-lg border p-4">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
          >
            Layout
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            className="mt-1 font-semibold"
          >
            <span className="tablet:hidden">Column stack (mobile)</span>
            <span className="tablet:inline desktop:hidden hidden">
              Row · two columns (tablet)
            </span>
            <span className="desktop:inline hidden">
              Row · three columns (desktop)
            </span>
          </Text>
        </div>
        <div className="border-border-default bg-bg-subtle tablet:max-w-none flex-1 rounded-lg border p-4">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
          >
            Nav chrome
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            className="desktop:hidden mt-1 font-semibold"
          >
            Compact / drawer pattern
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            className="desktop:block mt-1 hidden font-semibold"
          >
            Persistent sidebar + top bar
          </Text>
        </div>
        <div className="border-border-default bg-bg-subtle desktop:block hidden flex-1 rounded-lg border p-4">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
          >
            Desktop only
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            className="mt-1 font-semibold"
          >
            Extra panel (hidden below desktop)
          </Text>
        </div>
      </div>

      {/* Visibility legend */}
      <div className="tablet:grid-cols-3 grid gap-2">
        <Text
          as="div"
          className="border-border-default bg-bg-canvas rounded-md border px-3 py-2 text-center text-xs font-medium"
        >
          Always visible
        </Text>
        <Text
          as="div"
          className="border-border-default bg-bg-canvas tablet:block hidden rounded-md border px-3 py-2 text-center text-xs font-medium"
        >
          tablet:block and up
        </Text>
        <Text
          as="div"
          className="border-border-default bg-bg-canvas desktop:block hidden rounded-md border px-3 py-2 text-center text-xs font-medium"
        >
          desktop:block and up
        </Text>
      </div>

      <Text
        as="pre"
        variant={TextVariant.code}
        size={TextSize.sm}
        className="border-border-default bg-bg-subtle overflow-x-auto rounded-lg border p-3"
      >
        {`<div className="flex flex-col gap-3 tablet:flex-row desktop:gap-8">
  <aside className="hidden desktop:block">Sidebar</aside>
  <main className="flex-1">…</main>
</div>`}
      </Text>
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
        <Text
          as="p"
          variant={TextVariant.label}
          size={TextSize.overline}
          color={TextColor.accent}
          className="mb-1"
        >
          Foundations
        </Text>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Text as="h1" variant={TextVariant.heading} size={TextSize.xl}>
            Breakpoints
          </Text>
          <Text
            as="span"
            className="border-border-default bg-bg-subtle rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize"
          >
            {theme} · .{modeMeta.className}
          </Text>
        </div>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.md}
          color={TextColor.muted}
          className="mt-2"
        >
          Three mobile-first tiers for a Dev tool SaaS layout. Base styles are{" "}
          <Text as="strong" className="font-semibold">
            mobile
          </Text>
          layer up with{" "}
          <Text
            as="code"
            variant={TextVariant.code}
            size={TextSize.sm}
            className="bg-bg-surface-active rounded px-1"
          >
            tablet:
          </Text>{" "}
          and{" "}
          <Text
            as="code"
            variant={TextVariant.code}
            size={TextSize.sm}
            className="bg-bg-surface-active rounded px-1"
          >
            desktop:
          </Text>
          . Switch sizes with the Storybook{" "}
          <Text as="strong" className="font-semibold">
            viewport
          </Text>{" "}
          toolbar (Mobile / Tablet / Desktop) — the same tokens as the design
          system.
        </Text>

        <div className="border-border-default bg-bg-subtle mt-4 rounded-lg border px-4 py-3">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
          >
            Current viewport
          </Text>
          <Text as="p" className="mt-1 font-mono text-lg font-semibold">
            {width}px →{" "}
            <Text as="span" color={TextColor.accent} className="capitalize">
              {active}
            </Text>
          </Text>
        </div>
      </header>

      <section className="mb-10 space-y-3">
        <Text as="h2" variant={TextVariant.heading} size={TextSize.md}>
          Tiers
        </Text>
        {breakpointOrder.map((name) => (
          <BreakpointCard key={name} name={name} active={name === active} />
        ))}
      </section>

      <section className="mb-10">
        <Text
          as="h2"
          variant={TextVariant.heading}
          size={TextSize.md}
          className="mb-2"
        >
          Storybook viewport toolbar
        </Text>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.sm}
          color={TextColor.muted}
          className="mb-4"
        >
          The toolbar lists only these three options (configured in{" "}
          <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
            .storybook/preview.tsx
          </Text>{" "}
          from{" "}
          <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
            designSystemViewports
          </Text>
          ).
        </Text>
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
        <Text
          as="h2"
          variant={TextVariant.heading}
          size={TextSize.md}
          className="mb-3"
        >
          Responsive demo
        </Text>
        <ResponsiveDemo />
      </section>

      <section>
        <Text
          as="h2"
          variant={TextVariant.heading}
          size={TextSize.md}
          className="mb-3"
        >
          Usage
        </Text>
        <ul className="list-disc space-y-2 pl-5">
          <Text
            as="li"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            <Text as="strong">Mobile-first:</Text> write mobile styles with no
            prefix, then override at larger tiers.
          </Text>
          <Text
            as="li"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Default Tailwind{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              sm:
            </Text>{" "}
            /{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              md:
            </Text>{" "}
            /{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              lg:
            </Text>{" "}
            variants are <Text as="strong">removed</Text> — use{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              tablet:
            </Text>{" "}
            and{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              desktop:
            </Text>{" "}
            only.
          </Text>
          <Text
            as="li"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Prefer layout changes (stack → row, hide sidebar) over unrelated
            visual rewrites per breakpoint.
          </Text>
        </ul>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Breakpoints",
  parameters: {
    layout: "fullscreen",
    // Layout documentation, not product components.
    a11y: { test: "off" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <BreakpointsDoc theme={theme} />;
  },
};
