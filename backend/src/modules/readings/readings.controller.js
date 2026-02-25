const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./readings.service");

const listByLand = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const range = req.query.range || "24h";
    const data = await service.listReadingsByLand(req.user.sub, req.params.landId, range);
    res.json(data);
  }),
];

module.exports = { listByLand };