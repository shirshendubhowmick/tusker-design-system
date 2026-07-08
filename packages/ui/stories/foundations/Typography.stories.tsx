import type { Meta, StoryObj } from "@storybook/react";

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

const textStyleClass: Record<TextStyleName, string> = {
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "heading-xl": "text-heading-xl",
  "heading-lg": "text-heading-lg",
  "heading-md": "text-heading-md",
  "heading-sm": "text-heading-sm",
  "heading-xs": "text-heading-xs",
  "body-lg": "text-body-lg",
  "body-md": "text-body-md",
  "body-sm": "text-body-sm",
  "body-md-medium": "text-body-md-medium",
  "label-lg": "text-label-lg",
  "label-md": "text-label-md",
  "label-sm": "text-label-sm",
  "label-overline": "text-label-overline",
  "code-md": "text-code-md",
  "code-sm": "text-code-sm",
  "code-block": "text-code-block",
  "metric-lg": "text-metric-lg",
  "metric-md": "text-metric-md",
  "metric-sm": "text-metric-sm",
};

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

interface SpecRow {
  label: string;
  value: string;
}

function TypeSpecList({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="border-border-default bg-bg-subtle mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-md border px-3 py-2.5">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-fg-muted text-xs font-semibold tracking-wide uppercase">
            {row.label}
          </dt>
          <dd className="text-fg-default font-mono text-xs font-medium">
            {row.value}
          </dd>
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

  return (
    <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <code className="text-code-sm text-accent-text font-semibold">
          text-{style.name}
        </code>
        <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize">
          {group}
        </span>
      </div>

      <p className="text-fg-default text-sm font-medium">{summary}</p>
      <p className="text-fg-muted mt-0.5 text-xs">{style.description}</p>

      <p className={`mt-4 ${textStyleClass[style.name]} text-fg-default`}>
        {sampleByGroup[group]}
      </p>

      <TypeSpecList rows={rows} />
    </div>
  );
}

function TypographyDoc({ theme }: { theme: ColorMode }) {
  const meta = colorModeMeta[theme];

  return (
    <div className="mx-auto max-w-3xl p-6 text-left">
      <header className="border-border-default mb-10 border-b pb-6">
        <p className="text-label-overline text-accent-text mb-1">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Typography</h1>
          <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize">
            {theme} · .{meta.className}
          </span>
        </div>
        <p className="text-body-md text-fg-muted mt-2 max-w-2xl">
          Use the{" "}
          <strong className="text-fg-default font-semibold">Theme</strong>{" "}
          control in the Storybook toolbar (sun / moon) to switch light and
          dark. Each specimen lists family, weight, and size in plain language.
        </p>
        <p className="text-body-md text-fg-default mt-4">
          The quick deploy jumped over the flaky test — default body on canvas.
        </p>
        <p className="text-fg-muted mt-1 text-sm font-medium">
          Inter · regular (400) · 14px · text-body-md + text-fg-default
        </p>
      </header>

      <div className="space-y-10">
        {/* Families */}
        <section>
          <h2 className="text-heading-md text-fg-default mb-2">1. Families</h2>
          <p className="text-body-sm text-fg-muted mb-4">
            Product typefaces. Specs list the primary face and CSS token.
          </p>
          <div className="grid gap-4">
            {Object.values(fontFamilies).map((family) => (
              <div
                key={family.name}
                className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-label-lg text-fg-default">
                    font-{family.name}
                  </span>
                  <span className="text-body-sm text-fg-muted font-medium">
                    {family.role}
                  </span>
                </div>
                <p className="text-fg-default text-sm font-medium">
                  Primary face: {family.stack[0]}
                </p>
                <p className="text-body-sm text-fg-muted mt-0.5">
                  {family.description}
                </p>

                <p
                  className={
                    family.name === "mono"
                      ? "text-code-md text-fg-default mt-4"
                      : "text-body-lg text-fg-default mt-4"
                  }
                >
                  The quick deploy jumped over the flaky test.
                </p>

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
          <h2 className="text-heading-md text-fg-default mb-2">
            2. Size scale
          </h2>
          <p className="text-body-sm text-fg-muted mb-4">
            Size tokens change font-size (and default line-height). Family stays
            Inter / font-sans unless paired with a semantic style or font-mono.
          </p>
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
                      <p
                        className={`${sizeClass[name]} text-fg-default truncate`}
                      >
                        Deploy pipeline status
                      </p>
                      <p className="text-fg-default mt-1 text-sm font-medium">
                        Inter (font-sans) · regular (400) · {token.px}px /{" "}
                        {token.rem}
                      </p>
                      <p className="text-fg-muted text-xs">
                        {token.description}
                      </p>
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
            <h2 className="text-heading-sm text-fg-default mb-1">Weights</h2>
            <p className="text-body-sm text-fg-muted mb-3">
              Numeric CSS font-weight. Pair with a family (usually Inter).
            </p>
            <ul className="space-y-3">
              {Object.entries(fontWeights).map(([name, token]) => (
                <li
                  key={name}
                  className="border-border-muted border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <p
                    className="text-body-md text-fg-default"
                    style={{ fontWeight: token.value }}
                  >
                    Inter · {name} ({token.value}) — The quick deploy jumped
                    over the flaky test.
                  </p>
                  <p className="text-fg-muted mt-1 font-mono text-xs">
                    font-{name} · weight {token.value} · {token.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
            <h2 className="text-heading-sm text-fg-default mb-1">
              Line height
            </h2>
            <p className="text-body-sm text-fg-muted mb-3">
              Unitless multipliers on the font size. Each sample uses the same
              multi-line paragraph so you can compare vertical rhythm.
            </p>
            <ul className="space-y-5">
              {Object.entries(lineHeights).map(([name, token]) => (
                <li
                  key={name}
                  className="border-border-muted border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <p className="text-fg-default mb-2 font-mono text-xs font-semibold">
                    leading-{name}
                    <span className="text-fg-muted font-medium">
                      {" "}
                      · {token.value} · {token.description}
                    </span>
                  </p>
                  <p
                    className="text-body-md text-fg-default max-w-prose"
                    style={{ lineHeight: token.value }}
                  >
                    Monitor builds, previews, and production health from one
                    place. Rollback in a click when something goes wrong. Share
                    deploy links with your team and keep every environment in
                    sync without leaving the dashboard.
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border-default bg-bg-canvas rounded-lg border p-4 shadow-sm">
            <h2 className="text-heading-sm text-fg-default mb-1">
              Letter spacing
            </h2>
            <p className="text-body-sm text-fg-muted mb-3">
              Tracking in ems relative to font size.
            </p>
            <ul className="space-y-2">
              {Object.entries(letterSpacings).map(([name, token]) => (
                <li key={name} className="text-body-sm text-fg-default">
                  <span className="text-fg-default font-mono text-xs font-semibold">
                    tracking-{name}
                  </span>
                  <span className="text-fg-muted">
                    {" "}
                    · {token.value} · {token.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Semantic styles */}
        <section>
          <h2 className="text-heading-md text-fg-default mb-2">
            3. Semantic text styles
          </h2>
          <p className="text-body-md text-fg-muted mb-6">
            Full recipes: each card shows the live specimen plus family, weight,
            and size. Prefer{" "}
            <code className="bg-bg-surface-active text-code-sm text-fg-default rounded px-1">
              text-heading-lg
            </code>{" "}
            over ad-hoc size/weight combos.
          </p>

          {textStyleGroups.map((group) => {
            const styles = textStyles.filter((s) => s.group === group);
            return (
              <div key={group} className="mb-8">
                <h3 className="text-label-overline text-fg-muted mb-3">
                  {group}
                </h3>
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
          <h2 className="text-heading-md text-fg-default mb-2">
            4. On-surface samples
          </h2>
          <p className="text-body-sm text-fg-muted mb-4">
            Common pairings of semantic type + foreground tokens. Specs call out
            face and weight.
          </p>
          <div className="space-y-3">
            <div className="border-border-default bg-bg-canvas rounded-lg border p-4">
              <p className="text-heading-lg text-fg-default">
                Page title on canvas
              </p>
              <p className="text-fg-muted mt-1 text-sm font-medium">
                Inter · semibold (600) · 20px · text-heading-lg +
                text-fg-default
              </p>
              <p className="text-body-md text-fg-muted mt-2">
                Supporting copy — Inter · regular (400) · 14px · text-body-md +
                text-fg-muted
              </p>
            </div>
            <div className="border-border-default bg-bg-surface rounded-lg border p-4">
              <p className="text-heading-sm text-fg-default">
                Card title on surface
              </p>
              <p className="text-fg-muted mt-1 text-sm font-medium">
                Inter · semibold (600) · 16px · text-heading-sm +
                text-fg-default
              </p>
              <p className="text-body-sm text-fg-muted mt-2">
                Meta — Inter · regular (400) · 12px · text-body-sm +
                text-fg-muted
              </p>
              <code className="text-code-sm text-fg-default mt-2 block">
                src/pipelines/deploy.ts
              </code>
              <p className="text-fg-muted mt-1 text-sm font-medium">
                JetBrains Mono · regular (400) · 14px · text-code-sm
              </p>
            </div>
            <div className="bg-bg-inverse rounded-lg p-4">
              <p className="text-heading-sm text-fg-on-inverse">
                Inverse surface
              </p>
              <p className="text-fg-on-inverse/90 mt-1 text-sm font-medium">
                Inter · semibold (600) · 16px · text-heading-sm +
                text-fg-on-inverse
              </p>
              <p className="text-body-sm text-fg-on-inverse/80 mt-2">
                Tooltips and inverse chips use on-inverse text.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-accent-solid rounded-md px-3 py-2">
                <span className="text-label-lg text-fg-on-accent">
                  Primary action
                </span>
                <p className="text-fg-on-accent/90 mt-1 text-[11px] font-medium">
                  Inter · medium (500) · 14px
                </p>
              </div>
              <div className="bg-danger-solid rounded-md px-3 py-2">
                <span className="text-label-lg text-fg-on-danger">
                  Destructive
                </span>
                <p className="text-fg-on-danger/90 mt-1 text-[11px] font-medium">
                  Inter · medium (500) · 14px
                </p>
              </div>
              <div className="bg-warning-solid rounded-md px-3 py-2">
                <span className="text-label-lg text-fg-on-warning">
                  Warning
                </span>
                <p className="text-fg-on-warning/90 mt-1 text-[11px] font-medium">
                  Inter · medium (500) · 14px
                </p>
              </div>
              <div className="bg-success-subtle rounded-md px-3 py-2">
                <span className="text-label-md text-success-text">Healthy</span>
                <p className="text-success-text mt-1 text-[11px] font-medium">
                  Inter · medium (500) · 12px
                </p>
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
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <TypographyDoc theme={theme} />;
  },
};
