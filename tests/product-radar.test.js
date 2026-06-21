import { describe, expect, it } from "vitest";
import {
  buildRadarSummary,
  formatOpportunityScore,
  getCategoryById,
  getCompetitionLabel,
  PRODUCT_CATEGORIES,
} from "../apps/web/src/product-radar.js";

describe("product radar", () => {
  it("formats opportunity scores as percentages", () => {
    expect(formatOpportunityScore(87.4)).toBe("87%");
  });

  it("maps competition levels to readable labels", () => {
    expect(getCompetitionLabel("low")).toBe("Low competition");
    expect(getCompetitionLabel("medium")).toBe("Moderate competition");
  });

  it("resolves categories by id with a safe fallback", () => {
    expect(getCategoryById(PRODUCT_CATEGORIES, "web").label).toBe("Websites");
    expect(getCategoryById(PRODUCT_CATEGORIES, "missing").id).toBe("mobile");
  });

  it("builds a radar summary for the active category", () => {
    const summary = buildRadarSummary(PRODUCT_CATEGORIES[2]);

    expect(summary.headline).toBe("Software opportunity");
    expect(summary.score).toBe("91%");
    expect(summary.competition).toBe("Low competition");
    expect(summary.insight).toContain("Workflow automation");
  });
});
