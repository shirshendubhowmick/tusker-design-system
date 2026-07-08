import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App (JIT design-system consumer)", () => {
  it("renders design-system Button via package subpath", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: "Primary action" }),
    ).toBeInTheDocument();
  });

  it("surfaces token metadata from @design-system/ui/tokens", () => {
    render(<App />);
    expect(screen.getByText(/tablet ≥/i)).toBeInTheDocument();
    expect(screen.getByText(/desktop ≥/i)).toBeInTheDocument();
  });
});
