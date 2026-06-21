import {
  aggregateCampaignAttribution,
  CAMPAIGN_WINDOW_PRESETS,
  DEFAULT_CAMPAIGN_WINDOW_HOURS,
  TRADEAI_AU_CAMPAIGN_T0,
  TRADEAI_AU_CAMPAIGN_UTMS,
} from "../waitlist/campaign-attribution.js";

function formatWindowRange(attribution) {
  if (!attribution.windowStart || !attribution.windowEnd) {
    return "Invalid campaign window";
  }

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `${formatter.format(new Date(attribution.windowStart))} – ${formatter.format(new Date(attribution.windowEnd))}`;
}

function renderBreakdownTable(breakdown) {
  const table = document.createElement("table");
  table.className = "metrics-attribution-table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  for (const label of ["UTM source", "UTM campaign", "Signups"]) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    headRow.append(cell);
  }

  head.append(headRow);

  const body = document.createElement("tbody");

  if (breakdown.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "metrics-attribution-table__empty";
    cell.textContent = "No campaign signups in this window yet";
    row.append(cell);
    body.append(row);
  } else {
    for (const item of breakdown) {
      const row = document.createElement("tr");

      const source = document.createElement("td");
      source.textContent = item.source;

      const campaign = document.createElement("td");
      campaign.textContent = item.campaign;

      const count = document.createElement("td");
      count.className = "metrics-attribution-table__count";
      count.textContent = String(item.count);

      row.append(source, campaign, count);
      body.append(row);
    }
  }

  table.append(head, body);
  return table;
}

export function mountCampaignAttribution({
  container,
  getMetrics,
  t0 = TRADEAI_AU_CAMPAIGN_T0,
  campaigns = TRADEAI_AU_CAMPAIGN_UTMS,
  defaultWindowHours = DEFAULT_CAMPAIGN_WINDOW_HOURS,
}) {
  if (!container) {
    return;
  }

  container.replaceChildren();

  const panel = document.createElement("div");
  panel.className = "metrics-attribution-panel";

  const controls = document.createElement("div");
  controls.className = "metrics-attribution-controls";

  const windowField = document.createElement("div");
  windowField.className = "metrics-campaign-field";

  const windowLabel = document.createElement("label");
  windowLabel.className = "metrics-campaign-field__label";
  windowLabel.htmlFor = "campaign-attribution-window";
  windowLabel.textContent = "Attribution window";

  const windowSelect = document.createElement("select");
  windowSelect.className = "metrics-campaign-field__input";
  windowSelect.id = "campaign-attribution-window";
  windowSelect.name = "attributionWindow";

  for (const preset of CAMPAIGN_WINDOW_PRESETS) {
    const option = document.createElement("option");
    option.value = String(preset.hours);
    option.textContent = preset.label;
    option.selected = preset.hours === defaultWindowHours;
    windowSelect.append(option);
  }

  windowField.append(windowLabel, windowSelect);

  const meta = document.createElement("p");
  meta.className = "metrics-attribution-meta";
  meta.id = "campaign-attribution-window-meta";

  const campaignList = document.createElement("p");
  campaignList.className = "metrics-attribution-campaigns";
  campaignList.textContent = `Tracking campaigns: ${campaigns.join(", ")}`;

  controls.append(windowField, meta, campaignList);

  const summary = document.createElement("div");
  summary.className = "metrics-attribution-summary";
  summary.id = "campaign-attribution-summary";

  const breakdownTitle = document.createElement("p");
  breakdownTitle.className = "metrics-attribution-breakdown-title";
  breakdownTitle.textContent = "Window breakdown by UTM source / campaign";

  const breakdownRoot = document.createElement("div");
  breakdownRoot.id = "campaign-attribution-breakdown";

  panel.append(controls, summary, breakdownTitle, breakdownRoot);
  container.append(panel);

  function render() {
    const windowHours = Number(windowSelect.value);
    const attribution = aggregateCampaignAttribution(getMetrics(), {
      t0,
      windowHours,
      campaigns,
    });

    meta.textContent = `T0 ${new Date(t0).toLocaleString()} · Window ${formatWindowRange(attribution)}`;

    summary.replaceChildren();

    const cards = [
      {
        label: "Window signups",
        value: String(attribution.windowSignupCount),
        hint: `${windowHours}h from campaign publish`,
      },
      {
        label: "All-time baseline",
        value: String(attribution.allTimeSignupCount),
        hint: "Same campaigns since tracking began",
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
      summary.append(article);
    }

    breakdownRoot.replaceChildren(renderBreakdownTable(attribution.breakdown));
  }

  windowSelect.addEventListener("change", render);
  render();
}
