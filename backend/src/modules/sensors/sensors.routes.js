const router = require("express").Router();
const c = require("./sensors.controller");

router.post("/", ...c.create);
router.get("/", ...c.listMine);
router.post("/pair", ...c.pair);
router.post("/unpair", ...c.unpair);
router.put("/:sensorCode/calibration", ...c.calibrate);

module.exports = router;
