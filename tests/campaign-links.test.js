import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildCampaignLink,
  buildCampaignUtm,
  CAMPAIGN_LINK_PRESETS,
  sanitizeUtmField,
} from "../apps/web/src/metrics/campaign-links.js";
import { WAITLIST_ROUTES } from "../apps/web/src/waitlist/concept-pages.js";

describe("campaign link builder", () => {
  it("defines presets for common promotion sources", () => {
    expect(CAMPAIGN_LINK_PRESETS.map((preset) => preset.id)).toEqual([
      "twitter",
      "instagram",
      "reddit",
      "newsletter",
    ]);
    expect(CAMPAIGN_LINK_PRESETS[3]).toMatchObject({
      utm_source: "newsletter",
      utm_medium: "email",
    });
  });

  it("builds relative paths without UTM params when fields are empty", () => {
    const url = buildCampaignLink({
      pagePath: WAITLIST_ROUTES.radar.path,
    });

    expect(url).toBe("/waitlist/product-opportunity-radar");
  });

  it("builds full URLs with origin and standard UTM params", () => {
    const url = buildCampaignLink({
      pagePath: WAITLIST_ROUTES.trade.path,
      origin: "https://snakeoil.example",
      utm: {
        utm_source: "twitter",
        utm_medium: "social",
        utm_campaign: "detailing-mvp",
      },
    });

    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://snakeoil.example");
    expect(parsed.pathname).toBe("/waitlist/trade-cost-calculator");
    expect(parsed.searchParams.get("utm_source")).toBe("twitter");
    expect(parsed.searchParams.get("utm_medium")).toBe("social");
    expect(parsed.searchParams.get("utm_campaign")).toBe("detailing-mvp");
  });

  it("supports optional term and content params", () => {
    const url = buildCampaignLink({
      pagePath: WAITLIST_ROUTES.groomer.path,
      utm: {
        utm_source: "reddit",
        utm_medium: "social",
        utm_campaign: "groomroute-launch",
        utm_term: "mobile-groomers",
        utm_content: "hero-cta",
      },
    });

    const params = new URL(`https://snakeoil.example${url}`).searchParams;
    expect(params.get("utm_term")).toBe("mobile-groomers");
    expect(params.get("utm_content")).toBe("hero-cta");
  });

  it("trims whitespace and omits empty UTM fields", () => {
    expect(sanitizeUtmField("  twitter  ")).toBe("twitter");
    expect(
      buildCampaignUtm({ utm_source: "  ig  ", utm_medium: "   " }),
    ).toEqual({ utm_source: "ig" });

    const url = buildCampaignLink({
      pagePath: "/research-feed",
      utm: {
        utm_source: " newsletter ",
        utm_medium: "email",
        utm_campaign: "",
      },
    });

    const params = new URL(`https://snakeoil.example${url}`).searchParams;
    expect(params.get("utm_source")).toBe("newsletter");
    expect(params.get("utm_medium")).toBe("email");
    expect(params.has("utm_campaign")).toBe(false);
  });

  it("preserves commas in campaign values via URL encoding", () => {
    const url = buildCampaignLink({
      pagePath: WAITLIST_ROUTES.groomer.path,
      utm: {
        utm_source: "instagram",
        utm_campaign: "launch,phase-1",
      },
    });

    const params = new URL(`https://snakeoil.example${url}`).searchParams;
    expect(params.get("utm_campaign")).toBe("launch,phase-1");
  });
});

describe("campaign links page markup", () => {
  it("includes the campaign links section container", () => {
    const html = readFileSync("apps/web/metrics/index.html", "utf8");

    expect(html).toContain('id="metrics-campaign-links-title"');
    expect(html).toContain('id="campaign-links-root"');
    expect(html).toContain("Campaign links");
  });
});
