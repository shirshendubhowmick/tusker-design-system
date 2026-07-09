import {
  Cross2Icon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { IconButton } from "../../src/components/IconButton";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

type IconButtonStoryArgs = ComponentProps<typeof IconButton> & {
  icon?: "search" | "close" | "plus" | "trash" | "more";
};

const ICONS = {
  search: MagnifyingGlassIcon,
  close: Cross2Icon,
  plus: PlusIcon,
  trash: TrashIcon,
  more: DotsHorizontalIcon,
} as const;

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    "variant": {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      ...docsDefault("primary"),
    },
    "color": {
      control: "select",
      options: ["primary", "danger", "success", "warning", "info"],
      ...docsDefault("primary"),
    },
    "size": {
      control: "select",
      options: ["sm", "md", "lg"],
      ...docsDefault("md"),
    },
    "bare": {
      control: "boolean",
      description: "Tertiary only: no chrome beyond the icon glyph",
      ...docsDefault("false"),
    },
    "disabled": {
      control: "boolean",
      ...docsDefault("false"),
    },
    "aria-label": {
      control: "text",
      description: "Required accessible name for the icon-only control.",
      table: { type: { summary: "string" } },
    },
    "icon": {
      control: "select",
      options: ["search", "close", "plus", "trash", "more"],
      description: "Demo icon from @radix-ui/react-icons (maps to children).",
      ...docsDefault("search"),
    },
    "children": {
      table: { disable: true, type: { summary: "ReactNode" } },
      control: false,
    },
  },
  args: {
    "aria-label": "Search",
    "variant": "primary",
    "color": "primary",
    "size": "md",
    "bare": false,
    "disabled": false,
    "icon": "search",
  },
} satisfies Meta<IconButtonStoryArgs>;

export default meta;
type Story = StoryObj<IconButtonStoryArgs>;

export const Playground: Story = {
  render: function PlaygroundStory({
    icon = "search",
    ...args
  }: IconButtonStoryArgs) {
    const Icon = ICONS[icon];
    return (
      <IconButton {...args}>
        <Icon />
      </IconButton>
    );
  },
};

const VARIANTS = ["primary", "secondary", "tertiary"] as const;
const COLORS = ["primary", "danger", "success", "warning", "info"] as const;
const SIZES = ["sm", "md", "lg"] as const;

/** variant × color matrix for visual QA */
export const Matrix: Story = {
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
                          <IconButton
                            key={size}
                            variant={variant}
                            color={color}
                            size={size}
                            aria-label={`${variant} ${color} ${size}`}
                          >
                            <PlusIcon />
                          </IconButton>
                        );
                      })}
                      <IconButton
                        variant={variant}
                        color={color}
                        aria-label={`${variant} ${color} disabled`}
                        disabled
                      >
                        <PlusIcon />
                      </IconButton>
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

/** Toolbar-style row of common actions */
export const Toolbar: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function ToolbarStory() {
    return (
      <div className="border-border-default bg-bg-surface flex items-center gap-1 rounded-lg border p-2 shadow-sm">
        <IconButton aria-label="Search" variant="tertiary">
          <MagnifyingGlassIcon />
        </IconButton>
        <IconButton aria-label="Add" variant="tertiary" color="primary">
          <PlusIcon />
        </IconButton>
        <IconButton aria-label="More" variant="tertiary">
          <DotsHorizontalIcon />
        </IconButton>
        <div className="bg-border-default mx-1 h-5 w-px" />
        <IconButton aria-label="Delete" variant="tertiary" color="danger">
          <TrashIcon />
        </IconButton>
        <IconButton aria-label="Close" variant="secondary" size="sm">
          <Cross2Icon />
        </IconButton>
      </div>
    );
  },
};
