const express = require("express");
const router = express.Router();
const env = require("../../config/env");
const requireAuth = require("../../middlewares/auth.middleware");

const { sequelize, Land, Reading, Sensor } = require("../../models");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// POST /api/dev/seed-readings/:landId
router.post("/seed-readings/:landId", requireAuth, async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not available in production." });
    }

    const key = req.header("x-dev-key");
    if (!key || key !== env.IOT_MASTER_KEY) {
      return res.status(401).json({ message: "Invalid dev key." });
    }

    const { landId } = req.params;
    const days = Number(req.body?.days || 7);
    const pointsPerDay = Number(req.body?.pointsPerDay || 24);

    const land = await Land.findOne({ where: { id: landId, ownerId: req.user.sub } });
    if (!land) return res.status(404).json({ message: "Land not found." });

    const sensor = await Sensor.findOne({ where: { landId: land.id, ownerId: req.user.sub } });
    if (!sensor) return res.status(400).json({ message: "No sensor paired to this land." });

    const total = days * pointsPerDay;
    const now = Date.now();

    let t = rand(18, 24);
    let h = rand(45, 65);

    const rows = [];
    for (let i = total - 1; i >= 0; i--) {
      const ts = new Date(now - i * (24 * 60 * 60 * 1000) / pointsPerDay);
      t += rand(-0.6, 0.6);
      h += rand(-1.5, 1.5);

      rows.push({
        sensorId: sensor.id,
        temperatureC: Number(t.toFixed(1)),
        humidityPct: Math.max(0, Math.min(100, Math.round(h))),
        recordedAt: ts,
      });
    }

    await sequelize.transaction(async (trx) => {
      await Reading.bulkCreate(rows, { transaction: trx });
      await sensor.update({ lastReadingAt: new Date() }, { transaction: trx });
    });

    res.json({ ok: true, inserted: rows.length });
  } catch (e) {
    next(e);
  }
});

module.exports = router;