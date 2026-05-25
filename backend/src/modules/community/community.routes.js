const router = require("express").Router();
const c = require("./community.controller");

router.get("/posts", c.list);
router.post("/posts", ...c.create);
router.get("/posts/:id", c.getOne);
router.delete("/posts/:id", ...c.remove);

router.post("/posts/:id/comments", ...c.addComment);
router.post("/posts/:id/like", ...c.toggleLike);

router.get("/likes/mine", ...c.myLikes);

module.exports = router;
