import type { Meta, StoryObj } from "@storybook/react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

const VARIANTS = Object.values(TextVariant);
const SIZES = Object.values(TextSize);
const COLORS = Object.values(TextColor);

const AS_OPTIONS = [
  "p",
  "span",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "li",
  "strong",
  "em",
  "code",
] as const;

const meta = {
  title: "Components/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: [...AS_OPTIONS],
      description: "HTML element to render (required).",
      table: { type: { summary: "ElementType" } },
    },
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Semantic typography group (`TextVariant.*`).",
      ...docsDefault("body", { type: "TextVariant" }),
    },
    size: {
      control: "select",
      options: SIZES,
      description:
        "Step within the variant (`TextSize.*`, e.g. heading + lg → text-heading-lg).",
      ...docsDefault("md", { type: "TextSize" }),
    },
    color: {
      control: "select",
      options: COLORS,
      description: "Semantic foreground color (`TextColor.*`).",
      ...docsDefault("default", { type: "TextColor" }),
    },
    children: {
      control: "text",
      description: "Text content (`ReactNode`).",
      ...docsDefault("—", { type: "ReactNode" }),
    },
  },
  args: {
    as: "p",
    variant: TextVariant.body,
    size: TextSize.md,
    color: TextColor.default,
    children: "The quick brown fox jumps over the lazy dog.",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Sample of each variant at its default size (md). */
export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function VariantsStory() {
    return (
      <div className="flex max-w-xl flex-col gap-4 p-2">
        {VARIANTS.map(function renderVariant(variant) {
          return (
            <div key={variant} className="flex flex-col gap-1">
              <Text
                as="span"
                variant={TextVariant.label}
                size={TextSize.sm}
                color={TextColor.muted}
              >
                {variant}
              </Text>
              <Text as="p" variant={variant} size={TextSize.md}>
                {variant === TextVariant.metric
                  ? "99.98%"
                  : variant === TextVariant.code
                    ? "pnpm deploy --env=production"
                    : "Ship faster with confidence"}
              </Text>
            </div>
          );
        })}
      </div>
    );
  },
};

/** Canvas-safe text colors (`on-*` only belongs on solid fills). */
const CANVAS_COLORS = [
  TextColor.default,
  TextColor.muted,
  TextColor.subtle,
  TextColor.accent,
  TextColor.success,
  TextColor.warning,
  TextColor.danger,
  TextColor.info,
] as const;

const ON_SOLID_COLORS: { color: TextColor; solidClass: string }[] = [
  { color: TextColor.onAccent, solidClass: "bg-accent-solid" },
  { color: TextColor.onSuccess, solidClass: "bg-success-solid" },
  { color: TextColor.onWarning, solidClass: "bg-warning-solid" },
  { color: TextColor.onDanger, solidClass: "bg-danger-solid" },
  { color: TextColor.onInfo, solidClass: "bg-info-solid" },
  { color: TextColor.onInverse, solidClass: "bg-bg-inverse" },
];

/** Body sizes + colors for visual QA */
export const Matrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    const bodySizes = [
      TextSize.lg,
      TextSize.md,
      TextSize.sm,
      TextSize.mdMedium,
    ] as const;
    return (
      <div className="flex max-w-2xl flex-col gap-6 p-2">
        <div className="flex flex-col gap-2">
          <Text as="h2" variant={TextVariant.heading} size={TextSize.sm}>
            Body sizes
          </Text>
          {bodySizes.map(function renderSize(size) {
            return (
              <Text key={size} as="p" variant={TextVariant.body} size={size}>
                body / {size} — The quick brown fox jumps over the lazy dog.
              </Text>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <Text as="h2" variant={TextVariant.heading} size={TextSize.sm}>
            Colors on canvas
          </Text>
          {CANVAS_COLORS.map(function renderColor(color) {
            return (
              <Text
                key={color}
                as="p"
                variant={TextVariant.body}
                size={TextSize.md}
                color={color}
              >
                color={color}
              </Text>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <Text as="h2" variant={TextVariant.heading} size={TextSize.sm}>
            On-solid ink (paired fills)
          </Text>
          <div className="flex flex-wrap gap-2">
            {ON_SOLID_COLORS.map(function renderOnSolid({ color, solidClass }) {
              return (
                <span
                  key={color}
                  className={`${solidClass} rounded-md px-2 py-1`}
                >
                  <Text
                    as="span"
                    variant={TextVariant.label}
                    size={TextSize.md}
                    color={color}
                  >
                    {color}
                  </Text>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
};
