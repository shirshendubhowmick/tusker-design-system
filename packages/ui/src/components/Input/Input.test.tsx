// @vitest-environment jsdom
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Input, inputFieldVariants } from "./Input";

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

describe("inputFieldVariants", () => {
  it("applies default color + md size + fullWidth", () => {
    const classes = inputFieldVariants();
    expectHasClasses(classes, [
      "border-border-default",
      "h-9",
      "w-full",
      "bg-bg-surface",
    ]);
  });

  it("applies success and danger (error) border + matching focus rings", () => {
    const success = inputFieldVariants({ color: "success" });
    expectHasClasses(success, [
      "border-success-border",
      "focus-within:border-success-solid",
    ]);
    expect(success).toContain("--color-success-solid");
    expect(success).not.toContain("shadow-focus");

    const danger = inputFieldVariants({ color: "danger" });
    expectHasClasses(danger, [
      "border-danger-border",
      "focus-within:border-danger-solid",
    ]);
    expect(danger).toContain("--color-danger-solid");
    expect(danger).not.toContain("shadow-focus");
  });

  it("applies warning color with matching focus ring", () => {
    const warning = inputFieldVariants({ color: "warning" });
    expectHasClasses(warning, ["border-warning-border"]);
    expect(warning).toContain("--color-warning-solid");
    expect(warning).not.toContain("shadow-focus");
  });

  it("uses brand focus-within shadow-focus for default color only", () => {
    expectHasClasses(inputFieldVariants({ color: "default" }), [
      "focus-within:shadow-focus",
      "focus-within:border-accent-border",
    ]);
  });

  it("supports size and fullWidth toggles", () => {
    expectHasClasses(inputFieldVariants({ size: "sm" }), ["h-8"]);
    expectHasClasses(inputFieldVariants({ size: "lg" }), ["h-10"]);
    expectHasClasses(inputFieldVariants({ fullWidth: false }), ["w-auto"]);
  });
});

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("forwards ref and native attributes", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <Input ref={ref} aria-label="Name" placeholder="Jane" name="name" />,
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("placeholder", "Jane");
    expect(input).toHaveAttribute("name", "name");

    await user.type(input, "Ada");
    expect(input).toHaveValue("Ada");
  });

  it("sets aria-invalid for danger (error) color", () => {
    render(<Input aria-label="Password" color="danger" />);
    expect(screen.getByRole("textbox", { name: "Password" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("respects explicit aria-invalid even when color is default", () => {
    render(<Input aria-label="Field" aria-invalid={true} />);
    expect(screen.getByRole("textbox", { name: "Field" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("merges className on the field chrome and does not forward CVA props", () => {
    const { container } = render(
      <Input
        aria-label="X"
        color="success"
        size="sm"
        fullWidth={false}
        className="custom-class"
      />,
    );
    const field = container.querySelector('[data-slot="input-field"]');
    const input = container.querySelector("input");
    expect(field?.className).toContain("custom-class");
    expect(field?.className).toContain("border-success-border");
    expect(input).not.toHaveAttribute("color");
    expect(input).not.toHaveAttribute("fullWidth");
  });

  it("supports disabled with a slightly darker surface", () => {
    render(<Input aria-label="Disabled" disabled />);
    const input = screen.getByRole("textbox", { name: "Disabled" });
    expect(input).toBeDisabled();
    const field = input.closest('[data-slot="input-field"]');
    expectHasClasses(field?.className, ["has-[:disabled]:bg-bg-surface-hover"]);
  });

  it("renders start and end icons as decorative slots", () => {
    render(
      <Input
        aria-label="Search"
        startIcon={<MagnifyingGlassIcon data-testid="start-icon" />}
        endIcon={<span data-testid="end-icon">×</span>}
      />,
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search" }).className).toMatch(
      /pl-9/,
    );
  });

  it("does not render icon slots when icons are omitted", () => {
    const { container } = render(<Input aria-label="Plain" />);
    expect(
      container.querySelector('[data-slot="input-start-icon"]'),
    ).toBeNull();
    expect(container.querySelector('[data-slot="input-end-icon"]')).toBeNull();
  });
});
