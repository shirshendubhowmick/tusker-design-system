// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, createRef, useState } from "react";

import { Field, FieldOrientation } from "../Field";
import { Root, Thumb, switchRootVariants, switchThumbVariants } from "./Switch";

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

function NamedSwitch(props: ComponentProps<typeof Root>) {
  return (
    <Root aria-label="Airplane mode" {...props}>
      <Thumb />
    </Root>
  );
}

describe("switch variants", () => {
  it("root defaults to md track", () => {
    expectHasClasses(switchRootVariants(), [
      "h-5",
      "w-9",
      "rounded-full",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
      "data-[state=checked]:bg-accent-solid",
      "data-[state=unchecked]:bg-border-default",
      "data-[state=checked]:justify-end",
    ]);
  });

  it("root supports ControlSize steps", () => {
    expectHasClasses(switchRootVariants({ size: "sm" }), ["h-4", "w-7"]);
    expectHasClasses(switchRootVariants({ size: "lg" }), ["h-6", "w-11"]);
  });

  it("thumb is a high-contrast white knob without soft elevation shadow", () => {
    expectHasClasses(switchThumbVariants(), [
      "h-full",
      "aspect-square",
      "rounded-full",
      "bg-white",
      "ring-1",
    ]);
    expect(switchThumbVariants()).not.toContain("shadow-sm");
    expect(switchThumbVariants()).not.toContain("bg-bg-surface");
  });
});

describe("Switch", () => {
  it("renders an unchecked switch with accessible name", async () => {
    const { container } = render(<NamedSwitch />);
    const control = screen.getByRole("switch", { name: "Airplane mode" });
    expect(control).toBeInTheDocument();
    expect(control).not.toBeChecked();
    expect(control).toHaveAttribute("data-state", "unchecked");
    expectHasClasses(control.className, [
      "h-5",
      "w-9",
      "rounded-full",
      "cursor-pointer",
    ]);
    await expectNoA11yViolations(container);
  });

  it("toggles on click and calls onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<NamedSwitch onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Airplane mode" });
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toBeChecked();
    expect(control).toHaveAttribute("data-state", "checked");
  });

  it("supports controlled checked state", () => {
    render(<NamedSwitch checked />);
    const control = screen.getByRole("switch", { name: "Airplane mode" });
    expect(control).toBeChecked();
    expect(control).toHaveAttribute("data-state", "checked");
  });

  it("supports controlled updates", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [on, setOn] = useState(false);
      return (
        <>
          <p data-testid="state">{String(on)}</p>
          <NamedSwitch checked={on} onCheckedChange={setOn} />
        </>
      );
    }

    render(<Controlled />);
    expect(screen.getByTestId("state")).toHaveTextContent("false");
    await user.click(screen.getByRole("switch", { name: "Airplane mode" }));
    expect(screen.getByTestId("state")).toHaveTextContent("true");
  });

  it("forwards ref and disabled", async () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<NamedSwitch ref={ref} disabled />);
    const control = screen.getByRole("switch", { name: "Airplane mode" });
    expect(ref.current).toBe(control);
    expect(control).toBeDisabled();
    expectHasClasses(control.className, ["disabled:cursor-not-allowed"]);
    await expectNoA11yViolations(container);
  });

  it("applies size prop on Root", () => {
    render(<NamedSwitch size="sm" />);
    expectHasClasses(
      screen.getByRole("switch", { name: "Airplane mode" }).className,
      ["h-4", "w-7"],
    );
  });

  it("forwards ref on Thumb", () => {
    const thumbRef = createRef<HTMLSpanElement>();
    render(
      <Root aria-label="With thumb ref">
        <Thumb ref={thumbRef} />
      </Root>,
    );
    expect(thumbRef.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("composes with horizontal Field", async () => {
    function Example() {
      const [checked, setChecked] = useState(false);
      return (
        <Field
          orientation={FieldOrientation.horizontal}
          label="Email me digests"
          htmlFor="sw-field"
          description="Weekly product news"
        >
          {(control) => (
            <Root
              id={control.id}
              checked={checked}
              onCheckedChange={setChecked}
              aria-describedby={control["aria-describedby"]}
              aria-required={control["aria-required"]}
              aria-label="Email me digests"
            >
              <Thumb />
            </Root>
          )}
        </Field>
      );
    }

    const { container } = render(<Example />);
    expect(
      screen.getByRole("switch", { name: "Email me digests" }),
    ).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
