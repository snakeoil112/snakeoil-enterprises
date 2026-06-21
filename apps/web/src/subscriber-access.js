import {
  buildWaitlistEntry,
  readWaitlistSignups,
  saveWaitlistSignup,
} from "./waitlist/storage.js";
import { parseUtmFromUrl } from "./waitlist/utm.js";

export const RESEARCH_FEED_STORAGE_KEY = "snakeoil-research-subscriber";
export const RESEARCH_FEED_PATH = "/research-feed";
export const RESEARCH_FEED_CONCEPT_ID = "research-feed";

export function isResearchFeedUnlocked(storage = globalThis.localStorage) {
  return readWaitlistSignups(RESEARCH_FEED_STORAGE_KEY, storage).length > 0;
}

export function isSubscriberEmail(email, storage = globalThis.localStorage) {
  const normalized = email.trim().toLowerCase();
  return readWaitlistSignups(RESEARCH_FEED_STORAGE_KEY, storage).some(
    (entry) => entry.email === normalized,
  );
}

export function unlockResearchFeed({
  email,
  url,
  storage = globalThis.localStorage,
  joinedAt,
}) {
  const utm = parseUtmFromUrl(url);
  const entry = buildWaitlistEntry({
    email,
    conceptId: RESEARCH_FEED_CONCEPT_ID,
    pagePath: RESEARCH_FEED_PATH,
    utm,
    joinedAt,
  });

  return saveWaitlistSignup(RESEARCH_FEED_STORAGE_KEY, entry, storage);
}

export function buildResearchFeedUnlockUrl({
  basePath = RESEARCH_FEED_PATH,
  utm = {},
} = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(utm)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
