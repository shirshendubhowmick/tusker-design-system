import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "../../src/components/Label";
import { docsDefault } from "../utils/docs";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      ...docsDefault("—", { type: "ReactNode" }),
    },
    htmlFor: {
      control: "text",
      ...docsDefault("—", { type: "string" }),
    },
    required: {
      control: "boolean",
      description: "Shows a decorative required marker (*).",
      ...docsDefault("false"),
    },
    disabled: {
      control: "boolean",
      description: "Muted label when the control is disabled.",
      ...docsDefault("false"),
    },
  },
  args: {
    children: "Email",
    htmlFor: "demo-email",
    required: false,
    disabled: false,
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory(args) {
    return (
      <div className="flex flex-col gap-2">
        <Label {...args} />
        <input
          id={args.htmlFor}
          disabled={args.disabled}
          required={args.required}
          className="border-border-default bg-bg-surface text-body-md h-9 rounded-md border px-3"
          placeholder="you@acme.com"
        />
      </div>
    );
  },
};

export const Required: Story = {
  args: {
    children: "Workspace name",
    htmlFor: "ws",
    required: true,
  },
  render: function RequiredStory(args) {
    return (
      <div className="flex flex-col gap-2">
        <Label {...args} />
        <input
          id={args.htmlFor}
          required
          className="border-border-default bg-bg-surface text-body-md h-9 rounded-md border px-3"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    children: "API token",
    htmlFor: "token",
    disabled: true,
  },
  render: function DisabledStory(args) {
    return (
      <div className="flex flex-col gap-2">
        <Label {...args} />
        <input
          id={args.htmlFor}
          disabled
          className="border-border-default bg-bg-surface text-body-md h-9 rounded-md border px-3 opacity-65"
          value="••••••••"
          readOnly
        />
      </div>
    );
  },
};
