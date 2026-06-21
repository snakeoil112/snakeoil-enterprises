export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export function parseUtmFromSearch(search = "") {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : `?${search}`,
  );
  const utm = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }

  return utm;
}

export function parseUtmFromUrl(url) {
  if (typeof url === "string") {
    const queryIndex = url.indexOf("?");
    const search = queryIndex >= 0 ? url.slice(queryIndex) : "";
    return parseUtmFromSearch(search);
  }

  return parseUtmFromSearch(url?.search ?? "");
}

export function hasUtmParams(utm) {
  return Object.keys(utm).length > 0;
}

export function buildUrlWithUtm(url, utm = {}) {
  const parsed = new URL(url, "https://snakeoil.example");
  for (const key of UTM_PARAMS) {
    const value = utm[key];
    if (value) {
      parsed.searchParams.set(key, value);
    }
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return parsed.toString();
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
