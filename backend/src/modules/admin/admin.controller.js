const asyncHandler = require("../../utils/asyncHandler");
const { User, Land, Sensor } = require("../../models");
const ApiError = require("../../utils/ApiError");
const env = require("../../config/env");
const { spawn } = require("child_process");

exports.listUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "username", "name", "role", "plan", "created_at"],
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

  res.json({ message: "User updated", user: { id: user.id, email: user.email, username: user.username, role: user.role } });
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
  // Practical approach for this project: run pg_dump inside the dockerized Postgres.
  // Requires: docker running + container name from docker-compose.yml (agrione_postgres).

  const container = process.env.PG_DOCKER_CONTAINER || "agrione_postgres";

  const args = [
    "exec",
    "-i",
    "-e",
    `PGPASSWORD=${env.DB_PASS}`,
    container,
    "pg_dump",
    "-U",
    env.DB_USER,
    "-d",
    env.DB_NAME,
    "--no-owner",
    "--no-privileges",
  ];

  const proc = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"] });

  let started = false;
  let stderr = "";

  proc.stderr.on("data", (d) => {
    stderr += d.toString();
  });

  proc.on("error", (e) => {
    console.error("Backup spawn error:", e);
    if (started || res.headersSent) return;
    res.status(503).json({
      message: "Backup unavailable (docker not available)",
      code: "ADMIN_BACKUP_UNAVAILABLE",
      details: { reason: "docker-not-available" },
    });
  });

  proc.stdout.on("data", (chunk) => {
    if (!started) {
      started = true;
      res.setHeader("Content-Type", "application/sql");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`
      );
    }
    res.write(chunk);
  });

  proc.stdout.on("end", () => {
    if (started) res.end();
  });

  proc.on("close", (code) => {
    if (code === 0) return;
    console.error("Backup pg_dump failed:", stderr);
    if (!started && !res.headersSent) {
      res.status(503).json({
        message: "Backup failed (pg_dump)",
        code: "ADMIN_BACKUP_FAILED",
        details: { stderr: stderr.slice(0, 4000) },
      });
      return;
    }
    try { res.end(); } catch { /* ignore */ }
  });
});
