const router = require("express").Router();
const c = require("./newsletter.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

// Public
router.post("/subscribe", c.subscribe);
router.get("/unsubscribe/:token", c.unsubscribe);
router.post("/unsubscribe/:token", c.unsubscribe);

// Admin only
router.get("/campaigns", auth, role(["ADMIN"]), c.getCampaigns);
router.get("/stats", auth, role(["ADMIN"]), c.getStats);
router.post("/send", auth, role(["ADMIN"]), c.sendCampaign);

module.exports = router;
