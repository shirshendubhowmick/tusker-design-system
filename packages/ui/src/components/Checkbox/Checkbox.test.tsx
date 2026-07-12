// @vitest-environment jsdom
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, createRef, useState } from "react";

import { Field, FieldOrientation } from "../Field";
import {
  type CheckedState,
  Indicator,
  Root,
  checkboxRootVariants,
} from "./Checkbox";

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

function NamedCheckbox(props: ComponentProps<typeof Root>) {
  return (
    <Root aria-label="Accept" {...props}>
      <Indicator>
        {props.checked === "indeterminate" ? (
          <DividerHorizontalIcon />
        ) : (
          <CheckIcon />
        )}
      </Indicator>
    </Root>
  );
}

describe("checkboxRootVariants", () => {
  it("defaults to md box size", () => {
    expectHasClasses(checkboxRootVariants(), ["size-4", "rounded-sm"]);
  });

  it("supports ControlSize steps", () => {
    expectHasClasses(checkboxRootVariants({ size: "sm" }), ["size-3.5"]);
    expectHasClasses(checkboxRootVariants({ size: "lg" }), ["size-5"]);
  });
});

describe("Checkbox", () => {
  it("renders an unchecked checkbox with accessible name", async () => {
    const { container } = render(<NamedCheckbox />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    expect(box).toBeInTheDocument();
    expect(box).not.toBeChecked();
    expectHasClasses(box.className, [
      "size-4",
      "border-border-default",
      "bg-bg-surface",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
    ]);
    await expectNoA11yViolations(container);
  });

  it("toggles on click and calls onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<NamedCheckbox onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    await user.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports controlled checked state", () => {
    render(<NamedCheckbox checked />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });

  it("supports indeterminate state", async () => {
    const { container } = render(
      <NamedCheckbox checked="indeterminate" aria-label="Select all" />,
    );
    const box = screen.getByRole("checkbox", { name: "Select all" });
    expect(box).toHaveAttribute("data-state", "indeterminate");
    await expectNoA11yViolations(container);
  });

  it("forwards ref and disabled", async () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<NamedCheckbox ref={ref} disabled />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    expect(ref.current).toBe(box);
    expect(box).toBeDisabled();
    await expectNoA11yViolations(container);
  });

  it("composes with horizontal Field", async () => {
    function Example() {
      const [checked, setChecked] = useState<CheckedState>(false);
      return (
        <Field
          orientation={FieldOrientation.horizontal}
          label="Email me digests"
          htmlFor="mkt"
          description="Weekly product news"
        >
          {(control) => (
            <Root
              id={control.id}
              checked={checked}
              onCheckedChange={setChecked}
              aria-describedby={control["aria-describedby"]}
              aria-required={control["aria-required"]}
              aria-invalid={control["aria-invalid"]}
            >
              <Indicator>
                <CheckIcon />
              </Indicator>
            </Root>
          )}
        </Field>
      );
    }

    const user = userEvent.setup();
    const { container } = render(<Example />);
    const box = screen.getByRole("checkbox", { name: "Email me digests" });
    expect(box).toBeInTheDocument();
    await user.click(box);
    expect(box).toBeChecked();
    await expectNoA11yViolations(container);
  });

  it("merges className onto Root", () => {
    render(
      <Root aria-label="X" className="mt-2">
        <Indicator />
      </Root>,
    );
    expectHasClasses(screen.getByRole("checkbox", { name: "X" }).className, [
      "mt-2",
      "size-4",
    ]);
  });
});
