const ApiError = require("../utils/ApiError");

module.exports = (roles = []) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, "Unauthorized", null, "AUTH_UNAUTHORIZED"));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, "Forbidden", null, "AUTH_FORBIDDEN"));
  next();
};
