import { CONCEPT_PAGES } from "./concept-pages.js";

export const SITE_NAME = "Snakeoil Enterprises";

export const PLACEHOLDER_OG_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'%3E%3Crect fill='%23141b2f' width='1200' height='630'/%3E%3Ctext x='600' y='300' fill='%234ade80' font-family='system-ui,sans-serif' font-size='56' font-weight='700' text-anchor='middle'%3ESnakeoil Enterprises%3C/text%3E%3Ctext x='600' y='360' fill='%2394a3b8' font-family='system-ui,sans-serif' font-size='28' text-anchor='middle'%3EConcept validation waitlist%3C/text%3E%3C/svg%3E";

export const RESEARCH_FEED_SOCIAL = {
  path: "/research-feed",
  title: "Subscriber Research Feed — Snakeoil Enterprises",
  description:
    "Snakeoil subscriber research feed — curated market opportunities from deep research",
  shareText:
    "Curated opportunity feed from Snakeoil's deep market research — see where new products can gain traction.",
};

export function buildSocialMetaTags({
  title,
  description,
  imageUrl = PLACEHOLDER_OG_IMAGE,
  url,
  siteName = SITE_NAME,
  type = "website",
}) {
  const tags = [
    { property: "og:type", content: type },
    { property: "og:site_name", content: siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  if (url) {
    tags.splice(5, 0, { property: "og:url", content: url });
  }

  return tags;
}

export function renderSocialMetaHtml(tags) {
  return tags
    .map((tag) => {
      const attribute = tag.property ? "property" : "name";
      const key = tag.property ?? tag.name;
      return `<meta ${attribute}="${key}" content="${escapeMetaContent(tag.content)}" />`;
    })
    .join("\n    ");
}

function escapeMetaContent(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function getWaitlistSocialMeta(page, origin = "") {
  const siteName = page.socialBrand ?? SITE_NAME;
  const title = page.socialBrand ? page.title : `${page.title} — ${SITE_NAME}`;
  const url = origin ? new URL(page.path, origin).toString() : undefined;

  return {
    title,
    description: page.lede,
    shareText: page.headline,
    path: page.path,
    tags: buildSocialMetaTags({
      title,
      description: page.lede,
      url,
      siteName,
    }),
  };
}

export function getResearchFeedSocialMeta(origin = "") {
  const url = origin
    ? new URL(RESEARCH_FEED_SOCIAL.path, origin).toString()
    : undefined;

  return {
    ...RESEARCH_FEED_SOCIAL,
    tags: buildSocialMetaTags({
      title: RESEARCH_FEED_SOCIAL.title,
      description: RESEARCH_FEED_SOCIAL.description,
      url,
    }),
  };
}

export function mountSocialMeta(tags) {
  if (typeof document === "undefined") {
    return;
  }

  const head = document.head;
  if (!head) {
    return;
  }

  for (const tag of tags) {
    const element = document.createElement("meta");
    if (tag.property) {
      element.setAttribute("property", tag.property);
    } else {
      element.setAttribute("name", tag.name);
    }
    element.setAttribute("content", tag.content);
    head.append(element);
  }
}

export const WAITLIST_SOCIAL_META = CONCEPT_PAGES.map((page) =>
  getWaitlistSocialMeta(page),
);
