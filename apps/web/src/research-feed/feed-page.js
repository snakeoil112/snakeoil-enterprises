import {
  buildOpportunityCard,
  RESEARCH_OPPORTUNITIES,
} from "../research-feed.js";
import {
  isResearchFeedUnlocked,
  unlockResearchFeed,
} from "../subscriber-access.js";
import { mountShareButtons } from "../waitlist/share.js";
import {
  getResearchFeedSocialMeta,
  mountSocialMeta,
  RESEARCH_FEED_SOCIAL,
} from "../waitlist/social-meta.js";

const gateSection = document.getElementById("research-feed-gate");
const contentSection = document.getElementById("research-feed-content");
const feedGrid = document.getElementById("research-feed-grid");
const unlockForm = document.getElementById("unlock-form");
const unlockNote = document.getElementById("unlock-note");

function renderOpportunityCard(opportunity) {
  const card = buildOpportunityCard(opportunity);
  const article = document.createElement("article");
  article.className = "research-feed-card";
  article.dataset.opportunityId = opportunity.id;

  const category = document.createElement("p");
  category.className = "research-feed-card__category";
  category.textContent = card.categoryLabel;

  const title = document.createElement("h3");
  title.textContent = card.title;

  const scoreRow = document.createElement("div");
  scoreRow.className = "research-feed-card__scores";

  const score = document.createElement("p");
  score.className = "research-feed-card__score";
  score.textContent = card.score;

  const competition = document.createElement("p");
  competition.className = "research-feed-card__competition";
  competition.textContent = card.competition;

  const scoresLabel = document.createElement("p");
  scoresLabel.className = "research-feed-card__rgf";
  scoresLabel.textContent = card.scoresLabel;

  scoreRow.append(score, competition, scoresLabel);

  const meter = document.createElement("div");
  meter.className = "radar-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", "100");
  meter.setAttribute("aria-label", `${card.title} opportunity score`);

  const meterFill = document.createElement("div");
  meterFill.className = "radar-meter__fill";
  meterFill.style.width = `${opportunity.opportunity}%`;
  meterFill.setAttribute("aria-valuenow", String(opportunity.opportunity));
  meter.append(meterFill);

  const insight = document.createElement("p");
  insight.className = "research-feed-card__insight";
  insight.textContent = card.insight;

  article.append(category, title, scoreRow, meter, insight);
  return article;
}

function renderFeed() {
  if (!feedGrid) {
    return;
  }

  feedGrid.replaceChildren(
    ...RESEARCH_OPPORTUNITIES.map((opportunity) =>
      renderOpportunityCard(opportunity),
    ),
  );
}

function showUnlockedView() {
  gateSection?.setAttribute("hidden", "");
  contentSection?.removeAttribute("hidden");
  renderFeed();
}

function showGateView() {
  gateSection?.removeAttribute("hidden");
  contentSection?.setAttribute("hidden", "");
}

mountSocialMeta(getResearchFeedSocialMeta(globalThis.location?.origin).tags);

const share = mountShareButtons({
  container: unlockForm?.closest(".research-feed-form") ?? unlockForm,
  pagePath: RESEARCH_FEED_SOCIAL.path,
  shareText: RESEARCH_FEED_SOCIAL.shareText,
});

function mountUnlockForm() {
  if (!unlockForm || !unlockNote) {
    return;
  }

  unlockForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(unlockForm);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      return;
    }

    const result = unlockResearchFeed({
      email,
      url: globalThis.location.href,
    });

    unlockNote.hidden = false;
    unlockNote.textContent = result.duplicate
      ? "You're already subscribed — loading your feed."
      : "Unlocked. Loading your research feed.";

    share.show();
    unlockForm.reset();
    showUnlockedView();
  });
}

if (isResearchFeedUnlocked()) {
  showUnlockedView();
} else {
  showGateView();
}

mountUnlockForm();
