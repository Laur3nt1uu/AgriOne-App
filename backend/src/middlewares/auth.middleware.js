const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

module.exports = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return next(new ApiError(401, "Missing access token", null, "AUTH_MISSING_TOKEN"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { sub, role }
    return next();
  } catch {
    return next(new ApiError(401, "Invalid/expired access token", null, "AUTH_INVALID_TOKEN"));
  }
};
