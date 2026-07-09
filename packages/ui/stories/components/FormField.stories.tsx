import {
  CheckIcon,
  CrossCircledIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { FormField } from "../../src/components/FormField";

const PlaygroundFrame: Decorator = function PlaygroundFrame(Story) {
  return (
    <div className="w-80 max-w-[min(20rem,100%)]">
      <Story />
    </div>
  );
};

type FormFieldStoryArgs = ComponentProps<typeof FormField> & {
  showStartIcon?: boolean;
  showEndIcon?: boolean;
};

const meta = {
  title: "Components/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "success", "danger", "warning"],
      description:
        "Shared by the input chrome and message text. Use `danger` for errors.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel", "number"],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    // Playground uses a text control for convenience; the real prop type is ReactNode
    // (icons, emphasis, links, etc.). Force the Args table to show ReactNode, not string.
    label: {
      control: "text",
      description:
        "Field label. Type is `ReactNode` (string is fine; also supports markup, badges, required markers).",
      table: { type: { summary: "ReactNode" } },
    },
    message: {
      control: "text",
      description:
        "Helper or validation content under the control. Type is `ReactNode` (string or rich content).",
      table: { type: { summary: "ReactNode" } },
    },
    placeholder: { control: "text" },
    showStartIcon: {
      name: "startIcon",
      control: "boolean",
      description: "Leading MagnifyingGlassIcon (demo)",
    },
    showEndIcon: {
      name: "endIcon",
      control: "boolean",
      description: "Trailing CheckIcon (demo)",
    },
    startIcon: { table: { disable: true }, control: false },
    endIcon: { table: { disable: true }, control: false },
  },
  args: {
    label: "Email",
    message: "We'll never share your email.",
    placeholder: "you@company.com",
    color: "default",
    size: "md",
    fullWidth: true,
    disabled: false,
    readOnly: false,
    type: "email",
    showStartIcon: false,
    showEndIcon: false,
  },
} satisfies Meta<FormFieldStoryArgs>;

export default meta;
type Story = StoryObj<FormFieldStoryArgs>;

export const Playground: Story = {
  decorators: [PlaygroundFrame],
  render: function PlaygroundStory({
    showStartIcon,
    showEndIcon,
    ...args
  }: FormFieldStoryArgs) {
    return (
      <FormField
        {...args}
        startIcon={showStartIcon ? <MagnifyingGlassIcon /> : undefined}
        endIcon={showEndIcon ? <CheckIcon /> : undefined}
      />
    );
  },
};

const COLORS = ["default", "success", "danger", "warning"] as const;

/** Typical form stack — label + input (+ icons) + message */
export const Examples: Story = {
  decorators: [PlaygroundFrame],
  parameters: {
    controls: { disable: true },
  },
  render: function ExamplesStory() {
    return (
      <div className="flex flex-col gap-6">
        <FormField
          label="Email"
          type="email"
          placeholder="you@company.com"
          defaultValue="you@company.com"
          message="We'll never share your email."
          startIcon={<EnvelopeClosedIcon />}
        />
        <FormField
          label="Username"
          color="success"
          defaultValue="ada-lovelace"
          message="Available"
          endIcon={<CheckIcon />}
        />
        <FormField
          label="Password"
          type="password"
          color="danger"
          defaultValue="123"
          message="Must be at least 8 characters"
          startIcon={<LockClosedIcon />}
          endIcon={<CrossCircledIcon />}
        />
        <FormField
          label="Search"
          type="search"
          placeholder="Search projects…"
          startIcon={<MagnifyingGlassIcon />}
        />
      </div>
    );
  },
};

export const Matrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex max-w-md flex-col gap-6 p-2">
        {COLORS.map(function renderColor(color) {
          return (
            <FormField
              key={color}
              label={color === "danger" ? "Error" : color}
              color={color}
              placeholder={`${color} field`}
              message={
                color === "default"
                  ? "Helper text"
                  : color === "success"
                    ? "Looks good"
                    : color === "danger"
                      ? "Something went wrong"
                      : "Check this value"
              }
            />
          );
        })}
      </div>
    );
  },
};
