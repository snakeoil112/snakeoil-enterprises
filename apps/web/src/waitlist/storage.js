import { parseUtmFromUrl } from "./utm.js";

export function buildWaitlistEntry({
  email,
  conceptId,
  pagePath,
  utm = {},
  joinedAt,
}) {
  return {
    email: email.trim().toLowerCase(),
    conceptId,
    pagePath,
    utm,
    joinedAt: joinedAt ?? new Date().toISOString(),
  };
}

export function saveWaitlistSignup(
  storageKey,
  entry,
  storage = globalThis.localStorage,
) {
  const existing = readWaitlistSignups(storageKey, storage);
  const duplicate = existing.some((item) => item.email === entry.email);

  if (duplicate) {
    return { saved: false, duplicate: true, total: existing.length };
  }

  const next = [...existing, entry];
  storage.setItem(storageKey, JSON.stringify(next));

  return { saved: true, duplicate: false, total: next.length };
}

export function readWaitlistSignups(
  storageKey,
  storage = globalThis.localStorage,
) {
  const raw = storage.getItem(storageKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function captureWaitlistSignup({
  storageKey,
  conceptId,
  pagePath,
  email,
  url,
  storage = globalThis.localStorage,
  joinedAt,
}) {
  const utm = parseUtmFromUrl(url);
  const entry = buildWaitlistEntry({
    email,
    conceptId,
    pagePath,
    utm,
    joinedAt,
  });

  return saveWaitlistSignup(storageKey, entry, storage);
}
