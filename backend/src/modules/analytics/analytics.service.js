const { Op, fn, col } = require("sequelize");
const { Land, Sensor, Reading, Transaction, Alert, User } = require("../../models");

async function overview(actor) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const safe = async (fn, fallback) => {
    try {
      return await fn();
    } catch (e) {
      console.error("Analytics query failed:", e?.message || e);
      return fallback;
    }
  };

  const whereOwner = isAdmin ? {} : { ownerId };

  // Lands count
  const landsCount = await safe(() => Land.count({ where: whereOwner }), 0);

  // Sensors count
  const sensorsCount = await safe(() => Sensor.count({ where: whereOwner }), 0);

  // Active sensors (15 min rule)
  const activeSensors = await safe(
    () =>
      Sensor.count({
        where: {
          ...(whereOwner || {}),
          lastReadingAt: { [Op.gte]: new Date(Date.now() - 15 * 60 * 1000) },
        },
      }),
    0
  );

  // Avg temp/humidity last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const avgTemperature24h = await safe(
    async () => {
      if (isAdmin) {
        const n = await Reading.aggregate("temperatureC", "avg", {
          where: { recordedAt: { [Op.gte]: since } },
        });
        return n == null ? null : Number(Number(n).toFixed(2));
      }

      const n = await Reading.aggregate("temperatureC", "avg", {
        include: [{ model: Sensor, where: { ownerId }, attributes: [] }],
        where: { recordedAt: { [Op.gte]: since } },
      });
      return n == null ? null : Number(Number(n).toFixed(2));
    },
    null
  );

  const avgHumidity24h = await safe(
    async () => {
      if (isAdmin) {
        const n = await Reading.aggregate("humidityPct", "avg", {
          where: { recordedAt: { [Op.gte]: since } },
        });
        return n == null ? null : Number(Number(n).toFixed(2));
      }

      const n = await Reading.aggregate("humidityPct", "avg", {
        include: [{ model: Sensor, where: { ownerId }, attributes: [] }],
        where: { recordedAt: { [Op.gte]: since } },
      });
      return n == null ? null : Number(Number(n).toFixed(2));
    },
    null
  );

  const revenue = await safe(
    async () => {
      const s = await Transaction.sum("amount", { where: { ...(whereOwner || {}), type: "REVENUE" } });
      return Number(s || 0);
    },
    0
  );
  const expense = await safe(
    async () => {
      const s = await Transaction.sum("amount", { where: { ...(whereOwner || {}), type: "EXPENSE" } });
      return Number(s || 0);
    },
    0
  );
  const profitTotal = Number((revenue - expense).toFixed(2));

  // Recent alerts count (last 7 days)
  const recentAlerts = await safe(
    () =>
      Alert.count({
        where: {
          ...(whereOwner || {}),
          created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    0
  );

  return {
    landsCount,
    sensorsCount,
    activeSensors,
    avgTemperature24h,
    avgHumidity24h,
    profitTotal,
    recentAlerts
  };
}

function clamp(n, a, b) {
  const x = Number(n);
  if (!Number.isFinite(x)) return a;
  return Math.max(a, Math.min(b, x));
}

function isOnline(lastAt, minutes = 15) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= minutes * 60 * 1000;
}

async function health(actor) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const whereOwner = isAdmin ? {} : { ownerId };

  const lands = await Land.findAll({
    where: whereOwner,
    include: isAdmin ? [{ model: User, attributes: ["id", "email", "username", "role"] }] : [],
    order: [["created_at", "DESC"]],
  });

  const landIds = lands.map((l) => l.id);
  if (!landIds.length) return { items: [] };

  // Latest sensor per land (most recently updated) + online status
  const sensors = await Sensor.findAll({
    where: { landId: { [Op.in]: landIds } },
    order: [["updated_at", "DESC"]],
    attributes: ["id", "landId", "sensorCode", "lastReadingAt"],
  });
  const sensorByLand = new Map();
  for (const s of sensors) {
    const k = String(s.landId);
    if (!sensorByLand.has(k)) sensorByLand.set(k, s);
  }

  // Recent alerts per land (last 7 days)
  const alertsWhere = {
    ...(isAdmin ? {} : { ownerId }),
    landId: { [Op.in]: landIds },
    created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  };
  const alertCounts = await Alert.findAll({
    attributes: ["landId", [fn("count", col("id")), "count"]],
    where: alertsWhere,
    group: ["landId"],
    raw: true,
  });
  const alertsByLand = new Map(alertCounts.map((r) => [String(r.landId), Number(r.count || 0)]));

  // Latest reading per land (last 48h window, pick newest)
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const readingWhere = {
    recordedAt: { [Op.gte]: since },
  };

  const readings = await Reading.findAll({
    where: readingWhere,
    include: [{
      model: Sensor,
      attributes: ["landId"],
      where: { landId: { [Op.in]: landIds } },
    }],
    order: [["recorded_at", "DESC"]],
    limit: 5000,
  });

  const latestByLand = new Map();
  for (const r of readings) {
    const landId = r?.Sensor?.landId;
    if (!landId) continue;
    const k = String(landId);
    if (latestByLand.has(k)) continue;
    latestByLand.set(k, r);
  }

  const items = lands.map((l) => {
    const json = l.toJSON ? l.toJSON() : l;
    const landId = String(l.id);

    const sensor = sensorByLand.get(landId) || null;
    const online = sensor ? isOnline(sensor.lastReadingAt) : false;
    const alertsCount = alertsByLand.get(landId) || 0;
    const last = latestByLand.get(landId) || null;

    let score = 100;
    const reasons = [];

    if (!sensor) {
      score -= 40;
      reasons.push("Fără senzor asociat");
    } else if (!online) {
      score -= 25;
      reasons.push("Senzor offline (ultima citire > 15 min)");
    }

    if (alertsCount > 0) {
      const penalty = Math.min(30, alertsCount * 10);
      score -= penalty;
      reasons.push(`${alertsCount} alerte recente (7 zile)`);
    }

    if (last) {
      const t = Number(last.temperatureC);
      const h = Number(last.humidityPct);
      if (Number.isFinite(t) && (t < 0 || t > 40)) {
        score -= 10;
        reasons.push(`Temperatură neobișnuită: ${t.toFixed(1)}°C`);
      }
      if (Number.isFinite(h) && (h < 20 || h > 90)) {
        score -= 10;
        reasons.push(`Umiditate neobișnuită: ${Math.round(h)}%`);
      }
    }

    score = clamp(score, 0, 100);
    const label = score >= 80 ? "Bun" : score >= 55 ? "Atenție" : "Risc";

    const out = {
      landId: json.id,
      landName: json.name,
      score,
      label,
      reasons,
      sensorCode: sensor ? sensor.sensorCode : null,
      online,
      alerts7d: alertsCount,
      lastReadingAt: sensor ? sensor.lastReadingAt : null,
    };

    if (isAdmin) {
      out.owner = json.User ? { id: json.User.id, email: json.User.email, username: json.User.username, role: json.User.role } : undefined;
    }

    return out;
  });

  return { items };
}

module.exports = { overview, health };