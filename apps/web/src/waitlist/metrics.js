import {
  RESEARCH_FEED_CONCEPT_ID,
  RESEARCH_FEED_PATH,
  RESEARCH_FEED_STORAGE_KEY,
} from "../subscriber-access.js";
import { CONCEPT_PAGES } from "./concept-pages.js";
import { readWaitlistSignups } from "./storage.js";

export const METRICS_PATH = "/metrics";
export const SIGNUP_TARGET = 50;

export const METRICS_SOURCES = [
  ...CONCEPT_PAGES.map((page) => ({
    conceptId: page.id,
    title: page.title,
    storageKey: page.storageKey,
    pagePath: page.path,
    kind: "waitlist",
  })),
  {
    conceptId: RESEARCH_FEED_CONCEPT_ID,
    title: "Subscriber Research Feed",
    storageKey: RESEARCH_FEED_STORAGE_KEY,
    pagePath: RESEARCH_FEED_PATH,
    kind: "research-feed",
  },
];

export function countByUtmSource(signups) {
  const counts = {};

  for (const signup of signups) {
    const source = signup.utm?.utm_source?.trim() || "(direct)";
    counts[source] = (counts[source] ?? 0) + 1;
  }

  return counts;
}

export function sortUtmBreakdown(breakdown) {
  return Object.entries(breakdown)
    .sort((left, right) => right[1] - left[1])
    .map(([source, count]) => ({ source, count }));
}

export function aggregateConceptMetrics(
  source,
  storage = globalThis.localStorage,
) {
  const signups = readWaitlistSignups(source.storageKey, storage);

  return {
    conceptId: source.conceptId,
    title: source.title,
    pagePath: source.pagePath,
    kind: source.kind,
    signupCount: signups.length,
    utmBreakdown: countByUtmSource(signups),
    signups,
  };
}

export function aggregateWaitlistMetrics(storage = globalThis.localStorage) {
  const concepts = METRICS_SOURCES.map((source) =>
    aggregateConceptMetrics(source, storage),
  );
  const totalSignups = concepts.reduce(
    (sum, concept) => sum + concept.signupCount,
    0,
  );
  const waitlistSignups = concepts
    .filter((concept) => concept.kind === "waitlist")
    .reduce((sum, concept) => sum + concept.signupCount, 0);
  const researchFeedUnlocks =
    concepts.find((concept) => concept.kind === "research-feed")?.signupCount ??
    0;

  return {
    generatedAt: new Date().toISOString(),
    target: SIGNUP_TARGET,
    totalSignups,
    waitlistSignups,
    researchFeedUnlocks,
    progressPercent: Math.min(
      100,
      Math.round((totalSignups / SIGNUP_TARGET) * 100),
    ),
    concepts,
  };
}

export function escapeCsvCell(value) {
  const text = String(value ?? "");

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

export function formatMetricsJson(metrics) {
  return `${JSON.stringify(metrics, null, 2)}\n`;
}

export function formatMetricsCsv(metrics) {
  const headers = [
    "conceptId",
    "conceptTitle",
    "kind",
    "email",
    "joinedAt",
    "pagePath",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const lines = [headers.join(",")];

  for (const concept of metrics.concepts) {
    for (const signup of concept.signups) {
      const row = [
        concept.conceptId,
        concept.title,
        concept.kind,
        signup.email,
        signup.joinedAt,
        signup.pagePath,
        signup.utm?.utm_source ?? "",
        signup.utm?.utm_medium ?? "",
        signup.utm?.utm_campaign ?? "",
        signup.utm?.utm_term ?? "",
        signup.utm?.utm_content ?? "",
      ].map(escapeCsvCell);

      lines.push(row.join(","));
    }
  }

  return `${lines.join("\n")}\n`;
}
