import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { Input } from "../../src/components/Input";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

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
      ...docsDefault("default"),
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      ...docsDefault("md"),
    },
    fullWidth: {
      control: "boolean",
      ...docsDefault("true"),
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel", "number"],
      ...docsDefault("text"),
    },
    disabled: {
      control: "boolean",
      ...docsDefault("false"),
    },
    readOnly: {
      control: "boolean",
      ...docsDefault("false"),
    },
    placeholder: {
      control: "text",
      ...docsDefault("undefined", { type: "string" }),
    },
    showStartIcon: {
      name: "startIcon",
      control: "boolean",
      description:
        "Leading icon (demo: MagnifyingGlassIcon from @radix-ui/react-icons)",
      ...docsDefault("false"),
    },
    showEndIcon: {
      name: "endIcon",
      control: "boolean",
      description: "Trailing icon (demo: CheckIcon from @radix-ui/react-icons)",
      ...docsDefault("false"),
    },
    startIcon: {
      table: {
        disable: true,
        type: { summary: "ReactNode" },
      },
      control: false,
    },
    endIcon: {
      table: {
        disable: true,
        type: { summary: "ReactNode" },
      },
      control: false,
    },
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
              <Text
                as="p"
                variant={TextVariant.heading}
                size={TextSize.xs}
                className="capitalize"
              >
                {color}
                {color === "danger" ? " (error)" : ""}
              </Text>
              <div className="flex flex-col gap-2">
                {SIZES.map(function renderSizeRow(size) {
                  return (
                    <div
                      key={size}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <Text
                        as="span"
                        variant={TextVariant.label}
                        size={TextSize.md}
                        color={TextColor.muted}
                        className="w-10 shrink-0"
                      >
                        {size}
                      </Text>
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
