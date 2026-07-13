// @vitest-environment jsdom
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Button } from "../Button";
import {
  Body,
  Provider,
  Root,
  Title,
  Viewport,
  toastIconVariants,
  toastRootVariants,
  toastTitleVariants,
  toastViewportVariants,
} from "./Toast";

/**
 * Radix Toast uses Pointer Capture APIs that jsdom does not implement.
 */
beforeAll(() => {
  if (typeof Element !== "undefined") {
    const noop = (): void => undefined;
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.setPointerCapture ??= noop;
    Element.prototype.releasePointerCapture ??= noop;
  }
});

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

function ExampleToast({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  color = "default",
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  color?: "default" | "success" | "danger" | "warning" | "info";
}) {
  const icon =
    color === "danger" ? (
      <CrossCircledIcon data-testid="toast-icon-svg" />
    ) : color === "success" ? (
      <CheckCircledIcon data-testid="toast-icon-svg" />
    ) : (
      <CheckCircledIcon data-testid="toast-icon-svg" />
    );

  return (
    <Provider>
      <Root
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        duration={Infinity}
        data-testid="toast-root"
      >
        <Body
          color={color}
          icon={icon}
          title="Deploy finished"
          description="edge-api is live in us-east-1."
          actionLabel="View"
        />
      </Root>
      <Viewport />
    </Provider>
  );
}

describe("toast variants", () => {
  it("viewport defaults to bottom-right with toast z-index", () => {
    expectHasClasses(toastViewportVariants(), [
      "fixed",
      "z-toast",
      "bottom-0",
      "right-0",
      "flex-col-reverse",
    ]);
  });

  it("viewport supports corner positions", () => {
    expectHasClasses(toastViewportVariants({ position: "top-left" }), [
      "top-0",
      "left-0",
      "flex-col",
    ]);
    expectHasClasses(toastViewportVariants({ position: "top-center" }), [
      "top-0",
      "left-1/2",
      "-translate-x-1/2",
    ]);
    expectHasClasses(toastViewportVariants({ position: "bottom-left" }), [
      "bottom-0",
      "left-0",
    ]);
  });

  it("root is always neutral surface chrome", () => {
    expectHasClasses(toastRootVariants(), [
      "bg-bg-surface",
      "border-border-default",
      "shadow-md",
      "rounded-md",
    ]);
  });

  it("title and icon carry semantic ink (panel does not)", () => {
    expectHasClasses(toastTitleVariants({ color: "success" }), [
      "text-success-text",
    ]);
    expectHasClasses(toastTitleVariants({ color: "danger" }), [
      "text-danger-text",
    ]);
    expectHasClasses(toastIconVariants({ color: "success" }), [
      "text-success-text",
    ]);
    expectHasClasses(toastIconVariants({ color: "warning" }), [
      "text-warning-text",
    ]);
    expectHasClasses(toastIconVariants({ color: "info" }), ["text-info-text"]);
  });
});

describe("Toast", () => {
  it("opens and shows title and description via Body", async () => {
    const { container } = render(<ExampleToast defaultOpen />);

    expect(await screen.findByText("Deploy finished")).toBeInTheDocument();
    expect(
      screen.getByText("edge-api is live in us-east-1."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("toast-root")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("dismisses via Body close control", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ExampleToast defaultOpen onOpenChange={onOpenChange} />);

    await screen.findByText("Deploy finished");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Show toast</Button>
          <ExampleToast open={open} onOpenChange={setOpen} />
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByText("Deploy finished")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Deploy finished")).toBeInTheDocument();
  });

  it("renders action button from actionLabel", async () => {
    render(<ExampleToast defaultOpen />);
    await screen.findByText("Deploy finished");
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("forwards refs on Root and Viewport", async () => {
    const rootRef = createRef<HTMLLIElement>();
    const viewportRef = createRef<HTMLOListElement>();

    render(
      <Provider>
        <Root ref={rootRef} defaultOpen duration={Infinity}>
          <Title>Ref toast</Title>
        </Root>
        <Viewport ref={viewportRef} />
      </Provider>,
    );

    await screen.findByText("Ref toast");
    expect(rootRef.current).toBeInstanceOf(HTMLLIElement);
    expect(viewportRef.current).toBeInstanceOf(HTMLOListElement);
  });

  it("keeps neutral root surface and colors Body title + icon for danger", async () => {
    render(<ExampleToast defaultOpen color="danger" />);
    await screen.findByText("Deploy finished");
    expectHasClasses(screen.getByTestId("toast-root").className, [
      "bg-bg-surface",
      "border-border-default",
    ]);
    const title = screen.getByText("Deploy finished");
    expectHasClasses(title.className, ["text-danger-text"]);
    const iconWrap = screen.getByTestId("toast-icon-svg").parentElement;
    expect(iconWrap).toBeTruthy();
    expectHasClasses(iconWrap?.className, ["text-danger-text", "self-start"]);
  });

  it("omits close when close={false}", async () => {
    render(
      <Provider>
        <Root defaultOpen duration={Infinity}>
          <Body title="No close" close={false} />
        </Root>
        <Viewport />
      </Provider>,
    );
    await screen.findByText("No close");
    expect(
      screen.queryByRole("button", { name: "Dismiss" }),
    ).not.toBeInTheDocument();
  });
});
