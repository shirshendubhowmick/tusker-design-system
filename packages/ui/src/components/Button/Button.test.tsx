// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Button, buttonVariants } from "./Button";

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

function expectMissingClasses(
  className: string | null | undefined,
  unexpected: string[],
): void {
  const tokens = classTokens(className);
  for (const token of unexpected) {
    expect(
      tokens.has(token),
      `did not expect "${token}" in "${className}"`,
    ).toBe(false);
  }
}

describe("buttonVariants", () => {
  it("applies default primary variant + primary color + md size", () => {
    const classes = buttonVariants();
    expectHasClasses(classes, [
      "bg-accent-solid",
      "text-fg-on-accent",
      "h-9",
      "text-label-lg",
      "inline-flex",
      "w-auto",
    ]);
  });

  it("combines variant × color (solid danger CTA) with active deepen", () => {
    const classes = buttonVariants({ variant: "primary", color: "danger" });
    expectHasClasses(classes, [
      "bg-danger-solid",
      "text-fg-on-danger",
      "enabled:hover:bg-danger-solid-hover",
      "enabled:active:brightness-95",
    ]);
  });

  it("supports secondary outline with solid-weight semantic borders", () => {
    expectHasClasses(
      buttonVariants({ variant: "secondary", color: "primary" }),
      ["border-accent-solid", "text-accent-text", "border", "bg-bg-surface"],
    );
    expectHasClasses(
      buttonVariants({ variant: "secondary", color: "danger" }),
      ["border-danger-solid", "text-danger-text"],
    );
  });

  it("supports tertiary ghost with semantic colors (padded)", () => {
    expectHasClasses(
      buttonVariants({ variant: "tertiary", bare: false, color: "primary" }),
      ["text-accent-text", "enabled:hover:bg-accent-subtle"],
    );
    expectHasClasses(
      buttonVariants({ variant: "tertiary", bare: false, color: "success" }),
      ["text-success-text", "enabled:hover:bg-success-subtle"],
    );
  });

  it("bare tertiary deepens text color without hover fill", () => {
    const classes = buttonVariants({
      variant: "tertiary",
      bare: true,
      color: "danger",
    });
    expectHasClasses(classes, [
      "text-danger-text",
      "enabled:hover:text-[color-mix(in_srgb,var(--color-danger-text)_72%,black)]",
      "!px-0",
      "!h-auto",
    ]);
    expectMissingClasses(classes, ["enabled:hover:bg-danger-subtle"]);
  });

  it("supports sm, md, and lg sizes", () => {
    expectHasClasses(buttonVariants({ size: "sm" }), ["h-8", "text-label-md"]);
    expectHasClasses(buttonVariants({ size: "md" }), ["h-9", "text-label-lg"]);
    expectHasClasses(buttonVariants({ size: "lg" }), [
      "h-10",
      "px-4",
      "text-label-lg",
    ]);
  });

  it("supports fullWidth", () => {
    expectHasClasses(buttonVariants({ fullWidth: true }), ["w-full", "flex"]);
    expectHasClasses(buttonVariants({ fullWidth: false }), [
      "w-auto",
      "inline-flex",
    ]);
  });

  it("bare only strips padding when tertiary", () => {
    const bareTertiary = buttonVariants({ variant: "tertiary", bare: true });
    expectHasClasses(bareTertiary, ["!px-0", "!h-auto"]);

    const barePrimary = buttonVariants({ variant: "primary", bare: true });
    expectMissingClasses(barePrimary, ["!px-0", "!h-auto"]);
  });

  it("tertiary ignores fullWidth (always content-sized)", () => {
    const classes = buttonVariants({
      variant: "tertiary",
      fullWidth: true,
    });
    expectHasClasses(classes, ["!w-auto", "!inline-flex"]);
  });

  it("always includes focus, cursor, and disabled foundations", () => {
    const classes = buttonVariants({
      variant: "secondary",
      color: "info",
      size: "sm",
    });
    expectHasClasses(classes, [
      "focus-visible:shadow-focus",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
      "disabled:opacity-65",
      "rounded-md",
      "enabled:active:translate-y-px",
    ]);
  });
});

describe("Button", () => {
  it("renders a native button with accessible name from children", () => {
    render(<Button>Save changes</Button>);

    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it('defaults type to "button" to avoid accidental form submit', () => {
    render(<Button>Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("allows overriding type (e.g. submit)", () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("applies default primary / primary / md styles on the element", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });

    expectHasClasses(button.className, [
      "bg-accent-solid",
      "text-fg-on-accent",
      "h-9",
      "text-label-lg",
      "inline-flex",
    ]);
  });

  it("applies variant, color, and size classes", () => {
    render(
      <Button variant="secondary" color="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });

    expectHasClasses(button.className, [
      "border-danger-solid",
      "text-danger-text",
      "h-10",
      "px-4",
      "bg-bg-surface",
    ]);
  });

  it("does not forward CVA-only props to the DOM", () => {
    render(
      <Button
        variant="secondary"
        color="success"
        size="sm"
        fullWidth
        bare={false}
        loading={false}
        loadingText="Working…"
        data-testid="btn"
      >
        Label
      </Button>,
    );
    const button = screen.getByTestId("btn");

    expect(button).not.toHaveAttribute("variant");
    expect(button).not.toHaveAttribute("color");
    expect(button).not.toHaveAttribute("size");
    expect(button).not.toHaveAttribute("fullWidth");
    expect(button).not.toHaveAttribute("bare");
    expect(button).not.toHaveAttribute("loading");
    expect(button).not.toHaveAttribute("loadingText");
  });

  it("merges consumer className with variant classes", () => {
    render(<Button className="custom-hook data-x:underline">Merge</Button>);
    const button = screen.getByRole("button", { name: "Merge" });

    expectHasClasses(button.className, [
      "custom-hook",
      "data-x:underline",
      "bg-accent-solid",
    ]);
  });

  it("stretches with fullWidth for non-tertiary variants", () => {
    render(
      <Button fullWidth variant="primary">
        Wide
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Wide" });

    expectHasClasses(button.className, ["w-full", "flex"]);
    expectMissingClasses(button.className, ["inline-flex", "w-auto"]);
  });

  it("keeps tertiary content-sized even when fullWidth is true", () => {
    render(
      <Button variant="tertiary" fullWidth>
        Link-like
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Link-like" });

    expectHasClasses(button.className, ["!w-auto", "!inline-flex"]);
    expectMissingClasses(button.className, ["w-full"]);
  });

  it("bare tertiary is text-only (no fixed height / horizontal padding)", () => {
    render(
      <Button variant="tertiary" bare color="danger">
        Text only
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Text only" });

    expectHasClasses(button.className, [
      "!px-0",
      "!h-auto",
      "text-danger-text",
      "enabled:hover:text-[color-mix(in_srgb,var(--color-danger-text)_72%,black)]",
    ]);
    expectMissingClasses(button.className, ["enabled:hover:bg-danger-subtle"]);
  });

  it("bare has no padding reset on primary", () => {
    render(
      <Button variant="primary" bare>
        Still solid
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Still solid" });

    expectMissingClasses(button.className, ["!px-0", "!h-auto"]);
    expectHasClasses(button.className, ["bg-accent-solid", "h-9"]);
  });

  it("forwards native attributes and the disabled state", () => {
    render(
      <Button disabled aria-describedby="hint" name="save" value="1">
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Disabled" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-describedby", "hint");
    expect(button).toHaveAttribute("name", "save");
    expect(button).toHaveAttribute("value", "1");
  });

  it("invokes onClick when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not invoke onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Nope" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>With ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("button", { name: "With ref" }));
  });

  it("shows a spinner, keeps the label, and marks busy when loading", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(
      button.querySelector('[data-slot="button-spinner"]'),
    ).toBeInTheDocument();
    expect(button).toHaveTextContent("Save");
    expectHasClasses(button.className, ["pointer-events-none"]);
  });

  it("uses loadingText when provided", () => {
    render(
      <Button loading loadingText="Saving…">
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving…" });

    expect(button).toHaveTextContent("Saving…");
    expect(button).not.toHaveTextContent("Save");
  });

  it("does not invoke onClick when loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Busy
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Busy" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
