// @vitest-environment jsdom
import { Cross2Icon } from "@radix-ui/react-icons";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from "./Dialog";

function classTokens(className: string | null | undefined): Set<string> {
  return new Set((className ?? "").split(/\s+/).filter(Boolean));
}

function expectHasClasses(
  className: string | null | undefined,
  expected: string[],
): void {
  const tokens = classTokens(className);
  for (const token of expected) {
    expect(tokens.has(token), `expected "${token}" in "${className}"`).toBe(
      true,
    );
  }
}

function ExampleDialog({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Root defaultOpen={defaultOpen} open={openProp} onOpenChange={onOpenChange}>
      <Trigger asChild>
        <Button>Open dialog</Button>
      </Trigger>
      <Portal>
        <Overlay data-testid="dialog-overlay" />
        <Content>
          <Title>Edit profile</Title>
          <Description>Make changes to your profile here.</Description>
          <Close asChild>
            <IconButton aria-label="Close" variant="tertiary">
              <Cross2Icon />
            </IconButton>
          </Close>
          <Close asChild>
            <Button variant="primary">Save</Button>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
}

describe("dialog variants", () => {
  it("overlay uses scrim + overlay z-index", () => {
    expectHasClasses(dialogOverlayVariants(), [
      "fixed",
      "inset-0",
      "z-overlay",
      "bg-overlay-scrim",
    ]);
  });

  it("content defaults to md panel chrome", () => {
    expectHasClasses(dialogContentVariants(), [
      "fixed",
      "z-modal",
      "shadow-lg",
      "bg-bg-surface",
      // md = full-screen mobile, centered from tablet up
      "inset-0",
      "h-dvh",
      "rounded-none",
      "tablet:max-w-2xl",
      "tablet:rounded-md",
    ]);
  });

  it("content supports product dialog size steps", () => {
    // sm: always centered — never full-screen
    expectHasClasses(dialogContentVariants({ size: "sm" }), [
      "max-w-xl",
      "top-1/2",
      "left-1/2",
      "w-[calc(100%-2rem)]",
    ]);
    expect(dialogContentVariants({ size: "sm" })).not.toContain("inset-0");
    expect(dialogContentVariants({ size: "sm" })).not.toContain("h-dvh");

    // md+: full-screen on mobile tier; max-width only from tablet:
    expectHasClasses(dialogContentVariants({ size: "md" }), [
      "inset-0",
      "h-dvh",
      "tablet:max-w-2xl",
    ]);
    expectHasClasses(dialogContentVariants({ size: "lg" }), [
      "inset-0",
      "tablet:max-w-4xl",
    ]);
    expectHasClasses(dialogContentVariants({ size: "xl" }), [
      "inset-0",
      "tablet:max-w-6xl",
    ]);
  });

  it("title and description use semantic type tokens", () => {
    expectHasClasses(dialogTitleVariants(), [
      "text-heading-sm",
      "text-fg-default",
    ]);
    expectHasClasses(dialogDescriptionVariants(), [
      "text-body-sm",
      "text-fg-muted",
    ]);
  });
});

describe("Dialog", () => {
  it("opens from trigger and exposes dialog role with title", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExampleDialog />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: "Edit profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Make changes to your profile here."),
    ).toBeInTheDocument();

    expectHasClasses(dialog.className, [
      "tablet:max-w-2xl",
      "z-modal",
      "bg-bg-surface",
      "shadow-lg",
      "inset-0",
    ]);
    expectHasClasses(screen.getByTestId("dialog-overlay").className, [
      "z-overlay",
      "bg-overlay-scrim",
    ]);

    await expectNoA11yViolations(container);
  });

  it("closes via Escape and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(<ExampleDialog />);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes via Close control", async () => {
    const user = userEvent.setup();
    render(<ExampleDialog />);

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>External open</Button>
          <ExampleDialog open={open} onOpenChange={setOpen} />
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "External open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards ref to Content", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();

    render(
      <Root>
        <Trigger asChild>
          <Button>Open</Button>
        </Trigger>
        <Portal>
          <Overlay />
          <Content ref={ref} aria-describedby={undefined}>
            <Title>Titled</Title>
          </Content>
        </Portal>
      </Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(ref.current).toBe(screen.getByRole("dialog"));
  });

  it("applies size prop once and merges className extras", async () => {
    render(
      <Root defaultOpen>
        <Portal>
          <Overlay />
          <Content size="lg" className="mt-2" aria-describedby={undefined}>
            <Title>Large</Title>
          </Content>
        </Portal>
      </Root>,
    );

    const dialog = await screen.findByRole("dialog");
    expectHasClasses(dialog.className, ["tablet:max-w-4xl", "mt-2", "z-modal"]);
    // Must not stack default md full-screen leftovers when size is lg
    expect(dialog.className).toContain("inset-0");
    expect(dialog.className).not.toContain("tablet:max-w-2xl");
  });

  it("size sm stays a centered panel (no mobile full-screen classes)", async () => {
    render(
      <Root defaultOpen>
        <Portal>
          <Overlay />
          <Content size="sm" aria-describedby={undefined}>
            <Title>Small</Title>
          </Content>
        </Portal>
      </Root>,
    );

    const dialog = await screen.findByRole("dialog");
    expectHasClasses(dialog.className, [
      "max-w-xl",
      "top-1/2",
      "left-1/2",
      "max-h-[min(85vh,100%)]",
    ]);
    expect(dialog.className).not.toContain("inset-0");
    expect(dialog.className).not.toContain("h-dvh");
    expect(dialog.className).not.toContain("tablet:max-w-2xl");
  });

  it("renders defaultOpen with a11y-clean tree", async () => {
    const { container } = render(<ExampleDialog defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
