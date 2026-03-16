const router = require("express").Router();
const c = require("./blogs.controller");

router.post("/", ...c.create);
router.get("/", c.list);
router.get("/:slug", c.getOne);
router.put("/:slug", ...c.update);
router.delete("/:slug", ...c.remove);

module.exports = router;
