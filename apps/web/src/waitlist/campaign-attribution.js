export const TRADEAI_AU_CAMPAIGN_T0 = "2026-06-21T13:32:47.000Z";

export const TRADEAI_AU_CAMPAIGN_UTMS = [
  "tradeai-au-launch",
  "tradeai-au-b2b",
  "tradeai-au-reddit",
];

export const DEFAULT_CAMPAIGN_WINDOW_HOURS = 48;

export const CAMPAIGN_WINDOW_PRESETS = [
  { id: "24h", label: "24 hours", hours: 24 },
  { id: "48h", label: "48 hours", hours: 48 },
  { id: "72h", label: "72 hours", hours: 72 },
  { id: "7d", label: "7 days", hours: 168 },
];

export function normalizeUtmCampaign(signup) {
  return signup.utm?.utm_campaign?.trim() ?? "";
}

export function normalizeUtmSource(signup) {
  return signup.utm?.utm_source?.trim() || "(direct)";
}

export function isTrackedCampaignSignup(
  signup,
  campaigns = TRADEAI_AU_CAMPAIGN_UTMS,
) {
  const campaign = normalizeUtmCampaign(signup);
  return campaigns.includes(campaign);
}

export function parseCampaignTimestamp(iso) {
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

export function getCampaignWindowBounds({
  t0 = TRADEAI_AU_CAMPAIGN_T0,
  windowHours = DEFAULT_CAMPAIGN_WINDOW_HOURS,
} = {}) {
  const startMs = parseCampaignTimestamp(t0);
  if (startMs === null) {
    return { startMs: null, endMs: null };
  }

  return {
    startMs,
    endMs: startMs + windowHours * 60 * 60 * 1000,
  };
}

export function isWithinCampaignWindow(
  signup,
  {
    t0 = TRADEAI_AU_CAMPAIGN_T0,
    windowHours = DEFAULT_CAMPAIGN_WINDOW_HOURS,
  } = {},
) {
  const joinedMs = parseCampaignTimestamp(signup.joinedAt);
  const { startMs, endMs } = getCampaignWindowBounds({ t0, windowHours });

  if (joinedMs === null || startMs === null || endMs === null) {
    return false;
  }

  return joinedMs >= startMs && joinedMs < endMs;
}

export function collectCampaignSignups(
  metrics,
  campaigns = TRADEAI_AU_CAMPAIGN_UTMS,
) {
  const signups = [];

  for (const concept of metrics.concepts) {
    for (const signup of concept.signups) {
      if (!isTrackedCampaignSignup(signup, campaigns)) {
        continue;
      }

      signups.push({
        ...signup,
        conceptId: concept.conceptId,
        conceptTitle: concept.title,
      });
    }
  }

  return signups;
}

export function countByUtmSourceAndCampaign(signups) {
  const counts = new Map();

  for (const signup of signups) {
    const source = normalizeUtmSource(signup);
    const campaign = normalizeUtmCampaign(signup);
    const key = `${source}\0${campaign}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => {
      const [source, campaign] = key.split("\0");
      return { source, campaign, count };
    })
    .sort(
      (left, right) =>
        right.count - left.count ||
        left.source.localeCompare(right.source) ||
        left.campaign.localeCompare(right.campaign),
    );
}

export function aggregateCampaignAttribution(
  metrics,
  {
    t0 = TRADEAI_AU_CAMPAIGN_T0,
    windowHours = DEFAULT_CAMPAIGN_WINDOW_HOURS,
    campaigns = TRADEAI_AU_CAMPAIGN_UTMS,
  } = {},
) {
  const allCampaignSignups = collectCampaignSignups(metrics, campaigns);
  const windowSignups = allCampaignSignups.filter((signup) =>
    isWithinCampaignWindow(signup, { t0, windowHours }),
  );
  const { startMs, endMs } = getCampaignWindowBounds({ t0, windowHours });

  return {
    t0,
    windowHours,
    campaigns,
    windowStart: startMs === null ? null : new Date(startMs).toISOString(),
    windowEnd: endMs === null ? null : new Date(endMs).toISOString(),
    windowSignupCount: windowSignups.length,
    allTimeSignupCount: allCampaignSignups.length,
    breakdown: countByUtmSourceAndCampaign(windowSignups),
    allTimeBreakdown: countByUtmSourceAndCampaign(allCampaignSignups),
  };
}
