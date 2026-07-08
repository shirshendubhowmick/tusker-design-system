import type { Meta, StoryObj } from "@storybook/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  type ColorMode,
  type PaletteName,
  RADIX_STEPS,
  type RadixStep,
  type SemanticColorGroup,
  colorModeMeta,
  formatSemanticRef,
  hasModeOverride,
  palette,
  semanticColorGroups,
  semanticColorTokens,
} from "../../src/tokens/colors";

const paletteBg: Record<PaletteName, Record<RadixStep, string>> = {
  gray: {
    1: "bg-gray-1",
    2: "bg-gray-2",
    3: "bg-gray-3",
    4: "bg-gray-4",
    5: "bg-gray-5",
    6: "bg-gray-6",
    7: "bg-gray-7",
    8: "bg-gray-8",
    9: "bg-gray-9",
    10: "bg-gray-10",
    11: "bg-gray-11",
    12: "bg-gray-12",
  },
  brand: {
    1: "bg-brand-1",
    2: "bg-brand-2",
    3: "bg-brand-3",
    4: "bg-brand-4",
    5: "bg-brand-5",
    6: "bg-brand-6",
    7: "bg-brand-7",
    8: "bg-brand-8",
    9: "bg-brand-9",
    10: "bg-brand-10",
    11: "bg-brand-11",
    12: "bg-brand-12",
  },
  green: {
    1: "bg-green-1",
    2: "bg-green-2",
    3: "bg-green-3",
    4: "bg-green-4",
    5: "bg-green-5",
    6: "bg-green-6",
    7: "bg-green-7",
    8: "bg-green-8",
    9: "bg-green-9",
    10: "bg-green-10",
    11: "bg-green-11",
    12: "bg-green-12",
  },
  amber: {
    1: "bg-amber-1",
    2: "bg-amber-2",
    3: "bg-amber-3",
    4: "bg-amber-4",
    5: "bg-amber-5",
    6: "bg-amber-6",
    7: "bg-amber-7",
    8: "bg-amber-8",
    9: "bg-amber-9",
    10: "bg-amber-10",
    11: "bg-amber-11",
    12: "bg-amber-12",
  },
  red: {
    1: "bg-red-1",
    2: "bg-red-2",
    3: "bg-red-3",
    4: "bg-red-4",
    5: "bg-red-5",
    6: "bg-red-6",
    7: "bg-red-7",
    8: "bg-red-8",
    9: "bg-red-9",
    10: "bg-red-10",
    11: "bg-red-11",
    12: "bg-red-12",
  },
  cyan: {
    1: "bg-cyan-1",
    2: "bg-cyan-2",
    3: "bg-cyan-3",
    4: "bg-cyan-4",
    5: "bg-cyan-5",
    6: "bg-cyan-6",
    7: "bg-cyan-7",
    8: "bg-cyan-8",
    9: "bg-cyan-9",
    10: "bg-cyan-10",
    11: "bg-cyan-11",
    12: "bg-cyan-12",
  },
};

const semanticBgClass: Record<string, string> = {
  "bg-canvas": "bg-bg-canvas",
  "bg-subtle": "bg-bg-subtle",
  "bg-surface": "bg-bg-surface",
  "bg-surface-hover": "bg-bg-surface-hover",
  "bg-surface-active": "bg-bg-surface-active",
  "bg-inverse": "bg-bg-inverse",
  "fg-default": "bg-fg-default",
  "fg-muted": "bg-fg-muted",
  "fg-subtle": "bg-fg-subtle",
  "fg-on-accent": "bg-fg-on-accent",
  "fg-on-inverse": "bg-fg-on-inverse",
  "fg-on-success": "bg-fg-on-success",
  "fg-on-warning": "bg-fg-on-warning",
  "fg-on-danger": "bg-fg-on-danger",
  "fg-on-info": "bg-fg-on-info",
  "border-default": "bg-border-default",
  "border-muted": "bg-border-muted",
  "border-strong": "bg-border-strong",
  "border-hover": "bg-border-hover",
  "accent-solid": "bg-accent-solid",
  "accent-solid-hover": "bg-accent-solid-hover",
  "accent-subtle": "bg-accent-subtle",
  "accent-subtle-hover": "bg-accent-subtle-hover",
  "accent-border": "bg-accent-border",
  "accent-text": "bg-accent-text",
  "success-solid": "bg-success-solid",
  "success-solid-hover": "bg-success-solid-hover",
  "success-subtle": "bg-success-subtle",
  "success-border": "bg-success-border",
  "success-text": "bg-success-text",
  "warning-solid": "bg-warning-solid",
  "warning-solid-hover": "bg-warning-solid-hover",
  "warning-subtle": "bg-warning-subtle",
  "warning-border": "bg-warning-border",
  "warning-text": "bg-warning-text",
  "danger-solid": "bg-danger-solid",
  "danger-solid-hover": "bg-danger-solid-hover",
  "danger-subtle": "bg-danger-subtle",
  "danger-border": "bg-danger-border",
  "danger-text": "bg-danger-text",
  "info-solid": "bg-info-solid",
  "info-solid-hover": "bg-info-solid-hover",
  "info-subtle": "bg-info-subtle",
  "info-border": "bg-info-border",
  "info-text": "bg-info-text",
  "focus-ring": "bg-focus-ring",
  "overlay-scrim": "bg-overlay-scrim",
};

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const el = document.createElement("textarea");
    el.value = value;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function cssColorToHex(input: string): string | null {
  const value = input.trim();
  if (!value || value === "transparent") return null;

  if (value.startsWith("#")) {
    if (value.length === 4) {
      const r = value[1];
      const g = value[2];
      const b = value[3];
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return value.toUpperCase();
  }

  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
  );
  if (rgb) {
    const r = Math.round(Number(rgb[1]));
    const g = Math.round(Number(rgb[2]));
    const b = Math.round(Number(rgb[3]));
    const aRaw = rgb[4];
    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
    if (aRaw === undefined) return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const a = aRaw.endsWith("%")
      ? Number(aRaw.slice(0, -1)) / 100
      : Number(aRaw);
    if (a >= 0.999) return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`;
  }

  // Fallback for modern color syntax (oklch(), color(display-p3 …), …):
  // paint one pixel and read it back — getImageData always returns sRGB,
  // so wide-gamut values resolve to their closest sRGB hex.
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
    if (a >= 254) return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  } catch {
    return null;
  }
}

/** `themeKey` forces remeasure when Storybook toolbar theme changes. */
function useSwatchColor(swatchClassName: string, themeKey: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState<string | null>(null);
  const [rgb, setRgb] = useState<string | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const raw = getComputedStyle(el).backgroundColor;
    setRgb(raw || null);
    setHex(cssColorToHex(raw));
  }, []);

  useEffect(() => {
    measure();
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure, swatchClassName, themeKey]);

  return { ref, hex, rgb };
}

function CopyChip({
  label,
  value,
  title,
}: {
  label?: string;
  value: string;
  title?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(value);
    setState(ok ? "copied" : "error");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 1400);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      title={title ?? `Copy ${value}`}
      className="border-border-default bg-bg-canvas text-fg-default hover:border-border-strong hover:bg-bg-surface-hover focus-visible:ring-focus-ring inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {label ? (
        <span className="text-fg-muted shrink-0 font-semibold tracking-wide uppercase">
          {label}
        </span>
      ) : null}
      <span className="text-fg-default truncate">
        {state === "copied" ? "Copied!" : state === "error" ? "Failed" : value}
      </span>
    </button>
  );
}

function ColorSwatchCard({
  tokenName,
  cssVar,
  utilityClass,
  swatchClassName,
  description,
  meta,
  themeKey,
  children,
}: {
  tokenName: string;
  cssVar: string;
  utilityClass: string;
  swatchClassName: string;
  description?: string;
  meta?: ReactNode;
  themeKey: string;
  children?: ReactNode;
}) {
  const { ref, hex, rgb } = useSwatchColor(swatchClassName, themeKey);
  const labelId = useId();

  return (
    <div
      className="border-border-default bg-bg-canvas overflow-hidden rounded-lg border shadow-sm"
      aria-labelledby={labelId}
    >
      <div
        ref={ref}
        className={`border-border-muted h-14 w-full border-b ${swatchClassName}`}
        aria-hidden
      />
      <div className="bg-bg-canvas space-y-2.5 p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              id={labelId}
              className="text-fg-default truncate font-mono text-sm font-semibold tracking-tight"
            >
              {tokenName}
            </p>
            {description ? (
              <p className="text-fg-muted mt-1 text-xs leading-snug">
                {description}
              </p>
            ) : null}
          </div>
          {meta}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <CopyChip label="token" value={tokenName} title="Copy token name" />
          <CopyChip label="var" value={cssVar} title="Copy CSS variable" />
          <CopyChip
            label="class"
            value={utilityClass}
            title="Copy Tailwind class"
          />
          {hex ? (
            <CopyChip label="hex" value={hex} title="Copy hex color" />
          ) : (
            <span className="border-border-default text-fg-muted rounded-md border border-dashed px-1.5 py-0.5 font-mono text-[11px]">
              hex …
            </span>
          )}
          {rgb ? (
            <CopyChip label="css" value={rgb} title="Copy computed CSS color" />
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}

function PaletteScale({
  name,
  themeKey,
}: {
  name: PaletteName;
  themeKey: string;
}) {
  const meta = palette[name];
  return (
    <div className="mb-6">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="text-fg-default text-sm font-semibold capitalize">
          {name}
        </h3>
        <CopyChip
          label="radix"
          value={meta.radix}
          title="Copy Radix scale name"
        />
        <span className="text-fg-muted text-xs font-medium">{meta.role}</span>
      </div>
      <p className="text-fg-muted mb-3 text-xs">{meta.description}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {RADIX_STEPS.map((step) => {
          const tokenName = `${name}-${step}`;
          const utilityClass = paletteBg[name][step];
          const cssVar = `--color-${name}-${step}`;
          return (
            <ColorSwatchCard
              key={step}
              tokenName={tokenName}
              cssVar={cssVar}
              utilityClass={utilityClass}
              swatchClassName={utilityClass}
              description={`Step ${step} · product primitive`}
              themeKey={themeKey}
            />
          );
        })}
      </div>
    </div>
  );
}

function SemanticGroup({
  group,
  themeKey,
}: {
  group: SemanticColorGroup;
  themeKey: string;
}) {
  const tokens = semanticColorTokens.filter((t) => t.group === group);
  if (tokens.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-fg-default mb-2 text-sm font-semibold capitalize">
        {group}
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => {
          const override = hasModeOverride(token);
          const utilityClass =
            semanticBgClass[token.name] ?? `bg-${token.name}`;
          const cssVar = `--color-${token.name}`;
          return (
            <ColorSwatchCard
              key={token.name}
              tokenName={token.name}
              cssVar={cssVar}
              utilityClass={utilityClass}
              swatchClassName={utilityClass}
              description={token.description}
              themeKey={themeKey}
              meta={
                override ? (
                  <span className="border-accent-border bg-accent-subtle text-accent-text rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                    mode override
                  </span>
                ) : null
              }
            >
              <div className="border-border-default flex flex-wrap gap-1.5 border-t pt-2">
                <CopyChip
                  label="light"
                  value={formatSemanticRef(token.light)}
                  title="Copy light primitive ref"
                />
                <CopyChip
                  label="dark"
                  value={formatSemanticRef(token.dark)}
                  title="Copy dark primitive ref"
                />
              </div>
            </ColorSwatchCard>
          );
        })}
      </div>
    </div>
  );
}

function ColorsDoc({ theme }: { theme: ColorMode }) {
  const meta = colorModeMeta[theme];
  const overrides = semanticColorTokens.filter(hasModeOverride);

  return (
    <div className="mx-auto max-w-5xl p-6 text-left">
      <header className="border-border-default mb-8 border-b pb-6">
        <p className="text-accent-text mb-1 text-xs font-semibold tracking-wide uppercase">
          Foundations
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-fg-default text-2xl font-semibold">
            Color tokens
          </h1>
          <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-2 py-0.5 font-mono text-xs font-medium capitalize">
            {theme} · .{meta.className}
          </span>
        </div>
        <p className="text-fg-muted mt-2 max-w-3xl text-sm">
          Use the{" "}
          <strong className="text-fg-default font-semibold">Theme</strong>{" "}
          control in the Storybook toolbar (sun / moon) to switch light and
          dark. Click any chip to copy token, CSS variable, class, or live hex
          for the active mode.
        </p>
        {overrides.length > 0 ? (
          <p className="text-fg-muted mt-3 text-xs">
            Tokens with different light/dark mappings:{" "}
            {overrides.map((t) => t.name).join(", ")}.
          </p>
        ) : null}
      </header>

      <section className="mb-8">
        <h2 className="text-fg-muted mb-3 text-sm font-semibold tracking-wide uppercase">
          Canvas &amp; foreground
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ColorSwatchCard
            tokenName="bg-canvas"
            cssVar="--color-bg-canvas"
            utilityClass="bg-bg-canvas"
            swatchClassName="bg-bg-canvas"
            description={meta.canvasStep}
            themeKey={theme}
          />
          <ColorSwatchCard
            tokenName="fg-default"
            cssVar="--color-fg-default"
            utilityClass="text-fg-default"
            swatchClassName="bg-fg-default"
            description={meta.foregroundStep}
            themeKey={theme}
          />
        </div>
        <p className="text-fg-default mt-3 text-sm">
          The quick deploy jumped over the flaky test — body on canvas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-fg-muted mb-3 text-sm font-semibold tracking-wide uppercase">
          Palette
        </h2>
        {(Object.keys(palette) as PaletteName[]).map((name) => (
          <PaletteScale key={name} name={name} themeKey={theme} />
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-fg-muted mb-3 text-sm font-semibold tracking-wide uppercase">
          Semantic
        </h2>
        {semanticColorGroups.map((group) => (
          <SemanticGroup key={group} group={group} themeKey={theme} />
        ))}
      </section>

      <section className="border-border-default bg-bg-surface space-y-3 rounded-lg border p-4">
        <p className="text-fg-default text-sm font-semibold">Sample chrome</p>
        <p className="text-fg-muted text-xs">
          Secondary copy on a raised surface.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-accent-solid text-fg-on-accent rounded-md px-2.5 py-1 text-xs font-semibold">
            Primary
          </span>
          <span className="border-border-default bg-bg-subtle text-fg-default rounded-md border px-2.5 py-1 text-xs font-semibold">
            Secondary
          </span>
          <span className="bg-danger-solid text-fg-on-danger rounded-md px-2.5 py-1 text-xs font-semibold">
            Danger
          </span>
          <span className="bg-warning-solid text-fg-on-warning rounded-md px-2.5 py-1 text-xs font-semibold">
            Warning
          </span>
          <span className="bg-success-subtle text-success-text rounded-md px-2.5 py-1 text-xs font-medium">
            Healthy
          </span>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const theme: ColorMode = globals.theme === "dark" ? "dark" : "light";
    return <ColorsDoc theme={theme} />;
  },
};
