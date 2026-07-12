// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Button } from "../Button";
import {
  Action,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
  alertDialogContentVariants,
  alertDialogDescriptionVariants,
  alertDialogOverlayVariants,
  alertDialogTitleVariants,
} from "./AlertDialog";

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

function ExampleAlert({
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
        <Button color="danger" variant="secondary">
          Delete project
        </Button>
      </Trigger>
      <Portal>
        <Overlay data-testid="alert-overlay" />
        <Content>
          <Title>Delete project?</Title>
          <Description>
            This removes the project and its deploy history. This cannot be
            undone.
          </Description>
          <Cancel asChild>
            <Button variant="secondary">Cancel</Button>
          </Cancel>
          <Action asChild>
            <Button color="danger" variant="primary">
              Delete
            </Button>
          </Action>
        </Content>
      </Portal>
    </Root>
  );
}

describe("alertDialog variants", () => {
  it("overlay uses scrim + overlay z-index", () => {
    expectHasClasses(alertDialogOverlayVariants(), [
      "fixed",
      "inset-0",
      "z-overlay",
      "bg-overlay-scrim",
    ]);
  });

  it("content defaults to compact md centered panel", () => {
    expectHasClasses(alertDialogContentVariants(), [
      "max-w-md",
      "fixed",
      "z-modal",
      "shadow-lg",
      "bg-bg-surface",
      "rounded-md",
      "top-1/2",
      "left-1/2",
      "w-[calc(100%-2rem)]",
    ]);
    // Never full-screen (product Dialog owns that)
    expect(alertDialogContentVariants()).not.toContain("inset-0");
    expect(alertDialogContentVariants()).not.toContain("h-dvh");
  });

  it("content supports compact size steps (always centered)", () => {
    expectHasClasses(alertDialogContentVariants({ size: "sm" }), ["max-w-sm"]);
    expectHasClasses(alertDialogContentVariants({ size: "md" }), ["max-w-md"]);
    expectHasClasses(alertDialogContentVariants({ size: "lg" }), ["max-w-lg"]);
    for (const size of ["sm", "md", "lg"] as const) {
      const cls = alertDialogContentVariants({ size });
      expect(cls).not.toContain("inset-0");
      expect(cls).not.toContain("h-dvh");
      expect(cls).toContain("top-1/2");
    }
  });

  it("title and description use semantic type tokens", () => {
    expectHasClasses(alertDialogTitleVariants(), [
      "text-heading-sm",
      "text-fg-default",
    ]);
    expectHasClasses(alertDialogDescriptionVariants(), [
      "text-body-sm",
      "text-fg-muted",
    ]);
  });
});

describe("AlertDialog", () => {
  it("opens from trigger as alertdialog with title", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExampleAlert />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete project" }));

    const alert = screen.getByRole("alertdialog");
    expect(alert).toBeInTheDocument();
    expect(
      within(alert).getByRole("heading", { name: "Delete project?" }),
    ).toBeInTheDocument();
    expectHasClasses(alert.className, [
      "max-w-md",
      "z-modal",
      "bg-bg-surface",
      "top-1/2",
    ]);
    expectHasClasses(screen.getByTestId("alert-overlay").className, [
      "z-overlay",
      "bg-overlay-scrim",
    ]);

    await expectNoA11yViolations(container);
  });

  it("closes via Cancel and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(<ExampleAlert />);

    const trigger = screen.getByRole("button", { name: "Delete project" });
    await user.click(trigger);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes via Action", async () => {
    const user = userEvent.setup();
    render(<ExampleAlert />);

    await user.click(screen.getByRole("button", { name: "Delete project" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes via Escape and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(<ExampleAlert />);

    const trigger = screen.getByRole("button", { name: "Delete project" });
    await user.click(trigger);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>External open</Button>
          <ExampleAlert open={open} onOpenChange={setOpen} />
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "External open" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
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
          <Content ref={ref}>
            <Title>Confirm</Title>
            <Description>Are you sure?</Description>
            <Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </Cancel>
            <Action asChild>
              <Button>OK</Button>
            </Action>
          </Content>
        </Portal>
      </Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(ref.current).toBe(screen.getByRole("alertdialog"));
  });

  it("applies size prop once and merges className extras", async () => {
    render(
      <Root defaultOpen>
        <Portal>
          <Overlay />
          <Content size="sm" className="mt-2">
            <Title>Small</Title>
            <Description>Compact confirm.</Description>
            <Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </Cancel>
            <Action asChild>
              <Button>OK</Button>
            </Action>
          </Content>
        </Portal>
      </Root>,
    );

    const alert = await screen.findByRole("alertdialog");
    expectHasClasses(alert.className, ["max-w-sm", "mt-2", "z-modal"]);
    expect(alert.className).not.toContain("max-w-md");
    expect(alert.className).not.toContain("inset-0");
  });

  it("renders defaultOpen with a11y-clean tree", async () => {
    const { container } = render(<ExampleAlert defaultOpen />);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
