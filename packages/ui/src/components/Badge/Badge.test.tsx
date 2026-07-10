// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Badge, badgeVariants } from "./Badge";

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

describe("badgeVariants", () => {
  it("defaults to soft neutral md", () => {
    expectHasClasses(badgeVariants(), [
      "bg-bg-surface-active",
      "text-fg-muted",
      "h-6",
      "text-label-md",
      "rounded-full",
    ]);
  });

  it("combines variant × color", () => {
    expectHasClasses(badgeVariants({ variant: "solid", color: "success" }), [
      "bg-success-solid",
      "text-fg-on-success",
    ]);
    expectHasClasses(badgeVariants({ variant: "outline", color: "danger" }), [
      "border-danger-border",
      "text-danger-text",
      "border",
    ]);
    expectHasClasses(badgeVariants({ variant: "soft", color: "primary" }), [
      "bg-accent-subtle",
      "text-accent-text",
    ]);
  });

  it("supports sm and md sizes", () => {
    expectHasClasses(badgeVariants({ size: "sm" }), ["h-5", "text-label-sm"]);
    expectHasClasses(badgeVariants({ size: "md" }), ["h-6", "text-label-md"]);
  });
});

describe("Badge", () => {
  it("renders children in a span", () => {
    render(<Badge>Active</Badge>);
    const el = screen.getByText("Active");
    expect(el.tagName).toBe("SPAN");
  });

  it("does not forward CVA-only props to the DOM", () => {
    render(
      <Badge variant="outline" color="info" size="sm">
        Info
      </Badge>,
    );
    const el = screen.getByText("Info");
    expect(el).not.toHaveAttribute("variant");
    expect(el).not.toHaveAttribute("color");
    expect(el).not.toHaveAttribute("size");
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="custom-badge">
        Tag
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expectHasClasses(ref.current?.className, [
      "custom-badge",
      "bg-bg-surface-active",
    ]);
  });
});
