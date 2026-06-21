import {
  aggregateWaitlistMetrics,
  formatMetricsCsv,
  formatMetricsJson,
  sortUtmBreakdown,
} from "../waitlist/metrics.js";
import { mountCampaignAttribution } from "./campaign-attribution.js";
import { mountCampaignLinks } from "./campaign-links.js";

const summaryRoot = document.getElementById("metrics-summary");
const campaignAttributionRoot = document.getElementById(
  "campaign-attribution-root",
);
const campaignLinksRoot = document.getElementById("campaign-links-root");
const conceptsRoot = document.getElementById("metrics-concepts");
const exportJsonButton = document.getElementById("export-json");
const exportCsvButton = document.getElementById("export-csv");
const refreshedAt = document.getElementById("metrics-refreshed-at");

function downloadTextFile({ filename, mimeType, content }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderSummary(metrics) {
  if (!summaryRoot) {
    return;
  }

  summaryRoot.replaceChildren();

  const cards = [
    {
      label: "Total signups",
      value: String(metrics.totalSignups),
      hint: `${metrics.progressPercent}% of ${metrics.target}-signup target`,
    },
    {
      label: "Waitlist signups",
      value: String(metrics.waitlistSignups),
      hint: "Across three concept landings",
    },
    {
      label: "Research feed unlocks",
      value: String(metrics.researchFeedUnlocks),
      hint: "Subscriber email unlocks",
    },
  ];

  for (const card of cards) {
    const article = document.createElement("article");
    article.className = "metrics-summary-card";

    const label = document.createElement("p");
    label.className = "metrics-summary-card__label";
    label.textContent = card.label;

    const value = document.createElement("p");
    value.className = "metrics-summary-card__value";
    value.textContent = card.value;

    const hint = document.createElement("p");
    hint.className = "metrics-summary-card__hint";
    hint.textContent = card.hint;

    article.append(label, value, hint);
    summaryRoot.append(article);
  }

  const progress = document.createElement("div");
  progress.className = "metrics-progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", String(metrics.target));
  progress.setAttribute("aria-valuenow", String(metrics.totalSignups));
  progress.setAttribute(
    "aria-label",
    `Validation progress toward ${metrics.target} signups`,
  );

  const fill = document.createElement("div");
  fill.className = "metrics-progress__fill";
  fill.style.width = `${metrics.progressPercent}%`;
  progress.append(fill);
  summaryRoot.append(progress);
}

function renderUtmBreakdown(concept) {
  const breakdown = sortUtmBreakdown(concept.utmBreakdown);

  if (breakdown.length === 0) {
    const empty = document.createElement("p");
    empty.className = "metrics-utm-empty";
    empty.textContent = "No UTM data yet";
    return empty;
  }

  const list = document.createElement("ul");
  list.className = "metrics-utm-list";

  for (const item of breakdown) {
    const row = document.createElement("li");
    row.className = "metrics-utm-list__item";

    const source = document.createElement("span");
    source.className = "metrics-utm-list__source";
    source.textContent = item.source;

    const count = document.createElement("span");
    count.className = "metrics-utm-list__count";
    count.textContent = String(item.count);

    row.append(source, count);
    list.append(row);
  }

  return list;
}

function renderConcepts(metrics) {
  if (!conceptsRoot) {
    return;
  }

  conceptsRoot.replaceChildren();

  for (const concept of metrics.concepts) {
    const article = document.createElement("article");
    article.className = "metrics-concept-card";
    article.dataset.conceptId = concept.conceptId;

    const header = document.createElement("div");
    header.className = "metrics-concept-card__header";

    const title = document.createElement("h3");
    title.textContent = concept.title;

    const count = document.createElement("p");
    count.className = "metrics-concept-card__count";
    count.textContent = `${concept.signupCount} signup${
      concept.signupCount === 1 ? "" : "s"
    }`;

    header.append(title, count);

    const kind = document.createElement("p");
    kind.className = "metrics-concept-card__kind";
    kind.textContent =
      concept.kind === "research-feed"
        ? "Research feed unlock"
        : "Concept waitlist";

    const path = document.createElement("p");
    path.className = "metrics-concept-card__path";
    path.textContent = concept.pagePath;

    const utmTitle = document.createElement("p");
    utmTitle.className = "metrics-concept-card__utm-title";
    utmTitle.textContent = "UTM source breakdown";

    article.append(header, kind, path, utmTitle, renderUtmBreakdown(concept));
    conceptsRoot.append(article);
  }
}

function mountExportButtons(metrics) {
  exportJsonButton?.addEventListener("click", () => {
    downloadTextFile({
      filename: "snakeoil-waitlist-metrics.json",
      mimeType: "application/json",
      content: formatMetricsJson(metrics),
    });
  });

  exportCsvButton?.addEventListener("click", () => {
    downloadTextFile({
      filename: "snakeoil-waitlist-metrics.csv",
      mimeType: "text/csv",
      content: formatMetricsCsv(metrics),
    });
  });
}

function renderDashboard() {
  const metrics = aggregateWaitlistMetrics();

  if (refreshedAt) {
    refreshedAt.textContent = new Date(metrics.generatedAt).toLocaleString();
  }

  renderSummary(metrics);
  mountCampaignAttribution({
    container: campaignAttributionRoot,
    getMetrics: () => metrics,
  });
  mountCampaignLinks({ container: campaignLinksRoot });
  renderConcepts(metrics);
  mountExportButtons(metrics);
}

renderDashboard();
