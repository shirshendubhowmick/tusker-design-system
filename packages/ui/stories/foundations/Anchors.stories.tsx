import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";

/**
 * Global product styles for plain `<a>` elements (from `styles/index.css` base layer).
 * Button-as-link (`as="a"` / router Link) is covered under Components/Button.
 */
const meta = {
  title: "Foundations/Anchors",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="border-border-default flex flex-col gap-1 border-b pb-2">
        <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
          {title}
        </Text>
        {description ? (
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Default chrome, inline use, focus, and surfaces for plain anchors. */
export const Overview: Story = {
  render: function OverviewStory() {
    return (
      <div className="flex max-w-2xl flex-col gap-10 p-2">
        <Section
          title="Default"
          description="Base layer: accent text, medium weight, underline on hover, focus-visible ring."
        >
          <div className="flex flex-wrap items-center gap-6">
            <a href="#default">Standalone link</a>
            <a href="https://example.com">External href</a>
          </div>
        </Section>

        <Section
          title="In body copy"
          description="Anchors inherit surrounding type size; color and underline still come from global styles."
        >
          <Text as="p" variant={TextVariant.body} size={TextSize.md}>
            Monitor deployments from one place. See the{" "}
            <a href="#docs">documentation</a> for setup, or read about{" "}
            <a href="#rollback">rollbacks</a> when something goes wrong.
          </Text>
          <Text as="p" variant={TextVariant.body} size={TextSize.sm}>
            Smaller body text with an <a href="#inline-sm">inline link</a> for
            dense UI.
          </Text>
        </Section>

        <Section
          title="Focus"
          description="Tab to the link (or click then Tab) to see focus-visible:shadow-focus."
        >
          <a href="#focus-demo">Keyboard-focusable link</a>
        </Section>

        <Section
          title="On surfaces"
          description="Accent links stay legible on canvas and raised surface."
        >
          <div className="flex flex-col gap-3">
            <div className="bg-bg-canvas border-border-default rounded-md border p-4">
              <Text
                as="p"
                variant={TextVariant.label}
                size={TextSize.sm}
                color={TextColor.muted}
                className="mb-2"
              >
                bg-canvas
              </Text>
              <a href="#on-canvas">Link on canvas</a>
            </div>
            <div className="bg-bg-surface border-border-default rounded-md border p-4 shadow-sm">
              <Text
                as="p"
                variant={TextVariant.label}
                size={TextSize.sm}
                color={TextColor.muted}
                className="mb-2"
              >
                bg-surface
              </Text>
              <a href="#on-surface">Link on surface</a>
            </div>
          </div>
        </Section>

        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.sm}
          color={TextColor.muted}
        >
          Source:{" "}
          <Text as="code" variant={TextVariant.code} size={TextSize.sm}>
            packages/ui/src/styles/index.css
          </Text>{" "}
          (@layer base → a / a:hover). Button-as-link lives under
          Components/Button.
        </Text>
      </div>
    );
  },
};
