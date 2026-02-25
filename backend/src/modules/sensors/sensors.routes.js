const router = require("express").Router();
const c = require("./sensors.controller");

router.post("/", ...c.create);
router.get("/", ...c.listMine);
router.post("/pair", ...c.pair);
router.post("/unpair", ...c.unpair);

module.exports = router;
