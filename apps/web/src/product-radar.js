export const PRODUCT_CATEGORIES = [
  {
    id: "mobile",
    label: "Mobile Apps",
    opportunity: 87,
    competition: "low",
    insight: "Niche utility apps with daily retention loops are underserved.",
  },
  {
    id: "web",
    label: "Websites",
    opportunity: 72,
    competition: "medium",
    insight: "Vertical SaaS landing pages convert when paired with live demos.",
  },
  {
    id: "software",
    label: "Software",
    opportunity: 91,
    competition: "low",
    insight: "Workflow automation for solo operators has room to grow fast.",
  },
];

export function getCategoryById(categories, id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

export function formatOpportunityScore(score) {
  return `${Math.round(score)}%`;
}

export function getCompetitionLabel(level) {
  const labels = {
    low: "Low competition",
    medium: "Moderate competition",
    high: "High competition",
  };

  return labels[level] ?? "Unknown competition";
}

export function buildRadarSummary(category) {
  return {
    headline: `${category.label} opportunity`,
    score: formatOpportunityScore(category.opportunity),
    competition: getCompetitionLabel(category.competition),
    insight: category.insight,
  };
}
