export const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "products", label: "Products" },
  { id: "product-radar", label: "Radar" },
  { id: "contact", label: "Contact" },
];

export const HERO_CONTENT = {
  eyebrow: "Snakeoil Enterprises",
  title: "Build. Ship. Sell.",
  lede: "Mobile apps, websites, and software — researched, promoted, and sold by a team that gets the job done.",
  primaryCta: "Explore live products",
  secondaryCta: "Meet the founder",
};

export const COMPANY_STATS = [
  { id: "concepts", value: "3+", label: "New concepts weekly" },
  { id: "channels", value: "Daily", label: "Social promotion" },
  { id: "response", value: "24h", label: "Sales follow-up" },
  { id: "markets", value: "Global", label: "Market research" },
];

export const ABOUT_CONTENT = {
  eyebrow: "Our story",
  title: "Built by The Snake, shipped for the masses",
  lede: "Snakeoil Enterprises turns bold product ideas into mobile apps, websites, and software that customers actually use.",
  story: [
    'Founded by Benny "The Snake" Sorensen, we combine relentless sales, daily promotion, and deep market research to find gaps competitors ignore.',
    "Our concepts team prototypes new opportunities every few days. Engineering ships fast. Marketing makes sure the world hears about it.",
  ],
};

export const FOUNDER_CONTENT = {
  eyebrow: "Founder",
  name: 'Benny "The Snake" Sorensen',
  role: "Founder & Owner",
  portraitSrc: "/founder-portrait.svg",
  portraitAlt:
    'Stylized portrait of Benny "The Snake" Sorensen, founder of Snakeoil Enterprises',
  quote:
    "We don't wait for permission to ship. We research the gap, build the proof, promote it daily, and sell until the market listens.",
  highlights: [
    "Product builder across mobile, web, and software",
    "Leads concepts, sales, and go-to-market velocity",
    "Obsessed with underserved niches and fast validation",
  ],
};

/** Disabled until board approves v3 demo on SNAAA-43. */
export const FOUNDER_VIDEO = {
  enabled: false,
  src: "/founder-reel.mp4",
  posterSrc: "/founder-reel-poster.jpg",
  variant: "likeness",
  social: {
    linkedin16x9: "/social/founder-reel-linkedin-16x9.mp4",
    reels9x16: "/social/founder-reel-reels-9x16.mp4",
  },
};

export const SERVICES_CONTENT = {
  eyebrow: "What we do",
  title: "Full-stack go-to-market for digital products",
  lede: "From opportunity research to daily promotion — Snakeoil runs the loop that turns concepts into revenue.",
  services: [
    {
      id: "research",
      title: "Market research",
      description:
        "Deep scans for underserved niches, competition gaps, and demand signals before a single line of code ships.",
      icon: "🔍",
    },
    {
      id: "concepts",
      title: "Concept velocity",
      description:
        "New mobile, web, and software ideas every few days — each validated with waitlists and real buyer intent.",
      icon: "⚡",
    },
    {
      id: "engineering",
      title: "Product engineering",
      description:
        "Fast, polished builds across apps, sites, and tools — engineered to convert and ready for scale.",
      icon: "🛠️",
    },
    {
      id: "marketing",
      title: "Marketing & brand",
      description:
        "Positioning, landing pages, and campaign creative that make Snakeoil products impossible to ignore.",
      icon: "📣",
    },
    {
      id: "promotion",
      title: "Daily promotion",
      description:
        "Relentless social presence and content cadence — we reach the masses and keep the brand top of feed.",
      icon: "📱",
    },
    {
      id: "sales",
      title: "Sales execution",
      description:
        "Outbound, partnerships, and conversion optimization — our sales team doesn't stop until the job is done.",
      icon: "🎯",
    },
  ],
};

export const TEAM_PILLARS = [
  {
    id: "concepts-team",
    title: "Concepts",
    description: "Spins high-demand product ideas on a weekly cadence.",
  },
  {
    id: "engineering-team",
    title: "Engineering",
    description: "Ships polished apps, sites, and software at startup speed.",
  },
  {
    id: "marketing-team",
    title: "Marketing",
    description: "One of the strongest go-to-market teams in the game.",
  },
  {
    id: "promotion-team",
    title: "Promotion",
    description: "Daily social content that builds a household name.",
  },
  {
    id: "sales-team",
    title: "Sales",
    description: "Relentless pursuit — we close and we follow up.",
  },
];

export const PRODUCT_SHOWCASE = [
  {
    id: "trade-cost-calculator",
    name: "TradeAI Australia",
    category: "Software",
    tagline: "Quote Aussie trade jobs in under a minute.",
    status: "Live campaign",
    href: "/waitlist/trade-cost-calculator/",
    cta: "Try the estimator",
  },
  {
    id: "product-opportunity-radar",
    name: "Product Opportunity Radar",
    category: "Research",
    tagline: "Score niches before competitors catch on.",
    status: "Waitlist open",
    href: "/waitlist/product-opportunity-radar/",
    cta: "Join waitlist",
  },
  {
    id: "pet-groomer-crm",
    name: "GroomRoute CRM",
    category: "Vertical SaaS",
    tagline: "CRM built for mobile pet groomers on the road.",
    status: "Waitlist open",
    href: "/waitlist/pet-groomer-crm/",
    cta: "Join waitlist",
  },
  {
    id: "signal-boost",
    name: "Signal Boost",
    category: "Promotion",
    tagline: "Social campaigns that ship daily creative.",
    status: "In market",
    href: "#contact",
    cta: "Book a campaign",
  },
];

export const SOCIAL_CONTENT = {
  eyebrow: "Stay in the loop",
  title: "Daily content. Real momentum.",
  lede: "Follow Snakeoil for product drops, market gaps, and behind-the-scenes builds from The Snake's team.",
  links: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/snakeoil-enterprises",
    },
    { id: "x", label: "X / Twitter", href: "https://x.com/snakeoilhq" },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/snakeoilenterprises",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/@snakeoilenterprises",
    },
  ],
};

export const CONTACT_CONTENT = {
  eyebrow: "Get in touch",
  title: "Ready to build the next Snakeoil product?",
  lede: "Tell us what you want to launch. Our sales and concepts teams respond within one business day.",
  ctaLabel: "Send message",
  placeholderNote:
    "Form submission is a placeholder — wire up your backend when ready.",
};

export const FOOTER_CONTENT = {
  tagline: "Snakeoil Enterprises — we get the job done.",
  links: [
    { label: "Research feed", href: "/research-feed/" },
    { label: "Waitlist metrics", href: "/metrics/" },
  ],
};

export function getSectionById(sections, id) {
  return sections.find((section) => section.id === id) ?? sections[0];
}

export function getProductById(products, id) {
  return products.find((product) => product.id === id) ?? products[0];
}
