import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CONCEPT_PAGES } from "../apps/web/src/waitlist/concept-pages.js";
import {
  buildSharePageUrl,
  buildTwitterShareUrl,
  WAITLIST_SHARE_UTM,
} from "../apps/web/src/waitlist/share.js";
import {
  buildSocialMetaTags,
  getResearchFeedSocialMeta,
  getWaitlistSocialMeta,
  PLACEHOLDER_OG_IMAGE,
  RESEARCH_FEED_SOCIAL,
  renderSocialMetaHtml,
} from "../apps/web/src/waitlist/social-meta.js";
import { buildUrlWithUtm } from "../apps/web/src/waitlist/utm.js";

describe("social meta tags", () => {
  it("builds Open Graph and Twitter Card tags", () => {
    const tags = buildSocialMetaTags({
      title: "GroomRoute CRM — Snakeoil Enterprises",
      description: "CRM built for mobile pet groomers on the road",
      url: "https://snakeoil.example/waitlist/pet-groomer-crm",
    });

    expect(tags).toEqual(
      expect.arrayContaining([
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Snakeoil Enterprises" },
        {
          property: "og:title",
          content: "GroomRoute CRM — Snakeoil Enterprises",
        },
        {
          property: "og:description",
          content: "CRM built for mobile pet groomers on the road",
        },
        {
          property: "og:url",
          content: "https://snakeoil.example/waitlist/pet-groomer-crm",
        },
        { property: "og:image", content: PLACEHOLDER_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "GroomRoute CRM — Snakeoil Enterprises",
        },
        {
          name: "twitter:description",
          content: "CRM built for mobile pet groomers on the road",
        },
        { name: "twitter:image", content: PLACEHOLDER_OG_IMAGE },
      ]),
    );
  });

  it("renders escaped meta tag markup", () => {
    const html = renderSocialMetaHtml(
      buildSocialMetaTags({
        title: 'Test "quoted" title',
        description: "Safe & shareable",
      }),
    );

    expect(html).toContain(
      'property="og:title" content="Test &quot;quoted&quot; title"',
    );
    expect(html).toContain(
      'name="twitter:description" content="Safe &amp; shareable"',
    );
  });

  it("maps concept pages to shareable metadata", () => {
    for (const page of CONCEPT_PAGES) {
      const meta = getWaitlistSocialMeta(page, "https://snakeoil.example");
      expect(meta.title).toContain(page.title);
      expect(meta.description).toBe(page.lede);
      expect(meta.tags.some((tag) => tag.property === "og:image")).toBe(true);
    }
  });

  it("uses TradeAI Australia branding for the trade waitlist page", () => {
    const tradePage = CONCEPT_PAGES.find(
      (page) => page.id === "trade-cost-calculator",
    );
    const meta = getWaitlistSocialMeta(tradePage, "https://snakeoil.example");

    expect(meta.title).toBe("TradeAI Australia");
    expect(meta.tags).toEqual(
      expect.arrayContaining([
        { property: "og:site_name", content: "TradeAI Australia" },
        { property: "og:title", content: "TradeAI Australia" },
      ]),
    );
  });

  it("maps research feed metadata", () => {
    const meta = getResearchFeedSocialMeta("https://snakeoil.example");
    expect(meta.title).toBe(RESEARCH_FEED_SOCIAL.title);
    expect(meta.tags).toEqual(
      expect.arrayContaining([
        {
          property: "og:url",
          content: "https://snakeoil.example/research-feed",
        },
      ]),
    );
  });
});

describe("share url builder", () => {
  it("appends waitlist-share UTM params", () => {
    const url = buildSharePageUrl(
      "/waitlist/trade-cost-calculator",
      "twitter",
      "https://snakeoil.example",
    );
    const params = new URL(url).searchParams;

    expect(params.get("utm_source")).toBe("twitter");
    expect(params.get("utm_medium")).toBe("social");
    expect(params.get("utm_campaign")).toBe("waitlist-share");
  });

  it("reuses utm helpers for copy-link shares", () => {
    const url = buildUrlWithUtm("/waitlist/pet-groomer-crm", {
      ...WAITLIST_SHARE_UTM,
      utm_source: "copy",
    });
    const params = new URL(`https://snakeoil.example${url}`).searchParams;

    expect(params.get("utm_source")).toBe("copy");
    expect(params.get("utm_medium")).toBe("social");
    expect(params.get("utm_campaign")).toBe("waitlist-share");
  });

  it("builds Twitter intent URLs with encoded share text", () => {
    const url = buildTwitterShareUrl({
      pagePath: "/waitlist/product-opportunity-radar",
      text: "Find your next product before competitors do",
      origin: "https://snakeoil.example",
    });
    const intent = new URL(url);

    expect(intent.origin + intent.pathname).toBe(
      "https://twitter.com/intent/tweet",
    );
    expect(intent.searchParams.get("text")).toBe(
      "Find your next product before competitors do",
    );

    const shared = new URL(intent.searchParams.get("url"));
    expect(shared.pathname).toBe("/waitlist/product-opportunity-radar");
    expect(shared.searchParams.get("utm_source")).toBe("twitter");
    expect(shared.searchParams.get("utm_medium")).toBe("social");
    expect(shared.searchParams.get("utm_campaign")).toBe("waitlist-share");
  });
});

describe("waitlist social markup", () => {
  const pages = [
    {
      file: "apps/web/waitlist/product-opportunity-radar/index.html",
      title: "Product Opportunity Radar — Snakeoil Enterprises",
    },
    {
      file: "apps/web/waitlist/trade-cost-calculator/index.html",
      title: "TradeAI Australia",
    },
    {
      file: "apps/web/waitlist/pet-groomer-crm/index.html",
      title: "GroomRoute CRM — Snakeoil Enterprises",
    },
    {
      file: "apps/web/research-feed/index.html",
      title: "Subscriber Research Feed — Snakeoil Enterprises",
    },
  ];

  it.each(pages)("includes social meta tags for $file", ({ file, title }) => {
    const html = readFileSync(file, "utf8");

    expect(html).toContain('property="og:title"');
    expect(html).toContain(title);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain(PLACEHOLDER_OG_IMAGE);
  });
});
