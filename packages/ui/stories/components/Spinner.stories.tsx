import type { Meta, StoryObj } from "@storybook/react";

import {
  Spinner,
  SpinnerSize,
  type SpinnerSize as SpinnerSizeKey,
} from "../../src/components/Spinner";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { cn } from "../../src/utils/cn";
import { docsDefault } from "../utils/docs";

const SIZES = Object.keys(SpinnerSize) as SpinnerSizeKey[];

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: SIZES,
      description: "Glyph size — keys of `SpinnerSize`.",
      ...docsDefault("md", { type: "SpinnerSize" }),
    },
    label: {
      control: "text",
      description:
        "Accessible name when the spinner is the sole indicator. Omit for decorative use (e.g. inside a busy button).",
      ...docsDefault("—", { type: "string" }),
    },
    className: {
      control: "text",
      description: "Extra classes — use semantic text colors for tint.",
    },
  },
  args: {
    size: "md",
    className: "text-fg-default",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Semantic color × size matrix for visual QA */
const COLOR_SWATCHES = [
  { label: "default", className: "text-fg-default" },
  { label: "muted", className: "text-fg-muted" },
  { label: "accent", className: "text-accent-text" },
  { label: "danger", className: "text-danger-text" },
  { label: "success", className: "text-success-text" },
  { label: "warning", className: "text-warning-text" },
  { label: "info", className: "text-info-text" },
  {
    label: "on accent",
    className: "text-fg-on-accent bg-accent-solid rounded-md px-2 py-2",
  },
] as const;

export const Matrix: Story = {
  argTypes: {
    size: { table: { disable: true } },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex flex-col gap-3 p-2">
        <div className="flex flex-wrap items-center gap-3">
          <Text
            as="span"
            variant={TextVariant.label}
            size={TextSize.md}
            color={TextColor.muted}
            className="w-24"
          >
            size →
          </Text>
          {SIZES.map(function renderSizeHeader(size) {
            return (
              <Text
                key={size}
                as="span"
                variant={TextVariant.label}
                size={TextSize.sm}
                color={TextColor.muted}
                className="flex w-10 justify-center capitalize"
              >
                {size}
              </Text>
            );
          })}
        </div>
        {COLOR_SWATCHES.map(function renderColorRow(swatch) {
          return (
            <div
              key={swatch.label}
              className="flex flex-wrap items-center gap-3"
            >
              <Text
                as="span"
                variant={TextVariant.label}
                size={TextSize.md}
                color={TextColor.muted}
                className="w-24 capitalize"
              >
                {swatch.label}
              </Text>
              {SIZES.map(function renderSizeCell(size) {
                return (
                  <div
                    key={size}
                    className={cn(
                      "flex w-10 items-center justify-center",
                      swatch.className,
                    )}
                  >
                    <Spinner size={size} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  },
};
