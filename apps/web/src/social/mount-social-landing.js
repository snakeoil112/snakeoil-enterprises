import { renderValueProps } from "../waitlist/mount-waitlist.js";
import {
  buildSocialMetaTags,
  mountSocialMeta,
  PLACEHOLDER_OG_IMAGE,
} from "../waitlist/social-meta.js";
import {
  getSocialPlatformCtaHref,
  WAITLIST_DISCLAIMER,
} from "./platform-pages.js";

export function mountSocialLanding(page) {
  if (typeof document === "undefined") {
    return;
  }

  const origin = globalThis.location?.origin ?? "";
  const pageUrl = origin
    ? new URL(`${page.path}/`, origin).toString()
    : undefined;

  document.title = page.ogTitle;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", page.ogDescription);
  }

  mountSocialMeta(
    buildSocialMetaTags({
      title: page.ogTitle,
      description: page.ogDescription,
      imageUrl: PLACEHOLDER_OG_IMAGE,
      url: pageUrl,
      siteName: "TradeAI Australia",
    }),
  );

  const eyebrow = document.getElementById("social-eyebrow");
  const headline = document.getElementById("social-headline");
  const lede = document.getElementById("social-lede");
  const cta = document.getElementById("social-cta");
  const disclaimer = document.getElementById("social-disclaimer");
  const affiliation = document.getElementById("social-affiliation");

  if (eyebrow) {
    eyebrow.textContent = page.eyebrow;
  }
  if (headline) {
    headline.textContent = page.headline;
  }
  if (lede) {
    lede.textContent = page.lede;
  }
  if (cta) {
    cta.textContent = page.ctaLabel;
    cta.href = getSocialPlatformCtaHref(page, origin);
  }
  if (disclaimer) {
    disclaimer.textContent = WAITLIST_DISCLAIMER;
  }
  if (affiliation) {
    if (page.affiliationNote) {
      affiliation.textContent = page.affiliationNote;
      affiliation.hidden = false;
    } else {
      affiliation.hidden = true;
    }
  }

  renderValueProps(document.getElementById("value-props"), page.valueProps);
}
