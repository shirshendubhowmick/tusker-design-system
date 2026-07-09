import { Button } from "@design-system/ui/Button";
import { Text, TextColor, TextSize, TextVariant } from "@design-system/ui/Text";
import { cn } from "@design-system/ui/cn";
import { breakpoints, resolveBreakpoint } from "@design-system/ui/tokens";
import { useEffect, useState } from "react";

/**
 * Minimal page proving ADR-001 JIT consumption:
 * subpath imports, semantic tokens, and live DS components.
 */
export function App() {
  const [tier, setTier] = useState(() =>
    typeof window === "undefined"
      ? "mobile"
      : resolveBreakpoint(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setTier(resolveBreakpoint(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="bg-bg-canvas text-fg-default min-h-screen">
      <header className="border-border-default bg-bg-surface/95 z-sticky sticky top-0 border-b shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <Text
              as="p"
              variant={TextVariant.label}
              size={TextSize.md}
              color={TextColor.muted}
            >
              JIT consumer
            </Text>
            <Text as="h1" variant={TextVariant.heading} size={TextSize.sm}>
              @design-system/web
            </Text>
          </div>
          <Button color="primary" size="md">
            Primary action
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
        <section
          className={cn(
            "border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm",
          )}
        >
          <Text as="h2" variant={TextVariant.heading} size={TextSize.xs}>
            Imports
          </Text>
          <ul className="mt-2 list-inside list-disc">
            <li>
              <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
                @design-system/ui/Button
              </Text>
            </li>
            <li>
              <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
                @design-system/ui/cn
              </Text>
            </li>
            <li>
              <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
                @design-system/ui/tokens
              </Text>
            </li>
            <li>
              <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
                @design-system/ui/styles.css
              </Text>
            </li>
            <li>
              <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
                @design-system/ui/Text
              </Text>
            </li>
          </ul>
        </section>

        <section className="border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm">
          <Text as="h2" variant={TextVariant.heading} size={TextSize.xs}>
            Tokens
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.md}
            color={TextColor.muted}
            className="mt-2"
          >
            Viewport tier:{" "}
            <Text as="span" color={TextColor.default} className="font-medium">
              {tier}
            </Text>
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-1"
          >
            tablet ≥ {breakpoints.tablet.minWidthPx}px · desktop ≥{" "}
            {breakpoints.desktop.minWidthPx}px
          </Text>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" color="primary" size="sm">
              Primary
            </Button>
            <Button variant="secondary" color="primary" size="sm">
              Secondary
            </Button>
            <Button variant="tertiary" color="danger" size="sm">
              Tertiary danger
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
