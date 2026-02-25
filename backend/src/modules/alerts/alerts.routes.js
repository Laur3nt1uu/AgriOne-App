const router = require("express").Router();
const c = require("./alerts.controller");

router.post("/rules", c.upsertRule);
router.get("/rules", c.getRules);

router.get("/", c.listAlerts);

module.exports = router;