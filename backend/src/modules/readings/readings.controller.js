const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./readings.service");

const listByLand = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { range = "24h", from, to } = req.query;
    const data = await service.listReadingsByLand(req.user, req.params.landId, { range, from, to });
    res.json(data);
  }),
];

module.exports = { listByLand };