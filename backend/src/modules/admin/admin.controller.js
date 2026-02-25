const asyncHandler = require("../../utils/asyncHandler");
const { User, Land, Sensor } = require("../../models");
const ApiError = require("../../utils/ApiError");

exports.listUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "created_at"],
      order: [["created_at", "DESC"]],
    });
    res.json({ users });
  } catch (e) {
    console.error("Admin listUsers error:", e);
    res.json({ users: [] });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!["USER", "ADMIN"].includes(role)) {
    throw new ApiError(400, "Invalid role", null, "ADMIN_INVALID_ROLE");
  }

  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found", null, "USER_NOT_FOUND");

  user.role = role;
  await user.save();

  res.json({ message: "User updated", user: { id: user.id, email: user.email, role: user.role } });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting yourself
  if (id === req.user.sub) {
    throw new ApiError(400, "Cannot delete yourself", null, "ADMIN_CANNOT_DELETE_SELF");
  }

  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found", null, "USER_NOT_FOUND");

  await user.destroy();
  res.json({ message: "User deleted" });
});

exports.getStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.count().catch(() => 0);
    const totalLands = await Land.count().catch(() => 0);
    const totalSensors = await Sensor.count().catch(() => 0);

    res.json({ totalUsers, totalLands, totalSensors });
  } catch (e) {
    res.json({ totalUsers: 0, totalLands: 0, totalSensors: 0 });
  }
});

exports.backup = asyncHandler(async (req, res) => {
  // Simple backup - in production you'd use pg_dump or similar
  res.setHeader("Content-Type", "application/sql");
  res.setHeader("Content-Disposition", "attachment; filename=backup.sql");
  res.send("-- Backup functionality requires pg_dump integration\n-- Contact system administrator");
});
