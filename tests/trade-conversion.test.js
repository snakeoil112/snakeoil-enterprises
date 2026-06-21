import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WAITLIST_ROUTES } from "../apps/web/src/waitlist/concept-pages.js";
import {
  buildSharePageUrl,
  buildTwitterShareUrl,
} from "../apps/web/src/waitlist/share.js";

const TRADE_HTML = "apps/web/waitlist/trade-cost-calculator/index.html";

describe("TradeAI calculator conversion config", () => {
  const page = WAITLIST_ROUTES.trade;

  it("preserves trade-cost-calculator concept id and storage key", () => {
    expect(page.id).toBe("trade-cost-calculator");
    expect(page.path).toBe("/waitlist/trade-cost-calculator");
    expect(page.storageKey).toBe("snakeoil-waitlist-trade-calculator");
  });

  it("defines post-estimate CTA copy with urgency messaging", () => {
    expect(page.postEstimateCta).toMatchObject({
      eyebrow: expect.stringMatching(/estimate is ready/i),
      title: expect.stringMatching(/state price tables/i),
      body: expect.stringMatching(/TradeAI Australia/i),
      button: expect.stringMatching(/early access/i),
    });
  });

  it("defines TradeAI-branded share prompt text", () => {
    expect(page.sharePrompt.label).toMatch(/TradeAI Australia/i);
    expect(page.sharePrompt.text).toMatch(/TradeAI Australia/i);
  });

  it("builds share URLs that keep the trade calculator path", () => {
    const shareUrl = buildSharePageUrl(
      page.path,
      "twitter",
      "https://snakeoil.example",
    );
    const intent = new URL(
      buildTwitterShareUrl({
        pagePath: page.path,
        text: page.sharePrompt.text,
        origin: "https://snakeoil.example",
      }),
    );

    expect(new URL(shareUrl).pathname).toBe(page.path);
    expect(intent.searchParams.get("text")).toBe(page.sharePrompt.text);
    expect(new URL(intent.searchParams.get("url")).pathname).toBe(page.path);
  });
});

describe("TradeAI calculator conversion markup", () => {
  const html = readFileSync(TRADE_HTML, "utf8");

  it("includes post-estimate CTA bridge before the waitlist section", () => {
    const ctaIndex = html.indexOf('id="calculator-cta"');
    const waitlistIndex = html.indexOf('id="waitlist-section"');

    expect(ctaIndex).toBeGreaterThan(-1);
    expect(waitlistIndex).toBeGreaterThan(ctaIndex);
    expect(html).toContain("calculator-cta__title");
    expect(html).toContain('id="calculator-cta-total"');
    expect(html).toContain('href="#waitlist-section"');
  });

  it("reserves a post-signup share mount point", () => {
    expect(html).toContain('id="waitlist-share-root"');
  });

  it("loads the trade page module", () => {
    expect(html).toContain("/src/waitlist/trade-page.js");
  });
});
