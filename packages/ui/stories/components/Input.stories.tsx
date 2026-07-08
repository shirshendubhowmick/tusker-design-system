import {
  CheckIcon,
  CrossCircledIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { Input } from "../../src/components/Input";

/**
 * Fixed-width frame so fullWidth inputs have a real parent width.
 * Storybook `layout: 'centered'` otherwise shrink-wraps oddly.
 */
const PlaygroundFrame: Decorator = function PlaygroundFrame(Story) {
  return (
    <div className="w-80 max-w-[min(20rem,100%)]">
      <Story />
    </div>
  );
};

/** Story-only toggles mapped to Radix icons in Playground. */
type InputStoryArgs = ComponentProps<typeof Input> & {
  showStartIcon?: boolean;
  showEndIcon?: boolean;
};

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "success", "danger", "warning"],
      description:
        "Validation / intent. Use `danger` for error states (shares danger semantic tokens).",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel", "number"],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
    showStartIcon: {
      name: "startIcon",
      control: "boolean",
      description:
        "Leading icon (demo: MagnifyingGlassIcon from @radix-ui/react-icons)",
    },
    showEndIcon: {
      name: "endIcon",
      control: "boolean",
      description: "Trailing icon (demo: CheckIcon from @radix-ui/react-icons)",
    },
    startIcon: { table: { disable: true }, control: false },
    endIcon: { table: { disable: true }, control: false },
  },
  args: {
    placeholder: "Enter value…",
    color: "default",
    size: "md",
    fullWidth: true,
    disabled: false,
    readOnly: false,
    type: "text",
    showStartIcon: false,
    showEndIcon: false,
  },
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<InputStoryArgs>;

/** Interactive playground — Controls include icon toggles. */
export const Playground: Story = {
  decorators: [PlaygroundFrame],
  render: function PlaygroundStory({
    showStartIcon,
    showEndIcon,
    ...args
  }: InputStoryArgs) {
    return (
      <Input
        {...args}
        startIcon={showStartIcon ? <MagnifyingGlassIcon /> : undefined}
        endIcon={showEndIcon ? <CheckIcon /> : undefined}
      />
    );
  },
};

const COLORS = ["default", "success", "danger", "warning"] as const;
const SIZES = ["sm", "md", "lg"] as const;

/** color × size matrix for visual QA (plain fields — icons in Docs / Playground) */
export const Matrix: Story = {
  argTypes: {
    color: { table: { disable: true } },
    size: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
    disabled: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    showStartIcon: { table: { disable: true } },
    showEndIcon: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex max-w-xl flex-col gap-8 p-2">
        {COLORS.map(function renderColorSection(color) {
          return (
            <div key={color} className="flex flex-col gap-3">
              <p className="text-heading-xs text-fg-default capitalize">
                {color}
                {color === "danger" ? " (error)" : ""}
              </p>
              <div className="flex flex-col gap-2">
                {SIZES.map(function renderSizeRow(size) {
                  return (
                    <div
                      key={size}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <span className="text-label-md text-fg-muted w-10 shrink-0">
                        {size}
                      </span>
                      <Input
                        color={color}
                        size={size}
                        placeholder={`${color} · ${size}`}
                        aria-label={`${color} ${size}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

export const Validation: Story = {
  decorators: [PlaygroundFrame],
  parameters: {
    controls: { disable: true },
  },
  render: function ValidationStory() {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-email"
            className="text-label-md text-fg-default"
          >
            Email
          </label>
          <Input
            id="input-email"
            type="email"
            color="default"
            placeholder="you@company.com"
            defaultValue="you@company.com"
            startIcon={<EnvelopeClosedIcon />}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-username"
            className="text-label-md text-fg-default"
          >
            Username
          </label>
          <Input
            id="input-username"
            color="success"
            defaultValue="ada-lovelace"
            aria-describedby="username-ok"
            endIcon={<CheckIcon />}
          />
          <span id="username-ok" className="text-body-sm text-success-text">
            Available
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-password"
            className="text-label-md text-fg-default"
          >
            Password
          </label>
          <Input
            id="input-password"
            type="password"
            color="danger"
            defaultValue="123"
            aria-describedby="password-err"
            startIcon={<LockClosedIcon />}
            endIcon={<CrossCircledIcon />}
          />
          <span id="password-err" className="text-body-sm text-danger-text">
            Must be at least 8 characters
          </span>
        </div>
      </div>
    );
  },
};
