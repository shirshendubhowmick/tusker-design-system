import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { expect, userEvent, within } from "storybook/test";

import {
  Action,
  type AlertDialogContentSize,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "../../src/components/AlertDialog";
import { Button } from "../../src/components/Button";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { surfaceSectionClass } from "../../src/utils/surface";
import { docsDefault } from "../utils/docs";

type AlertDialogStoryArgs = ComponentPropsWithoutRef<typeof Root>;

const meta: Meta<AlertDialogStoryArgs> = {
  title: "Components/AlertDialog",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-alert-dialog`. Behavior and API match Radix; import from `@design-system/ui/AlertDialog`.",
          "",
          "Use for **confirms and alerts** that require an explicit choice (Cancel / Action). Not for multi-field forms — use `@design-system/ui/Dialog` for those.",
          "",
          "### Confirm patterns",
          "Tone comes from the **Action** `Button`, not from AlertDialog itself:",
          "",
          "| Pattern | Action `Button` | Example |",
          "| --- | --- | --- |",
          '| **Danger** (destructive) | `color="danger"` `variant="primary"` | Delete project — see **Playground** |',
          "| **Neutral** (non-destructive) | default primary / secondary | Discard unsaved changes, leave page |",
          "",
          "### Differences from Dialog",
          "- Role is `alertdialog`.",
          "- **Action** / **Cancel** instead of a generic Close (prefer `asChild` + `Button`).",
          "- Pointer-down outside does not dismiss (must choose an action or Cancel / Escape).",
          "- **Always a centered panel** at every breakpoint — no mobile full-screen sheet.",
          "- Compact max-width scale (`sm` / `md` / `lg`).",
          "",
          "### Panel layout (composition)",
          "Compose regions with `surfaceSectionClass` from `@design-system/ui/surface` (same as Dialog):",
          "",
          "| Region | Recipe | Role |",
          "| --- | --- | --- |",
          "| **Header** | `surfaceSectionClass.header` | Title + description |",
          "| **Body** | `surfaceSectionClass.body` | Optional extra detail |",
          "| **Footer** | `surfaceSectionClass.footer` | Cancel + Action |",
          "",
          "### Sizing",
          "Set size with the **`Content` `size` prop** (default `md`). Do not pass `alertDialogContentVariants({ size })` as `className`.",
          "",
          "| size | token | ~width | mobile |",
          "| --- | --- | --- | --- |",
          "| `sm` | `max-w-sm` | 384px | centered |",
          "| `md` (default) | `max-w-md` | 448px | centered |",
          "| `lg` | `max-w-lg` | 512px | centered |",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state.",
      ...docsDefault("undefined", { type: "boolean" }),
    },
    defaultOpen: {
      control: "boolean",
      ...docsDefault("false"),
    },
    children: { table: { disable: true }, control: false },
    onOpenChange: { table: { disable: true }, control: false },
  },
  args: {
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<AlertDialogStoryArgs>;

function ActionFooter({ children }: { children: ReactNode }) {
  return (
    <div className={`${surfaceSectionClass.footer} flex justify-end gap-2`}>
      {children}
    </div>
  );
}

function AlertShell({
  title,
  description,
  size,
  children,
}: {
  title: string;
  description: string;
  size?: AlertDialogContentSize;
  children?: ReactNode;
}) {
  return (
    <Portal>
      <Overlay />
      <Content size={size}>
        <div className={surfaceSectionClass.header}>
          <div className="flex min-w-0 flex-col gap-1">
            <Title>{title}</Title>
            <Description>{description}</Description>
          </div>
        </div>
        {children}
      </Content>
    </Portal>
  );
}

/** Uncontrolled playground — destructive confirm (danger Action Button). */
export const Playground: Story = {
  render: function PlaygroundRender(args) {
    return (
      <Root {...args}>
        <Trigger asChild>
          <Button color="danger" variant="secondary">
            Delete project
          </Button>
        </Trigger>
        <AlertShell
          title="Delete project?"
          description="This removes the project and its deploy history. This cannot be undone."
        >
          <ActionFooter>
            <Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </Cancel>
            <Action asChild>
              <Button color="danger" variant="primary">
                Delete
              </Button>
            </Action>
          </ActionFooter>
        </AlertShell>
      </Root>
    );
  },
  /**
   * Layer 4 (ADR-003) — keyboard / focus on the primary composition story.
   * Portaled content under `document.body`.
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Delete project" });

    await step("Open alert — focus moves inside", async () => {
      await userEvent.click(trigger);
      const alert = await page.findByRole("alertdialog");
      await expect(alert).toBeInTheDocument();
      await expect(
        alert.contains(document.activeElement),
        "focus should be inside the alert after open",
      ).toBe(true);
      await expect(alert.className.split(/\s+/)).toEqual(
        expect.arrayContaining([
          "focus-visible:shadow-focus",
          "focus-visible:outline-none",
          "max-w-md",
        ]),
      );
      // Compact: never full-screen geometry
      await expect(alert.className).not.toContain("inset-0");
      await expect(alert.className).not.toContain("h-dvh");
    });

    await step("Tab keeps focus within the alert (focus trap)", async () => {
      const alert = page.getByRole("alertdialog");
      const activeBefore = document.activeElement;
      await userEvent.tab();
      await expect(document.activeElement).not.toBe(activeBefore);
      await expect(alert.contains(document.activeElement)).toBe(true);
      await userEvent.tab();
      await expect(alert.contains(document.activeElement)).toBe(true);
    });

    await step("Escape closes and restores focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(page.queryByRole("alertdialog")).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
};

/** Compact size matrix — always centered panels. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Root key={size}>
          <Trigger asChild>
            <Button variant="secondary">Open {size}</Button>
          </Trigger>
          <AlertShell
            title={`Size ${size}`}
            description="Compact alert max-width from Content size prop."
            size={size}
          >
            <div className={surfaceSectionClass.body}>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.muted}
              >
                Size <code className="text-label-sm">{size}</code>
                {" → "}
                {
                  {
                    sm: "max-w-sm (~384px)",
                    md: "max-w-md (~448px)",
                    lg: "max-w-lg (~512px)",
                  }[size]
                }
                , always centered.
              </Text>
            </div>
            <ActionFooter>
              <Cancel asChild>
                <Button size="sm" variant="secondary">
                  Cancel
                </Button>
              </Cancel>
              <Action asChild>
                <Button size="sm">Confirm</Button>
              </Action>
            </ActionFooter>
          </AlertShell>
        </Root>
      ))}
    </div>
  ),
};
