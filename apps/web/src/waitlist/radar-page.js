import {
  buildRadarSummary,
  getCategoryById,
  PRODUCT_CATEGORIES,
} from "../product-radar.js";
import { WAITLIST_ROUTES } from "./concept-pages.js";
import { mountWaitlistForm, renderValueProps } from "./mount-waitlist.js";
import { getWaitlistSocialMeta, mountSocialMeta } from "./social-meta.js";

const page = WAITLIST_ROUTES.radar;

let activeCategoryId = PRODUCT_CATEGORIES[0].id;

function renderRadar(categoryId) {
  const category = getCategoryById(PRODUCT_CATEGORIES, categoryId);
  const summary = buildRadarSummary(category);

  document.getElementById("radar-headline").textContent = summary.headline;
  document.getElementById("radar-score").textContent = summary.score;
  document.getElementById("radar-competition").textContent =
    summary.competition;
  document.getElementById("radar-insight").textContent = summary.insight;

  const meter = document.getElementById("radar-meter");
  meter.style.width = `${category.opportunity}%`;
  meter.setAttribute("aria-valuenow", String(category.opportunity));

  for (const button of document.querySelectorAll("[data-category-id]")) {
    const isActive = button.dataset.categoryId === categoryId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function mountRadarTabs() {
  const root = document.getElementById("product-radar-demo");
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "radar-tabs";
  buttonGroup.setAttribute("role", "group");
  buttonGroup.setAttribute("aria-label", "Product categories");

  for (const category of PRODUCT_CATEGORIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "radar-tab";
    button.dataset.categoryId = category.id;
    button.textContent = category.label;
    button.addEventListener("click", () => {
      activeCategoryId = category.id;
      renderRadar(activeCategoryId);
    });
    buttonGroup.append(button);
  }

  root.prepend(buttonGroup);
  renderRadar(activeCategoryId);
}

mountSocialMeta(getWaitlistSocialMeta(page, globalThis.location?.origin).tags);

renderValueProps(document.getElementById("value-props"), page.valueProps);
mountRadarTabs();
mountWaitlistForm({
  formId: "waitlist-form",
  noteId: "waitlist-note",
  page,
});
