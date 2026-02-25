const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./analytics.service");

const overview = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.overview(req.user.sub);
    res.json(data);
  }),
];

module.exports = { overview };