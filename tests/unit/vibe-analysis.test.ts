import { describe, expect, it } from "vitest";
import { analyzeConcept } from "@/backend/ideas/vibe-analysis";

describe("analyzeConcept potential tiers", () => {
  it("classifies a short plain idea as low potential", () => {
    const concept = "Marketplace for socks";

    const result = analyzeConcept(concept);

    expect(result.wordCount).toBe(3);
    expect(result.vibeScore).toBe(1);
    expect(result.potentialTier).toBe("Low Potential");
  });

  it("classifies a moderately detailed pitch with some hype words as medium potential", () => {
    const concept = buildPitch(38, ["money", "popular"]);

    const result = analyzeConcept(concept);

    expect(result.wordCount).toBe(40);
    expect(result.vibeScore).toBe(4);
    expect(result.potentialTier).toBe("Medium Potential");
  });

  it("classifies a long pitch with multiple hype words as high potential", () => {
    const concept = buildPitch(100, [
      "money",
      "popular",
      "best",
      "we will be rich",
      "viral"
    ]);

    const result = analyzeConcept(concept);

    expect(result.wordCount).toBe(108);
    expect(result.vibeScore).toBe(10);
    expect(result.potentialTier).toBe("High Potential");
  });
});

function buildPitch(baseWordCount: number, keywords: string[]) {
  const baseWords = Array.from({ length: baseWordCount }, (_, index) => `idea${index + 1}`);
  return [...baseWords, ...keywords].join(" ");
}
