import { Button } from "@design-system/ui/Button";
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
            <p className="text-label-md text-fg-muted">JIT consumer</p>
            <h1 className="text-heading-sm text-fg-default">
              @design-system/web
            </h1>
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
          <h2 className="text-heading-xs text-fg-default">Imports</h2>
          <ul className="text-body-md text-fg-muted mt-2 list-inside list-disc">
            <li>
              <code className="text-code-sm">@design-system/ui/Button</code>
            </li>
            <li>
              <code className="text-code-sm">@design-system/ui/cn</code>
            </li>
            <li>
              <code className="text-code-sm">@design-system/ui/tokens</code>
            </li>
            <li>
              <code className="text-code-sm">@design-system/ui/styles.css</code>
            </li>
          </ul>
        </section>

        <section className="border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm">
          <h2 className="text-heading-xs text-fg-default">Tokens</h2>
          <p className="text-body-md text-fg-muted mt-2">
            Viewport tier:{" "}
            <span className="text-fg-default font-medium">{tier}</span>
          </p>
          <p className="text-body-sm text-fg-muted mt-1">
            tablet ≥ {breakpoints.tablet.minWidthPx}px · desktop ≥{" "}
            {breakpoints.desktop.minWidthPx}px
          </p>
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
