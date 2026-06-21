import {
  formatOpportunityScore,
  getCompetitionLabel,
} from "./product-radar.js";

export const RESEARCH_OPPORTUNITIES = [
  {
    id: "trade-cost-calculator",
    title: "Trade-specific cost calculator",
    category: "website",
    categoryLabel: "Website",
    opportunity: 88,
    competition: "low",
    insight:
      "Regional pricing and instant quote CTAs for solo operators in mobile detailing, epoxy floors, and fence install.",
    scores: { revenue: 4, gap: 5, fit: 5 },
  },
  {
    id: "product-opportunity-radar",
    title: "Product Opportunity Radar SaaS",
    category: "software",
    categoryLabel: "Software",
    opportunity: 95,
    competition: "low",
    insight:
      "Extend Snakeoil's internal radar into a subscriber research feed with weekly gap alerts.",
    scores: { revenue: 5, gap: 5, fit: 5 },
  },
  {
    id: "pet-groomer-crm",
    title: "CRM for mobile pet groomers",
    category: "software",
    categoryLabel: "Software",
    opportunity: 90,
    competition: "low",
    insight:
      "Route-aware scheduling and SMS-first booking replace Instagram DM chaos for van operators.",
    scores: { revenue: 5, gap: 5, fit: 4 },
  },
  {
    id: "food-truck-compliance",
    title: "Compliance checklist for food trucks",
    category: "website",
    categoryLabel: "Website",
    opportunity: 82,
    competition: "medium",
    insight:
      "Interactive permit and inspection checklists beat unusable government PDFs for mobile vendors.",
    scores: { revenue: 4, gap: 5, fit: 4 },
  },
  {
    id: "tattoo-booking",
    title: "Tattoo artist booking + deposits",
    category: "software",
    categoryLabel: "Software",
    opportunity: 85,
    competition: "low",
    insight:
      "Deposit collection and design approval in one flow — Instagram DMs still dominate booking.",
    scores: { revenue: 4, gap: 5, fit: 4 },
  },
  {
    id: "realtor-content-repurpose",
    title: "AI content repurposing for realtors",
    category: "software",
    categoryLabel: "Software",
    opportunity: 87,
    competition: "medium",
    insight:
      "Blog-to-short-video presets tuned for listing tours and market updates, not generic creators.",
    scores: { revenue: 5, gap: 3, fit: 4 },
  },
  {
    id: "voice-journal-mood",
    title: "AI voice journal with mood tagging",
    category: "mobile",
    categoryLabel: "Mobile App",
    opportunity: 84,
    competition: "low",
    insight:
      "Daily voice capture with mood trends for wellness niches — retention loops beat one-off journaling.",
    scores: { revenue: 4, gap: 5, fit: 4 },
  },
];

export function getOpportunityById(opportunities, id) {
  return opportunities.find((item) => item.id === id) ?? opportunities[0];
}

export function filterOpportunitiesByCategory(opportunities, category) {
  if (!category || category === "all") {
    return opportunities;
  }

  return opportunities.filter((item) => item.category === category);
}

export function buildOpportunityCard(opportunity) {
  return {
    title: opportunity.title,
    categoryLabel: opportunity.categoryLabel,
    score: formatOpportunityScore(opportunity.opportunity),
    competition: getCompetitionLabel(opportunity.competition),
    insight: opportunity.insight,
    scoresLabel: `R${opportunity.scores.revenue} / G${opportunity.scores.gap} / F${opportunity.scores.fit}`,
  };
}
