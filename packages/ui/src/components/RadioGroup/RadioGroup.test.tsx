// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Field, FieldOrientation } from "../Field";
import {
  Indicator,
  Item,
  Root,
  radioGroupItemVariants,
  radioGroupRootVariants,
} from "./RadioGroup";

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

function FruitRadios(props: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  itemSize?: "sm" | "md" | "lg";
}) {
  const { itemSize, ...rootProps } = props;
  return (
    <Root aria-label="Fruit" {...rootProps}>
      <div className="flex items-center gap-2">
        <Item value="apple" id="rg-apple" size={itemSize} aria-label="Apple">
          <Indicator />
        </Item>
      </div>
      <div className="flex items-center gap-2">
        <Item value="banana" id="rg-banana" size={itemSize} aria-label="Banana">
          <Indicator />
        </Item>
      </div>
      <div className="flex items-center gap-2">
        <Item
          value="grape"
          id="rg-grape"
          size={itemSize}
          disabled
          aria-label="Grape"
        >
          <Indicator />
        </Item>
      </div>
    </Root>
  );
}

describe("radioGroup variants", () => {
  it("root defaults to a vertical stack", () => {
    expectHasClasses(radioGroupRootVariants(), ["grid", "gap-2"]);
  });

  it("item defaults to md circle chrome", () => {
    expectHasClasses(radioGroupItemVariants(), [
      "size-4",
      "rounded-full",
      "border-border-default",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
      "data-[state=checked]:bg-accent-solid",
    ]);
  });

  it("item supports ControlSize steps", () => {
    expectHasClasses(radioGroupItemVariants({ size: "sm" }), ["size-3.5"]);
    expectHasClasses(radioGroupItemVariants({ size: "lg" }), ["size-5"]);
  });
});

describe("RadioGroup", () => {
  it("renders a radiogroup with options", async () => {
    const { container } = render(<FruitRadios defaultValue="apple" />);
    expect(
      screen.getByRole("radiogroup", { name: "Fruit" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Apple" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Banana" })).not.toBeChecked();
    expectHasClasses(screen.getByRole("radio", { name: "Apple" }).className, [
      "size-4",
      "rounded-full",
    ]);
    await expectNoA11yViolations(container);
  });

  it("selects an option on click and calls onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitRadios onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(screen.getByRole("radio", { name: "Banana" })).toBeChecked();
  });

  it("supports controlled value", () => {
    render(<FruitRadios value="banana" />);
    expect(screen.getByRole("radio", { name: "Banana" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Apple" })).not.toBeChecked();
  });

  it("supports controlled updates", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("apple");
      return (
        <>
          <p data-testid="value">{value}</p>
          <FruitRadios value={value} onValueChange={setValue} />
        </>
      );
    }

    render(<Controlled />);
    expect(screen.getByTestId("value")).toHaveTextContent("apple");
    await user.click(screen.getByRole("radio", { name: "Banana" }));
    expect(screen.getByTestId("value")).toHaveTextContent("banana");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitRadios defaultValue="apple" onValueChange={onValueChange} />);

    const grape = screen.getByRole("radio", { name: "Grape" });
    expect(grape).toBeDisabled();
    await user.click(grape);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Apple" })).toBeChecked();
  });

  it("applies size prop on Item", () => {
    render(<FruitRadios itemSize="sm" defaultValue="apple" />);
    expectHasClasses(screen.getByRole("radio", { name: "Apple" }).className, [
      "size-3.5",
    ]);
  });

  it("forwards refs on Root and Item", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <Root ref={rootRef} aria-label="Refs">
        <Item ref={itemRef} value="a" aria-label="A">
          <Indicator />
        </Item>
      </Root>,
    );
    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("composes with horizontal Field", async () => {
    const { container } = render(
      <Root defaultValue="email" aria-label="Contact method">
        <Field
          orientation={FieldOrientation.horizontal}
          label="Email"
          htmlFor="rg-field-email"
        >
          {(control) => (
            <Item id={control.id} value="email" aria-label="Email">
              <Indicator />
            </Item>
          )}
        </Field>
        <Field
          orientation={FieldOrientation.horizontal}
          label="SMS"
          htmlFor="rg-field-sms"
        >
          {(control) => (
            <Item id={control.id} value="sms" aria-label="SMS">
              <Indicator />
            </Item>
          )}
        </Field>
      </Root>,
    );

    expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
    await expectNoA11yViolations(container);
  });

  // Keyboard roving is covered in Storybook Layer 4 (Playground play) —
  // jsdom does not fully exercise Radix radio arrow navigation.
});
