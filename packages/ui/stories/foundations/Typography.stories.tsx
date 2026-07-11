import type { Meta, StoryObj } from "@storybook/react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { type ColorMode, colorModeMeta } from "../../src/tokens/colors";
import {
  type FontFamilyName,
  type FontSizeName,
  type FontWeightName,
  type LetterSpacingName,
  type LineHeightName,
  type TextStyleGroup,
  type TextStyleName,
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  textStyleGroups,
  textStyles,
} from "../../src/tokens/typography";

const sampleByGroup: Record<TextStyleGroup, string> = {
  display: "Ship faster with confidence",
  heading: "Deployment overview",
  body: "Monitor builds, previews, and production health from one place. Rollback in a click when something goes wrong.",
  label: "Environment",
  code: "pnpm deploy --env=production",
  metric: "99.98%",
};

const sizeClass: Record<FontSizeName, string> = {
  "2xs": "text-2xs",
  "xs": "text-xs",
  "sm": "text-sm",
  "md": "text-md",
  "lg": "text-lg",
  "xl": "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

function primaryFace(family: FontFamilyName): string {
  return fontFamilies[family].stack[0] ?? family;
}

function describeFamily(family: FontFamilyName): string {
  const face = primaryFace(family);
  return family === "mono"
    ? `${face} (monospace / code)`
    : `${face} (sans-serif / UI)`;
}

function describeWeight(weight: FontWeightName): string {
  const token = fontWeights[weight];
  return `${weight} · ${token.value}`;
}

function describeSize(size: FontSizeName): string {
  const token = fontSizes[size];
  return `${size} · ${token.px}px (${token.rem})`;
}

function describeLeading(leading: LineHeightName): string {
  return `${leading} · ${lineHeights[leading].value}`;
}

function describeTracking(tracking: LetterSpacingName): string {
  return `${tracking} · ${letterSpacings[tracking].value}`;
}

/** Derive Text size step from a semantic style name + group (e.g. body-md-medium → md-medium). */
function textStyleSize(name: TextStyleName, group: TextStyleGroup): TextSize {
  return name.slice(group.length + 1) as TextSize;
}

interface SpecRow {
  label: string;
  value: string;
}

function TypeSpecList({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="border-border-default bg-bg-subtle mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-md border px-3 py-2.5">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <Text
            as="dt"
            color={TextColor.muted}
            className="text-xs font-semibold tracking-wide uppercase"
          >
            {row.label}
          </Text>
          <Text as="dd" className="font-mono text-xs font-medium">
            {row.value}
          </Text>
        </div>
      ))}
    </dl>
  );
}

function SemanticStyleCard({
  name,
  group,
}: {
  name: TextStyleName;
  group: TextStyleGroup;
}) {
  const style = textStyles.find((s) => s.name === name);
  if (!style) return null;

  const face = primaryFace(style.family);
  const weightToken = fontWeights[style.weight];
  const sizeToken = fontSizes[style.size];

  const summary = [
    face,
    `${style.weight} (${weightToken.value})`,
    `${sizeToken.px}px`,
  ].join(" · ");

  const rows: SpecRow[] = [
    { label: "Utility", value: `text-${style.name}` },
    { label: "Family", value: describeFamily(style.family) },
    { label: "Face", value: face },
    { label: "Token", value: `font-${style.family}` },
    { label: "Weight", value: describeWeight(style.weight) },
    { label: "Size", value: describeSize(style.size) },
    { label: "Leading", value: describeLeading(style.leading) },
    { label: "Tracking", value: describeTracking(style.tracking) },
  ];

  if ("transform" in style && style.transform === "uppercase") {
    rows.push({ label: "Transform", value: "uppercase" });
  }
  if (style.group === "metric") {
    rows.push({ label: "Numeric", value: "tabular-nums" });
  }

  const specimenAs =
    group === "code"
      ? "code"
      : group === "heading" || group === "display"
        ? "h3"
        : "p";

  return (
    <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <Text
          as="code"
          variant={TextVariant.code}
          size={TextSize.sm}
          color={TextColor.accent}
          className="font-semibold"
        >
          text-{style.name}
        </Text>
        <Text
          as="span"
          className="border-border-default bg-bg-subtle rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize"
        >
          {group}
        </Text>
      </div>

      <Text as="p" className="text-sm font-medium">
        {summary}
      </Text>
      <Text as="p" color={TextColor.muted} className="mt-0.5 text-xs">
        {style.description}
      </Text>

      <Text
        as={specimenAs}
        variant={group as TextVariant}
        size={textStyleSize(style.name, group)}
        className="mt-4"
      >
        {sampleByGroup[group]}
      </Text>

      <TypeSpecList rows={rows} />
    </div>
  );
}

function TypographyDoc({ theme }: { theme: ColorMode }) {
  const meta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-3xl p-6 text-left">
      <header className="border-border-default mb-10 border-b pb-6">
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
            Typography
          </Text>
          <Text
            as="span"
            className="border-border-default bg-bg-subtle rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize"
          >
            {theme} · .{meta.className}
          </Text>
        </div>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.md}
          color={TextColor.muted}
          className="mt-2 max-w-2xl"
        >
          Use the{" "}
          <Text as="strong" className="font-semibold">
            Theme
          </Text>{" "}
          control in the Storybook toolbar (sun / moon) to switch light and
          dark. Each specimen lists family, weight, and size in plain language.
        </Text>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.md}
          className="mt-4"
        >
          The quick deploy jumped over the flaky test — default body on canvas.
        </Text>
        <Text
          as="p"
          color={TextColor.muted}
          className="mt-1 text-sm font-medium"
        >
          Inter · regular (400) · 14px · text-body-md + text-fg-default
        </Text>
      </header>

      <div className="space-y-10">
        {/* Families */}
        <section>
          <Text
            as="h2"
            variant={TextVariant.heading}
            size={TextSize.md}
            className="mb-2"
          >
            1. Families
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mb-4"
          >
            Product typefaces. Specs list the primary face and CSS token.
          </Text>
          <div className="grid gap-4">
            {Object.values(fontFamilies).map((family) => (
              <div
                key={family.name}
                className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-2">
                  <Text
                    as="span"
                    variant={TextVariant.label}
                    size={TextSize.lg}
                  >
                    font-{family.name}
                  </Text>
                  <Text
                    as="span"
                    variant={TextVariant.body}
                    size={TextSize.sm}
                    color={TextColor.muted}
                    className="font-medium"
                  >
                    {family.role}
                  </Text>
                </div>
                <Text as="p" className="text-sm font-medium">
                  Primary face: {family.stack[0]}
                </Text>
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                  className="mt-0.5"
                >
                  {family.description}
                </Text>

                <Text
                  as="p"
                  variant={
                    family.name === "mono" ? TextVariant.code : TextVariant.body
                  }
                  size={family.name === "mono" ? TextSize.md : TextSize.lg}
                  className="mt-4"
                >
                  The quick deploy jumped over the flaky test.
                </Text>

                <TypeSpecList
                  rows={[
                    { label: "Token", value: `font-${family.name}` },
                    { label: "Face", value: family.stack[0] ?? family.name },
                    {
                      label: "Kind",
                      value:
                        family.name === "mono" ? "monospace" : "sans-serif",
                    },
                    { label: "Role", value: family.role },
                    { label: "Stack", value: family.stack.join(", ") },
                  ]}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Size scale */}
        <section>
          <Text
            as="h2"
            variant={TextVariant.heading}
            size={TextSize.md}
            className="mb-2"
          >
            2. Size scale
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mb-4"
          >
            Size tokens change font-size (and default line-height). Family stays
            Inter / font-sans unless paired with a semantic style or font-mono.
          </Text>
          <div className="border-border-default bg-bg-canvas overflow-hidden rounded-lg border shadow-sm">
            {(Object.keys(fontSizes) as FontSizeName[]).map((name) => {
              const token = fontSizes[name];
              return (
                <div
                  key={name}
                  className="border-border-default border-b px-4 py-3 last:border-b-0"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <div className="text-fg-default w-28 shrink-0 font-mono text-xs font-medium">
                      text-{name}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Primitive size specimen — raw utility, not Text semantic style */}
                      <p
                        className={`${sizeClass[name]} text-fg-default truncate`}
                      >
                        Deploy pipeline status
                      </p>
                      <Text as="p" className="mt-1 text-sm font-medium">
                        Inter (font-sans) · regular (400) · {token.px}px /{" "}
                        {token.rem}
                      </Text>
                      <Text as="p" color={TextColor.muted} className="text-xs">
                        {token.description}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Weights / leading / tracking */}
        <section className="grid gap-4">
          <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
            <Text
              as="h2"
              variant={TextVariant.heading}
              size={TextSize.sm}
              className="mb-1"
            >
              Weights
            </Text>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
              className="mb-3"
            >
              Numeric CSS font-weight. Pair with a family (usually Inter).
            </Text>
            <ul className="space-y-3">
              {Object.entries(fontWeights).map(([name, token]) => (
                <li
                  key={name}
                  className="border-border-muted border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <Text
                    as="p"
                    variant={TextVariant.body}
                    size={TextSize.md}
                    style={{ fontWeight: token.value }}
                  >
                    Inter · {name} ({token.value}) — The quick deploy jumped
                    over the flaky test.
                  </Text>
                  <Text
                    as="p"
                    color={TextColor.muted}
                    className="mt-1 font-mono text-xs"
                  >
                    font-{name} · weight {token.value} · {token.description}
                  </Text>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
            <Text
              as="h2"
              variant={TextVariant.heading}
              size={TextSize.sm}
              className="mb-1"
            >
              Line height
            </Text>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
              className="mb-3"
            >
              Unitless multipliers on the font size. Each sample uses the same
              multi-line paragraph so you can compare vertical rhythm.
            </Text>
            <ul className="space-y-5">
              {Object.entries(lineHeights).map(([name, token]) => (
                <li
                  key={name}
                  className="border-border-muted border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <Text as="p" className="mb-2 font-mono text-xs font-semibold">
                    leading-{name}
                    <Text
                      as="span"
                      color={TextColor.muted}
                      className="font-medium"
                    >
                      {" "}
                      · {token.value} · {token.description}
                    </Text>
                  </Text>
                  <Text
                    as="p"
                    variant={TextVariant.body}
                    size={TextSize.md}
                    className="max-w-prose"
                    style={{ lineHeight: token.value }}
                  >
                    Monitor builds, previews, and production health from one
                    place. Rollback in a click when something goes wrong. Share
                    deploy links with your team and keep every environment in
                    sync without leaving the dashboard.
                  </Text>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
            <Text
              as="h2"
              variant={TextVariant.heading}
              size={TextSize.sm}
              className="mb-1"
            >
              Letter spacing
            </Text>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
              className="mb-3"
            >
              Tracking in ems relative to font size.
            </Text>
            <ul className="space-y-2">
              {Object.entries(letterSpacings).map(([name, token]) => (
                <Text
                  as="li"
                  key={name}
                  variant={TextVariant.body}
                  size={TextSize.sm}
                >
                  <Text as="span" className="font-mono text-xs font-semibold">
                    tracking-{name}
                  </Text>
                  <Text as="span" color={TextColor.muted}>
                    {" "}
                    · {token.value} · {token.description}
                  </Text>
                </Text>
              ))}
            </ul>
          </div>
        </section>

        {/* Semantic styles */}
        <section>
          <Text
            as="h2"
            variant={TextVariant.heading}
            size={TextSize.md}
            className="mb-2"
          >
            3. Semantic text styles
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            color={TextColor.muted}
            className="mb-6"
          >
            Full recipes: each card shows the live specimen plus family, weight,
            and size. Prefer{" "}
            <Text
              as="code"
              variant={TextVariant.code}
              size={TextSize.sm}
              className="bg-bg-surface-active rounded px-1"
            >
              text-heading-lg
            </Text>{" "}
            over ad-hoc size/weight combos.
          </Text>

          {textStyleGroups.map((group) => {
            const styles = textStyles.filter((s) => s.group === group);
            return (
              <div key={group} className="mb-8">
                <Text
                  as="h3"
                  variant={TextVariant.label}
                  size={TextSize.overline}
                  color={TextColor.muted}
                  className="mb-3"
                >
                  {group}
                </Text>
                <div className="space-y-3">
                  {styles.map((style) => (
                    <SemanticStyleCard
                      key={style.name}
                      name={style.name}
                      group={group}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* On-surface samples */}
        <section>
          <Text
            as="h2"
            variant={TextVariant.heading}
            size={TextSize.md}
            className="mb-2"
          >
            4. On-surface samples
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mb-4"
          >
            Common pairings of semantic type + foreground tokens. Specs call out
            face and weight.
          </Text>
          <div className="space-y-3">
            <div className="border-border-default bg-bg-canvas rounded-lg border p-4">
              <Text as="p" variant={TextVariant.heading} size={TextSize.lg}>
                Page title on canvas
              </Text>
              <Text
                as="p"
                color={TextColor.muted}
                className="mt-1 text-sm font-medium"
              >
                Inter · semibold (600) · 20px · text-heading-lg +
                text-fg-default
              </Text>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.md}
                color={TextColor.muted}
                className="mt-2"
              >
                Supporting copy — Inter · regular (400) · 14px · text-body-md +
                text-fg-muted
              </Text>
            </div>
            <div className="border-border-default bg-bg-surface rounded-lg border p-4">
              <Text as="p" variant={TextVariant.heading} size={TextSize.sm}>
                Card title on surface
              </Text>
              <Text
                as="p"
                color={TextColor.muted}
                className="mt-1 text-sm font-medium"
              >
                Inter · semibold (600) · 16px · text-heading-sm +
                text-fg-default
              </Text>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.muted}
                className="mt-2"
              >
                Meta — Inter · regular (400) · 12px · text-body-sm +
                text-fg-muted
              </Text>
              <Text
                as="code"
                variant={TextVariant.code}
                size={TextSize.sm}
                className="mt-2 block"
              >
                src/pipelines/deploy.ts
              </Text>
              <Text
                as="p"
                color={TextColor.muted}
                className="mt-1 text-sm font-medium"
              >
                JetBrains Mono · regular (400) · 14px · text-code-sm
              </Text>
            </div>
            <div className="bg-bg-inverse rounded-lg p-4">
              <Text
                as="p"
                variant={TextVariant.heading}
                size={TextSize.sm}
                color={TextColor.onInverse}
              >
                Inverse surface
              </Text>
              <Text
                as="p"
                color={TextColor.onInverse}
                className="text-fg-on-inverse/90 mt-1 text-sm font-medium"
              >
                Inter · semibold (600) · 16px · text-heading-sm +
                text-fg-on-inverse
              </Text>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.onInverse}
                className="text-fg-on-inverse/80 mt-2"
              >
                Tooltips and inverse chips use on-inverse text.
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-accent-solid rounded-md px-3 py-2">
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.lg}
                  color={TextColor.onAccent}
                >
                  Primary action
                </Text>
                <Text
                  as="p"
                  color={TextColor.onAccent}
                  className="text-fg-on-accent/90 mt-1 text-[11px] font-medium"
                >
                  Inter · medium (500) · 14px
                </Text>
              </div>
              <div className="bg-danger-solid rounded-md px-3 py-2">
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.lg}
                  color={TextColor.onDanger}
                >
                  Destructive
                </Text>
                <Text
                  as="p"
                  color={TextColor.onDanger}
                  className="text-fg-on-danger/90 mt-1 text-[11px] font-medium"
                >
                  Inter · medium (500) · 14px
                </Text>
              </div>
              <div className="bg-warning-solid rounded-md px-3 py-2">
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.lg}
                  color={TextColor.onWarning}
                >
                  Warning
                </Text>
                <Text
                  as="p"
                  color={TextColor.onWarning}
                  className="text-fg-on-warning/90 mt-1 text-[11px] font-medium"
                >
                  Inter · medium (500) · 14px
                </Text>
              </div>
              <div className="bg-success-subtle rounded-md px-3 py-2">
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.success}
                >
                  Healthy
                </Text>
                <Text
                  as="p"
                  color={TextColor.success}
                  className="mt-1 text-[11px] font-medium"
                >
                  Inter · medium (500) · 12px
                </Text>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "fullscreen",
    // Specimen grids, not product UI — axe contrast noise from scale demos.
    a11y: { test: "off" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <TypographyDoc theme={theme} />;
  },
};
