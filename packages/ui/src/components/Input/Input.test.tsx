// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Input, inputVariants } from "./Input";

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

describe("inputVariants", () => {
  it("applies default color + md size + fullWidth", () => {
    const classes = inputVariants();
    expectHasClasses(classes, [
      "border-border-default",
      "h-9",
      "text-body-md",
      "w-full",
      "bg-bg-surface",
    ]);
  });

  it("applies success and danger (error) border + matching focus rings", () => {
    const success = inputVariants({ color: "success" });
    expectHasClasses(success, [
      "border-success-border",
      "focus-visible:border-success-solid",
    ]);
    expect(success).toContain("--color-success-solid");
    expect(success).not.toContain("shadow-focus");

    const danger = inputVariants({ color: "danger" });
    expectHasClasses(danger, [
      "border-danger-border",
      "focus-visible:border-danger-solid",
    ]);
    expect(danger).toContain("--color-danger-solid");
    expect(danger).not.toContain("shadow-focus");
  });

  it("applies warning color with matching focus ring", () => {
    const warning = inputVariants({ color: "warning" });
    expectHasClasses(warning, ["border-warning-border"]);
    expect(warning).toContain("--color-warning-solid");
    expect(warning).not.toContain("shadow-focus");
  });

  it("uses brand shadow-focus for default color only", () => {
    expectHasClasses(inputVariants({ color: "default" }), [
      "focus-visible:shadow-focus",
      "focus-visible:border-accent-border",
    ]);
  });

  it("supports size and fullWidth toggles", () => {
    expectHasClasses(inputVariants({ size: "sm" }), ["h-8", "text-body-sm"]);
    expectHasClasses(inputVariants({ size: "lg" }), ["h-10"]);
    expectHasClasses(inputVariants({ fullWidth: false }), ["w-auto"]);
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

  it("merges className and does not forward CVA props to the DOM", () => {
    const { container } = render(
      <Input
        aria-label="X"
        color="success"
        size="sm"
        fullWidth={false}
        className="custom-class"
      />,
    );
    const input = container.querySelector("input");
    expect(input?.className).toContain("custom-class");
    expect(input?.className).toContain("border-success-border");
    expect(input).not.toHaveAttribute("color");
    expect(input).not.toHaveAttribute("fullWidth");
  });

  it("supports disabled with a slightly darker surface", () => {
    render(<Input aria-label="Disabled" disabled />);
    const input = screen.getByRole("textbox", { name: "Disabled" });
    expect(input).toBeDisabled();
    expectHasClasses(input.className, ["disabled:bg-bg-surface-hover"]);
  });
});
