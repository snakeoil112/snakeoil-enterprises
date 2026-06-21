import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getSocialPlatformCtaHref,
  getSocialPlatformPage,
  SOCIAL_PLATFORM_PAGES,
  WAITLIST_DISCLAIMER,
  WAITLIST_TRADE_PATH,
} from "../apps/web/src/social/platform-pages.js";
import { PLACEHOLDER_OG_IMAGE } from "../apps/web/src/waitlist/social-meta.js";

const LIVE_ORIGIN = "https://snakeoil112.github.io/snakeoil-enterprises";

describe("social platform pages", () => {
  it("defines seven platform routes", () => {
    expect(SOCIAL_PLATFORM_PAGES).toHaveLength(7);
    expect(SOCIAL_PLATFORM_PAGES.map((page) => page.path)).toEqual([
      "/social/youtube",
      "/social/twitter",
      "/social/instagram",
      "/social/linkedin",
      "/social/tiktok",
      "/social/facebook",
      "/social/reddit",
    ]);
  });

  it("includes hero copy and value props for each platform", () => {
    for (const page of SOCIAL_PLATFORM_PAGES) {
      expect(page.headline.length).toBeGreaterThan(10);
      expect(page.lede.length).toBeGreaterThan(20);
      expect(page.valueProps).toHaveLength(3);
      expect(page.ogTitle.length).toBeGreaterThan(10);
      expect(page.ogDescription.length).toBeGreaterThan(10);
    }
  });

  it("builds waitlist CTA hrefs with social-landing UTM content", () => {
    for (const page of SOCIAL_PLATFORM_PAGES) {
      const href = getSocialPlatformCtaHref(page, LIVE_ORIGIN);
      const url = new URL(href);

      expect(url.pathname).toBe(WAITLIST_TRADE_PATH);
      expect(url.searchParams.get("utm_medium")).toBe("social");
      expect(url.searchParams.get("utm_content")).toBe("social-landing");
      expect(url.searchParams.get("utm_source")).toBe(page.ctaUtm.utm_source);
      expect(url.searchParams.get("utm_campaign")).toBe(
        page.ctaUtm.utm_campaign,
      );
    }
  });

  it("uses tradeai-au-b2b campaign for LinkedIn", () => {
    const linkedin = getSocialPlatformPage("linkedin");
    const href = getSocialPlatformCtaHref(linkedin, LIVE_ORIGIN);

    expect(new URL(href).searchParams.get("utm_campaign")).toBe(
      "tradeai-au-b2b",
    );
  });

  it("uses tradeai-au-reddit campaign for Reddit", () => {
    const reddit = getSocialPlatformPage("reddit");
    const href = getSocialPlatformCtaHref(reddit, LIVE_ORIGIN);

    expect(new URL(href).searchParams.get("utm_campaign")).toBe(
      "tradeai-au-reddit",
    );
    expect(reddit.affiliationNote).toContain("Snakeoil Enterprises");
  });

  it("resolves pages by slug with safe fallback", () => {
    expect(getSocialPlatformPage("tiktok").slug).toBe("tiktok");
    expect(getSocialPlatformPage("missing").slug).toBe("youtube");
  });
});

describe("social landing page markup", () => {
  it.each(
    SOCIAL_PLATFORM_PAGES,
  )("includes OG meta, disclaimer shell, and CTA for $slug", (page) => {
    const file = `apps/web/social/${page.slug}/index.html`;
    const html = readFileSync(file, "utf8");

    expect(html).toContain(page.headline);
    expect(html).toContain(page.ogTitle);
    expect(html).toContain('property="og:title"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain(PLACEHOLDER_OG_IMAGE);
    expect(html).toContain('id="social-disclaimer"');
    expect(html).toContain('id="social-cta"');
    expect(html).toContain(`data-platform="${page.slug}"`);
    expect(html).toContain("← Back to Snakeoil home");
  });

  it("embeds the shared waitlist disclaimer in the data module", () => {
    expect(WAITLIST_DISCLAIMER).toContain("Waitlist validation only");
    expect(WAITLIST_DISCLAIMER).toContain("not a live trading");
  });
});
