const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./weather.service");

const byCoords = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const data = await service.getWeatherBundle(lat, lng);
    res.json({ weather: data });
  }),
];

const reverse = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new ApiError(
        400,
        "Validation error",
        { fieldErrors: { lat: ["Coordonate invalide."], lng: ["Coordonate invalide."] }, formErrors: [] },
        "VALIDATION_ERROR"
      );
    }

    const location = await service.reverseGeocode(lat, lng);
    res.json({ location });
  }),
];

module.exports = { byCoords, reverse };