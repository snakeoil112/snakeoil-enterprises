import { METRICS_SOURCES } from "../waitlist/metrics.js";
import { buildUrlWithUtm } from "../waitlist/utm.js";

export const CAMPAIGN_LINK_PRESETS = [
  {
    id: "twitter",
    label: "Twitter",
    utm_source: "twitter",
    utm_medium: "social",
  },
  {
    id: "instagram",
    label: "Instagram",
    utm_source: "instagram",
    utm_medium: "social",
  },
  {
    id: "reddit",
    label: "Reddit",
    utm_source: "reddit",
    utm_medium: "social",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    utm_source: "newsletter",
    utm_medium: "email",
  },
];

export function sanitizeUtmField(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildCampaignUtm(fields = {}) {
  const utm = {};

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const value = sanitizeUtmField(fields[key]);
    if (value) {
      utm[key] = value;
    }
  }

  return utm;
}

export function buildCampaignLink({ pagePath, origin = "", utm = {} }) {
  const base = origin ? new URL(pagePath, origin).toString() : pagePath;

  return buildUrlWithUtm(base, buildCampaignUtm(utm));
}

function createField({ id, label, name, value = "", placeholder = "" }) {
  const field = document.createElement("div");
  field.className = "metrics-campaign-field";

  const fieldLabel = document.createElement("label");
  fieldLabel.className = "metrics-campaign-field__label";
  fieldLabel.htmlFor = id;
  fieldLabel.textContent = label;

  const input = document.createElement("input");
  input.className = "metrics-campaign-field__input";
  input.id = id;
  input.name = name;
  input.type = "text";
  input.value = value;
  input.placeholder = placeholder;
  input.autocomplete = "off";

  field.append(fieldLabel, input);
  return { field, input };
}

export function mountCampaignLinks({
  container,
  sources = METRICS_SOURCES,
  origin = globalThis.location?.origin ?? "",
}) {
  if (!container) {
    return;
  }

  container.replaceChildren();

  const form = document.createElement("form");
  form.className = "metrics-campaign-form";
  form.noValidate = true;

  const conceptField = document.createElement("div");
  conceptField.className = "metrics-campaign-field";

  const conceptLabel = document.createElement("label");
  conceptLabel.className = "metrics-campaign-field__label";
  conceptLabel.htmlFor = "campaign-concept";
  conceptLabel.textContent = "Concept page";

  const conceptSelect = document.createElement("select");
  conceptSelect.className = "metrics-campaign-field__input";
  conceptSelect.id = "campaign-concept";
  conceptSelect.name = "concept";

  for (const source of sources) {
    const option = document.createElement("option");
    option.value = source.pagePath;
    option.textContent = `${source.title} (${source.pagePath})`;
    conceptSelect.append(option);
  }

  conceptField.append(conceptLabel, conceptSelect);

  const sourceField = createField({
    id: "campaign-utm-source",
    label: "UTM source",
    name: "utm_source",
    placeholder: "twitter",
  });
  const mediumField = createField({
    id: "campaign-utm-medium",
    label: "UTM medium",
    name: "utm_medium",
    placeholder: "social",
  });
  const campaignField = createField({
    id: "campaign-utm-campaign",
    label: "UTM campaign",
    name: "utm_campaign",
    placeholder: "spring-launch",
  });

  const presets = document.createElement("div");
  presets.className = "metrics-campaign-presets";
  presets.setAttribute("role", "group");
  presets.setAttribute("aria-label", "Common UTM source presets");

  const presetsLabel = document.createElement("p");
  presetsLabel.className = "metrics-campaign-presets__label";
  presetsLabel.textContent = "Quick presets";

  const presetButtons = document.createElement("div");
  presetButtons.className = "metrics-campaign-presets__buttons";

  for (const preset of CAMPAIGN_LINK_PRESETS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "metrics-campaign-presets__button";
    button.dataset.presetId = preset.id;
    button.textContent = preset.label;
    presetButtons.append(button);
  }

  presets.append(presetsLabel, presetButtons);

  const preview = document.createElement("div");
  preview.className = "metrics-campaign-preview";

  const previewLabel = document.createElement("p");
  previewLabel.className = "metrics-campaign-preview__label";
  previewLabel.textContent = "Generated URL";

  const previewOutput = document.createElement("output");
  previewOutput.className = "metrics-campaign-preview__url";
  previewOutput.id = "campaign-link-preview";
  previewOutput.setAttribute(
    "for",
    "campaign-concept campaign-utm-source campaign-utm-medium campaign-utm-campaign",
  );
  previewOutput.textContent = buildCampaignLink({
    pagePath: sources[0]?.pagePath ?? "/",
    origin,
  });

  const actions = document.createElement("div");
  actions.className = "metrics-campaign-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "cta-button";
  copyButton.textContent = "Copy link";

  const copyNote = document.createElement("p");
  copyNote.className = "metrics-campaign-copy-note";
  copyNote.hidden = true;

  actions.append(copyButton);
  preview.append(previewLabel, previewOutput, actions, copyNote);

  form.append(
    conceptField,
    sourceField.field,
    mediumField.field,
    campaignField.field,
    presets,
    preview,
  );
  container.append(form);

  const utmInputs = [sourceField.input, mediumField.input, campaignField.input];

  function readUtmFields() {
    return {
      utm_source: sourceField.input.value,
      utm_medium: mediumField.input.value,
      utm_campaign: campaignField.input.value,
    };
  }

  function updatePreview() {
    const url = buildCampaignLink({
      pagePath: conceptSelect.value,
      origin,
      utm: readUtmFields(),
    });
    previewOutput.textContent = url;
    copyNote.hidden = true;
    return url;
  }

  conceptSelect.addEventListener("change", updatePreview);
  for (const input of utmInputs) {
    input.addEventListener("input", updatePreview);
  }

  presetButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset-id]");
    if (!button) {
      return;
    }

    const preset = CAMPAIGN_LINK_PRESETS.find(
      (item) => item.id === button.dataset.presetId,
    );
    if (!preset) {
      return;
    }

    sourceField.input.value = preset.utm_source;
    mediumField.input.value = preset.utm_medium;
    updatePreview();
  });

  copyButton.addEventListener("click", async () => {
    const url = updatePreview();

    try {
      await navigator.clipboard.writeText(url);
      copyNote.hidden = false;
      copyNote.textContent = "Campaign link copied.";
    } catch {
      copyNote.hidden = false;
      copyNote.textContent = url;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}
