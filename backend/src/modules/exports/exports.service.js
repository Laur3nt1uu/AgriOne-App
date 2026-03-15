const ApiError = require("../../utils/ApiError");
const { Op } = require("sequelize");
const { Land, Sensor, Reading, AlertRule, Alert, Transaction, User } = require("../../models");

function parseDateParam(value, { endOfDay = false } = {}) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;

  // Accept YYYY-MM-DD (treat as UTC day bounds)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(s + (endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z"));
  }

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

async function getLandReportData(actor, landId, { from = undefined, to = undefined } = {}) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const fromDate = parseDateParam(from, { endOfDay: false });
  const toDate = parseDateParam(to, { endOfDay: true });

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

  const txWhere = { ownerId: effectiveOwnerId, landId };
  if (fromDate || toDate) {
    txWhere.occurredAt = {};
    if (fromDate) txWhere.occurredAt[Op.gte] = fromDate;
    if (toDate) txWhere.occurredAt[Op.lte] = toDate;
  }

  // Keep list readable in PDF; summary is computed across the whole period.
  const transactions = await safe(
    () =>
      Transaction.findAll({
        where: txWhere,
        order: [["occurred_at", "DESC"]],
        limit: fromDate || toDate ? 100 : 15,
      }),
    []
  );

  const txCount = await safe(() => Transaction.count({ where: txWhere }), 0);
  const revenue = await safe(() => Transaction.sum("amount", { where: { ...txWhere, type: "REVENUE" } }), 0);
  const expense = await safe(() => Transaction.sum("amount", { where: { ...txWhere, type: "EXPENSE" } }), 0);
  const profit = Number(revenue || 0) - Number(expense || 0);

  return {
    land,
    rule,
    sensor,
    online: !!online,
    latestReadings,
    alerts,
    transactions,
    summary: {
      revenue: Number(Number(revenue || 0).toFixed(2)),
      expense: Number(Number(expense || 0).toFixed(2)),
      profit: Number(Number(profit || 0).toFixed(2)),
      count: Number(txCount || 0),
      from: fromDate ? fromDate.toISOString() : null,
      to: toDate ? toDate.toISOString() : null,
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

async function getEconomicsReportData(actor, { from = undefined, to = undefined } = {}) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const fromDate = parseDateParam(from, { endOfDay: false });
  const toDate = parseDateParam(to, { endOfDay: true });

  const safe = async (fn, fallback) => {
    try {
      return await fn();
    } catch (e) {
      console.error("Exports query failed:", e?.message || e);
      return fallback;
    }
  };

  const txWhere = isAdmin ? {} : { ownerId };
  if (fromDate || toDate) {
    txWhere.occurredAt = {};
    if (fromDate) txWhere.occurredAt[Op.gte] = fromDate;
    if (toDate) txWhere.occurredAt[Op.lte] = toDate;
  }

  const include = [
    { model: Land, attributes: ["id", "name"], required: false },
    ...(isAdmin ? [{ model: User, attributes: ["id", "email", "username", "role"], required: false }] : []),
  ];

  const transactions = await safe(
    () =>
      Transaction.findAll({
        where: txWhere,
        include,
        order: [["occurred_at", "DESC"]],
        limit: 500,
      }),
    []
  );

  const txCount = await safe(() => Transaction.count({ where: txWhere }), 0);
  const revenue = await safe(() => Transaction.sum("amount", { where: { ...txWhere, type: "REVENUE" } }), 0);
  const expense = await safe(() => Transaction.sum("amount", { where: { ...txWhere, type: "EXPENSE" } }), 0);
  const profit = Number(revenue || 0) - Number(expense || 0);

  return {
    scope: isAdmin ? "ADMIN_GLOBAL" : "OWNER",
    transactions,
    summary: {
      revenue: Number(Number(revenue || 0).toFixed(2)),
      expense: Number(Number(expense || 0).toFixed(2)),
      profit: Number(Number(profit || 0).toFixed(2)),
      count: Number(txCount || 0),
      from: fromDate ? fromDate.toISOString() : null,
      to: toDate ? toDate.toISOString() : null,
    },
  };
}

module.exports = { getLandReportData, getEconomicsReportData, getReadingsCsv };