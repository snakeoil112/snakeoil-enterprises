import { describe, expect, it } from "vitest";
import {
  calculateTradeQuote,
  formatCurrency,
  getJobScopeById,
  getTradeAddonsByIds,
  getTradeById,
} from "../apps/web/src/trade-calculator.js";

describe("AU trade cost calculator", () => {
  it("applies hourly rates and call-out fees by trade and scope", () => {
    const electricianCallout = calculateTradeQuote({
      tradeId: "electrician",
      scopeId: "callout",
      addonIds: [],
    });
    const plumberFullDay = calculateTradeQuote({
      tradeId: "plumber",
      scopeId: "full-day",
      addonIds: [],
    });

    expect(electricianCallout.laborTotal).toBe(285);
    expect(plumberFullDay.laborTotal).toBe(840);
    expect(plumberFullDay.total).toBeGreaterThan(electricianCallout.total);
  });

  it("adds flat and percentage-based add-ons to the total", () => {
    const withFlatAddons = calculateTradeQuote({
      tradeId: "electrician",
      scopeId: "half-day",
      addonIds: ["materials", "travel"],
    });
    const withAfterHours = calculateTradeQuote({
      tradeId: "electrician",
      scopeId: "callout",
      addonIds: ["after-hours"],
    });

    expect(withFlatAddons.addons).toHaveLength(2);
    expect(withFlatAddons.addonsTotal).toBe(285);
    expect(withFlatAddons.total).toBe(725);
    expect(withAfterHours.addonsTotal).toBe(71);
    expect(withAfterHours.total).toBe(356);
  });

  it("resolves lookup helpers with safe fallbacks", () => {
    expect(getTradeById("missing").id).toBe("electrician");
    expect(getJobScopeById("missing").id).toBe("callout");
    expect(getTradeAddonsByIds(["materials", "missing"])).toHaveLength(1);
  });

  it("formats currency in AUD for quote display", () => {
    expect(formatCurrency(725)).toBe("$725");
  });

  it("returns a readable quote summary", () => {
    const quote = calculateTradeQuote({
      tradeId: "carpenter",
      scopeId: "full-day",
      addonIds: ["materials"],
    });

    expect(quote.summary).toContain("full-day job");
    expect(quote.summary).toContain("carpenter");
    expect(quote.total).toBe(880);
  });
});
