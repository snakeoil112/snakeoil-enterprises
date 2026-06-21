export const WAITLIST_ROUTES = {
  radar: {
    id: "product-opportunity-radar",
    path: "/waitlist/product-opportunity-radar",
    slug: "product-opportunity-radar",
    title: "Product Opportunity Radar",
    eyebrow: "Concept validation",
    headline: "Find your next product before competitors do",
    lede: "Snakeoil scores underserved niches across mobile, web, and software — then ships waitlists to prove demand before we build.",
    valueProps: [
      {
        title: "Opportunity scoring",
        description:
          "See demand signals and competition gaps ranked by category before you commit engineering time.",
      },
      {
        title: "Weekly gap alerts",
        description:
          "Get a curated feed of micro-niches where incumbents are generic and buyers still use spreadsheets.",
      },
      {
        title: "Concept velocity",
        description:
          "Spin validation landings in days, not months — the same loop Snakeoil uses internally.",
      },
    ],
    waitlistCta: "Join the research waitlist",
    waitlistNote:
      "Early access to the subscriber research portal. No spam — one update when we launch.",
    storageKey: "snakeoil-waitlist-radar",
  },
  trade: {
    id: "trade-cost-calculator",
    path: "/waitlist/trade-cost-calculator",
    slug: "trade-cost-calculator",
    title: "TradeAI Australia",
    socialBrand: "TradeAI Australia",
    eyebrow: "Australian trades",
    headline: "Quote Aussie trade jobs in under a minute",
    lede: "State-by-state labour rates, job scopes, and materials bundled into instant AUD estimates — built for sole traders tired of undercharging.",
    valueProps: [
      {
        title: "Trade-specific pricing",
        description:
          "Electrician, plumber, carpenter, painter, and more — each with realistic hourly bands for Australian metros.",
      },
      {
        title: "Scope-aware estimates",
        description:
          "From call-out fixes to multi-day projects — labour hours and call-out fees adjust automatically per job size.",
      },
      {
        title: "Quote-ready output",
        description:
          "Copy a customer-ready AUD estimate on the spot — state price tables and PDF export ship with the waitlist launch.",
      },
    ],
    waitlistCta: "Get TradeAI Australia early access",
    waitlistNote:
      "Join the waitlist for state price tables and one-tap quote export.",
    postEstimateCta: {
      eyebrow: "Your estimate is ready",
      title: "Lock in state price tables before launch",
      body: "Early access is open during our live TradeAI Australia promo — join the waitlist to export quotes and stop undercharging on every job.",
      button: "Get TradeAI Australia early access",
    },
    sharePrompt: {
      label: "Spread the word — share TradeAI Australia",
      text: "Quote Aussie trade jobs in under a minute — try TradeAI Australia's free estimator:",
    },
    storageKey: "snakeoil-waitlist-trade-calculator",
  },
  groomer: {
    id: "pet-groomer-crm",
    path: "/waitlist/pet-groomer-crm",
    slug: "pet-groomer-crm",
    title: "GroomRoute CRM",
    eyebrow: "Vertical SaaS",
    headline: "CRM built for mobile pet groomers on the road",
    lede: "Route-aware scheduling, SMS reminders, and deposit collection — without the enterprise bloat tattooed on generic salon software.",
    valueProps: [
      {
        title: "Route-smart calendar",
        description:
          "Stack appointments by neighborhood so drive time stops eating your margin on every van day.",
      },
      {
        title: "Text-first booking",
        description:
          "Replace Instagram DM chaos with templated replies, deposit links, and automatic day-before reminders.",
      },
      {
        title: "Recurring client loops",
        description:
          "Track breed notes, vaccine due dates, and preferred styles so every return visit feels personal.",
      },
    ],
    waitlistCta: "Join the GroomRoute waitlist",
    waitlistNote:
      "Founding groomers get priority onboarding and locked-in launch pricing.",
    storageKey: "snakeoil-waitlist-pet-groomer-crm",
  },
};

export const CONCEPT_PAGES = Object.values(WAITLIST_ROUTES);

export function getConceptPageBySlug(slug) {
  return CONCEPT_PAGES.find((page) => page.slug === slug) ?? CONCEPT_PAGES[0];
}

export function getConceptPageById(id) {
  return CONCEPT_PAGES.find((page) => page.id === id) ?? CONCEPT_PAGES[0];
}
