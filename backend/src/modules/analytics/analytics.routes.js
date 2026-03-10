const router = require("express").Router();
const c = require("./analytics.controller");

router.get("/overview", c.overview);
router.get("/health", c.health);

module.exports = router;