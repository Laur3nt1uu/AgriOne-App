const router = require("express").Router();
const c = require("./iot.controller");

router.post("/ingest", c.ingest);

module.exports = router;
