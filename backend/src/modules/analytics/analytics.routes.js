const router = require("express").Router();
const c = require("./analytics.controller");

router.get("/overview", c.overview);

module.exports = router;