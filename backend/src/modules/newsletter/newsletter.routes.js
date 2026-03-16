const router = require("express").Router();
const c = require("./newsletter.controller");

router.post("/subscribe", c.subscribe);

module.exports = router;
