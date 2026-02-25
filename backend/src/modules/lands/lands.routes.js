const router = require("express").Router();
const requireAuth = require("../../middlewares/auth.middleware");
const c = require("./lands.controller");

router.use(requireAuth);

router.post("/", c.create);
router.get("/", c.listMine);
router.get("/:id", c.getOne);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;

