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
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email");
  });

  it("provides control id via render props", () => {
    render(
      <Field label="Name" htmlFor="name-field">
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name-field");
  });

  it("wires description and message into aria-describedby", () => {
    render(
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
    const input = screen.getByLabelText("Username");
    const description = screen.getByText("Public handle");
    const message = screen.getByText("Looks good");
    expect(description).toHaveAttribute("data-slot", "field-description");
    expect(message).toHaveAttribute("data-slot", "field-message");
    expect(message.className).toContain("text-success-text");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toEqual(
      expect.arrayContaining([description.id, message.id]),
    );
  });

  it("uses role=alert and aria-invalid for danger messages", () => {
    render(
      <Field
        label="Password"
        htmlFor="pw"
        message="Too short"
        messageTone={FieldMessageTone.danger}
      >
        {(control) => <input {...control} type="password" />}
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("horizontal: control then label text (choice layout)", () => {
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
    const root = screen
      .getByText("Email me digests")
      .closest('[data-slot="field"]');
    expect(root).toHaveAttribute("data-orientation", "horizontal");
    expect(
      screen.getByRole("checkbox", { name: "Email me digests" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Weekly product news")).toBeInTheDocument();
    // Control + label share row 1 and center; description is row 2 under label.
    const row = root?.querySelector('[data-slot="field-row"]');
    expect(row?.className).toContain("grid");
    expect(row?.className).toContain("items-center");
  });

  it("horizontal label-only centers the control with the label", () => {
    render(
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
    const field = screen
      .getByText("I agree to the terms")
      .closest('[data-slot="field"]');
    expect(field).toBeTruthy();
    const row = field?.querySelector('[data-slot="field-row"]');
    expect(row?.className).toContain("items-center");
    // Message is below the row, not a sibling that skews alignment.
    const message = field?.querySelector('[data-slot="field-message"]');
    expect(message).toBeTruthy();
    expect(row && message ? row.contains(message) : true).toBe(false);
  });

  it("shows required marker and aria-required on the control", () => {
    render(
      <Field label="Team" htmlFor="team" required>
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(
      screen
        .getByText("Team")
        .parentElement?.querySelector('[data-slot="label-required"]'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Team/)).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("omits message and description slots when empty", () => {
    const { container } = render(
      <Field label="Only label" htmlFor="only">
        {(control) => <input {...control} />}
      </Field>,
    );
    expect(container.querySelector('[data-slot="field-message"]')).toBeNull();
    expect(
      container.querySelector('[data-slot="field-description"]'),
    ).toBeNull();
  });

  it("supports plain children when the control sets its own id", () => {
    render(
      <Field label="Code" htmlFor="code">
        <input id="code" />
      </Field>,
    );
    expect(screen.getByLabelText("Code")).toHaveAttribute("id", "code");
  });
});
