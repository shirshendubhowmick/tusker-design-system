// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import {
  ControlSize,
  controlGlyphClass,
  controlSizeOrder,
} from "../../tokens/control";
import { Spinner } from "./Spinner";

/** Split a className into exact tokens (avoids false positives from toContain). */
function classTokens(className: string | null | undefined): Set<string> {
  return new Set((className ?? "").split(/\s+/).filter(Boolean));
}

function expectHasClasses(
  className: string | null | undefined,
  expected: string[],
): void {
  const tokens = classTokens(className);
  for (const token of expected) {
    expect(tokens.has(token), `expected "${token}" in "${className}"`).toBe(
      true,
    );
  }
}

describe("Spinner", () => {
  it("renders a decorative spinner by default", () => {
    render(<Spinner data-testid="spin" />);
    const el = screen.getByTestId("spin");

    expect(el.tagName).toBe("svg");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).not.toHaveAttribute("role");
    expect(el).toHaveAttribute("data-slot", "spinner");
    expectHasClasses(el.getAttribute("class"), [
      "animate-spin",
      controlGlyphClass.md,
      "shrink-0",
    ]);
  });

  it("supports every ControlSize", () => {
    const { rerender } = render(
      <Spinner size={ControlSize.sm} data-testid="spin" />,
    );

    for (const size of controlSizeOrder) {
      rerender(<Spinner size={size} data-testid="spin" />);
      expectHasClasses(screen.getByTestId("spin").getAttribute("class"), [
        controlGlyphClass[size],
      ]);
    }
  });

  it("falls back to md for null size", () => {
    render(<Spinner size={null} data-testid="spin" />);
    expectHasClasses(screen.getByTestId("spin").getAttribute("class"), [
      controlGlyphClass.md,
    ]);
  });

  it("exposes a status role when label is provided", () => {
    render(<Spinner label="Loading" />);
    const el = screen.getByRole("status", { name: "Loading" });

    expect(el).toHaveAttribute("data-slot", "spinner");
    expect(el).not.toHaveAttribute("aria-hidden");
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Spinner ref={ref} className="text-accent-text" data-testid="spin" />,
    );
    const el = screen.getByTestId("spin");

    expect(ref.current).toBe(el);
    expectHasClasses(el.getAttribute("class"), [
      "text-accent-text",
      "animate-spin",
    ]);
  });
});
