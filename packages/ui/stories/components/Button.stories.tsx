import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { Button } from "../../src/components/Button";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

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
      ...docsDefault("primary"),
    },
    color: {
      control: "select",
      options: ["primary", "danger", "success", "warning", "info"],
      ...docsDefault("primary"),
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      ...docsDefault("md"),
    },
    fullWidth: {
      control: "boolean",
      description: "Stretch to parent width (not used for tertiary)",
      ...docsDefault("false"),
    },
    bare: {
      control: "boolean",
      description: "Tertiary only: no padding — text-only control",
      ...docsDefault("false"),
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      ...docsDefault("button"),
    },
    disabled: {
      control: "boolean",
      ...docsDefault("false"),
    },
    loading: {
      control: "boolean",
      description:
        "Shows a spinner, sets aria-busy, and disables the control. Label stays mounted to avoid width jump.",
      ...docsDefault("false"),
    },
    loadingText: {
      control: "text",
      description: "Optional label while loading (defaults to children).",
      ...docsDefault("—", { type: "ReactNode" }),
    },
    as: {
      control: "select",
      options: ["button", "a"],
      description:
        "Host element/component (`button` default). Use `as={Link}` for app routers.",
      ...docsDefault("button", { type: "ElementType" }),
    },
    children: {
      control: "text",
      ...docsDefault("—", { type: "ReactNode" }),
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    color: "primary",
    size: "md",
    fullWidth: false,
    bare: false,
    disabled: false,
    loading: false,
    type: "button",
    as: "button",
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
    loading: { table: { disable: true } },
    loadingText: { table: { disable: true } },
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
                      <Button variant={variant} color={color} loading>
                        loading
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

/**
 * Polymorphic host — button **look** on `<a>` (or a router `Link`).
 * No disabled-link behavior: that isn't a native anchor concept.
 * Plain text links use global `a` styles from `styles.css`.
 */
export const AsLink: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function AsLinkStory() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Button chrome as anchor (`as=&quot;a&quot;`)
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button as="a" href="#primary">
              Primary link
            </Button>
            <Button as="a" href="#secondary" variant="secondary">
              Secondary link
            </Button>
            <Button as="a" href="#danger" variant="secondary" color="danger">
              Danger link
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Inline text anchors (global base styles — not Button)
          </Text>
          <Text as="p" variant={TextVariant.body} size={TextSize.md}>
            See the <a href="#docs">documentation</a> for setup, or{" "}
            <a href="https://example.com">external site</a>.
          </Text>
        </div>
      </div>
    );
  },
};

/**
 * Loading always shows a spinner.
 * - Default: keep `children` so width stays stable ("Save changes").
 * - `loadingText`: swap the label while busy ("Saving…").
 */
export const Loading: Story = {
  argTypes: {
    loading: { table: { disable: true } },
    loadingText: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
  },
  render: function LoadingStory() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            loading only — same label as idle (stable width)
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Save changes</Button>
            <Button loading>Save changes</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            loading + loadingText — replace label while busy
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Save changes</Button>
            <Button loading loadingText="Saving…">
              Save changes
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
