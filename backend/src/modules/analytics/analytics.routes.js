const router = require("express").Router();
const requireAuth = require("../../middlewares/auth.middleware");
const c = require("./analytics.controller");

// Health check is public (for monitoring/uptime checks)
router.get("/health", c.health);

// Overview requires authentication (contains user-specific KPIs)
router.get("/overview", requireAuth, c.overview);

module.exports = router;