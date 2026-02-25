const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { upsertRuleSchema } = require("./alerts.validation");
const service = require("./alerts.service");

const upsertRule = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = upsertRuleSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
    const rule = await service.upsertRule(req.user.sub, parsed.data);
    res.json({ rule });
  }),
];

const getRules = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const rules = await service.getRules(req.user.sub, req.query.landId);
    res.json({ rules });
  }),
];

const listAlerts = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const landId = req.query.landId;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const alerts = await service.listAlerts(req.user.sub, { landId, limit });
    res.json({ alerts });
  }),
];

module.exports = { upsertRule, getRules, listAlerts };