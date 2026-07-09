// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";

import { Text, TextColor, TextSize, TextVariant } from "./Text";

describe("Text", () => {
  it("requires as and renders that element with default body-md + fg-default", () => {
    render(
      <Text as="p" data-testid="t">
        Hello
      </Text>,
    );
    const el = screen.getByTestId("t");
    expect(el.tagName).toBe("P");
    expect(el).toHaveTextContent("Hello");
    expect(el.className).toContain("text-body-md");
    expect(el.className).toContain("text-fg-default");
  });

  it("accepts const maps instead of string literals", () => {
    render(
      <Text
        as="h1"
        variant={TextVariant.heading}
        size={TextSize.xl}
        color={TextColor.accent}
      >
        Title
      </Text>,
    );
    const el = screen.getByText("Title");
    expect(el.tagName).toBe("H1");
    expect(el.className).toContain("text-heading-xl");
    expect(el.className).toContain("text-accent-text");
  });

  it("supports label, code, metric, and display groups via maps", () => {
    const { rerender } = render(
      <Text as="span" variant={TextVariant.label} size={TextSize.overline}>
        Overline
      </Text>,
    );
    expect(screen.getByText("Overline").className).toContain(
      "text-label-overline",
    );

    rerender(
      <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
        id
      </Text>,
    );
    expect(screen.getByText("id").className).toContain("text-code-sm");

    rerender(
      <Text as="span" variant={TextVariant.metric} size={TextSize.lg}>
        99%
      </Text>,
    );
    expect(screen.getByText("99%").className).toContain("text-metric-lg");

    rerender(
      <Text as="p" variant={TextVariant.display} size={TextSize.lg}>
        Hero
      </Text>,
    );
    expect(screen.getByText("Hero").className).toContain("text-display-lg");
  });

  it("applies semantic colors from TextColor map", () => {
    render(
      <Text as="span" color={TextColor.muted}>
        Quiet
      </Text>,
    );
    expect(screen.getByText("Quiet").className).toContain("text-fg-muted");

    render(
      <Text as="span" color={TextColor.danger}>
        Bad
      </Text>,
    );
    expect(screen.getByText("Bad").className).toContain("text-danger-text");

    render(
      <Text as="span" color={TextColor.onDanger}>
        On solid
      </Text>,
    );
    expect(screen.getByText("On solid").className).toContain(
      "text-fg-on-danger",
    );
  });

  it("falls back when size is invalid for the variant", () => {
    render(
      <Text as="p" variant={TextVariant.heading} size={TextSize.block}>
        Fallback
      </Text>,
    );
    // heading has no "block" → default heading-md
    expect(screen.getByText("Fallback").className).toContain("text-heading-md");
  });

  it("merges className without dropping the style utility", () => {
    render(
      <Text
        as="span"
        className="underline"
        variant={TextVariant.body}
        size={TextSize.sm}
      >
        Mixed
      </Text>,
    );
    const el = screen.getByText("Mixed");
    expect(el.className).toContain("text-body-sm");
    expect(el.className).toContain("underline");
  });

  it("exposes stable map values for consumers", () => {
    expect(TextVariant.body).toBe("body");
    expect(TextSize.mdMedium).toBe("md-medium");
    expect(TextColor.danger).toBe("danger");
    expect(TextColor.onAccent).toBe("on-accent");
  });
});
