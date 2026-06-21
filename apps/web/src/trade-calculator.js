export const TRADE_TYPES = [
  { id: "electrician", label: "Electrician", hourlyRate: 110 },
  { id: "plumber", label: "Plumber", hourlyRate: 105 },
  { id: "carpenter", label: "Carpenter", hourlyRate: 85 },
  { id: "painter", label: "Painter", hourlyRate: 65 },
  { id: "tiler", label: "Tiler", hourlyRate: 75 },
  { id: "landscaper", label: "Landscaper", hourlyRate: 70 },
];

export const JOB_SCOPES = [
  {
    id: "callout",
    label: "Call-out / minor fix",
    hours: 1.5,
    calloutFee: 120,
  },
  { id: "half-day", label: "Half-day job", hours: 4 },
  { id: "full-day", label: "Full-day job", hours: 8 },
  { id: "multi-day", label: "Multi-day project", hours: 16 },
];

export const TRADE_ADDONS = [
  { id: "materials", label: "Materials allowance", price: 200 },
  { id: "after-hours", label: "After-hours premium", percentOfLabor: 25 },
  { id: "travel", label: "Regional travel surcharge", price: 85 },
];

export function getTradeById(id) {
  return TRADE_TYPES.find((trade) => trade.id === id) ?? TRADE_TYPES[0];
}

export function getJobScopeById(id) {
  return JOB_SCOPES.find((scope) => scope.id === id) ?? JOB_SCOPES[0];
}

export function getTradeAddonsByIds(ids) {
  const selected = new Set(ids);
  return TRADE_ADDONS.filter((addon) => selected.has(addon.id));
}

export function calculateTradeQuote({ tradeId, scopeId, addonIds = [] }) {
  const trade = getTradeById(tradeId);
  const scope = getJobScopeById(scopeId);
  const addons = getTradeAddonsByIds(addonIds);

  const laborTotal = Math.round(
    trade.hourlyRate * scope.hours + (scope.calloutFee ?? 0),
  );

  let flatAddonsTotal = 0;
  let percentAddonsTotal = 0;

  for (const addon of addons) {
    if (addon.percentOfLabor) {
      percentAddonsTotal += Math.round(
        (laborTotal * addon.percentOfLabor) / 100,
      );
    } else {
      flatAddonsTotal += addon.price;
    }
  }

  const addonsTotal = flatAddonsTotal + percentAddonsTotal;
  const total = laborTotal + addonsTotal;

  return {
    trade,
    scope,
    addons,
    laborTotal,
    addonsTotal,
    total,
    summary: `Estimated ${scope.label.toLowerCase()} for ${trade.label.toLowerCase()}`,
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}
