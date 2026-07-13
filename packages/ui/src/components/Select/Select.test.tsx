// @vitest-environment jsdom
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
} from "./Select";

/**
 * Radix Select uses Pointer Capture APIs that jsdom does not implement.
 * Polyfill the minimum surface so open / select interactions work in unit tests.
 * @see https://github.com/radix-ui/primitives/issues/1207
 */
beforeAll(() => {
  if (typeof Element !== "undefined") {
    const noop = (): void => undefined;
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.setPointerCapture ??= noop;
    Element.prototype.releasePointerCapture ??= noop;
    Element.prototype.scrollIntoView ??= noop;
  }
});

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

function FruitSelect({
  defaultValue,
  value,
  onValueChange,
  disabled,
  triggerProps,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  triggerProps?: Parameters<typeof Trigger>[0];
}) {
  return (
    <Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Trigger aria-label="Fruit" {...triggerProps}>
        <Value placeholder="Pick a fruit" />
        <Icon>
          <ChevronDownIcon />
        </Icon>
      </Trigger>
      <Portal>
        <Content position="popper" sideOffset={4}>
          <ScrollUpButton>
            <ChevronUpIcon />
          </ScrollUpButton>
          <Viewport>
            <Group>
              <Label>Fruits</Label>
              <Item value="apple">
                <ItemIndicator>
                  <CheckIcon />
                </ItemIndicator>
                <ItemText>Apple</ItemText>
              </Item>
              <Item value="banana">
                <ItemIndicator>
                  <CheckIcon />
                </ItemIndicator>
                <ItemText>Banana</ItemText>
              </Item>
              <Item value="grape" disabled>
                <ItemIndicator>
                  <CheckIcon />
                </ItemIndicator>
                <ItemText>Grape (disabled)</ItemText>
              </Item>
            </Group>
            <Separator />
            <Item value="orange">
              <ItemIndicator>
                <CheckIcon />
              </ItemIndicator>
              <ItemText>Orange</ItemText>
            </Item>
          </Viewport>
          <ScrollDownButton>
            <ChevronDownIcon />
          </ScrollDownButton>
        </Content>
      </Portal>
    </Root>
  );
}

describe("select variants", () => {
  it("trigger defaults to md field chrome", () => {
    expectHasClasses(selectTriggerVariants(), [
      "h-9",
      "border-border-default",
      "bg-bg-surface",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
      "w-full",
    ]);
  });

  it("trigger supports ControlSize and validation colors", () => {
    expectHasClasses(selectTriggerVariants({ size: "sm" }), ["h-8"]);
    expectHasClasses(selectTriggerVariants({ size: "lg" }), ["h-10"]);
    expectHasClasses(selectTriggerVariants({ color: "danger" }), [
      "border-danger-border",
    ]);
  });

  it("content uses popover surface + dropdown z-index", () => {
    expectHasClasses(selectContentVariants(), [
      "z-dropdown",
      "shadow-md",
      "bg-bg-surface",
      "rounded-md",
    ]);
    // Padding is on Viewport, not Content (scroll buttons sit outside the list)
    expect(selectContentVariants()).not.toContain("p-1");
  });

  it("item uses pointer cursor, selected color, and disabled not-allowed", () => {
    expectHasClasses(selectItemVariants(), [
      "cursor-pointer",
      "data-[disabled]:cursor-not-allowed",
      "pl-8",
      "data-[state=checked]:bg-accent-subtle",
      "data-[state=checked]:text-accent-text",
      "data-[highlighted]:data-[state=checked]:bg-accent-subtle-hover",
    ]);
  });
});

describe("Select", () => {
  it("renders trigger with placeholder and opens listbox", async () => {
    const user = userEvent.setup();
    const { container } = render(<FruitSelect />);

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-placeholder");
    expectHasClasses(trigger.className, ["h-9", "cursor-pointer", "w-full"]);

    await user.click(trigger);

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(
      within(listbox).getByRole("option", { name: "Apple" }),
    ).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("selects an option and updates the trigger value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent(
      "Banana",
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports controlled value", () => {
    render(<FruitSelect value="apple" />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent(
      "Apple",
    );
  });

  it("supports controlled open via external state", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("orange");
      return (
        <div>
          <p data-testid="value">{value}</p>
          <FruitSelect value={value} onValueChange={setValue} />
        </div>
      );
    }

    render(<Controlled />);
    expect(screen.getByTestId("value")).toHaveTextContent("orange");
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(screen.getByTestId("value")).toHaveTextContent("apple");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FruitSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    const disabled = screen.getByRole("option", { name: "Grape (disabled)" });
    expect(disabled).toHaveAttribute("data-disabled");
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards disabled on Root to the trigger", () => {
    render(<FruitSelect disabled />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeDisabled();
  });

  it("applies DS size and color on Trigger", () => {
    render(
      <FruitSelect
        triggerProps={{ size: "sm", color: "danger", fullWidth: false }}
      />,
    );
    expectHasClasses(
      screen.getByRole("combobox", { name: "Fruit" }).className,
      ["h-8", "border-danger-border", "w-auto"],
    );
  });

  it("forwards refs on Trigger and Content", async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Root>
        <Trigger ref={triggerRef} aria-label="Ref select">
          <Value placeholder="Choose" />
          <Icon>
            <ChevronDownIcon />
          </Icon>
        </Trigger>
        <Portal>
          <Content ref={contentRef} position="popper">
            <Viewport>
              <Item value="a">
                <ItemText>A</ItemText>
              </Item>
            </Viewport>
          </Content>
        </Portal>
      </Root>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    await user.click(screen.getByRole("combobox", { name: "Ref select" }));
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    await user.click(trigger);
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders group label and separator in the open list", async () => {
    const user = userEvent.setup();
    render(<FruitSelect />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Orange" })).toBeInTheDocument();
  });
});
