const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { createSensorSchema, pairSchema, unpairSchema } = require("./sensors.validation");
const service = require("./sensors.service");

const create = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = createSensorSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
    const sensor = await service.createSensor(req.user.sub, parsed.data);
    res.status(201).json({ sensor });
  }),
];

const listMine = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const sensors = await service.listMySensors(req.user.sub);
    res.json({ sensors });
  }),
];

const pair = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = pairSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
    const sensor = await service.pairSensor(req.user.sub, parsed.data);
    res.json({ sensor });
  }),
];

const unpair = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = unpairSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
    const sensor = await service.unpairSensor(req.user.sub, parsed.data.sensorCode);
    res.json({ sensor });
  }),
];

module.exports = { create, listMine, pair, unpair };
