import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../../src/components/Badge";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

const VARIANTS = ["soft", "outline", "solid"] as const;
const COLORS = [
  "neutral",
  "primary",
  "success",
  "warning",
  "danger",
  "info",
] as const;
const SIZES = ["sm", "md"] as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [...VARIANTS],
      ...docsDefault("soft"),
    },
    color: {
      control: "select",
      options: [...COLORS],
      ...docsDefault("neutral"),
    },
    size: {
      control: "select",
      options: [...SIZES],
      ...docsDefault("md"),
    },
    children: {
      control: "text",
      ...docsDefault("—", { type: "ReactNode" }),
    },
  },
  args: {
    children: "Badge",
    variant: "soft",
    color: "neutral",
    size: "md",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** variant × color matrix; sizes in each cell */
export const Matrix: Story = {
  argTypes: {
    variant: { table: { disable: true } },
    color: { table: { disable: true } },
    size: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex flex-col gap-8 p-2">
        {VARIANTS.map(function renderVariant(variant) {
          return (
            <div key={variant} className="flex flex-col gap-3">
              <Text
                as="p"
                variant={TextVariant.heading}
                size={TextSize.xs}
                className="capitalize"
              >
                {variant}
              </Text>
              <div className="flex flex-col gap-2">
                {COLORS.map(function renderColorRow(color) {
                  return (
                    <div
                      key={color}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <Text
                        as="span"
                        variant={TextVariant.label}
                        size={TextSize.md}
                        color={TextColor.muted}
                        className="w-20 capitalize"
                      >
                        {color}
                      </Text>
                      {SIZES.map(function renderSize(size) {
                        return (
                          <Badge
                            key={size}
                            variant={variant}
                            color={color}
                            size={size}
                          >
                            {size}
                          </Badge>
                        );
                      })}
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
