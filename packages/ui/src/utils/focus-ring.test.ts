import {
  FocusRingIntent,
  focusRing,
  focusRingClass,
  focusRingShadowClass,
} from "./focus-ring";

describe("focusRing", () => {
  it("defaults to self focus-visible + brand shadow-focus + outline-none", () => {
    expect(focusRing()).toBe(
      "focus-visible:outline-none focus-visible:shadow-focus",
    );
    expect(focusRingClass.self.default).toBe(focusRing());
  });

  it("supports within mode without outline-none by default", () => {
    expect(focusRing({ within: true })).toBe("focus-within:shadow-focus");
    expect(focusRingClass.within.default).toBe(focusRing({ within: true }));
  });

  it("tints status intents with the solid color (same 3px geometry)", () => {
    for (const intent of [
      FocusRingIntent.success,
      FocusRingIntent.danger,
      FocusRingIntent.warning,
    ] as const) {
      const self = focusRing({ intent });
      const within = focusRing({ intent, within: true });

      expect(self).toContain("focus-visible:outline-none");
      expect(self).toContain(`focus-visible:${focusRingShadowClass[intent]}`);
      expect(within).toBe(`focus-within:${focusRingShadowClass[intent]}`);
      expect(within).not.toContain("outline-none");
      expect(within).not.toContain("shadow-focus");
    }
  });

  it("allows overriding outlineNone", () => {
    expect(focusRing({ outlineNone: false })).toBe(
      "focus-visible:shadow-focus",
    );
    expect(focusRing({ within: true, outlineNone: true })).toBe(
      "focus-within:outline-none focus-within:shadow-focus",
    );
  });

  it("exposes complete CVA maps for self and within", () => {
    for (const intent of Object.values(FocusRingIntent)) {
      expect(focusRingClass.self[intent]).toBe(focusRing({ intent }));
      expect(focusRingClass.within[intent]).toBe(
        focusRing({ intent, within: true }),
      );
    }
  });
});
