import { WAITLIST_ROUTES } from "./concept-pages.js";
import { mountWaitlistForm, renderValueProps } from "./mount-waitlist.js";
import { getWaitlistSocialMeta, mountSocialMeta } from "./social-meta.js";

const page = WAITLIST_ROUTES.groomer;

const TEASER_FEATURES = [
  {
    title: "Van-day route builder",
    description:
      "Cluster clients by zip code and surface open slots between drives.",
  },
  {
    title: "Deposit + reschedule links",
    description:
      "Send one text with payment and calendar options — no app download required.",
  },
  {
    title: "Client pet profiles",
    description:
      "Breed, temperament notes, and photo history travel with every appointment.",
  },
];

function renderTeaserFeatures() {
  const container = document.getElementById("feature-teaser");
  if (!container) {
    return;
  }

  const list = document.createElement("div");
  list.className = "feature-teaser";

  for (const feature of TEASER_FEATURES) {
    const item = document.createElement("div");
    item.className = "feature-teaser__item";

    const title = document.createElement("strong");
    title.textContent = feature.title;

    const description = document.createElement("span");
    description.textContent = feature.description;

    item.append(title, description);
    list.append(item);
  }

  container.replaceChildren(list);
}

mountSocialMeta(getWaitlistSocialMeta(page, globalThis.location?.origin).tags);

renderValueProps(document.getElementById("value-props"), page.valueProps);
renderTeaserFeatures();
mountWaitlistForm({
  formId: "waitlist-form",
  noteId: "waitlist-note",
  page,
});

export { TEASER_FEATURES };
