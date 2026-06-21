import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ABOUT_CONTENT,
  COMPANY_STATS,
  CONTACT_CONTENT,
  FOUNDER_CONTENT,
  getProductById,
  getSectionById,
  NAV_SECTIONS,
  PRODUCT_SHOWCASE,
  SERVICES_CONTENT,
} from "../apps/web/src/site-content.js";

describe("marketing site content", () => {
  it("exposes primary navigation sections", () => {
    expect(NAV_SECTIONS.map((section) => section.id)).toEqual([
      "about",
      "services",
      "products",
      "product-radar",
      "contact",
    ]);
  });

  it("includes the about story headline", () => {
    expect(ABOUT_CONTENT.title).toContain("The Snake");
    expect(ABOUT_CONTENT.story).toHaveLength(2);
  });

  it("defines founder portrait content", () => {
    expect(FOUNDER_CONTENT.name).toContain("The Snake");
    expect(FOUNDER_CONTENT.portraitSrc).toBe("/founder-portrait.svg");
    expect(FOUNDER_CONTENT.highlights.length).toBeGreaterThan(0);
  });

  it("lists company stats for the hero band", () => {
    expect(COMPANY_STATS).toHaveLength(4);
    expect(COMPANY_STATS[0].label).toContain("concepts");
  });

  it("covers full go-to-market services", () => {
    expect(SERVICES_CONTENT.services).toHaveLength(6);
    expect(SERVICES_CONTENT.title).toContain("go-to-market");
  });

  it("lists showcase products with live links", () => {
    expect(PRODUCT_SHOWCASE).toHaveLength(4);
    expect(getProductById(PRODUCT_SHOWCASE, "trade-cost-calculator").href).toBe(
      "/waitlist/trade-cost-calculator/",
    );
  });

  it("defines contact CTA copy", () => {
    expect(CONTACT_CONTENT.title).toContain("Snakeoil product");
    expect(CONTACT_CONTENT.ctaLabel).toBe("Send message");
  });

  it("resolves nav sections by id with a safe fallback", () => {
    expect(getSectionById(NAV_SECTIONS, "contact").label).toBe("Contact");
    expect(getSectionById(NAV_SECTIONS, "missing").id).toBe("about");
  });
});

describe("marketing site markup", () => {
  const html = readFileSync("apps/web/index.html", "utf8");

  it("links nav anchors to marketing sections", () => {
    for (const section of NAV_SECTIONS) {
      expect(html).toContain(`href="#${section.id}"`);
      expect(html).toContain(`id="${section.id}"`);
    }
  });

  it("includes key section headings and founder portrait", () => {
    expect(html).toContain(ABOUT_CONTENT.title);
    expect(html).toContain("Product showcase");
    expect(html).toContain(CONTACT_CONTENT.title);
    expect(html).toContain(FOUNDER_CONTENT.name);
    expect(html).toContain("/founder-portrait.svg");
    expect(html).toContain("Full-stack go-to-market");
  });

  it("links to live waitlist products", () => {
    expect(html).toContain('href="/waitlist/trade-cost-calculator/"');
    expect(html).toContain('href="/waitlist/product-opportunity-radar/"');
    expect(html).toContain('href="/waitlist/pet-groomer-crm/"');
  });

  it("links to the internal waitlist metrics dashboard", () => {
    expect(html).toContain('href="/metrics/"');
    expect(html).toContain("Waitlist metrics (internal)");
  });
});

describe("founder portrait asset", () => {
  const svg = readFileSync("apps/web/public/founder-portrait.svg", "utf8");

  it("ships a branded founder illustration", () => {
    expect(svg).toContain("BENNY");
    expect(svg).toContain("FOUNDER");
  });
});
