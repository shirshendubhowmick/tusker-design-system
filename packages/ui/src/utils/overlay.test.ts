import { zIndexClass } from "../tokens/z-index";
import { overlay, overlayClass } from "./overlay";

describe("overlay", () => {
  it("defaults to fixed full-viewport scrim at z-overlay", () => {
    expect(overlay()).toBe(
      `fixed inset-0 ${zIndexClass("overlay")} bg-overlay-scrim`,
    );
    expect(overlayClass.scrim).toBe(overlay());
  });

  it("supports transparent catch layer", () => {
    expect(overlay({ scrim: false })).toBe(
      `fixed inset-0 ${zIndexClass("overlay")}`,
    );
    expect(overlayClass.catch).toBe(overlay({ scrim: false }));
    expect(overlayClass.catch).not.toContain("bg-overlay-scrim");
  });

  it("allows z-index and fixed overrides", () => {
    expect(overlay({ z: "modal" })).toContain(zIndexClass("modal"));
    expect(overlay({ fixed: false, scrim: true })).toBe(
      "z-overlay bg-overlay-scrim",
    );
  });

  it("merges className", () => {
    expect(overlay({ className: "animate-in fade-in" })).toContain(
      "animate-in",
    );
  });
});
