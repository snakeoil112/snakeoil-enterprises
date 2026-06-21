import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RESEARCH_FEED_STORAGE_KEY } from "../apps/web/src/subscriber-access.js";
import { WAITLIST_ROUTES } from "../apps/web/src/waitlist/concept-pages.js";
import {
  aggregateConceptMetrics,
  aggregateWaitlistMetrics,
  countByUtmSource,
  escapeCsvCell,
  formatMetricsCsv,
  formatMetricsJson,
  METRICS_SOURCES,
  SIGNUP_TARGET,
  sortUtmBreakdown,
} from "../apps/web/src/waitlist/metrics.js";
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

describe("waitlist metrics aggregation", () => {
  it("tracks all concept waitlists and the research feed", () => {
    expect(METRICS_SOURCES).toHaveLength(4);
    expect(METRICS_SOURCES.map((source) => source.conceptId)).toEqual([
      WAITLIST_ROUTES.radar.id,
      WAITLIST_ROUTES.trade.id,
      WAITLIST_ROUTES.groomer.id,
      "research-feed",
    ]);
  });

  it("aggregates signup counts and UTM breakdown per concept", () => {
    const storageApi = createStorageApi();

    saveWaitlistSignup(
      WAITLIST_ROUTES.radar.storageKey,
      buildWaitlistEntry({
        email: "alpha@example.com",
        conceptId: WAITLIST_ROUTES.radar.id,
        pagePath: WAITLIST_ROUTES.radar.path,
        utm: { utm_source: "twitter" },
        joinedAt: "2026-06-21T10:00:00.000Z",
      }),
      storageApi,
    );
    saveWaitlistSignup(
      WAITLIST_ROUTES.radar.storageKey,
      buildWaitlistEntry({
        email: "beta@example.com",
        conceptId: WAITLIST_ROUTES.radar.id,
        pagePath: WAITLIST_ROUTES.radar.path,
        utm: { utm_source: "twitter" },
        joinedAt: "2026-06-21T11:00:00.000Z",
      }),
      storageApi,
    );
    saveWaitlistSignup(
      WAITLIST_ROUTES.trade.storageKey,
      buildWaitlistEntry({
        email: "trade@example.com",
        conceptId: WAITLIST_ROUTES.trade.id,
        pagePath: WAITLIST_ROUTES.trade.path,
        joinedAt: "2026-06-21T12:00:00.000Z",
      }),
      storageApi,
    );
    saveWaitlistSignup(
      RESEARCH_FEED_STORAGE_KEY,
      buildWaitlistEntry({
        email: "feed@example.com",
        conceptId: "research-feed",
        pagePath: "/research-feed",
        utm: { utm_source: "home" },
        joinedAt: "2026-06-21T13:00:00.000Z",
      }),
      storageApi,
    );

    const metrics = aggregateWaitlistMetrics(storageApi);

    expect(metrics.target).toBe(SIGNUP_TARGET);
    expect(metrics.totalSignups).toBe(4);
    expect(metrics.waitlistSignups).toBe(3);
    expect(metrics.researchFeedUnlocks).toBe(1);
    expect(metrics.progressPercent).toBe(8);

    const radar = metrics.concepts.find(
      (concept) => concept.conceptId === WAITLIST_ROUTES.radar.id,
    );
    expect(radar?.signupCount).toBe(2);
    expect(radar?.utmBreakdown).toEqual({ twitter: 2 });

    const trade = metrics.concepts.find(
      (concept) => concept.conceptId === WAITLIST_ROUTES.trade.id,
    );
    expect(trade?.utmBreakdown).toEqual({ "(direct)": 1 });
  });

  it("counts direct traffic when utm_source is missing", () => {
    const breakdown = countByUtmSource([
      buildWaitlistEntry({
        email: "one@example.com",
        conceptId: "a",
        pagePath: "/a",
      }),
      buildWaitlistEntry({
        email: "two@example.com",
        conceptId: "a",
        pagePath: "/a",
        utm: { utm_source: "newsletter" },
      }),
    ]);

    expect(breakdown).toEqual({
      "(direct)": 1,
      newsletter: 1,
    });
    expect(sortUtmBreakdown(breakdown)).toEqual([
      { source: "(direct)", count: 1 },
      { source: "newsletter", count: 1 },
    ]);
  });

  it("aggregates a single source with aggregateConceptMetrics", () => {
    const storageApi = createStorageApi();
    const source = METRICS_SOURCES[0];

    saveWaitlistSignup(
      source.storageKey,
      buildWaitlistEntry({
        email: "solo@example.com",
        conceptId: source.conceptId,
        pagePath: source.pagePath,
        utm: { utm_source: "ig" },
      }),
      storageApi,
    );

    const concept = aggregateConceptMetrics(source, storageApi);

    expect(concept.signupCount).toBe(1);
    expect(concept.utmBreakdown.ig).toBe(1);
  });
});

describe("waitlist metrics export formatting", () => {
  it("serializes metrics as indented JSON", () => {
    const metrics = aggregateWaitlistMetrics(createStorageApi());
    const json = formatMetricsJson(metrics);

    expect(json).toContain('"target": 50');
    expect(json.endsWith("\n")).toBe(true);
    expect(JSON.parse(json)).toMatchObject({
      totalSignups: 0,
      concepts: expect.any(Array),
    });
  });

  it("formats CSV rows with headers and escaped values", () => {
    const storageApi = createStorageApi();

    saveWaitlistSignup(
      WAITLIST_ROUTES.groomer.storageKey,
      buildWaitlistEntry({
        email: "groomer@example.com",
        conceptId: WAITLIST_ROUTES.groomer.id,
        pagePath: WAITLIST_ROUTES.groomer.path,
        utm: {
          utm_source: "instagram",
          utm_campaign: "launch,phase-1",
        },
        joinedAt: "2026-06-21T14:00:00.000Z",
      }),
      storageApi,
    );

    const csv = formatMetricsCsv(aggregateWaitlistMetrics(storageApi));
    const lines = csv.trim().split("\n");

    expect(lines[0]).toBe(
      "conceptId,conceptTitle,kind,email,joinedAt,pagePath,utm_source,utm_medium,utm_campaign,utm_term,utm_content",
    );
    expect(lines[1]).toContain("pet-groomer-crm");
    expect(lines[1]).toContain('"launch,phase-1"');
    expect(escapeCsvCell('value with "quotes"')).toBe(
      '"value with ""quotes"""',
    );
  });
});

describe("metrics page markup", () => {
  it("includes dashboard sections and export controls", () => {
    const html = readFileSync("apps/web/metrics/index.html", "utf8");

    expect(html).toContain('id="metrics-summary"');
    expect(html).toContain('id="metrics-concepts"');
    expect(html).toContain('id="export-json"');
    expect(html).toContain('id="export-csv"');
    expect(html).toContain('id="campaign-links-root"');
  });
});
