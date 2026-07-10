// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Label } from "./Label";

describe("Label", () => {
  it("renders a label associated via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("Email").tagName).toBe("LABEL");
  });

  it("shows a decorative required marker", () => {
    render(
      <Label htmlFor="name" required>
        Name
      </Label>,
    );
    const label = screen.getByText("Name").closest("label");
    expect(label).toHaveAttribute("data-required", "true");
    expect(
      label?.querySelector('[data-slot="label-required"]'),
    ).toHaveTextContent("*");
    expect(
      label?.querySelector('[data-slot="label-required"]'),
    ).toHaveAttribute("aria-hidden");
  });

  it("applies disabled styles", () => {
    render(
      <Label htmlFor="x" disabled>
        Off
      </Label>,
    );
    const label = screen.getByText("Off");
    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label.className).toContain("cursor-not-allowed");
    expect(label.className).toContain("opacity-65");
    expect(label.className).toContain("text-fg-muted");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <Label ref={ref} htmlFor="y" className="custom-label">
        Y
      </Label>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toHaveClass("custom-label");
  });
});
