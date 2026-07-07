import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { Button } from "../../src/components/Button";

/**
 * Fixed-width frame so `fullWidth` has a real parent width to fill.
 * Storybook `layout: 'centered'` otherwise shrink-wraps to the button.
 */
const PlaygroundFrame: Decorator = function PlaygroundFrame(Story) {
  return (
    <div className="w-80 max-w-[min(20rem,100%)]">
      <Story />
    </div>
  );
};

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    color: {
      control: "select",
      options: ["primary", "danger", "success", "warning", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
      description: "Stretch to parent width (not used for tertiary)",
    },
    bare: {
      control: "boolean",
      description: "Tertiary only: no padding — text-only control",
    },

    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    variant: "primary",
    color: "primary",
    size: "md",
    fullWidth: false,
    bare: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — use Controls to change variant, color, size, fullWidth, etc. */
export const Playground: Story = {
  decorators: [PlaygroundFrame],
};

const VARIANTS = ["primary", "secondary", "tertiary"] as const;
const COLORS = ["primary", "danger", "success", "warning", "info"] as const;
const SIZES = ["sm", "md", "lg"] as const;

/** variant × color matrix for visual QA */
export const Matrix: Story = {
  argTypes: {
    variant: { table: { disable: true } },
    color: { table: { disable: true } },
    size: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
    disabled: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex flex-col gap-8 p-2">
        {VARIANTS.map(function renderVariantSection(variant) {
          return (
            <div key={variant} className="flex flex-col gap-3">
              <p className="text-heading-xs text-fg-default capitalize">
                {variant}
              </p>
              <div className="flex flex-col gap-2">
                {COLORS.map(function renderColorRow(color) {
                  return (
                    <div
                      key={color}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <span className="text-label-md text-fg-muted w-20 capitalize">
                        {color}
                      </span>
                      {SIZES.map(function renderSizeButton(size) {
                        return (
                          <Button
                            key={size}
                            variant={variant}
                            color={color}
                            size={size}
                          >
                            {size}
                          </Button>
                        );
                      })}
                      <Button variant={variant} color={color} disabled>
                        disabled
                      </Button>
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
