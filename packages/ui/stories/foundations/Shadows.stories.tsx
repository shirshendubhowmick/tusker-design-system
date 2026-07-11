import type { Meta, StoryObj } from "@storybook/react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import {
  type ColorMode,
  colorModeMeta,
  formatSemanticRef,
  semanticColorTokens,
} from "../../src/tokens/colors";
import {
  type ShadowName,
  shadowElevationOrder,
  shadowTokens,
  shadowTopOrder,
} from "../../src/tokens/shadows";

/** Explicit utilities so Tailwind emits classes. */
const shadowClass: Record<ShadowName, string> = {
  "none": "shadow-none",
  "xs": "shadow-xs",
  "sm": "shadow-sm",
  "md": "shadow-md",
  "lg": "shadow-lg",
  "xl": "shadow-xl",
  "top-xs": "shadow-top-xs",
  "top-sm": "shadow-top-sm",
  "top-md": "shadow-top-md",
  "top-lg": "shadow-top-lg",
  "inner": "shadow-inner",
  "border": "shadow-border",
  "focus": "shadow-focus",
};

/**
 * Semantic surfaces to preview elevation against, ordered light → heavy app chrome.
 * (inverse last — inverted solid for contrast stress-test)
 */
const semanticSurfaces = [
  {
    token: "bg-canvas",
    utility: "bg-bg-canvas",
    label: "Canvas",
    inverse: false,
  },
  {
    token: "bg-subtle",
    utility: "bg-bg-subtle",
    label: "Subtle",
    inverse: false,
  },
  {
    token: "bg-surface",
    utility: "bg-bg-surface",
    label: "Surface",
    inverse: false,
  },
  {
    token: "bg-surface-hover",
    utility: "bg-bg-surface-hover",
    label: "Surface hover",
    inverse: false,
  },
  {
    token: "bg-surface-active",
    utility: "bg-bg-surface-active",
    label: "Surface active",
    inverse: false,
  },
  {
    token: "bg-inverse",
    utility: "bg-bg-inverse",
    label: "Inverse",
    inverse: true,
  },
] as const;

type SemanticSurface = (typeof semanticSurfaces)[number];

const elevationShadows = shadowElevationOrder.filter(
  (n) => n !== "none",
) as ShadowName[];

function surfaceMeta(tokenName: string, theme: ColorMode) {
  const token = semanticColorTokens.find((t) => t.name === tokenName);
  if (!token) return { description: "", ref: "" };
  const ref = formatSemanticRef(theme === "dark" ? token.dark : token.light);
  return { description: token.description, ref };
}

function SurfaceRow({
  surface,
  shadows,
  direction,
  theme,
}: {
  surface: SemanticSurface;
  shadows: readonly ShadowName[];
  direction: "down" | "up";
  theme: ColorMode;
}) {
  const meta = surfaceMeta(surface.token, theme);
  const titleColor = surface.inverse ? TextColor.onInverse : TextColor.default;
  const mutedColor = surface.inverse ? TextColor.onInverse : TextColor.muted;
  const mutedOpacityClass = surface.inverse
    ? "text-fg-on-inverse/80"
    : undefined;
  const borderClass = surface.inverse
    ? "border-white/15"
    : "border-border-default";

  return (
    <section className={`overflow-hidden rounded-xl border ${borderClass}`}>
      <header
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${borderClass} ${surface.utility}`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <Text as="h3" color={titleColor} className="text-sm font-semibold">
              {surface.label}
            </Text>
            <Text
              as="code"
              color={mutedColor}
              className={`font-mono text-[11px] font-medium ${mutedOpacityClass ?? ""}`}
            >
              {surface.token}
            </Text>
          </div>
          <Text
            as="p"
            color={mutedColor}
            className={`mt-0.5 text-xs ${mutedOpacityClass ?? ""}`}
          >
            {meta.description}
            {meta.ref ? (
              <>
                {" "}
                · maps to <span className="font-mono">{meta.ref}</span> in{" "}
                {theme}
              </>
            ) : null}
          </Text>
        </div>
        <Text
          as="code"
          color={mutedColor}
          className={`shrink-0 font-mono text-[11px] ${mutedOpacityClass ?? ""}`}
        >
          {surface.utility}
        </Text>
      </header>

      <div className={`${surface.utility} overflow-visible p-8`}>
        {direction === "down" ? (
          <div className="flex flex-wrap items-end justify-start gap-5">
            {shadows.map((name) => (
              <div key={name} className="flex w-30 flex-col items-center gap-2">
                {/* Elevated sample sits on the semantic surface behind it */}
                <div
                  className={`border-border-default bg-bg-surface flex h-20 w-full items-center justify-center rounded-lg border ${shadowClass[name]}`}
                >
                  <Text
                    as="span"
                    className="font-mono text-[11px] font-semibold"
                  >
                    {shadowTokens[name].utility.replace("shadow-", "")}
                  </Text>
                </div>
                <Text
                  as="span"
                  color={mutedColor}
                  className={`font-mono text-[10px] font-medium ${mutedOpacityClass ?? ""}`}
                >
                  {shadowTokens[name].utility}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shadows.map((name) => (
              <div key={name} className="space-y-2">
                <Text
                  as="p"
                  color={mutedColor}
                  className={`font-mono text-[11px] font-medium ${mutedOpacityClass ?? ""}`}
                >
                  {shadowTokens[name].utility}
                </Text>
                {/* Mini page on this semantic surface color */}
                <div
                  className={`relative h-36 overflow-hidden rounded-lg border ${borderClass} ${surface.utility}`}
                >
                  <div className="space-y-2 p-3 opacity-70">
                    <div
                      className={`h-2 w-3/4 rounded ${surface.inverse ? "bg-fg-on-inverse/20" : "bg-bg-surface-active"}`}
                    />
                    <div
                      className={`h-2 w-full rounded ${surface.inverse ? "bg-fg-on-inverse/20" : "bg-bg-surface-active"}`}
                    />
                    <div
                      className={`h-2 w-5/6 rounded ${surface.inverse ? "bg-fg-on-inverse/20" : "bg-bg-surface-active"}`}
                    />
                    <div
                      className={`h-2 w-1/2 rounded ${surface.inverse ? "bg-fg-on-inverse/20" : "bg-bg-surface-active"}`}
                    />
                  </div>
                  <div
                    className={`border-border-default bg-bg-surface absolute inset-x-0 bottom-0 rounded-t-lg border border-b-0 px-3 py-3 ${shadowClass[name]}`}
                  >
                    <div className="bg-border-strong mx-auto mb-2 h-1 w-8 rounded-full" />
                    <Text as="p" className="text-[11px] font-semibold">
                      Bottom sheet
                    </Text>
                    <Text
                      as="p"
                      color={TextColor.muted}
                      className="text-[10px]"
                    >
                      Top shadow onto content above
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ShadowsDoc({ theme }: { theme: ColorMode }) {
  const modeMeta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-5xl p-6 text-left">
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
            Shadows
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
          className="mt-2 max-w-2xl"
        >
          Elevation previewed on product{" "}
          <Text as="strong">semantic surfaces</Text> — canvas → subtle → surface
          → hover → active → inverse. Dark mode uses black occlusion (darker
          penumbra), not grey glows. Switch theme from the toolbar.
        </Text>
      </header>

      {/* Semantic surface legend */}
      <section className="border-border-default bg-bg-subtle mb-8 rounded-lg border p-4">
        <Text
          as="h2"
          variant={TextVariant.heading}
          size={TextSize.sm}
          className="mb-3"
        >
          Semantic surfaces
        </Text>
        <div className="tablet:grid-cols-3 desktop:grid-cols-6 grid gap-2">
          {semanticSurfaces.map((surface) => {
            const meta = surfaceMeta(surface.token, theme);
            const labelColor = surface.inverse
              ? TextColor.onInverse
              : TextColor.default;
            const mutedColor = surface.inverse
              ? TextColor.onInverse
              : TextColor.muted;
            const subtleColor = surface.inverse
              ? TextColor.onInverse
              : TextColor.subtle;
            return (
              <div
                key={surface.token}
                className={`border-border-default rounded-lg border p-3 ${surface.utility}`}
              >
                <Text
                  as="p"
                  color={labelColor}
                  className="text-xs font-semibold"
                >
                  {surface.label}
                </Text>
                <Text
                  as="p"
                  color={mutedColor}
                  className={`mt-1 font-mono text-[10px] ${surface.inverse ? "text-fg-on-inverse/80" : ""}`}
                >
                  {surface.utility}
                </Text>
                <Text
                  as="p"
                  color={subtleColor}
                  className={`mt-1 font-mono text-[10px] ${surface.inverse ? "text-fg-on-inverse/70" : ""}`}
                >
                  → {meta.ref}
                </Text>
              </div>
            );
          })}
        </div>
      </section>

      {/* Downward */}
      <section className="mb-12 space-y-6">
        <div>
          <Text as="h2" variant={TextVariant.heading} size={TextSize.md}>
            1. Downward elevation
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-1"
          >
            Shadow falls below the sample. Sample fill is{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              bg-bg-surface
            </Text>{" "}
            so the black penumbra darkens the semantic backdrop behind it.
          </Text>
          <div className="mt-2 flex flex-wrap gap-2">
            {elevationShadows.map((name) => (
              <Text
                as="code"
                key={name}
                className="border-border-default bg-bg-canvas rounded border px-1.5 py-0.5 font-mono text-[11px]"
              >
                {shadowTokens[name].utility}
              </Text>
            ))}
          </div>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-2"
          >
            Dark mode tip:{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              canvas
            </Text>{" "}
            /{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              subtle
            </Text>{" "}
            are already near-black, so penumbra headroom is small. Prefer
            floating UI on those backdrops at{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              shadow-sm
            </Text>
            + (not xs), and lift the element with{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              bg-bg-surface
            </Text>
            .
          </Text>
        </div>

        {semanticSurfaces.map((surface) => (
          <SurfaceRow
            key={`down-${surface.token}`}
            surface={surface}
            shadows={elevationShadows}
            direction="down"
            theme={theme}
          />
        ))}
      </section>

      {/* Top */}
      <section className="mb-12 space-y-6">
        <div>
          <Text as="h2" variant={TextVariant.heading} size={TextSize.md}>
            2. Top (upward) elevation
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-1"
          >
            Bottom sheets / sticky footers — shadow casts onto content above.
            Sheet uses{" "}
            <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
              bg-bg-surface
            </Text>
            .
          </Text>
          <div className="mt-2 flex flex-wrap gap-2">
            {shadowTopOrder.map((name) => (
              <Text
                as="code"
                key={name}
                className="border-border-default bg-bg-canvas rounded border px-1.5 py-0.5 font-mono text-[11px]"
              >
                {shadowTokens[name].utility}
              </Text>
            ))}
          </div>
        </div>

        {semanticSurfaces.map((surface) => (
          <SurfaceRow
            key={`up-${surface.token}`}
            surface={surface}
            shadows={shadowTopOrder}
            direction="up"
            theme={theme}
          />
        ))}
      </section>

      {/* Special */}
      <section className="mb-8 space-y-6">
        <div>
          <Text as="h2" variant={TextVariant.heading} size={TextSize.md}>
            3. Special tokens
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-1"
          >
            On primary product surfaces only (canvas, subtle, surface, inverse).
          </Text>
        </div>
        {semanticSurfaces
          .filter((s) =>
            ["bg-canvas", "bg-subtle", "bg-surface", "bg-inverse"].includes(
              s.token,
            ),
          )
          .map((surface) => (
            <SurfaceRow
              key={`special-${surface.token}`}
              surface={surface}
              shadows={["inner", "border", "focus", "none"]}
              direction="down"
              theme={theme}
            />
          ))}
      </section>

      {/* Reference */}
      <section>
        <Text
          as="h2"
          variant={TextVariant.heading}
          size={TextSize.md}
          className="mb-3"
        >
          Token reference
        </Text>
        <div className="border-border-default overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-fg-muted text-xs font-semibold tracking-wide uppercase">
              <tr>
                <th className="px-3 py-2">Utility</th>
                <th className="px-3 py-2">Group</th>
                <th className="px-3 py-2">Use for</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ...elevationShadows,
                  ...shadowTopOrder,
                  "inner",
                  "border",
                  "focus",
                  "none",
                ] as ShadowName[]
              ).map((name) => {
                const token = shadowTokens[name];
                return (
                  <tr key={name} className="border-border-default border-t">
                    <td className="text-accent-text px-3 py-2 font-mono text-xs font-medium">
                      {token.utility}
                    </td>
                    <td className="text-fg-muted px-3 py-2 text-xs capitalize">
                      {token.group}
                    </td>
                    <td className="text-fg-muted px-3 py-2 text-xs">
                      {token.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Shadows",
  parameters: {
    layout: "fullscreen",
    // Elevation specimens only; not interactive product UI.
    a11y: { test: "off" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <ShadowsDoc theme={theme} />;
  },
};
