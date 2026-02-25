const { Router } = require("express");
const controller = require("./admin.controller");
const requireAuth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");

const router = Router();

// All admin routes require ADMIN role
router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/users", controller.listUsers);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);
router.get("/stats", controller.getStats);
router.get("/backup", controller.backup);

module.exports = router;
