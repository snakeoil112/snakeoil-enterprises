import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CONCEPT_PAGES,
  getConceptPageById,
  getConceptPageBySlug,
  WAITLIST_ROUTES,
} from "../apps/web/src/waitlist/concept-pages.js";
import {
  buildWaitlistEntry,
  captureWaitlistSignup,
  readWaitlistSignups,
  saveWaitlistSignup,
} from "../apps/web/src/waitlist/storage.js";
import {
  hasUtmParams,
  parseUtmFromSearch,
  parseUtmFromUrl,
} from "../apps/web/src/waitlist/utm.js";

describe("concept waitlist pages", () => {
  it("defines three UTM-friendly routes", () => {
    expect(CONCEPT_PAGES).toHaveLength(3);
    expect(CONCEPT_PAGES.map((page) => page.path)).toEqual([
      "/waitlist/product-opportunity-radar",
      "/waitlist/trade-cost-calculator",
      "/waitlist/pet-groomer-crm",
    ]);
  });

  it("includes hero copy and value props for each concept", () => {
    for (const page of CONCEPT_PAGES) {
      expect(page.headline.length).toBeGreaterThan(10);
      expect(page.valueProps).toHaveLength(3);
      expect(page.storageKey).toMatch(/^snakeoil-waitlist-/);
    }
  });

  it("resolves pages by slug and id with safe fallbacks", () => {
    expect(getConceptPageBySlug("pet-groomer-crm").title).toBe(
      "GroomRoute CRM",
    );
    expect(getConceptPageById("trade-cost-calculator").slug).toBe(
      "trade-cost-calculator",
    );
    expect(getConceptPageBySlug("missing").id).toBe(
      "product-opportunity-radar",
    );
  });
});

describe("waitlist storage", () => {
  it("builds normalized waitlist entries", () => {
    const entry = buildWaitlistEntry({
      email: "Founder@Example.com",
      conceptId: WAITLIST_ROUTES.radar.id,
      pagePath: WAITLIST_ROUTES.radar.path,
      utm: { utm_source: "twitter" },
      joinedAt: "2026-06-21T12:00:00.000Z",
    });

    expect(entry.email).toBe("founder@example.com");
    expect(entry.utm.utm_source).toBe("twitter");
  });

  it("persists signups in localStorage and deduplicates emails", () => {
    const storage = new Map();
    const storageApi = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    };

    const first = captureWaitlistSignup({
      storageKey: "test-waitlist",
      conceptId: "radar",
      pagePath: "/waitlist/product-opportunity-radar",
      email: "alpha@example.com",
      url: "/waitlist/product-opportunity-radar?utm_source=newsletter",
      storage: storageApi,
      joinedAt: "2026-06-21T12:00:00.000Z",
    });

    const duplicate = captureWaitlistSignup({
      storageKey: "test-waitlist",
      conceptId: "radar",
      pagePath: "/waitlist/product-opportunity-radar",
      email: "alpha@example.com",
      url: "/waitlist/product-opportunity-radar",
      storage: storageApi,
      joinedAt: "2026-06-21T12:05:00.000Z",
    });

    expect(first.saved).toBe(true);
    expect(duplicate.duplicate).toBe(true);
    expect(readWaitlistSignups("test-waitlist", storageApi)).toHaveLength(1);
    expect(
      readWaitlistSignups("test-waitlist", storageApi)[0].utm.utm_source,
    ).toBe("newsletter");
  });

  it("saves multiple unique signups", () => {
    const storage = new Map();
    const storageApi = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    };

    saveWaitlistSignup(
      "test-waitlist",
      buildWaitlistEntry({
        email: "one@example.com",
        conceptId: "a",
        pagePath: "/a",
      }),
      storageApi,
    );
    saveWaitlistSignup(
      "test-waitlist",
      buildWaitlistEntry({
        email: "two@example.com",
        conceptId: "b",
        pagePath: "/b",
      }),
      storageApi,
    );

    expect(readWaitlistSignups("test-waitlist", storageApi)).toHaveLength(2);
  });
});

describe("utm parsing", () => {
  it("extracts standard utm params from search strings", () => {
    const utm = parseUtmFromSearch(
      "?utm_source=ig&utm_medium=social&utm_campaign=launch",
    );

    expect(utm).toEqual({
      utm_source: "ig",
      utm_medium: "social",
      utm_campaign: "launch",
    });
    expect(hasUtmParams(utm)).toBe(true);
  });

  it("parses utm params from full urls", () => {
    const utm = parseUtmFromUrl(
      "https://example.com/waitlist/trade-cost-calculator?utm_term=detailing",
    );

    expect(utm.utm_term).toBe("detailing");
    expect(hasUtmParams({})).toBe(false);
  });
});

describe("waitlist page markup", () => {
  const pages = [
    {
      file: "apps/web/waitlist/product-opportunity-radar/index.html",
      slug: "product-opportunity-radar",
      headline: WAITLIST_ROUTES.radar.headline,
    },
    {
      file: "apps/web/waitlist/trade-cost-calculator/index.html",
      slug: "trade-cost-calculator",
      headline: WAITLIST_ROUTES.trade.headline,
    },
    {
      file: "apps/web/waitlist/pet-groomer-crm/index.html",
      slug: "pet-groomer-crm",
      headline: WAITLIST_ROUTES.groomer.headline,
    },
  ];

  it.each(pages)("includes hero and waitlist form for $slug", ({
    file,
    headline,
  }) => {
    const html = readFileSync(file, "utf8");

    expect(html).toContain(headline);
    expect(html).toContain('id="waitlist-form"');
    expect(html).toContain('type="email"');
    expect(html).toContain("Value proposition");
  });
});
