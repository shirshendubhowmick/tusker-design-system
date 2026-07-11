import {
  WCAG_AA_BODY,
  WCAG_AA_LARGE,
  contrastRatio,
  minRatioForPair,
  modesForPair,
  relativeLuminance,
  resolveSemanticRefToHex,
  resolveSemanticTokenToHex,
  semanticContrastPairs,
} from "./contrast";
import { getSemanticRef, semanticColorTokens } from "./semantic";

describe("WCAG contrast math", () => {
  it("matches known black/white ratio", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 5);
  });

  it("treats identical colors as 1:1", () => {
    expect(contrastRatio("#808080", "#808080")).toBeCloseTo(1, 5);
  });

  it("computes relative luminance in range for sRGB", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("resolveSemanticTokenToHex", () => {
  it("resolves fixed white / dark ink", () => {
    expect(resolveSemanticTokenToHex("fg-on-accent", "light")).toBe("#ffffff");
    expect(resolveSemanticTokenToHex("fg-on-warning", "light")).toBe("#1c2024");
  });

  it("resolves custom brand solid from blue.css (not npm blue)", () => {
    // Seeded navy — must stay the brand solid used by CTAs.
    expect(resolveSemanticTokenToHex("accent-solid", "light")).toBe("#0d5bd8");
  });

  it("resolves every catalog token to #rrggbb in both modes (skip overlays)", () => {
    for (const token of semanticColorTokens) {
      if (token.group === "overlay") continue;
      for (const mode of ["light", "dark"] as const) {
        const hex = resolveSemanticTokenToHex(token.name, mode);
        expect(hex, `${token.name}/${mode}`).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("matches getSemanticRef → resolveSemanticRefToHex", () => {
    const token = semanticColorTokens.find((t) => t.name === "bg-canvas");
    expect(token).toBeDefined();
    if (!token) return;
    for (const mode of ["light", "dark"] as const) {
      const viaName = resolveSemanticTokenToHex("bg-canvas", mode);
      const viaRef = resolveSemanticRefToHex(getSemanticRef(token, mode), mode);
      expect(viaName).toBe(viaRef);
    }
  });
});

describe("semantic contrast pairs (ADR-003 Layer 3)", () => {
  it("has unique pair ids", () => {
    const ids = semanticContrastPairs.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("floor pairs declare minRatio; body/large-ui use WCAG defaults", () => {
    for (const p of semanticContrastPairs) {
      if (p.role === "floor") {
        expect(p.minRatio, p.id).toBeTypeOf("number");
        expect(p.minRatio, p.id).toBeGreaterThan(0);
      } else if (p.role === "body") {
        expect(minRatioForPair(p)).toBe(p.minRatio ?? WCAG_AA_BODY);
      } else if (p.role === "large-ui") {
        expect(minRatioForPair(p)).toBe(p.minRatio ?? WCAG_AA_LARGE);
      }
    }
  });

  it.each(
    semanticContrastPairs.flatMap((pair) =>
      modesForPair(pair).map((mode) => ({
        pair,
        mode,
        title: `${pair.id} [${mode}] ≥ ${minRatioForPair(pair).toFixed(1)} (${pair.role})`,
      })),
    ),
  )("$title", ({ pair, mode }) => {
    const fg = resolveSemanticTokenToHex(pair.fg, mode);
    const bg = resolveSemanticTokenToHex(pair.bg, mode);
    const ratio = contrastRatio(fg, bg);
    const min = minRatioForPair(pair);

    expect(
      ratio,
      [
        `${pair.id} ${mode}: ${fg} on ${bg}`,
        `ratio ${ratio.toFixed(3)} < min ${min}`,
        pair.note ?? "",
      ]
        .filter(Boolean)
        .join(" — "),
    ).toBeGreaterThanOrEqual(min);
  });
});
