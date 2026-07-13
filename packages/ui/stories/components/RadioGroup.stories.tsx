import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Field, FieldOrientation } from "../../src/components/Field";
import {
  Indicator,
  Item,
  type RadioGroupItemSize,
  Root,
  radioGroupItemVariants,
} from "../../src/components/RadioGroup";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { controlSizeOrder } from "../../src/tokens/control";
import { docsDefault } from "../utils/docs";

type RadioGroupStoryArgs = ComponentPropsWithoutRef<typeof Root> & {
  /**
   * Item size (styling only — not a Radix Root prop).
   * Composition helper for Playground / Docs.
   */
  size?: RadioGroupItemSize;
};

const meta: Meta<RadioGroupStoryArgs> = {
  title: "Components/RadioGroup",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-radio-group`. Behavior and API match Radix; import from `@design-system/ui/RadioGroup`.",
          "",
          "### Composition",
          "",
          "| Part | Role |",
          "| --- | --- |",
          "| **Root** | Group container — value, orientation, disabled, form attrs |",
          "| **Item** | Single option (`value` required) — DS `size` (styling only) |",
          "| **Indicator** | Checked mark — default on-accent dot; optional custom children |",
          "",
          "### States",
          "",
          "| State | How | Notes |",
          "| --- | --- | --- |",
          "| **Unchecked** | No selection / other value selected | Neutral surface + border |",
          "| **Checked** | Item matches `value` / `defaultValue` | `bg-accent-solid` + indicator dot |",
          "| **Disabled (group)** | `Root` `disabled` | All items non-interactive |",
          "| **Disabled (item)** | `Item` `disabled` | That option only |",
          "| **Focus** | Keyboard | Shared `focusRing()` |",
          "",
          "### Sizing",
          "Item uses shared **`ControlSize`** (`sm` / `md` / `lg`) — circle hit targets aligned with Checkbox. Styling only (not a Radix prop).",
          "",
          "Root defaults to a vertical stack (`grid gap-2`). Override with `className` for horizontal layouts.",
          "",
          'Pair with `@design-system/ui/Field` `orientation="horizontal"` for labeled choice rows (ADR-002).',
          "",
          "**Playground** is the interactive demo (Layer 4 keyboard). **Matrix** shows sizes and states for visual QA.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: [undefined, "startup", "business", "enterprise"],
      description: "Controlled selected value.",
      ...docsDefault("undefined", { type: "string" }),
    },
    defaultValue: {
      control: "text",
      description: "Uncontrolled initial value.",
      ...docsDefault("undefined", { type: "string" }),
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire group.",
      ...docsDefault("false"),
    },
    required: {
      control: "boolean",
      ...docsDefault("false"),
    },
    name: {
      control: "text",
      description: "Name for form submission.",
      ...docsDefault("undefined", { type: "string" }),
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Radix orientation (a11y / roving focus).",
      ...docsDefault("undefined"),
    },
    size: {
      control: "select",
      options: [...controlSizeOrder],
      description: "Item circle size (styling only — not a Radix prop).",
      ...docsDefault("md", { type: "ControlSize" }),
      table: {
        category: "Item",
        type: { summary: "ControlSize" },
        defaultValue: { summary: "md" },
      },
    },
    children: { table: { disable: true }, control: false },
    onValueChange: { table: { disable: true }, control: false },
  },
  args: {
    disabled: false,
    required: false,
    defaultValue: "business",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<RadioGroupStoryArgs>;

function OptionRow({
  id,
  value,
  label,
  description,
  size,
  disabled,
}: {
  id: string;
  value: string;
  label: string;
  description?: string;
  size?: RadioGroupItemSize;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Item
        id={id}
        value={value}
        size={size}
        disabled={disabled}
        className="mt-0.5"
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
      >
        <Indicator />
      </Item>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Text
          id={`${id}-label`}
          as="label"
          htmlFor={id}
          variant={TextVariant.label}
          size={TextSize.md}
          color={disabled ? TextColor.muted : TextColor.default}
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {label}
        </Text>
        {description ? (
          <Text
            id={`${id}-desc`}
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            {description}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

/** Uncontrolled playground — plan picker. */
export const Playground: Story = {
  render: function PlaygroundRender({
    size = "md",
    value,
    defaultValue = "business",
    ...args
  }) {
    // Avoid controlled mode when Storybook injects `value: undefined`.
    const selectionProps =
      value != null && value !== ""
        ? { value }
        : { defaultValue: defaultValue || "business" };

    return (
      <div className="w-72">
        <Root {...args} {...selectionProps} aria-label="Plan">
          <OptionRow
            id="plan-startup"
            value="startup"
            label="Startup"
            description="For early teams · 3 seats"
            size={size}
          />
          <OptionRow
            id="plan-business"
            value="business"
            label="Business"
            description="For growing products · 25 seats"
            size={size}
          />
          <OptionRow
            id="plan-enterprise"
            value="enterprise"
            label="Enterprise"
            description="SSO, audit logs, SLA"
            size={size}
          />
          <OptionRow
            id="plan-legacy"
            value="legacy"
            label="Legacy (disabled)"
            description="No longer offered"
            size={size}
            disabled
          />
        </Root>
      </div>
    );
  },
  /**
   * Layer 4 (ADR-003) — keyboard / selection on the primary composition story.
   *
   * Radix RadioGroup only auto-checks the next item on arrow when a
   * **document-level** arrow `keydown` flag is still true in the next item’s
   * `onFocus` (it then calls `.click()`). A full `userEvent.keyboard("{ArrowDown}")`
   * releases the key immediately (`keyup`), so the flag is cleared before focus
   * settles and the item stays unchecked.
   *
   * Hold the key with `{ArrowDown>}` … `{/ArrowDown}` so the flag stays set
   * through the focus transition (user-event keyboard API).
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const group = canvas.getByRole("radiogroup", { name: "Plan" });

    await step("Renders radiogroup with a selected option", async () => {
      await expect(group).toBeInTheDocument();
      await expect(
        canvas.getByRole("radio", { name: "Business" }),
      ).toBeChecked();
    });

    await step("Arrow keys move selection", async () => {
      const business = canvas.getByRole("radio", { name: "Business" });
      await user.click(business);
      await expect(business).toBeChecked();
      await expect(business).toHaveFocus();

      // Hold ArrowDown: keydown without keyup until after focus + check.
      await user.keyboard("{ArrowDown>}");
      const enterprise = canvas.getByRole("radio", { name: "Enterprise" });
      await expect(enterprise).toBeChecked();
      await expect(enterprise).toHaveFocus();
      await user.keyboard("{/ArrowDown}");
    });

    await step("Click selects another option", async () => {
      await user.click(canvas.getByRole("radio", { name: "Startup" }));
      await expect(
        canvas.getByRole("radio", { name: "Startup" }),
      ).toBeChecked();
    });
  },
};

/**
 * Visual QA — sizes and states.
 * No portaled chrome; safe under autodocs.
 */
export const Matrix: Story = {
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    disabled: { table: { disable: true } },
    required: { table: { disable: true } },
    name: { table: { disable: true } },
    orientation: { table: { disable: true } },
    size: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-10 p-2">
        <section className="flex flex-col gap-4">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            Item size
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Shared <code className="text-label-sm">ControlSize</code> with
            Checkbox. Apply via Item <code className="text-label-sm">size</code>{" "}
            or <code className="text-label-sm">radioGroupItemVariants</code>.
          </Text>
          <div className="flex flex-col gap-4">
            {controlSizeOrder.map(function renderSize(size) {
              return (
                <div key={size} className="flex items-center gap-6">
                  <Text
                    as="span"
                    variant={TextVariant.label}
                    size={TextSize.sm}
                    color={TextColor.muted}
                    className="w-8"
                  >
                    {size}
                  </Text>
                  <Root
                    defaultValue="a"
                    aria-label={`Size ${size}`}
                    className="flex flex-row flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <Item
                        value="a"
                        size={size}
                        aria-label={`${size} option A`}
                      >
                        <Indicator />
                      </Item>
                      <Text
                        as="span"
                        variant={TextVariant.label}
                        size={TextSize.md}
                      >
                        Selected
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Item
                        value="b"
                        size={size}
                        aria-label={`${size} option B`}
                      >
                        <Indicator />
                      </Item>
                      <Text
                        as="span"
                        variant={TextVariant.label}
                        size={TextSize.md}
                        color={TextColor.muted}
                      >
                        Unselected
                      </Text>
                    </div>
                  </Root>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            States
          </Text>
          <div className="flex flex-col gap-3">
            <Root defaultValue="on" aria-label="Enabled group">
              <div className="flex items-center gap-2">
                <Item value="on" aria-label="Enabled checked">
                  <Indicator />
                </Item>
                <Text as="span" variant={TextVariant.label} size={TextSize.md}>
                  Enabled · checked
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Item value="off" aria-label="Enabled unchecked">
                  <Indicator />
                </Item>
                <Text as="span" variant={TextVariant.label} size={TextSize.md}>
                  Enabled · unchecked
                </Text>
              </div>
            </Root>
            <Root defaultValue="on" disabled aria-label="Disabled group">
              <div className="flex items-center gap-2">
                <Item value="on" aria-label="Disabled checked">
                  <Indicator />
                </Item>
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.muted}
                >
                  Disabled group · checked
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Item value="off" aria-label="Disabled unchecked">
                  <Indicator />
                </Item>
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.muted}
                >
                  Disabled group · unchecked
                </Text>
              </div>
            </Root>
            <Root defaultValue="a" aria-label="Item disabled">
              <div className="flex items-center gap-2">
                <Item value="a" aria-label="Item a">
                  <Indicator />
                </Item>
                <Text as="span" variant={TextVariant.label} size={TextSize.md}>
                  Option A
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Item value="b" disabled aria-label="Item b disabled">
                  <Indicator />
                </Item>
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.muted}
                >
                  Option B · disabled item
                </Text>
              </div>
            </Root>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            With Field (horizontal)
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Product form composition — Field wires label + description.
          </Text>
          <FieldRadioExample />
        </section>

        <section className="flex flex-col gap-4">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            Size via variants helper
          </Text>
          <Root
            defaultValue="md"
            aria-label="Variants helper"
            className="flex flex-row gap-4"
          >
            {controlSizeOrder.map((size) => (
              <div key={size} className="flex items-center gap-2">
                <Item
                  value={size}
                  className={radioGroupItemVariants({ size })}
                  aria-label={`Variant ${size}`}
                >
                  <Indicator />
                </Item>
                <Text
                  as="span"
                  variant={TextVariant.label}
                  size={TextSize.sm}
                  color={TextColor.muted}
                >
                  {size}
                </Text>
              </div>
            ))}
          </Root>
        </section>
      </div>
    );
  },
};

function FieldRadioExample() {
  const [value, setValue] = useState("email");
  return (
    <Root
      value={value}
      onValueChange={setValue}
      aria-label="Contact preference"
      className="w-80"
    >
      <Field
        orientation={FieldOrientation.horizontal}
        label="Email"
        htmlFor="rg-mx-email"
        description="Primary notifications"
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
        htmlFor="rg-mx-sms"
        description="Urgent alerts only"
      >
        {(control) => (
          <Item id={control.id} value="sms" aria-label="SMS">
            <Indicator />
          </Item>
        )}
      </Field>
    </Root>
  );
}
