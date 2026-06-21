import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildOpportunityCard,
  filterOpportunitiesByCategory,
  getOpportunityById,
  RESEARCH_OPPORTUNITIES,
} from "../apps/web/src/research-feed.js";
import {
  buildResearchFeedUnlockUrl,
  isResearchFeedUnlocked,
  isSubscriberEmail,
  RESEARCH_FEED_PATH,
  RESEARCH_FEED_STORAGE_KEY,
  unlockResearchFeed,
} from "../apps/web/src/subscriber-access.js";

describe("research feed data", () => {
  it("seeds at least six opportunity cards from research categories", () => {
    expect(RESEARCH_OPPORTUNITIES.length).toBeGreaterThanOrEqual(6);

    const categories = new Set(
      RESEARCH_OPPORTUNITIES.map((item) => item.category),
    );
    expect(categories.has("website")).toBe(true);
    expect(categories.has("software")).toBe(true);
    expect(categories.has("mobile")).toBe(true);
  });

  it("builds display cards with scores and competition labels", () => {
    const card = buildOpportunityCard(RESEARCH_OPPORTUNITIES[0]);

    expect(card.title).toBe("Trade-specific cost calculator");
    expect(card.score).toMatch(/%$/);
    expect(card.competition).toContain("competition");
    expect(card.scoresLabel).toMatch(/^R\d+ \/ G\d+ \/ F\d+$/);
  });

  it("resolves and filters opportunities safely", () => {
    expect(
      getOpportunityById(RESEARCH_OPPORTUNITIES, "pet-groomer-crm").title,
    ).toBe("CRM for mobile pet groomers");
    expect(getOpportunityById(RESEARCH_OPPORTUNITIES, "missing").id).toBe(
      RESEARCH_OPPORTUNITIES[0].id,
    );

    const softwareOnly = filterOpportunitiesByCategory(
      RESEARCH_OPPORTUNITIES,
      "software",
    );
    expect(softwareOnly.length).toBeGreaterThanOrEqual(3);
    expect(softwareOnly.every((item) => item.category === "software")).toBe(
      true,
    );
    expect(
      filterOpportunitiesByCategory(RESEARCH_OPPORTUNITIES, "all"),
    ).toHaveLength(RESEARCH_OPPORTUNITIES.length);
  });
});

describe("subscriber access gating", () => {
  function createStorage() {
    const map = new Map();
    return {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => map.set(key, value),
    };
  }

  it("starts locked until a subscriber signs up", () => {
    const storage = createStorage();
    expect(isResearchFeedUnlocked(storage)).toBe(false);
  });

  it("unlocks after email signup and captures utm params", () => {
    const storage = createStorage();

    const result = unlockResearchFeed({
      email: "Founder@Example.com",
      url: "/research-feed/?utm_source=home&utm_medium=radar&utm_campaign=research-feed",
      storage,
      joinedAt: "2026-06-21T12:00:00.000Z",
    });

    expect(result.saved).toBe(true);
    expect(isResearchFeedUnlocked(storage)).toBe(true);
    expect(isSubscriberEmail("founder@example.com", storage)).toBe(true);

    const raw = JSON.parse(storage.getItem(RESEARCH_FEED_STORAGE_KEY));
    expect(raw[0].email).toBe("founder@example.com");
    expect(raw[0].pagePath).toBe(RESEARCH_FEED_PATH);
    expect(raw[0].utm.utm_source).toBe("home");
    expect(raw[0].utm.utm_campaign).toBe("research-feed");
  });

  it("deduplicates subscriber emails", () => {
    const storage = createStorage();

    unlockResearchFeed({
      email: "alpha@example.com",
      url: "/research-feed/",
      storage,
      joinedAt: "2026-06-21T12:00:00.000Z",
    });

    const duplicate = unlockResearchFeed({
      email: "alpha@example.com",
      url: "/research-feed/",
      storage,
      joinedAt: "2026-06-21T12:05:00.000Z",
    });

    expect(duplicate.duplicate).toBe(true);
    expect(isResearchFeedUnlocked(storage)).toBe(true);
  });

  it("builds unlock urls with campaign utm params", () => {
    const url = buildResearchFeedUnlockUrl({
      utm: {
        utm_source: "home",
        utm_medium: "radar",
        utm_campaign: "research-feed",
      },
    });

    expect(url).toBe(
      "/research-feed?utm_source=home&utm_medium=radar&utm_campaign=research-feed",
    );
  });
});

describe("research feed markup", () => {
  const feedHtml = readFileSync("apps/web/research-feed/index.html", "utf8");
  const homeHtml = readFileSync("apps/web/index.html", "utf8");

  it("includes gated unlock form and feed container", () => {
    expect(feedHtml).toContain('id="unlock-form"');
    expect(feedHtml).toContain('id="research-feed-grid"');
    expect(feedHtml).toContain("Subscribe to view the feed");
  });

  it("links home radar to the research feed unlock path with utm params", () => {
    expect(homeHtml).toContain('id="research-feed-cta"');
    expect(homeHtml).toContain("/research-feed/");
    expect(homeHtml).toContain("utm_source=home");
    expect(homeHtml).toContain("utm_campaign=research-feed");
    expect(homeHtml).toContain("Unlock subscriber research feed");
  });
});
