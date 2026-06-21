import { buildCampaignLink } from "../metrics/campaign-links.js";

export const WAITLIST_TRADE_PATH = "/waitlist/trade-cost-calculator";

export const WAITLIST_DISCLAIMER =
  "Waitlist validation only — early access, not a live trading or financial product.";

const SOCIAL_LANDING_UTM_CONTENT = "social-landing";

/** @typedef {{ title: string; description: string }} ValueProp */
/** @typedef {{ utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string }} SocialCtaUtm */

/**
 * @typedef {Object} SocialPlatformPage
 * @property {string} id
 * @property {string} slug
 * @property {string} path
 * @property {string} eyebrow
 * @property {string} headline
 * @property {string} lede
 * @property {ValueProp[]} valueProps
 * @property {string} ctaLabel
 * @property {SocialCtaUtm} ctaUtm
 * @property {string} ogTitle
 * @property {string} ogDescription
 * @property {string} [affiliationNote]
 */

/** @type {SocialPlatformPage[]} */
export const SOCIAL_PLATFORM_PAGES = [
  {
    id: "youtube",
    slug: "youtube",
    path: "/social/youtube",
    eyebrow: "From YouTube",
    headline: "Quote trade jobs in under 60 seconds",
    lede: "Aussie trade operators: stop undercharging. TradeAI Australia bundles regional pricing, service tiers, and add-ons into instant estimates you can send on the spot.",
    valueProps: [
      {
        title: "60-second demo",
        description: "See vehicle-aware pricing in action.",
      },
      {
        title: "Waitlist early access",
        description: "Regional price tables + PDF export at launch.",
      },
      {
        title: "Built for tradies",
        description: "Electrician, plumber, carpenter, painter, and more.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "youtube",
      utm_medium: "social",
      utm_campaign: "tradeai-au-launch",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle:
      "TradeAI Australia — Quote trade jobs in under 60 seconds | Waitlist",
    ogDescription:
      "Aussie trade operators: stop undercharging. Instant AUD estimates with vehicle-aware pricing and add-on upsells. Waitlist validation only.",
  },
  {
    id: "twitter",
    slug: "twitter",
    path: "/social/twitter",
    eyebrow: "From X",
    headline: "Know your true trade cost before you click buy",
    lede: "How many jobs did you underquote last month? TradeAI Australia turns vehicle type + add-ons into a customer-ready estimate in under a minute.",
    valueProps: [
      {
        title: "Stop spreadsheet quoting",
        description: "One flow for labour, scope, and add-ons.",
      },
      {
        title: "Sedan / SUV / truck pricing",
        description: "Vehicle-aware from day one.",
      },
      {
        title: "Early access waitlist",
        description: "Regional tables ship with launch.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "twitter",
      utm_medium: "social",
      utm_campaign: "tradeai-au-launch",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle: "TradeAI Australia — Aussie tradie quote calculator (waitlist)",
    ogDescription:
      "Instant trade job estimates for Australian operators. Waitlist open — not live yet.",
  },
  {
    id: "instagram",
    slug: "instagram",
    path: "/social/instagram",
    eyebrow: "From Instagram",
    headline: "Stop guessing your margins on every quote",
    lede: "TradeAI Australia = instant estimates for Aussie trade operators. Vehicle-aware pricing, add-on upsells, quote-ready output.",
    valueProps: [
      {
        title: "Link in bio ready",
        description: "One tap to the MVP calculator.",
      },
      {
        title: "Reel-friendly hook",
        description: '"Underquoting again?"',
      },
      {
        title: "Early access",
        description: "Join before regional tables ship.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "tradeai-au-launch",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle: "TradeAI Australia — Link in bio | Waitlist",
    ogDescription:
      "Instant trade estimates for Aussie operators. Waitlist validation only — not a live app yet.",
  },
  {
    id: "linkedin",
    slug: "linkedin",
    path: "/social/linkedin",
    eyebrow: "From LinkedIn",
    headline: "The hidden cost of manual quoting",
    lede: "If you run a trade business in Australia, spreadsheets break and generic SaaS is bloated. TradeAI Australia is built for solo operators and small crews who quote daily.",
    valueProps: [
      {
        title: "B2B operator focus",
        description: "Vehicle-aware pricing for real job scopes.",
      },
      {
        title: "Add-on upsells in one flow",
        description: "Ceramic, pet hair, steam, and more.",
      },
      {
        title: "Founding operator access",
        description: "Regional price tables + PDF export for waitlist signups.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "tradeai-au-b2b",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle:
      "TradeAI Australia — Trade cost calculator for AU operators (waitlist)",
    ogDescription:
      "Concept validation waitlist for a trade-specific cost calculator. Not financial advice. Not a live trading platform.",
  },
  {
    id: "tiktok",
    slug: "tiktok",
    path: "/social/tiktok",
    eyebrow: "From TikTok",
    headline: "POV: you finally stopped undercharging",
    lede: "TradeAI Australia — quote trade jobs in under 60 sec. Built for Aussie operators who are done rebuilding quotes in Notes.",
    valueProps: [
      {
        title: "60-second quote demo",
        description: "Try the MVP on the waitlist page.",
      },
      {
        title: "Vehicle + add-on pricing",
        description: "One flow, customer-ready output.",
      },
      {
        title: "Early access",
        description: "Waitlist open now.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "tiktok",
      utm_medium: "social",
      utm_campaign: "tradeai-au-launch",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle: "TradeAI Australia — 60-sec trade quote calculator (waitlist)",
    ogDescription:
      "Aussie tradie quote tool — waitlist validation only. Not live yet.",
  },
  {
    id: "facebook",
    slug: "facebook",
    path: "/social/facebook",
    eyebrow: "From Facebook",
    headline: "Calling Aussie trade operators",
    lede: "Tired of rebuilding quotes by hand? TradeAI Australia bundles regional pricing, service tiers, and add-ons into instant estimates — built for solo operators who are done undercharging.",
    valueProps: [
      {
        title: "Try the MVP calculator",
        description: "Free estimator on the waitlist page.",
      },
      {
        title: "Early access perks",
        description: "Regional tables + PDF export at launch.",
      },
      {
        title: "Snakeoil validation",
        description: "Demand testing before full ship.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "facebook",
      utm_medium: "social",
      utm_campaign: "tradeai-au-launch",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle: "TradeAI Australia — Aussie trade quote calculator (waitlist)",
    ogDescription:
      "Instant trade job estimates for Australian small businesses. Waitlist only — not a live product yet.",
  },
  {
    id: "reddit",
    slug: "reddit",
    path: "/social/reddit",
    eyebrow: "From Reddit",
    headline: "Built a trade job quote calculator for AU operators",
    lede: "We're validating TradeAI Australia — a trade-specific cost calculator for Aussie operators who quote jobs manually. MVP live on the waitlist page; full launch adds regional tables + one-tap export.",
    valueProps: [
      {
        title: "Vehicle-aware pricing",
        description: "Sedan / SUV / truck bands.",
      },
      {
        title: "Add-on line items",
        description: "Ceramic, pet hair, steam clean.",
      },
      {
        title: "Transparent validation",
        description: "Concept testing, not a shipped product.",
      },
    ],
    ctaLabel: "Join the waitlist",
    ctaUtm: {
      utm_source: "reddit",
      utm_medium: "social",
      utm_campaign: "tradeai-au-reddit",
      utm_content: SOCIAL_LANDING_UTM_CONTENT,
    },
    ogTitle:
      "TradeAI Australia — AU trade quote calculator (waitlist validation)",
    ogDescription:
      "Trade-specific cost calculator for Aussie operators. Not financial advice. Not a brokerage or trading platform.",
    affiliationNote: "Disclosure: Affiliated with Snakeoil Enterprises.",
  },
];

export function getSocialPlatformPage(slug) {
  return (
    SOCIAL_PLATFORM_PAGES.find((page) => page.slug === slug) ??
    SOCIAL_PLATFORM_PAGES[0]
  );
}

export function getSocialPlatformCtaHref(page, origin = "") {
  return buildCampaignLink({
    pagePath: WAITLIST_TRADE_PATH,
    origin,
    utm: page.ctaUtm,
  });
}

export function getSocialPlatformLiveUrl(page, origin) {
  return origin ? new URL(`${page.path}/`, origin).toString() : `${page.path}/`;
}
