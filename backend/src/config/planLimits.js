// Plan limits configuration
// STARTER: 2 lands, 5 sensors
// PRO: unlimited lands, 50 sensors
// ENTERPRISE: unlimited

const PLAN_LIMITS = {
  STARTER: { maxLands: 2, maxSensors: 5 },
  PRO: { maxLands: Infinity, maxSensors: 50 },
  ENTERPRISE: { maxLands: Infinity, maxSensors: Infinity },
};

function getLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.STARTER;
}

module.exports = { PLAN_LIMITS, getLimits };
