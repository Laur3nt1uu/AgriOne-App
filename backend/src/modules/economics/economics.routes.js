const router = require("express").Router();
const c = require("./economics.controller");

router.post("/transactions", c.add);
router.get("/transactions", c.list);
router.get("/summary", c.summary);
router.delete("/transactions/:id", c.remove);

module.exports = router;