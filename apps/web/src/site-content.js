export const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "product-radar", label: "Radar" },
  { id: "contact", label: "Contact" },
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

export const PRODUCT_SHOWCASE = [
  {
    id: "pulse-tracker",
    name: "Pulse Tracker",
    category: "Mobile App",
    tagline: "Daily habit loops for niche utility users.",
    status: "In market",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    category: "Website",
    tagline: "Vertical SaaS landing pages with live demos.",
    status: "Beta",
  },
  {
    id: "flowforge",
    name: "FlowForge",
    category: "Software",
    tagline: "Workflow automation for solo operators.",
    status: "Concept",
  },
  {
    id: "signal-boost",
    name: "Signal Boost",
    category: "Promotion",
    tagline: "Social campaigns that ship daily creative.",
    status: "In market",
  },
];

export const CONTACT_CONTENT = {
  eyebrow: "Get in touch",
  title: "Ready to build the next Snakeoil product?",
  lede: "Tell us what you want to launch. Our sales and concepts teams respond within one business day.",
  ctaLabel: "Send message",
  placeholderNote:
    "Form submission is a placeholder — wire up your backend when ready.",
};

export function getSectionById(sections, id) {
  return sections.find((section) => section.id === id) ?? sections[0];
}

export function getProductById(products, id) {
  return products.find((product) => product.id === id) ?? products[0];
}
