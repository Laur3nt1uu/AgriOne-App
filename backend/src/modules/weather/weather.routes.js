const router = require("express").Router();
const c = require("./weather.controller");

router.get("/by-coords", c.byCoords);
router.get("/reverse", c.reverse);

module.exports = router;