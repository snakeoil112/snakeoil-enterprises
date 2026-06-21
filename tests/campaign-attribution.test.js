import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RESEARCH_FEED_STORAGE_KEY } from "../apps/web/src/subscriber-access.js";
import {
  aggregateCampaignAttribution,
  CAMPAIGN_WINDOW_PRESETS,
  collectCampaignSignups,
  countByUtmSourceAndCampaign,
  DEFAULT_CAMPAIGN_WINDOW_HOURS,
  getCampaignWindowBounds,
  isTrackedCampaignSignup,
  isWithinCampaignWindow,
  TRADEAI_AU_CAMPAIGN_T0,
  TRADEAI_AU_CAMPAIGN_UTMS,
} from "../apps/web/src/waitlist/campaign-attribution.js";
import { WAITLIST_ROUTES } from "../apps/web/src/waitlist/concept-pages.js";
import { aggregateWaitlistMetrics } from "../apps/web/src/waitlist/metrics.js";
import {
  buildWaitlistEntry,
  saveWaitlistSignup,
} from "../apps/web/src/waitlist/storage.js";

function createStorageApi() {
  const storage = new Map();

  return {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
}

function saveTradeAiSignup(storageApi, { email, campaign, source, joinedAt }) {
  saveWaitlistSignup(
    WAITLIST_ROUTES.trade.storageKey,
    buildWaitlistEntry({
      email,
      conceptId: WAITLIST_ROUTES.trade.id,
      pagePath: WAITLIST_ROUTES.trade.path,
      utm: {
        utm_source: source,
        utm_campaign: campaign,
      },
      joinedAt,
    }),
    storageApi,
  );
}

describe("campaign attribution helpers", () => {
  it("tracks the TradeAI Australia campaign constants", () => {
    expect(TRADEAI_AU_CAMPAIGN_T0).toBe("2026-06-21T13:32:47.000Z");
    expect(TRADEAI_AU_CAMPAIGN_UTMS).toEqual([
      "tradeai-au-launch",
      "tradeai-au-b2b",
      "tradeai-au-reddit",
    ]);
    expect(DEFAULT_CAMPAIGN_WINDOW_HOURS).toBe(48);
    expect(CAMPAIGN_WINDOW_PRESETS.map((preset) => preset.hours)).toEqual([
      24, 48, 72, 168,
    ]);
  });

  it("filters signups to tracked campaign UTMs only", () => {
    const signup = buildWaitlistEntry({
      email: "tracked@example.com",
      conceptId: WAITLIST_ROUTES.trade.id,
      pagePath: WAITLIST_ROUTES.trade.path,
      utm: { utm_campaign: "tradeai-au-launch" },
    });

    expect(isTrackedCampaignSignup(signup)).toBe(true);
    expect(
      isTrackedCampaignSignup({
        ...signup,
        utm: { utm_campaign: "detailing-mvp" },
      }),
    ).toBe(false);
  });

  it("applies T0-relative window bounds", () => {
    const bounds = getCampaignWindowBounds({
      t0: TRADEAI_AU_CAMPAIGN_T0,
      windowHours: 48,
    });

    expect(bounds.startMs).toBe(Date.parse(TRADEAI_AU_CAMPAIGN_T0));
    expect(bounds.endMs).toBe(bounds.startMs + 48 * 60 * 60 * 1000);

    const inside = buildWaitlistEntry({
      email: "inside@example.com",
      conceptId: WAITLIST_ROUTES.trade.id,
      pagePath: WAITLIST_ROUTES.trade.path,
      joinedAt: "2026-06-22T10:00:00.000Z",
    });
    const outside = buildWaitlistEntry({
      email: "outside@example.com",
      conceptId: WAITLIST_ROUTES.trade.id,
      pagePath: WAITLIST_ROUTES.trade.path,
      joinedAt: "2026-06-23T14:00:00.000Z",
    });

    expect(isWithinCampaignWindow(inside)).toBe(true);
    expect(isWithinCampaignWindow(outside)).toBe(false);
    const afterTwentyFourHours = buildWaitlistEntry({
      email: "late@example.com",
      conceptId: WAITLIST_ROUTES.trade.id,
      pagePath: WAITLIST_ROUTES.trade.path,
      joinedAt: "2026-06-22T14:00:00.000Z",
    });

    expect(
      isWithinCampaignWindow(afterTwentyFourHours, { windowHours: 24 }),
    ).toBe(false);
  });

  it("breaks down signups by utm_source and utm_campaign", () => {
    const breakdown = countByUtmSourceAndCampaign([
      buildWaitlistEntry({
        email: "a@example.com",
        conceptId: WAITLIST_ROUTES.trade.id,
        pagePath: WAITLIST_ROUTES.trade.path,
        utm: {
          utm_source: "twitter",
          utm_campaign: "tradeai-au-launch",
        },
      }),
      buildWaitlistEntry({
        email: "b@example.com",
        conceptId: WAITLIST_ROUTES.trade.id,
        pagePath: WAITLIST_ROUTES.trade.path,
        utm: {
          utm_source: "twitter",
          utm_campaign: "tradeai-au-launch",
        },
      }),
      buildWaitlistEntry({
        email: "c@example.com",
        conceptId: WAITLIST_ROUTES.trade.id,
        pagePath: WAITLIST_ROUTES.trade.path,
        utm: {
          utm_campaign: "tradeai-au-reddit",
        },
      }),
    ]);

    expect(breakdown).toEqual([
      { source: "twitter", campaign: "tradeai-au-launch", count: 2 },
      { source: "(direct)", campaign: "tradeai-au-reddit", count: 1 },
    ]);
  });
});

describe("campaign attribution aggregation", () => {
  it("aggregates window signups against all-time baseline", () => {
    const storageApi = createStorageApi();

    saveTradeAiSignup(storageApi, {
      email: "launch-window@example.com",
      campaign: "tradeai-au-launch",
      source: "twitter",
      joinedAt: "2026-06-21T15:00:00.000Z",
    });
    saveTradeAiSignup(storageApi, {
      email: "b2b-window@example.com",
      campaign: "tradeai-au-b2b",
      source: "linkedin",
      joinedAt: "2026-06-22T08:00:00.000Z",
    });
    saveTradeAiSignup(storageApi, {
      email: "reddit-after-window@example.com",
      campaign: "tradeai-au-reddit",
      source: "reddit",
      joinedAt: "2026-06-23T15:00:00.000Z",
    });
    saveWaitlistSignup(
      WAITLIST_ROUTES.trade.storageKey,
      buildWaitlistEntry({
        email: "ignored@example.com",
        conceptId: WAITLIST_ROUTES.trade.id,
        pagePath: WAITLIST_ROUTES.trade.path,
        utm: { utm_campaign: "detailing-mvp", utm_source: "instagram" },
        joinedAt: "2026-06-21T16:00:00.000Z",
      }),
      storageApi,
    );
    saveWaitlistSignup(
      RESEARCH_FEED_STORAGE_KEY,
      buildWaitlistEntry({
        email: "feed@example.com",
        conceptId: "research-feed",
        pagePath: "/research-feed",
        utm: {
          utm_campaign: "tradeai-au-launch",
          utm_source: "newsletter",
        },
        joinedAt: "2026-06-21T18:00:00.000Z",
      }),
      storageApi,
    );

    const metrics = aggregateWaitlistMetrics(storageApi);
    const attribution = aggregateCampaignAttribution(metrics);

    expect(attribution.windowSignupCount).toBe(3);
    expect(attribution.allTimeSignupCount).toBe(4);
    expect(attribution.breakdown).toEqual([
      { source: "linkedin", campaign: "tradeai-au-b2b", count: 1 },
      { source: "newsletter", campaign: "tradeai-au-launch", count: 1 },
      { source: "twitter", campaign: "tradeai-au-launch", count: 1 },
    ]);
    expect(attribution.allTimeBreakdown).toEqual([
      { source: "linkedin", campaign: "tradeai-au-b2b", count: 1 },
      { source: "newsletter", campaign: "tradeai-au-launch", count: 1 },
      { source: "reddit", campaign: "tradeai-au-reddit", count: 1 },
      { source: "twitter", campaign: "tradeai-au-launch", count: 1 },
    ]);
    expect(collectCampaignSignups(metrics)).toHaveLength(4);
  });

  it("respects configurable window hours", () => {
    const storageApi = createStorageApi();

    saveTradeAiSignup(storageApi, {
      email: "recent@example.com",
      campaign: "tradeai-au-launch",
      source: "twitter",
      joinedAt: "2026-06-21T20:00:00.000Z",
    });
    saveTradeAiSignup(storageApi, {
      email: "older@example.com",
      campaign: "tradeai-au-b2b",
      source: "linkedin",
      joinedAt: "2026-06-22T20:00:00.000Z",
    });

    const metrics = aggregateWaitlistMetrics(storageApi);
    const twentyFourHour = aggregateCampaignAttribution(metrics, {
      windowHours: 24,
    });
    const seventyTwoHour = aggregateCampaignAttribution(metrics, {
      windowHours: 72,
    });

    expect(twentyFourHour.windowSignupCount).toBe(1);
    expect(seventyTwoHour.windowSignupCount).toBe(2);
  });
});

describe("campaign attribution page markup", () => {
  it("includes the campaign attribution section container", () => {
    const html = readFileSync("apps/web/metrics/index.html", "utf8");

    expect(html).toContain('id="metrics-campaign-attribution-title"');
    expect(html).toContain('id="campaign-attribution-root"');
    expect(html).toContain("Campaign attribution");
  });
});
