// @vitest-environment jsdom
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { FormField } from "./FormField";

describe("FormField", () => {
  it("associates label with the input", () => {
    render(<FormField label="Email" placeholder="you@acme.com" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "you@acme.com");
  });

  it("wires message via aria-describedby and shows message text", () => {
    render(
      <FormField
        label="Username"
        message="Available"
        color="success"
        defaultValue="ada"
      />,
    );
    const input = screen.getByLabelText("Username");
    const message = screen.getByText("Available");
    expect(message).toBeInTheDocument();
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
    expect(message.className).toContain("text-success-text");
  });

  it("uses role=alert for danger messages", () => {
    render(
      <FormField
        label="Password"
        message="Too short"
        color="danger"
        type="password"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref and supports icons / typing", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <FormField
        ref={ref}
        label="Search"
        startIcon={<MagnifyingGlassIcon data-testid="icon" />}
      />,
    );
    const input = screen.getByLabelText("Search");
    expect(ref.current).toBe(input);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    await user.type(input, "query");
    expect(input).toHaveValue("query");
  });

  it("omits message slot when message is not provided", () => {
    const { container } = render(<FormField label="Name" />);
    expect(container.querySelector('[data-slot="field-message"]')).toBeNull();
  });

  it("respects explicit id", () => {
    render(<FormField id="custom-id" label="Code" message="Hint" />);
    expect(screen.getByLabelText("Code")).toHaveAttribute("id", "custom-id");
    expect(screen.getByText("Hint")).toHaveAttribute("id", "custom-id-message");
  });
});
