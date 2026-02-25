const router = require("express").Router();
const c = require("./recommendations.controller");

router.get("/today", c.today);
router.get("/land/:landId", c.byLand);

module.exports = router;