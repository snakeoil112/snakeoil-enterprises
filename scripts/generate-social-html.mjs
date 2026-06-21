import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SOCIAL_PLATFORM_PAGES } from "../apps/web/src/social/platform-pages.js";
import { PLACEHOLDER_OG_IMAGE } from "../apps/web/src/waitlist/social-meta.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

for (const page of SOCIAL_PLATFORM_PAGES) {
  const dir = resolve(root, "apps/web/social", page.slug);
  mkdirSync(dir, { recursive: true });

  const html = `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(page.ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="TradeAI Australia" />
    <meta property="og:title" content="${escapeHtml(page.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(page.ogDescription)}" />
    <meta property="og:image" content="${PLACEHOLDER_OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(page.ogDescription)}" />
    <meta name="twitter:image" content="${PLACEHOLDER_OG_IMAGE}" />
    <title>${escapeHtml(page.ogTitle)}</title>
    <link rel="stylesheet" href="/src/style.css" />
    <link rel="stylesheet" href="/src/waitlist/waitlist.css" />
  </head>
  <body data-platform="${page.slug}">
    <header class="site-header">
      <a class="site-brand" href="../../index.html">Snakeoil Enterprises</a>
      <nav class="site-nav" aria-label="TradeAI links">
        <a class="site-nav__link" href="../../waitlist/trade-cost-calculator/">TradeAI waitlist</a>
      </nav>
    </header>

    <main class="shell waitlist-shell">
      <section class="waitlist-hero">
        <a class="waitlist-back" href="../../index.html">← Back to Snakeoil home</a>
        <p class="eyebrow" id="social-eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1 id="social-headline">${escapeHtml(page.headline)}</h1>
        <p class="lede" id="social-lede">${escapeHtml(page.lede)}</p>
      </section>

      <section class="waitlist-card" aria-labelledby="value-title">
        <p class="eyebrow">Why TradeAI Australia</p>
        <h2 id="value-title">Value proposition</h2>
        <div id="value-props"></div>
      </section>

      <section class="waitlist-card" aria-labelledby="cta-title">
        <p class="eyebrow">Early access</p>
        <h2 id="cta-title">${escapeHtml(page.ctaLabel)}</h2>
        <p class="waitlist-form__hint" id="social-disclaimer"></p>
        <a class="cta-button" id="social-cta" href="../../waitlist/trade-cost-calculator/">${escapeHtml(page.ctaLabel)}</a>
        <p class="waitlist-form__note" id="social-affiliation" hidden></p>
      </section>
    </main>
    <script type="module" src="/src/social/social-page.js"></script>
  </body>
</html>
`;

  writeFileSync(resolve(dir, "index.html"), html);
  console.log(`Wrote social/${page.slug}/index.html`);
}
