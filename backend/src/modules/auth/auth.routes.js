const router = require("express").Router();
const c = require("./auth.controller");
const requireAuth = require("../../middlewares/auth.middleware");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);
router.get("/me", requireAuth, c.me);
router.get("/preferences", requireAuth, c.getPreferences);
router.put("/preferences", requireAuth, c.updatePreferences);

module.exports = router;
