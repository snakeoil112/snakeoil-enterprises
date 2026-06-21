import {
  buildRadarSummary,
  getCategoryById,
  PRODUCT_CATEGORIES,
} from "./product-radar.js";

const environment = import.meta.env.DEV ? "development" : "production";

document.getElementById("environment").textContent = environment;
document.getElementById("started-at").textContent = new Date().toLocaleString();

const radarRoot = document.getElementById("product-radar");
const radarHeadline = document.getElementById("radar-headline");
const radarScore = document.getElementById("radar-score");
const radarCompetition = document.getElementById("radar-competition");
const radarInsight = document.getElementById("radar-insight");
const radarMeter = document.getElementById("radar-meter");
const ctaButton = document.getElementById("explore-cta");

let activeCategoryId = PRODUCT_CATEGORIES[0].id;

function renderRadar(categoryId) {
  const category = getCategoryById(PRODUCT_CATEGORIES, categoryId);
  const summary = buildRadarSummary(category);

  radarHeadline.textContent = summary.headline;
  radarScore.textContent = summary.score;
  radarCompetition.textContent = summary.competition;
  radarInsight.textContent = summary.insight;
  radarMeter.style.width = `${category.opportunity}%`;
  radarMeter.setAttribute("aria-valuenow", String(category.opportunity));

  for (const button of radarRoot.querySelectorAll("[data-category-id]")) {
    const isActive = button.dataset.categoryId === categoryId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function mountProductRadar() {
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

  radarRoot.prepend(buttonGroup);
  renderRadar(activeCategoryId);
}

function mountSmoothNav() {
  for (const link of document.querySelectorAll('.site-nav__link[href^="#"]')) {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href")?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function mountContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("contact-note");
  if (!form || !note) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.hidden = false;
    form.reset();
  });
}

ctaButton?.addEventListener("click", () => {
  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

mountSmoothNav();
mountContactForm();
mountProductRadar();
