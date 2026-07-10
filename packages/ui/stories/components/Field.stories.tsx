import type { Decorator, Meta, StoryObj } from "@storybook/react";

import {
  Field,
  FieldMessageTone,
  FieldOrientation,
} from "../../src/components/Field";
import { Input } from "../../src/components/Input";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

const PlaygroundFrame: Decorator = function PlaygroundFrame(Story) {
  return (
    <div className="w-80 max-w-[min(20rem,100%)]">
      <Story />
    </div>
  );
};

const CHECKBOX_CLASS =
  "border-border-default text-accent-solid focus-visible:shadow-focus size-4 shrink-0 rounded border";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description:
        "vertical = text fields; horizontal = checkbox / switch / radio.",
      ...docsDefault("vertical", { type: "FieldOrientation" }),
    },
    label: {
      control: "text",
      ...docsDefault("—", { type: "ReactNode" }),
    },
    description: {
      control: "text",
      ...docsDefault("undefined", { type: "ReactNode" }),
    },
    message: {
      control: "text",
      ...docsDefault("undefined", { type: "ReactNode" }),
    },
    messageTone: {
      control: "select",
      options: ["default", "success", "danger", "warning"],
      ...docsDefault("default", { type: "FieldMessageTone" }),
    },
    required: {
      control: "boolean",
      ...docsDefault("false"),
    },
    disabled: {
      control: "boolean",
      ...docsDefault("false"),
    },
    fullWidth: {
      control: "boolean",
      ...docsDefault("true"),
    },
    children: {
      table: { disable: true },
      control: false,
    },
  },
  args: {
    label: "Email",
    description: undefined,
    message: "We'll never share your email.",
    messageTone: FieldMessageTone.default,
    orientation: FieldOrientation.vertical,
    required: false,
    disabled: false,
    fullWidth: true,
    htmlFor: "field-email",
    // Render functions supply the real control; placeholder satisfies Meta typing.
    children: null,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [PlaygroundFrame],
  render: function PlaygroundStory(args) {
    return (
      <Field {...args}>
        {(control) => (
          <Input
            {...control}
            disabled={args.disabled}
            required={args.required}
            placeholder="you@acme.com"
          />
        )}
      </Field>
    );
  },
};

function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      as="h3"
      variant={TextVariant.heading}
      size={TextSize.xs}
      className="border-border-default border-b pb-2"
    >
      {children}
    </Text>
  );
}

function ExampleLabel({ children }: { children: string }) {
  return (
    <Text
      as="p"
      variant={TextVariant.label}
      size={TextSize.sm}
      color={TextColor.muted}
    >
      {children}
    </Text>
  );
}

/**
 * Orientation × content variants for visual QA.
 * Prefer FormField for labeled text inputs; use Field + horizontal for choices.
 */
export const Matrix: Story = {
  args: {
    children: null,
  },
  argTypes: {
    orientation: { table: { disable: true } },
    label: { table: { disable: true } },
    description: { table: { disable: true } },
    message: { table: { disable: true } },
    messageTone: { table: { disable: true } },
    required: { table: { disable: true } },
    disabled: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex w-full max-w-lg flex-col gap-10">
        {/* ── Vertical ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Vertical</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Label above the control — text inputs, selects, textareas.
          </Text>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label only</ExampleLabel>
            <Field label="Project name" htmlFor="mx-v-label">
              {(control) => <Input {...control} placeholder="design-system" />}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label + description</ExampleLabel>
            <Field
              label="API key name"
              htmlFor="mx-v-desc"
              description="Used in audit logs."
            >
              {(control) => <Input {...control} placeholder="ci-bot" />}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label + message</ExampleLabel>
            <Field
              label="Workspace slug"
              htmlFor="mx-v-msg"
              message="Unique within the organization."
            >
              {(control) => <Input {...control} placeholder="acme" />}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Required + danger message</ExampleLabel>
            <Field
              label="Email"
              htmlFor="mx-v-err"
              message="Enter a valid email address."
              messageTone={FieldMessageTone.danger}
              required
            >
              {(control) => (
                <Input {...control} type="email" placeholder="you@acme.com" />
              )}
            </Field>
          </div>
        </section>

        {/* ── Horizontal ───────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Horizontal (choice)</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Control + label row — checkbox, switch, radio (native demo until DS
            Checkbox / Switch ship).
          </Text>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label only</ExampleLabel>
            <Field
              orientation={FieldOrientation.horizontal}
              label="Enable SSO"
              htmlFor="mx-h-label"
            >
              {(control) => (
                <input
                  {...control}
                  type="checkbox"
                  className={CHECKBOX_CLASS}
                />
              )}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label + description</ExampleLabel>
            <Field
              orientation={FieldOrientation.horizontal}
              label="Email me product updates"
              htmlFor="mx-h-desc"
              description="About once a week. Unsubscribe anytime."
            >
              {(control) => (
                <input
                  {...control}
                  type="checkbox"
                  className={CHECKBOX_CLASS}
                />
              )}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Label + success message</ExampleLabel>
            <Field
              orientation={FieldOrientation.horizontal}
              label="Bill annually"
              htmlFor="mx-h-ok"
              message="Save 20% vs monthly."
              messageTone={FieldMessageTone.success}
            >
              {(control) => (
                <input
                  {...control}
                  type="checkbox"
                  defaultChecked
                  className={CHECKBOX_CLASS}
                />
              )}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <ExampleLabel>Required + danger message</ExampleLabel>
            <Field
              orientation={FieldOrientation.horizontal}
              label="I agree to the terms"
              htmlFor="mx-h-err"
              message="You must accept to continue."
              messageTone={FieldMessageTone.danger}
              required
            >
              {(control) => (
                <input
                  {...control}
                  type="checkbox"
                  className={CHECKBOX_CLASS}
                />
              )}
            </Field>
          </div>
        </section>
      </div>
    );
  },
};
