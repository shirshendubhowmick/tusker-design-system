// @vitest-environment jsdom
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { IconButton } from "./IconButton";

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

describe("IconButton", () => {
  it("renders a named icon button with default solid primary styles", () => {
    render(
      <IconButton aria-label="Search">
        <MagnifyingGlassIcon data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expectHasClasses(button.className, [
      "bg-accent-solid",
      "!size-9",
      "!p-0",
      "inline-flex",
    ]);
  });

  it("supports sizes as square hit targets", () => {
    const { rerender } = render(
      <IconButton aria-label="S" size="sm">
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    expectHasClasses(screen.getByRole("button", { name: "S" }).className, [
      "!size-8",
      "!min-w-8",
      "!min-h-8",
      "[&_svg]:size-3.5",
    ]);

    rerender(
      <IconButton aria-label="L" size="lg">
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    expectHasClasses(screen.getByRole("button", { name: "L" }).className, [
      "!size-10",
      "!min-w-10",
      "!min-h-10",
      "[&_svg]:size-5",
    ]);
  });

  it("forwards variant and color to the Button system", () => {
    render(
      <IconButton aria-label="Delete" variant="secondary" color="danger">
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    expectHasClasses(screen.getByRole("button", { name: "Delete" }).className, [
      "border-danger-solid",
      "text-danger-text",
      "border",
    ]);
  });

  it("replaces the icon with a spinner when loading", () => {
    render(
      <IconButton aria-label="Refresh" loading>
        <MagnifyingGlassIcon data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Refresh" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("keeps tertiary (and bare) square — not tall/narrow", () => {
    const { rerender } = render(
      <IconButton aria-label="Ghost" variant="tertiary">
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    let button = screen.getByRole("button", { name: "Ghost" });
    expectHasClasses(button.className, [
      "text-accent-text",
      "!size-9",
      "!p-0",
      "!min-w-9",
      "!min-h-9",
    ]);

    rerender(
      <IconButton aria-label="Bare" variant="tertiary" bare>
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    button = screen.getByRole("button", { name: "Bare" });
    // Still square despite Button tertiary bare's !h-auto / !px-0.
    expectHasClasses(button.className, [
      "text-accent-text",
      "!size-9",
      "!p-0",
      "!min-w-9",
      "!min-h-9",
    ]);
  });

  it("forwards ref, type, disabled, and click handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="Go" type="submit" onClick={onClick}>
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Go" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "submit");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    render(
      <IconButton aria-label="No" disabled>
        <MagnifyingGlassIcon />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "No" })).toBeDisabled();
  });
});
