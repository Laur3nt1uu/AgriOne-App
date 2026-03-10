const router = require("express").Router();
const c = require("./alerts.controller");

router.post("/rules", c.upsertRule);
router.get("/rules", c.getRules);

router.get("/", c.listAlerts);

router.delete("/:id", ...c.remove);

module.exports = router;