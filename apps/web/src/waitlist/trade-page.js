import {
  calculateTradeQuote,
  formatCurrency,
  JOB_SCOPES,
  TRADE_ADDONS,
  TRADE_TYPES,
} from "../trade-calculator.js";
import { WAITLIST_ROUTES } from "./concept-pages.js";
import { mountWaitlistForm, renderValueProps } from "./mount-waitlist.js";
import { getWaitlistSocialMeta, mountSocialMeta } from "./social-meta.js";

const page = WAITLIST_ROUTES.trade;

function getSelectedAddonIds(form) {
  return [...form.querySelectorAll('input[name="addon"]:checked')].map(
    (input) => input.value,
  );
}

function renderQuote(form) {
  const tradeId = form.elements.trade.value;
  const scopeId = form.elements.scope.value;
  const addonIds = getSelectedAddonIds(form);
  const quote = calculateTradeQuote({ tradeId, scopeId, addonIds });

  document.getElementById("quote-summary").textContent = quote.summary;
  document.getElementById("quote-total").textContent = formatCurrency(
    quote.total,
  );

  const cta = document.getElementById("calculator-cta");
  const ctaTotal = document.getElementById("calculator-cta-total");
  if (cta) {
    cta.hidden = false;
  }
  if (ctaTotal) {
    ctaTotal.textContent = formatCurrency(quote.total);
  }
}

function mountPostEstimateCta(config) {
  const cta = document.getElementById("calculator-cta");
  const button = document.getElementById("calculator-cta-button");
  if (!cta || !config) {
    return;
  }

  const eyebrow = cta.querySelector(".calculator-cta__eyebrow");
  const title = cta.querySelector(".calculator-cta__title");
  const body = cta.querySelector(".calculator-cta__body");

  if (eyebrow) {
    eyebrow.textContent = config.eyebrow;
  }
  if (title) {
    title.textContent = config.title;
  }
  if (body) {
    body.textContent = config.body;
  }
  if (button) {
    button.textContent = config.button;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("waitlist-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.getElementById("waitlist-form")?.querySelector("input")?.focus();
    });
  }
}

function mountCalculator() {
  const form = document.getElementById("calculator-form");
  if (!form) {
    return;
  }

  form.addEventListener("change", () => renderQuote(form));
  form.addEventListener("input", () => renderQuote(form));
  renderQuote(form);
}

mountSocialMeta(getWaitlistSocialMeta(page, globalThis.location?.origin).tags);

renderValueProps(document.getElementById("value-props"), page.valueProps);
mountPostEstimateCta(page.postEstimateCta);
mountCalculator();
mountWaitlistForm({
  formId: "waitlist-form",
  noteId: "waitlist-note",
  shareContainerId: "waitlist-share-root",
  page,
});

export { JOB_SCOPES, TRADE_ADDONS, TRADE_TYPES };
