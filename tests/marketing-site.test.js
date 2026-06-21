import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ABOUT_CONTENT,
  CONTACT_CONTENT,
  getProductById,
  getSectionById,
  NAV_SECTIONS,
  PRODUCT_SHOWCASE,
} from "../apps/web/src/site-content.js";

describe("marketing site content", () => {
  it("exposes primary navigation sections", () => {
    expect(NAV_SECTIONS.map((section) => section.id)).toEqual([
      "about",
      "products",
      "product-radar",
      "contact",
    ]);
  });

  it("includes the about story headline", () => {
    expect(ABOUT_CONTENT.title).toContain("The Snake");
    expect(ABOUT_CONTENT.story).toHaveLength(2);
  });

  it("lists showcase products with categories", () => {
    expect(PRODUCT_SHOWCASE).toHaveLength(4);
    expect(getProductById(PRODUCT_SHOWCASE, "flowforge").category).toBe(
      "Software",
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

  it("includes key section headings", () => {
    expect(html).toContain(ABOUT_CONTENT.title);
    expect(html).toContain("Product showcase");
    expect(html).toContain(CONTACT_CONTENT.title);
  });

  it("links to the internal waitlist metrics dashboard", () => {
    expect(html).toContain('href="/metrics/"');
    expect(html).toContain("Waitlist metrics (internal)");
  });
});
