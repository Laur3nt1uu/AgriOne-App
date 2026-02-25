const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./recommendations.service");

const byLand = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.recommendationsForLand(req.user.sub, req.params.landId);
    res.json(data);
  }),
];

const today = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const hasLat = req.query.lat !== undefined;
    const hasLng = req.query.lng !== undefined;

    if (hasLat || hasLng) {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new ApiError(400, "Validation error", { fieldErrors: { lat: ["Coordonate invalide."], lng: ["Coordonate invalide."] }, formErrors: [] }, "VALIDATION_ERROR");
      }

      const data = await service.recommendationsTodayForCoords(req.user.sub, lat, lng);
      return res.json(data);
    }

    const data = await service.recommendationsToday(req.user.sub);
    res.json(data);
  }),
];

module.exports = { byLand, today };