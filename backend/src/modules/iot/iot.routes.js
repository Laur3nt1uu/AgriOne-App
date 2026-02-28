const router = require("express").Router();
const c = require("./iot.controller");

router.post("/ingest", c.ingest);
router.post("/pair", ...c.pair);
router.post("/unpair", ...c.unpair);

module.exports = router;
