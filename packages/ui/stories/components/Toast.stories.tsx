import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../src/components/Button";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import {
  Body,
  Provider,
  Root,
  type ToastBodyProps,
  type ToastColor,
  type ToastViewportPosition,
  Viewport,
  toastViewportPositionOrder,
} from "../../src/components/Toast";
import { docsDefault } from "../utils/docs";

type ToastStoryArgs = ComponentPropsWithoutRef<typeof Root> & {
  /**
   * Semantic intent for Body title + leading icon (styling only — not a Root prop).
   * Panel stays `bg-bg-surface`; only ink / icon color changes.
   */
  color?: ToastColor;
  /**
   * Viewport placement (styling only — not a Root prop).
   * Composition helper for Playground / Docs.
   */
  position?: ToastViewportPosition;
};

/** Suggested status glyph per intent (apps pass their own icons). */
function statusIcon(color: ToastColor): ReactNode {
  switch (color) {
    case "success":
      return <CheckCircledIcon />;
    case "danger":
      return <CrossCircledIcon />;
    case "warning":
      return <ExclamationTriangleIcon />;
    case "info":
    case "default":
    default:
      return <InfoCircledIcon />;
  }
}

const TOAST_COLORS = [
  "default",
  "success",
  "danger",
  "warning",
  "info",
] as const satisfies readonly ToastColor[];

/** Suggested Provider swipeDirection for each viewport edge. */
const SWIPE_FOR_POSITION: Record<
  ToastViewportPosition,
  "up" | "down" | "left" | "right"
> = {
  "top-left": "left",
  "top-center": "up",
  "top-right": "right",
  "bottom-left": "left",
  "bottom-center": "down",
  "bottom-right": "right",
};

const meta: Meta<ToastStoryArgs> = {
  title: "Components/Toast",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-toast`, plus a DS layout kit. Behavior of Radix parts matches upstream; import from `@design-system/ui/Toast`.",
          "",
          "### Composition",
          "",
          "| Part | Role |",
          "| --- | --- |",
          "| **Provider** | App-level duration / swipe / label — wrap once |",
          "| **Viewport** | Fixed stack (`z-toast`) — DS `position` for corner placement |",
          "| **Root** | Individual toast — always neutral surface |",
          "| **Body** | **Product layout kit** — icon + title + description + action + close |",
          "| **Title** / **Description** / **Action** / **Close** | Radix parts (use directly for fully custom layouts) |",
          "",
          "Prefer **`Body`** for standard toasts. Drop to primitives only when you need a custom structure.",
          "",
          "```tsx",
          "<Root open onOpenChange={setOpen}>",
          "  <Body",
          '    color="success"',
          "    icon={<CheckCircledIcon />}",
          '    title="Deploy finished"',
          '    description="edge-api is live."',
          '    actionLabel="View"',
          "  />",
          "</Root>",
          "```",
          "",
          "### Viewport position",
          "",
          "Set on **`Viewport`** (styling only, not a Radix prop). Default `bottom-right`.",
          "",
          "| `position` | Placement |",
          "| --- | --- |",
          "| `top-left` / `top-center` / `top-right` | Top edge |",
          "| `bottom-left` / `bottom-center` / `bottom-right` | Bottom edge |",
          "",
          'Pair Provider `swipeDirection` with the edge (e.g. top stacks → `"up"`, bottom-right → `"right"`).',
          "",
          "### States / intent",
          "",
          "Panel background is always `bg-bg-surface`. Intent is title ink + a matching leading icon on **Body**:",
          "",
          "| `color` | Use | Suggested icon |",
          "| --- | --- | --- |",
          "| `default` | Neutral notice | InfoCircled |",
          "| `success` | Completed work | CheckCircled |",
          "| `danger` | Failure / blocking error | CrossCircled |",
          "| `warning` | Caution | ExclamationTriangle |",
          "| `info` | Informational | InfoCircled |",
          "",
          "Stacking is above modals (`z-toast`). Control open state with `open` / `defaultOpen` / `onOpenChange`.",
          "",
          "**Playground** is the interactive demo (Layer 4). **Matrix** shows color intents with Body (in-flow).",
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
    duration: {
      control: "number",
      description: "Visibility ms (overrides Provider).",
      ...docsDefault("5000"),
    },
    type: {
      control: "select",
      options: ["foreground", "background"],
      description: "Announcement priority for assistive tech.",
      ...docsDefault("foreground"),
    },
    color: {
      control: "select",
      options: [...TOAST_COLORS],
      description:
        "Semantic intent for Body title + leading icon (styling only). Panel stays neutral.",
      ...docsDefault("default"),
      table: {
        category: "Appearance",
        type: { summary: "default | success | danger | warning | info" },
        defaultValue: { summary: "default" },
      },
    },
    position: {
      control: "select",
      options: [...toastViewportPositionOrder],
      description:
        "Viewport corner / edge (styling only — passed to Viewport, not Root).",
      ...docsDefault("bottom-right", { type: "ToastViewportPosition" }),
      table: {
        category: "Viewport",
        type: {
          summary:
            "top-left | top-center | top-right | bottom-left | bottom-center | bottom-right",
        },
        defaultValue: { summary: "bottom-right" },
      },
    },
    children: { table: { disable: true }, control: false },
    onOpenChange: { table: { disable: true }, control: false },
  },
  args: {
    defaultOpen: false,
    duration: 5000,
    color: "default",
    position: "bottom-right",
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

function DemoBody(
  props: Pick<
    ToastBodyProps,
    "color" | "title" | "description" | "actionLabel"
  >,
) {
  const color = props.color ?? "default";
  return (
    <Body
      color={color}
      icon={statusIcon(color)}
      title={props.title}
      description={props.description}
      actionLabel={props.actionLabel}
    />
  );
}

interface PlaygroundToast {
  id: number;
  color: ToastColor;
  title: string;
  description: string;
}

const DEMO_MESSAGES: readonly { title: string; description: string }[] = [
  {
    title: "Deploy finished",
    description: "edge-api is live in us-east-1.",
  },
  {
    title: "Build started",
    description: "console-web · commit a3f9c21.",
  },
  {
    title: "Invite sent",
    description: "grace@acme.dev can join the workspace.",
  },
  {
    title: "Rollback complete",
    description: "billing-worker restored to v1.4.2.",
  },
];

/**
 * Interactive playground — open one or many toasts to see the stack.
 *
 * Docs renders this story in an iframe (`inline: false`) so `position: fixed`
 * Viewport placement is relative to a real frame, not the tiny inline canvas.
 */
export const Playground: Story = {
  parameters: {
    layout: "centered",
    docs: {
      // Avoid inline Docs canvas: fixed Viewport is trapped by transformed
      // ancestors. Iframe gives real corner placement without createPortal
      // (portals break Storybook’s react-element-to-jsx-string source path).
      story: {
        inline: false,
        iframeHeight: 360,
      },
      description: {
        story: [
          "Uses the exported **Body** layout kit. Docs embeds this story in an",
          "iframe so Viewport `position` lands in real frame corners.",
        ].join(" "),
      },
    },
  },
  render: function PlaygroundRender(args) {
    const color = args.color ?? "default";
    const duration = args.duration ?? 5000;
    const position = args.position ?? "bottom-right";
    const {
      color: _color,
      position: _position,
      duration: _duration,
      ...rootArgs
    } = args;

    const nextIdRef = useRef(0);
    const [toasts, setToasts] = useState<PlaygroundToast[]>([]);

    function addToast() {
      setToasts((prev) => {
        const id = nextIdRef.current;
        nextIdRef.current += 1;
        const copy = DEMO_MESSAGES[id % DEMO_MESSAGES.length];
        if (!copy) return prev;
        return [
          ...prev,
          {
            id,
            color,
            title: copy.title,
            description: `${copy.description} (#${id + 1})`,
          },
        ];
      });
    }

    function dismissToast(id: number) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
      <Provider
        duration={duration}
        swipeDirection={SWIPE_FOR_POSITION[position]}
      >
        <Button onClick={addToast}>Show toast</Button>
        {toasts.map((toast) => (
          <Root
            key={toast.id}
            {...rootArgs}
            open
            onOpenChange={(open) => {
              if (!open) dismissToast(toast.id);
            }}
            duration={duration}
          >
            <DemoBody
              color={toast.color}
              title={toast.title}
              description={toast.description}
              actionLabel="View"
            />
          </Root>
        ))}
        <Viewport position={position} />
      </Provider>
    );
  },
  /**
   * Layer 4 (ADR-003) — open / dismiss on the primary composition story.
   * Runs on story load in Canvas; ends by dismissing leftovers so the resting
   * UI is only the trigger (no toast open “by default”).
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Show toast" });

    await step("Open a toast from trigger", async () => {
      await userEvent.click(trigger);
      await expect(
        page.findByText("Deploy finished"),
      ).resolves.toBeInTheDocument();
    });

    await step("Click again stacks a second toast", async () => {
      await userEvent.click(trigger);
      const titles = await page.findAllByText(/Deploy finished|Build started/);
      await expect(titles.length).toBeGreaterThanOrEqual(2);
    });

    await step("Dismiss one via close control", async () => {
      const dismissButtons = page.getAllByRole("button", { name: "Dismiss" });
      await expect(dismissButtons.length).toBeGreaterThanOrEqual(2);
      const first = dismissButtons[0];
      await expect(first).toBeTruthy();
      if (first) {
        await userEvent.click(first);
      }
      await expect(
        page.getAllByRole("button", { name: "Dismiss" }).length,
      ).toBeGreaterThanOrEqual(1);
    });

    // Return to idle — play auto-runs in Storybook UI; leave no open toast.
    await step("Clear remaining toasts for idle canvas", async () => {
      const remaining = page.queryAllByRole("button", { name: "Dismiss" });
      for (const btn of remaining) {
        await userEvent.click(btn);
      }
      await expect(
        page.queryByRole("button", { name: "Dismiss" }),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Color matrix — Body kit; neutral panel; intent via title ink + matching icon.
 * Viewport is forced in-flow (`static`) so Docs isn’t covered by a fixed stack.
 */
export const Matrix: Story = {
  argTypes: {
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    duration: { table: { disable: true } },
    type: { table: { disable: true } },
    color: { table: { disable: true } },
    position: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
    // Multiple open toasts for visual QA
    a11y: { test: "off" },
  },
  render: function MatrixStory() {
    return (
      <Provider duration={Infinity}>
        <div className="flex w-full max-w-lg flex-col gap-4 p-2">
          <Text as="h3" variant={TextVariant.heading} size={TextSize.xs}>
            Color intents
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Exported <code className="text-label-sm">Body</code> layout — same
            neutral surface; only title and icon color change.
          </Text>
          {TOAST_COLORS.map(function renderColor(color) {
            const label = `${color.charAt(0).toUpperCase()}${color.slice(1)} toast`;
            return (
              <Root key={color} defaultOpen duration={Infinity}>
                <DemoBody
                  color={color}
                  title={label}
                  description="Short supporting message for visual QA."
                  actionLabel="Undo"
                />
              </Root>
            );
          })}
          {/*
            Radix portals each Root into Viewport. Override fixed bottom-right
            so the matrix stacks in document flow under Docs / the story canvas.
          */}
          <Viewport className="pointer-events-auto static! inset-auto! max-h-none! w-full! max-w-none! flex-col! gap-2 p-0!" />
        </div>
      </Provider>
    );
  },
};
