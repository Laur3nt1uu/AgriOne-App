const ApiError = require("../../utils/ApiError");
const { Op } = require("sequelize");
const { Land, Sensor, Reading, AlertRule, Alert, Transaction } = require("../../models");

async function getLandReportData(actor, landId) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  const safe = async (fn, fallback) => {
    try {
      return await fn();
    } catch (e) {
      console.error("Exports query failed:", e?.message || e);
      return fallback;
    }
  };

  const rule = await safe(() => AlertRule.findOne({ where: { ownerId: effectiveOwnerId, landId } }), null);

  const sensors = await safe(() => Sensor.findAll({ where: { ownerId: effectiveOwnerId, landId } }), []);
  sensors.sort((a, b) => {
    const ta = a.lastReadingAt ? new Date(a.lastReadingAt).getTime() : 0;
    const tb = b.lastReadingAt ? new Date(b.lastReadingAt).getTime() : 0;
    return tb - ta;
  });
  const sensor = sensors.length ? sensors[0] : null;

  const online =
    sensor?.lastReadingAt &&
    Date.now() - new Date(sensor.lastReadingAt).getTime() <= 15 * 60 * 1000;

  const latestReadings = sensor
    ? await safe(() => Reading.findAll({
        where: { sensorId: sensor.id },
        order: [["recorded_at", "DESC"]],
        limit: 10,
      }), [])
    : [];

  const alerts = await safe(() => Alert.findAll({
    where: { ownerId: effectiveOwnerId, landId },
    order: [["created_at", "DESC"]],
    limit: 10,
  }), []);

  const transactions = await safe(() => Transaction.findAll({
    where: { ownerId: effectiveOwnerId, landId },
    order: [["occurred_at", "DESC"]],
    limit: 15,
  }), []);

  let revenue = 0;
  let expense = 0;
  for (const t of transactions) {
    const val = Number(t.amount);
    if (t.type === "REVENUE") revenue += val;
    else expense += val;
  }

  const profit = revenue - expense;

  return {
    land,
    rule,
    sensor,
    online: !!online,
    latestReadings,
    alerts,
    transactions,
    summary: {
      revenue: Number(revenue.toFixed(2)),
      expense: Number(expense.toFixed(2)),
      profit: Number(profit.toFixed(2)),
    },
  };
}

async function getReadingsCsv(actor, landId, range = "24h") {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  const sensors = await Sensor.findAll({ where: { ownerId: effectiveOwnerId, landId } });
  if (!sensors.length) return { land, csv: "recordedAt,temperatureC,humidityPct,sensorCode\n" };

  sensors.sort((a, b) => {
    const ta = a.lastReadingAt ? new Date(a.lastReadingAt).getTime() : 0;
    const tb = b.lastReadingAt ? new Date(b.lastReadingAt).getTime() : 0;
    return tb - ta;
  });
  const sensor = sensors[0];

  const since =
    range === "7d"
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const readings = await Reading.findAll({
    where: {
      sensorId: sensor.id,
      recordedAt: { [Op.gte]: since },
    },
    order: [["recorded_at", "ASC"]],
  });

  let csv = "recordedAt,temperatureC,humidityPct,sensorCode\n";
  for (const r of readings) {
    csv += `${new Date(r.recordedAt).toISOString()},${r.temperatureC},${r.humidityPct},${sensor.sensorCode}\n`;
  }

  return { land, csv };
}

module.exports = { getLandReportData, getReadingsCsv };