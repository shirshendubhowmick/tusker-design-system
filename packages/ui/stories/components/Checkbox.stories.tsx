import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  type CheckedState,
  Indicator,
  Root,
  checkboxRootVariants,
} from "../../src/components/Checkbox";
import { Field, FieldOrientation } from "../../src/components/Field";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { ControlSize, controlSizeOrder } from "../../src/tokens/control";
import { docsDefault } from "../utils/docs";

function Mark({ state }: { state?: CheckedState }) {
  if (state === "indeterminate") {
    return <DividerHorizontalIcon aria-hidden />;
  }
  return <CheckIcon aria-hidden />;
}

const meta = {
  title: "Components/Checkbox",
  component: Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "select",
      options: [undefined, true, false, "indeterminate"],
      description: "Controlled checked state (Radix `CheckedState`).",
      ...docsDefault("undefined", { type: "CheckedState" }),
    },
    defaultChecked: {
      control: "boolean",
      ...docsDefault("false"),
    },
    disabled: {
      control: "boolean",
      ...docsDefault("false"),
    },
    required: {
      control: "boolean",
      ...docsDefault("false"),
    },
    name: {
      control: "text",
      ...docsDefault("undefined"),
    },
    value: {
      control: "text",
      ...docsDefault("on"),
    },
  },
  args: {
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled playground — click to toggle. */
export const Playground: Story = {
  render: function PlaygroundRender(args) {
    return (
      <div className="flex items-center gap-2">
        <Root
          {...args}
          id="cb-playground"
          aria-labelledby="cb-playground-label"
        >
          <Indicator>
            <Mark />
          </Indicator>
        </Root>
        <Text
          id="cb-playground-label"
          as="label"
          htmlFor="cb-playground"
          variant={TextVariant.label}
          size={TextSize.md}
          color={TextColor.default}
          className="cursor-pointer"
        >
          Accept terms
        </Text>
      </div>
    );
  },
};

/** Size matrix via `checkboxRootVariants` (styling helper — not a Radix prop). */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {controlSizeOrder.map((size) => (
        <label key={size} className="flex items-center gap-2">
          <Root
            id={`cb-size-${size}`}
            defaultChecked
            className={checkboxRootVariants({ size })}
            aria-label={`Size ${size}`}
          >
            <Indicator>
              <Mark />
            </Indicator>
          </Root>
          <Text
            as="span"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
          >
            {size}
          </Text>
        </label>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(
        [
          ["Unchecked", false],
          ["Checked", true],
          ["Indeterminate", "indeterminate"],
          ["Disabled", false],
          ["Disabled checked", true],
        ] as const
      ).map(([label, checked]) => {
        const disabled = label.startsWith("Disabled");
        return (
          <label key={label} className="flex items-center gap-2">
            <Root
              id={`cb-state-${label}`}
              checked={checked}
              disabled={disabled}
              aria-label={label}
            >
              <Indicator>
                <Mark state={checked} />
              </Indicator>
            </Root>
            <Text
              as="span"
              variant={TextVariant.label}
              size={TextSize.md}
              color={disabled ? TextColor.muted : TextColor.default}
            >
              {label}
            </Text>
          </label>
        );
      })}
    </div>
  ),
};

/** Horizontal Field — product form composition (ADR-002). */
export const WithField: Story = {
  render: function WithFieldRender() {
    const [checked, setChecked] = useState<CheckedState>(false);
    return (
      <div className="w-80">
        <Field
          orientation={FieldOrientation.horizontal}
          label="Email me digests"
          htmlFor="cb-field"
          description="Weekly product news and tips"
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
                <Mark state={checked} />
              </Indicator>
            </Root>
          )}
        </Field>
      </div>
    );
  },
};

export const IndeterminateControlled: Story = {
  render: function IndeterminateRender() {
    const [state, setState] = useState<CheckedState>("indeterminate");
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <Root
            id="cb-indeterminate"
            checked={state}
            onCheckedChange={setState}
            aria-labelledby="cb-indeterminate-label"
          >
            <Indicator>
              <Mark state={state} />
            </Indicator>
          </Root>
          <Text
            id="cb-indeterminate-label"
            as="label"
            htmlFor="cb-indeterminate"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.default}
            className="cursor-pointer"
          >
            Select all (click to cycle)
          </Text>
        </div>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.sm}
          color={TextColor.muted}
        >
          State: {String(state)} · size token default is{" "}
          <code className="text-label-sm">{ControlSize.md}</code>
        </Text>
      </div>
    );
  },
};
