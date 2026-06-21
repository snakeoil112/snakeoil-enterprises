# @snakeoil/web

First runnable web application in the Snakeoil Enterprises monorepo. This is a Vite-powered shell for future marketing pages, product demos, and customer-facing experiences.

## Local start

From the repository root:

```bash
npm install
npm run start:web
```

Or from this package:

```bash
npm install
npm start
```

The dev server starts at [http://localhost:5173](http://localhost:5173) by default.

## Production deploy

GitHub Pages deploys run automatically on push to `main` (see [`.github/workflows/deploy-web.yml`](../../.github/workflows/deploy-web.yml)).

| Item | Value |
|------|-------|
| Deploy trigger | Push to `main` |
| Published artifact | `apps/web/dist` |
| Public URL | [https://snakeoil112.github.io/snakeoil-enterprises/](https://snakeoil112.github.io/snakeoil-enterprises/) |

Enable **Settings → Pages → Source: GitHub Actions** in the repository before the first deploy.

To preview the GitHub Pages build locally:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Vite dev server |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Build static assets to `dist/` |
| `npm run preview` | Preview the production build locally |

## Concept waitlist routes

Three concept validation landings ship as a Vite multi-page app. Each page includes a hero, value proposition, email capture (stored in `localStorage` for MVP), and UTM parameter capture from the query string.

| Route | Concept | Highlights |
|-------|---------|------------|
| `/waitlist/product-opportunity-radar` | Product Opportunity Radar | Extends the product radar demo with a research waitlist |
| `/waitlist/trade-cost-calculator` | Mobile detailing cost calculator | Interactive MVP quote calculator + waitlist |
| `/waitlist/pet-groomer-crm` | GroomRoute CRM | Vertical CRM teaser for mobile pet groomers |

Example campaign URL:

```text
/waitlist/trade-cost-calculator?utm_source=instagram&utm_medium=social&utm_campaign=detailing-mvp
```

Local URLs (dev server):

- [http://localhost:5173/waitlist/product-opportunity-radar/](http://localhost:5173/waitlist/product-opportunity-radar/)
- [http://localhost:5173/waitlist/trade-cost-calculator/](http://localhost:5173/waitlist/trade-cost-calculator/)
- [http://localhost:5173/waitlist/pet-groomer-crm/](http://localhost:5173/waitlist/pet-groomer-crm/)

Waitlist logic lives in `src/waitlist/`; trade calculator helpers live in `src/trade-calculator.js`.

### Social sharing

Each waitlist page and `/research-feed` ship Open Graph + Twitter Card meta tags (concept-specific title, description, and a placeholder SVG `og:image`). After a successful email signup or research-feed unlock, share controls appear:

| Action | UTM source | Notes |
|--------|------------|-------|
| Share on X | `twitter` | Opens Twitter intent with pre-filled headline |
| Copy link | `copy` | Copies URL with `utm_medium=social` and `utm_campaign=waitlist-share` |

Example share URL:

```text
/waitlist/pet-groomer-crm?utm_source=copy&utm_medium=social&utm_campaign=waitlist-share
```

Helpers live in `src/waitlist/social-meta.js` and `src/waitlist/share.js`; UTM composition reuses `src/waitlist/utm.js`.

## Waitlist metrics dashboard

Internal dashboard for tracking concept validation progress toward the **50-signup target** ([SNAAA-20](https://paperclip.ing/SNAAA/issues/SNAAA-20)).

| Route | Access | Highlights |
|-------|--------|------------|
| `/metrics` | Footer link on home page | Per-concept signup counts, UTM source breakdown, campaign link generator, JSON/CSV export |

Data sources (browser `localStorage` MVP):

- Concept waitlists: `snakeoil-waitlist-radar`, `snakeoil-waitlist-trade-calculator`, `snakeoil-waitlist-pet-groomer-crm`
- Research feed unlocks: `snakeoil-research-subscriber`

Local URL (dev server):

- [http://localhost:5173/metrics/](http://localhost:5173/metrics/)

Aggregation and export helpers live in `src/waitlist/metrics.js`; the page bootstrap is `src/metrics/metrics-page.js`.

### Campaign link generator

The **Campaign links** section on `/metrics` lets the promotion team build tracked URLs for any concept waitlist or the research feed:

1. Pick a page from the concept dropdown.
2. Enter `utm_source`, `utm_medium`, and `utm_campaign` — or use quick presets for `twitter`, `instagram`, `reddit`, and `newsletter`.
3. Preview the generated URL and click **Copy link**.

Example output:

```text
https://snakeoil.example/waitlist/trade-cost-calculator?utm_source=twitter&utm_medium=social&utm_campaign=detailing-mvp
```

URL composition reuses `src/waitlist/utm.js`; the generator UI and helpers live in `src/metrics/campaign-links.js`.

## Subscriber research feed

The product radar demo links to a gated **subscriber research feed** that surfaces curated opportunity cards from Snakeoil's deep market research ([SNAAA-15](https://paperclip.ing/SNAAA/issues/SNAAA-15)).

| Route | Access | Highlights |
|-------|--------|------------|
| `/research-feed` | Email unlock (localStorage MVP) | 7 seeded opportunity cards across website, software, and mobile categories |

Unlock flow:

1. Click **Unlock subscriber research feed** on the home page radar section (UTM-tagged).
2. Enter an email on `/research-feed` to unlock the feed.
3. View scored opportunity cards with R/G/F ratings and competition labels.

Example campaign URL from home radar:

```text
/research-feed/?utm_source=home&utm_medium=radar&utm_campaign=research-feed
```

Local URL (dev server):

- [http://localhost:5173/research-feed/](http://localhost:5173/research-feed/)

Feed data and gating logic live in `src/research-feed.js` and `src/subscriber-access.js`.

## Marketing sections

The landing page includes a sticky nav and four primary sections:

| Section | Anchor | Content |
|---------|--------|---------|
| About | `#about` | Company story and Snakeoil mission |
| Products | `#products` | Showcase grid of live and concept products |
| Product radar | `#product-radar` | Interactive opportunity demo + link to subscriber feed |
| Contact | `#contact` | CTA form placeholder (no backend yet) |

Section copy and nav metadata live in `src/site-content.js` for testability.

## First user-visible feature: Product radar

The landing page ships with a hero CTA and an interactive **Product radar** demo.

1. Start the app with `npm run start:web` (or `npm start` in this package).
2. Click **Explore product radar** in the hero to scroll to the demo.
3. Switch between **Mobile Apps**, **Websites**, and **Software** to update the opportunity score, competition label, and insight text.

Logic lives in `src/product-radar.js`; `src/main.js` wires the CTA, tabs, and animated meter.

## Structure

```
apps/web/
├── index.html                              # Marketing home
├── research-feed/index.html                # Subscriber research feed
├── metrics/index.html                      # Internal waitlist metrics dashboard
├── waitlist/
│   ├── product-opportunity-radar/index.html
│   ├── trade-cost-calculator/index.html
│   └── pet-groomer-crm/index.html
├── src/
│   ├── main.js                             # Home bootstrap
│   ├── product-radar.js                    # Radar demo helpers
│   ├── research-feed.js                    # Seeded opportunity cards
│   ├── subscriber-access.js                # Email unlock gating
│   ├── research-feed.css                   # Feed + radar CTA styles
│   ├── research-feed/feed-page.js          # Feed page bootstrap
│   ├── metrics/metrics-page.js             # Metrics dashboard bootstrap
│   ├── metrics.css                         # Metrics dashboard styles
│   ├── trade-calculator.js                 # Detailing quote logic
│   ├── waitlist/
│   │   ├── concept-pages.js                # Page copy + routes
│   │   ├── metrics.js                      # Aggregation + export helpers
│   │   ├── storage.js                      # localStorage signups
│   │   ├── utm.js                          # UTM capture + URL builder
│   │   ├── social-meta.js                  # OG/Twitter meta tag helpers
│   │   ├── share.js                        # Share buttons + intent URLs
│   │   └── *.js                            # Per-page entry scripts
│   └── style.css                           # Base styles
├── vite.config.js                          # MPA build inputs
└── package.json
```