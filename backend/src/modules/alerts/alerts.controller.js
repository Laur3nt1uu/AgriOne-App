const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { upsertRuleSchema } = require("./alerts.validation");
const service = require("./alerts.service");
const { Alert, Land, User } = require("../../models");

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

    // Admin can see alerts across all owners; regular users see only their own.
    const where = {};
    if (req.user?.role !== "ADMIN") where.ownerId = req.user.sub;
    if (landId) where.landId = landId;

    const rows = await Alert.findAll({
      where,
      include: [
        { model: Land, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "email", "username", "role"] },
      ],
      order: [["created_at", "DESC"]],
      limit: Number.isFinite(limit) ? limit : 50,
    });

    const alerts = rows.map((r) => {
      const json = r.toJSON ? r.toJSON() : r;
      const { Land: land, User: owner, ...rest } = json;
      return {
        ...rest,
        landName: land?.name,
        land: land ? { id: land.id, name: land.name } : undefined,
        owner: owner ? { id: owner.id, email: owner.email, username: owner.username, role: owner.role } : undefined,
      };
    });

    res.json({ alerts });
  }),
];

const remove = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const where = req.user?.role === "ADMIN" ? { id } : { id, ownerId: req.user.sub };
    const alert = await Alert.findOne({ where });
    if (!alert) throw new ApiError(404, "Alert not found", null, "ALERT_NOT_FOUND");

    await alert.destroy();
    res.status(204).send();
  }),
];

module.exports = { upsertRule, getRules, listAlerts, remove };