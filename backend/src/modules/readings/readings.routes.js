const router = require("express").Router();
const c = require("./readings.controller");

router.get("/land/:landId", c.listByLand);

module.exports = router;