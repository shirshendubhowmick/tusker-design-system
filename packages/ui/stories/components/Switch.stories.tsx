import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Field, FieldOrientation } from "../../src/components/Field";
import { Root, type SwitchSize, Thumb } from "../../src/components/Switch";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { controlSizeOrder } from "../../src/tokens/control";
import { docsDefault } from "../utils/docs";

type SwitchStoryArgs = ComponentPropsWithoutRef<typeof Root> & {
  /**
   * Track size (styling only). Composition helper for Playground / Docs.
   */
  size?: SwitchSize;
};

const meta: Meta<SwitchStoryArgs> = {
  title: "Components/Switch",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-switch`. Behavior and API match Radix; import from `@design-system/ui/Switch`.",
          "",
          "### Composition",
          "",
          "| Part | Role |",
          "| --- | --- |",
          '| **Root** | Track + button semantics (`role="switch"`) — DS `size` (styling only) |',
          "| **Thumb** | Sliding knob — position via Root `data-state` + flex justify |",
          "",
          "### States",
          "",
          "| State | How | Notes |",
          "| --- | --- | --- |",
          "| **Off** | `checked={false}` / default | Neutral track (`bg-surface-active`) |",
          "| **On** | `checked` / `defaultChecked` | Brand solid track; thumb slides to end |",
          "| **Disabled** | `disabled` | `cursor-not-allowed` + opacity |",
          "| **Focus** | Keyboard | Shared `focusRing()` |",
          "",
          "### Sizing",
          "Root uses shared **`ControlSize`** (`sm` / `md` / `lg`) for track geometry. Thumb sizes itself to the track content box — no Thumb `size` prop.",
          "",
          'Pair with `@design-system/ui/Field` `orientation="horizontal"` for labeled form rows (ADR-002).',
          "",
          "**Playground** is the interactive demo (Layer 4). **Matrix** shows sizes and states for visual QA.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state.",
      ...docsDefault("undefined", { type: "boolean" }),
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
      ...docsDefault("undefined", { type: "string" }),
    },
    value: {
      control: "text",
      description: "Value when used in a form (submitted when checked).",
      ...docsDefault("on"),
    },
    size: {
      control: "select",
      options: [...controlSizeOrder],
      description: "Track size (styling only — not a Radix prop).",
      ...docsDefault("md", { type: "ControlSize" }),
      table: {
        category: "Appearance",
        type: { summary: "ControlSize" },
        defaultValue: { summary: "md" },
      },
    },
    children: { table: { disable: true }, control: false },
    onCheckedChange: { table: { disable: true }, control: false },
  },
  args: {
    disabled: false,
    required: false,
    defaultChecked: false,
    size: "md",
  },
};

export default meta;
type Story = StoryObj<SwitchStoryArgs>;

function LabeledSwitch({
  id,
  label,
  description,
  size,
  ...props
}: {
  id: string;
  label: string;
  description?: string;
  size?: SwitchSize;
} & ComponentPropsWithoutRef<typeof Root>) {
  return (
    <div className="flex items-start gap-2.5">
      <Root
        id={id}
        size={size}
        className="mt-0.5"
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        {...props}
      >
        <Thumb />
      </Root>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Text
          id={`${id}-label`}
          as="label"
          htmlFor={id}
          variant={TextVariant.label}
          size={TextSize.md}
          color={props.disabled ? TextColor.muted : TextColor.default}
          className={props.disabled ? "cursor-not-allowed" : "cursor-pointer"}
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

/** Uncontrolled playground — toggle with Controls. */
export const Playground: Story = {
  render: function PlaygroundRender({
    size = "md",
    checked,
    defaultChecked = false,
    ...args
  }) {
    const selectionProps =
      checked !== undefined ? { checked } : { defaultChecked };

    return (
      <div className="w-72">
        <LabeledSwitch
          id="sw-playground"
          label="Airplane mode"
          description="Disable radios and wireless links."
          size={size}
          {...args}
          {...selectionProps}
        />
      </div>
    );
  },
  /**
   * Layer 4 (ADR-003) — keyboard / toggle on the primary composition story.
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: "Airplane mode" });

    await step("Renders unchecked switch", async () => {
      await expect(control).toBeInTheDocument();
      await expect(control).not.toBeChecked();
    });

    await step("Click toggles on", async () => {
      await userEvent.click(control);
      await expect(control).toBeChecked();
    });

    await step("Space toggles off while focused", async () => {
      control.focus();
      await userEvent.keyboard(" ");
      await expect(control).not.toBeChecked();
    });

    await step("Space toggles on again", async () => {
      await userEvent.keyboard(" ");
      await expect(control).toBeChecked();
    });
  },
};

/**
 * Visual QA — sizes and states. Safe under autodocs (no portals).
 */
export const Matrix: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
    disabled: { table: { disable: true } },
    required: { table: { disable: true } },
    name: { table: { disable: true } },
    value: { table: { disable: true } },
    size: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex w-full max-w-xl flex-col gap-10 p-2">
        <section className="flex flex-col gap-4">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            Size
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Shared <code className="text-label-sm">ControlSize</code> on Root.
            Thumb scales to the track automatically.
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
                    size={size}
                    defaultChecked
                    aria-label={`Size ${size} on`}
                  >
                    <Thumb />
                  </Root>
                  <Root size={size} aria-label={`Size ${size} off`}>
                    <Thumb />
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
            <LabeledSwitch id="sw-off" label="Off" />
            <LabeledSwitch id="sw-on" label="On" defaultChecked />
            <LabeledSwitch id="sw-dis-off" label="Disabled · off" disabled />
            <LabeledSwitch
              id="sw-dis-on"
              label="Disabled · on"
              disabled
              defaultChecked
            />
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
          <FieldSwitchExample />
        </section>
      </div>
    );
  },
};

function FieldSwitchExample() {
  const [digest, setDigest] = useState(true);
  const [slack, setSlack] = useState(false);

  return (
    <div className="flex w-80 flex-col gap-4">
      <Field
        orientation={FieldOrientation.horizontal}
        label="Weekly digest"
        htmlFor="sw-mx-digest"
        description="Summary every Monday."
      >
        {(control) => (
          <Root
            id={control.id}
            checked={digest}
            onCheckedChange={setDigest}
            aria-describedby={control["aria-describedby"]}
            aria-label="Weekly digest"
          >
            <Thumb />
          </Root>
        )}
      </Field>
      <Field
        orientation={FieldOrientation.horizontal}
        label="Slack alerts"
        htmlFor="sw-mx-slack"
        description="Failed production deploys."
      >
        {(control) => (
          <Root
            id={control.id}
            checked={slack}
            onCheckedChange={setSlack}
            aria-describedby={control["aria-describedby"]}
            aria-label="Slack alerts"
          >
            <Thumb />
          </Root>
        )}
      </Field>
    </div>
  );
}
