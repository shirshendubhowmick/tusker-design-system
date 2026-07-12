// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";

import { Field, FieldMessageTone, FieldOrientation } from "./Field";

describe("Field", () => {
  it("vertical: associates label with the control", () => {
    render(
      <Field label="Email" htmlFor="email">
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "id",
      "email",
    );
  });

  it("provides control id via render props", () => {
    render(
      <Field label="Name" htmlFor="name-field">
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "id",
      "name-field",
    );
  });

  it("wires description and message into aria-describedby", async () => {
    const { container } = render(
      <Field
        label="Username"
        htmlFor="user"
        description="Public handle"
        message="Looks good"
        messageTone={FieldMessageTone.success}
      >
        {(control) => <input {...control} />}
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Username" });
    const description = screen.getByText("Public handle");
    const message = screen.getByText("Looks good");
    expect(message.className).toContain("text-success-text");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(/\s+/)).toEqual(
      expect.arrayContaining([description.id, message.id]),
    );
    await expectNoA11yViolations(container);
  });

  it("uses role=alert and aria-invalid for danger messages", async () => {
    const { container } = render(
      <Field
        label="Password"
        htmlFor="pw"
        message="Too short"
        messageTone={FieldMessageTone.danger}
      >
        {(control) => (
          <input {...control} type="password" autoComplete="current-password" />
        )}
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expectNoA11yViolations(container);
  });

  it("horizontal: associates choice control with label and description", () => {
    render(
      <Field
        orientation={FieldOrientation.horizontal}
        label="Email me digests"
        htmlFor="mkt"
        description="Weekly product news"
      >
        {(control) => <input {...control} type="checkbox" />}
      </Field>,
    );
    expect(
      screen.getByRole("checkbox", { name: "Email me digests" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Weekly product news")).toBeInTheDocument();
  });

  it("horizontal: shows danger message as alert under the control", async () => {
    const { container } = render(
      <Field
        orientation={FieldOrientation.horizontal}
        label="I agree to the terms"
        htmlFor="terms"
        message="You must accept to continue."
        messageTone={FieldMessageTone.danger}
        required
      >
        {(control) => <input {...control} type="checkbox" />}
      </Field>,
    );
    expect(
      screen.getByRole("checkbox", { name: /I agree to the terms/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You must accept to continue.",
    );
    await expectNoA11yViolations(container);
  });

  it("shows required marker and aria-required on the control", () => {
    render(
      <Field label="Team" htmlFor="team" required>
        {(control) => <input {...control} />}
      </Field>,
    );
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: /Team/ })).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("omits message and description when not provided", () => {
    render(
      <Field label="Only label" htmlFor="only">
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(
      screen.getByRole("textbox", { name: "Only label" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("supports plain children when the control sets its own id", () => {
    render(
      <Field label="Code" htmlFor="code">
        <input id="code" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Code" })).toHaveAttribute(
      "id",
      "code",
    );
  });
});
