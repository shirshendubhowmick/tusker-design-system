import type { Meta, StoryObj } from '@storybook/react';
import {
  shadowTokens,
  shadowElevationOrder,
  shadowTopOrder,
  type ShadowName,
} from '../../src/tokens/shadows';
import {
  colorModeMeta,
  formatSemanticRef,
  semanticColorTokens,
  type ColorMode,
} from '../../src/tokens/colors';

/** Explicit utilities so Tailwind emits classes. */
const shadowClass: Record<ShadowName, string> = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  'top-xs': 'shadow-top-xs',
  'top-sm': 'shadow-top-sm',
  'top-md': 'shadow-top-md',
  'top-lg': 'shadow-top-lg',
  inner: 'shadow-inner',
  border: 'shadow-border',
  focus: 'shadow-focus',
};

/**
 * Semantic surfaces to preview elevation against, ordered light → heavy app chrome.
 * (inverse last — inverted solid for contrast stress-test)
 */
const semanticSurfaces = [
  {
    token: 'bg-canvas',
    utility: 'bg-bg-canvas',
    label: 'Canvas',
    inverse: false,
  },
  {
    token: 'bg-subtle',
    utility: 'bg-bg-subtle',
    label: 'Subtle',
    inverse: false,
  },
  {
    token: 'bg-surface',
    utility: 'bg-bg-surface',
    label: 'Surface',
    inverse: false,
  },
  {
    token: 'bg-surface-hover',
    utility: 'bg-bg-surface-hover',
    label: 'Surface hover',
    inverse: false,
  },
  {
    token: 'bg-surface-active',
    utility: 'bg-bg-surface-active',
    label: 'Surface active',
    inverse: false,
  },
  {
    token: 'bg-inverse',
    utility: 'bg-bg-inverse',
    label: 'Inverse',
    inverse: true,
  },
] as const;

type SemanticSurface = (typeof semanticSurfaces)[number];

const elevationShadows = shadowElevationOrder.filter((n) => n !== 'none') as ShadowName[];

function surfaceMeta(tokenName: string, theme: ColorMode) {
  const token = semanticColorTokens.find((t) => t.name === tokenName);
  if (!token) return { description: '', ref: '' };
  const ref = formatSemanticRef(theme === 'dark' ? token.dark : token.light);
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
  direction: 'down' | 'up';
  theme: ColorMode;
}) {
  const meta = surfaceMeta(surface.token, theme);
  const titleClass = surface.inverse ? 'text-fg-on-inverse' : 'text-fg-default';
  const mutedClass = surface.inverse ? 'text-fg-on-inverse/80' : 'text-fg-muted';
  const borderClass = surface.inverse ? 'border-white/15' : 'border-border-default';

  return (
    <section className={`overflow-hidden rounded-xl border ${borderClass}`}>
      <header
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${borderClass} ${surface.utility}`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className={`text-sm font-semibold ${titleClass}`}>{surface.label}</h3>
            <code className={`font-mono text-[11px] font-medium ${mutedClass}`}>
              {surface.token}
            </code>
          </div>
          <p className={`mt-0.5 text-xs ${mutedClass}`}>
            {meta.description}
            {meta.ref ? (
              <>
                {' '}
                · maps to <span className="font-mono">{meta.ref}</span> in {theme}
              </>
            ) : null}
          </p>
        </div>
        <code className={`shrink-0 font-mono text-[11px] ${mutedClass}`}>{surface.utility}</code>
      </header>

      <div className={`${surface.utility} overflow-visible p-8`}>
        {direction === 'down' ? (
          <div className="flex flex-wrap items-end justify-start gap-5">
            {shadows.map((name) => (
              <div key={name} className="flex w-[7.5rem] flex-col items-center gap-2">
                {/* Elevated sample sits on the semantic surface behind it */}
                <div
                  className={`flex h-20 w-full items-center justify-center rounded-lg border border-border-default bg-bg-surface ${shadowClass[name]}`}
                >
                  <span className="font-mono text-[11px] font-semibold text-fg-default">
                    {shadowTokens[name].utility.replace('shadow-', '')}
                  </span>
                </div>
                <span className={`font-mono text-[10px] font-medium ${mutedClass}`}>
                  {shadowTokens[name].utility}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shadows.map((name) => (
              <div key={name} className="space-y-2">
                <p className={`font-mono text-[11px] font-medium ${mutedClass}`}>
                  {shadowTokens[name].utility}
                </p>
                {/* Mini page on this semantic surface color */}
                <div
                  className={`relative h-36 overflow-hidden rounded-lg border ${borderClass} ${surface.utility}`}
                >
                  <div className="space-y-2 p-3 opacity-70">
                    <div
                      className={`h-2 w-3/4 rounded ${surface.inverse ? 'bg-fg-on-inverse/20' : 'bg-bg-surface-active'}`}
                    />
                    <div
                      className={`h-2 w-full rounded ${surface.inverse ? 'bg-fg-on-inverse/20' : 'bg-bg-surface-active'}`}
                    />
                    <div
                      className={`h-2 w-5/6 rounded ${surface.inverse ? 'bg-fg-on-inverse/20' : 'bg-bg-surface-active'}`}
                    />
                    <div
                      className={`h-2 w-1/2 rounded ${surface.inverse ? 'bg-fg-on-inverse/20' : 'bg-bg-surface-active'}`}
                    />
                  </div>
                  <div
                    className={`absolute inset-x-0 bottom-0 rounded-t-lg border border-b-0 border-border-default bg-bg-surface px-3 py-3 ${shadowClass[name]}`}
                  >
                    <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-border-strong" />
                    <p className="text-[11px] font-semibold text-fg-default">Bottom sheet</p>
                    <p className="text-[10px] text-fg-muted">Top shadow onto content above</p>
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
      <header className="mb-8 border-b border-border-default pb-6">
        <p className="mb-1 text-label-overline text-accent-text">Foundations</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-heading-xl text-fg-default">Shadows</h1>
          <span className="rounded-md border border-border-default bg-bg-subtle px-2 py-0.5 font-mono text-xs font-medium capitalize text-fg-default">
            {theme} · .{modeMeta.className}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-body-md text-fg-muted">
          Elevation previewed on product <strong className="text-fg-default">semantic surfaces</strong>{' '}
          — canvas → subtle → surface → hover → active → inverse. Dark mode uses black occlusion (darker penumbra), not grey glows. Switch theme from the toolbar.
        </p>
      </header>

      {/* Semantic surface legend */}
      <section className="mb-8 rounded-lg border border-border-default bg-bg-subtle p-4">
        <h2 className="mb-3 text-heading-sm text-fg-default">Semantic surfaces</h2>
        <div className="grid gap-2 tablet:grid-cols-3 desktop:grid-cols-6">
          {semanticSurfaces.map((surface) => {
            const meta = surfaceMeta(surface.token, theme);
            return (
              <div
                key={surface.token}
                className={`rounded-lg border border-border-default p-3 ${surface.utility}`}
              >
                <p
                  className={`text-xs font-semibold ${surface.inverse ? 'text-fg-on-inverse' : 'text-fg-default'}`}
                >
                  {surface.label}
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] ${surface.inverse ? 'text-fg-on-inverse/80' : 'text-fg-muted'}`}
                >
                  {surface.utility}
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] ${surface.inverse ? 'text-fg-on-inverse/70' : 'text-fg-subtle'}`}
                >
                  → {meta.ref}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Downward */}
      <section className="mb-12 space-y-6">
        <div>
          <h2 className="text-heading-md text-fg-default">1. Downward elevation</h2>
          <p className="mt-1 text-body-sm text-fg-muted">
            Shadow falls below the sample. Sample fill is{' '}
            <code className="text-code-sm text-fg-default">bg-bg-surface</code> so the black
            penumbra darkens the semantic backdrop behind it.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {elevationShadows.map((name) => (
              <code
                key={name}
                className="rounded border border-border-default bg-bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-fg-default"
              >
                {shadowTokens[name].utility}
              </code>
            ))}
          </div>
        <p className="mt-2 text-body-sm text-fg-muted">
          Dark mode tip: <code className="text-code-sm">canvas</code> /{' '}
          <code className="text-code-sm">subtle</code> are already near-black, so penumbra headroom
          is small. Prefer floating UI on those backdrops at{' '}
          <code className="text-code-sm">shadow-sm</code>+ (not xs), and lift the element with{' '}
          <code className="text-code-sm">bg-bg-surface</code>.
        </p>
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
          <h2 className="text-heading-md text-fg-default">2. Top (upward) elevation</h2>
          <p className="mt-1 text-body-sm text-fg-muted">
            Bottom sheets / sticky footers — shadow casts onto content above. Sheet uses{' '}
            <code className="text-code-sm text-fg-default">bg-bg-surface</code>.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {shadowTopOrder.map((name) => (
              <code
                key={name}
                className="rounded border border-border-default bg-bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-fg-default"
              >
                {shadowTokens[name].utility}
              </code>
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
          <h2 className="text-heading-md text-fg-default">3. Special tokens</h2>
          <p className="mt-1 text-body-sm text-fg-muted">
            On primary product surfaces only (canvas, subtle, surface, inverse).
          </p>
        </div>
        {semanticSurfaces
          .filter((s) =>
            ['bg-canvas', 'bg-subtle', 'bg-surface', 'bg-inverse'].includes(s.token),
          )
          .map((surface) => (
            <SurfaceRow
              key={`special-${surface.token}`}
              surface={surface}
              shadows={['inner', 'border', 'focus', 'none']}
              direction="down"
              theme={theme}
            />
          ))}
      </section>

      {/* Reference */}
      <section>
        <h2 className="mb-3 text-heading-md text-fg-default">Token reference</h2>
        <div className="overflow-hidden rounded-lg border border-border-default">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-xs font-semibold uppercase tracking-wide text-fg-muted">
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
                  'inner',
                  'border',
                  'focus',
                  'none',
                ] as ShadowName[]
              ).map((name) => {
                const token = shadowTokens[name];
                return (
                  <tr key={name} className="border-t border-border-default">
                    <td className="px-3 py-2 font-mono text-xs font-medium text-accent-text">
                      {token.utility}
                    </td>
                    <td className="px-3 py-2 text-xs capitalize text-fg-muted">{token.group}</td>
                    <td className="px-3 py-2 text-xs text-fg-muted">{token.description}</td>
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
  title: 'Foundations/Shadows',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === 'dark' ? 'dark' : 'light';
    return <ShadowsDoc theme={theme} />;
  },
};
