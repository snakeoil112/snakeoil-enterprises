import { mountShareButtons } from "./share.js";
import { captureWaitlistSignup } from "./storage.js";

export function mountWaitlistForm({ formId, noteId, page, shareContainerId }) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  const shareContainer = shareContainerId
    ? document.getElementById(shareContainerId)
    : (form?.closest(".waitlist-form") ?? null);

  if (!form || !note) {
    return;
  }

  const share = mountShareButtons({
    container: shareContainer,
    pagePath: page.path,
    shareText: page.sharePrompt?.text ?? page.headline,
    shareLabel: page.sharePrompt?.label,
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      return;
    }

    const result = captureWaitlistSignup({
      storageKey: page.storageKey,
      conceptId: page.id,
      pagePath: page.path,
      email,
      url: globalThis.location.href,
    });

    note.hidden = false;
    note.textContent = result.duplicate
      ? "You're already on the list — we'll email you at launch."
      : "You're on the list. We'll reach out when this concept ships.";

    share.show();
    form.reset();
  });
}

export function renderValueProps(container, valueProps) {
  if (!container) {
    return;
  }

  const list = document.createElement("ul");
  list.className = "value-prop-list";

  for (const prop of valueProps) {
    const item = document.createElement("li");
    item.className = "value-prop";

    const title = document.createElement("h3");
    title.textContent = prop.title;

    const description = document.createElement("p");
    description.textContent = prop.description;

    item.append(title, description);
    list.append(item);
  }

  container.replaceChildren(list);
}
