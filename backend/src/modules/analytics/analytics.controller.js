const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./analytics.service");

const overview = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.overview(req.user);
    res.json(data);
  }),
];

const health = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.health(req.user);
    res.json(data);
  }),
];

module.exports = { overview, health };