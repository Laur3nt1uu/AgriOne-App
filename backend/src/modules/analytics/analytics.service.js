const { Op } = require("sequelize");
const { Land, Sensor, Reading, Transaction, Alert } = require("../../models");

async function overview(ownerId) {
  const safe = async (fn, fallback) => {
    try {
      return await fn();
    } catch (e) {
      console.error("Analytics query failed:", e?.message || e);
      return fallback;
    }
  };

  // Lands count
  const landsCount = await safe(() => Land.count({ where: { ownerId } }), 0);

  // Sensors count
  const sensors = await safe(() => Sensor.findAll({ where: { ownerId } }), []);
  const sensorsCount = sensors.length;

  // Active sensors (15 min rule)
  const activeSensors = sensors.filter(s =>
    s.lastReadingAt &&
    Date.now() - new Date(s.lastReadingAt).getTime() <= 15 * 60 * 1000
  ).length;

  // Avg temp/humidity last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const readings = await safe(() => Reading.findAll({
    include: [{
      model: Sensor,
      where: { ownerId },
      attributes: []
    }],
    where: {
      recordedAt: { [Op.gte]: since }
    }
  }), []);

  let avgTemperature24h = null;
  let avgHumidity24h = null;

  if (readings.length > 0) {
    const tempSum = readings.reduce((sum, r) => sum + r.temperatureC, 0);
    const humSum = readings.reduce((sum, r) => sum + r.humidityPct, 0);

    avgTemperature24h = Number((tempSum / readings.length).toFixed(2));
    avgHumidity24h = Number((humSum / readings.length).toFixed(2));
  }

  // Profit total
  const transactions = await safe(() => Transaction.findAll({
    where: { ownerId }
  }), []);

  let revenue = 0;
  let expense = 0;

  for (const t of transactions) {
    const val = Number(t.amount);
    if (t.type === "REVENUE") revenue += val;
    else expense += val;
  }

  const profitTotal = Number((revenue - expense).toFixed(2));

  // Recent alerts count (last 7 days)
  const recentAlerts = await safe(() => Alert.count({
    where: {
      ownerId,
      created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  }), 0);

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

module.exports = { overview };