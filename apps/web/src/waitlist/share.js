import { buildUrlWithUtm } from "./utm.js";

export const WAITLIST_SHARE_UTM = {
  utm_medium: "social",
  utm_campaign: "waitlist-share",
};

export function buildSharePageUrl(pagePath, source = "copy", origin = "") {
  const base = origin ? new URL(pagePath, origin).toString() : pagePath;

  return buildUrlWithUtm(base, {
    ...WAITLIST_SHARE_UTM,
    utm_source: source,
  });
}

export function buildTwitterShareUrl({
  pagePath,
  text,
  source = "twitter",
  origin = "",
}) {
  const shareUrl = buildSharePageUrl(pagePath, source, origin);
  const params = new URLSearchParams({
    url: shareUrl,
    text: text ?? "",
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function mountShareButtons({
  container,
  pagePath,
  shareText,
  shareLabel = "Share this concept",
  origin = globalThis.location?.origin ?? "",
}) {
  if (!container) {
    return { show: () => {} };
  }

  const panel = document.createElement("div");
  panel.className = "waitlist-share";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Share this waitlist");

  const label = document.createElement("p");
  label.className = "waitlist-share__label";
  label.textContent = shareLabel;

  const actions = document.createElement("div");
  actions.className = "waitlist-share__actions";

  const twitterLink = document.createElement("a");
  twitterLink.className = "waitlist-share__button";
  twitterLink.href = buildTwitterShareUrl({
    pagePath,
    text: shareText,
    origin,
  });
  twitterLink.target = "_blank";
  twitterLink.rel = "noopener noreferrer";
  twitterLink.textContent = "Share on X";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className =
    "waitlist-share__button waitlist-share__button--secondary";
  copyButton.textContent = "Copy link";

  const copyNote = document.createElement("p");
  copyNote.className = "waitlist-share__note";
  copyNote.hidden = true;

  copyButton.addEventListener("click", async () => {
    const shareUrl = buildSharePageUrl(pagePath, "copy", origin);

    try {
      await navigator.clipboard.writeText(shareUrl);
      copyNote.hidden = false;
      copyNote.textContent = "Link copied with UTM tracking.";
    } catch {
      copyNote.hidden = false;
      copyNote.textContent = shareUrl;
    }
  });

  actions.append(twitterLink, copyButton);
  panel.append(label, actions, copyNote);
  container.append(panel);

  return {
    show: () => {
      panel.hidden = false;
    },
  };
}
