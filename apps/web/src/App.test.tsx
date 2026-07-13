import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";

describe("App (Northstar dummy console)", () => {
  it("renders the app shell and projects view", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Northstar").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /New project/i }),
    ).toBeInTheDocument();
  });

  it("lists dummy projects from design-system components", () => {
    render(<App />);
    expect(screen.getByText("edge-api")).toBeInTheDocument();
    expect(screen.getByText("console-web")).toBeInTheDocument();
  });

  it("navigates to Deployments view", async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = within(screen.getByRole("navigation", { name: "Main" }));
    await user.click(nav.getByRole("button", { name: "Deployments" }));
    expect(
      screen.getByRole("heading", { name: "Deployments" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
  });

  it("navigates to Settings view", async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = within(screen.getByRole("navigation", { name: "Main" }));
    await user.click(nav.getByRole("button", { name: "Settings" }));
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Workspace display name/i),
    ).toBeInTheDocument();
  });
});
