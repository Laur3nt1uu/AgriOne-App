const router = require("express").Router();
const c = require("./auth.controller");
const requireAuth = require("../../middlewares/auth.middleware");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/google", c.googleLogin);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);
router.get("/me", requireAuth, c.me);
router.get("/preferences", requireAuth, c.getPreferences);
router.put("/preferences", requireAuth, c.updatePreferences);
router.put("/password", requireAuth, c.changePassword);
router.put("/plan", requireAuth, c.changePlan);

module.exports = router;
