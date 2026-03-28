// Plan limits configuration
// STARTER: 2 lands, 5 sensors, 5 AI messages/day
// PRO: unlimited lands, 50 sensors, 50 AI messages/day
// ENTERPRISE: unlimited

const PLAN_LIMITS = {
  STARTER: { maxLands: 2, maxSensors: 5, aiMessagesPerDay: 5, hasAiVision: false },
  PRO: { maxLands: Infinity, maxSensors: 50, aiMessagesPerDay: 50, hasAiVision: true },
  ENTERPRISE: { maxLands: Infinity, maxSensors: Infinity, aiMessagesPerDay: Infinity, hasAiVision: true },
};

function getLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.STARTER;
}

module.exports = { PLAN_LIMITS, getLimits };
