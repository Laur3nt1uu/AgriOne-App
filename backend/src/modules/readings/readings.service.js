const ApiError = require("../../utils/ApiError");
const { Op } = require("sequelize");
const { Land, Sensor, Reading } = require("../../models");
const { resolveReadingsPeriod } = require("../../utils/readingsPeriod");

async function listReadingsByLand(actor, landId, { range = "24h", from, to } = {}) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  const sensors = await Sensor.findAll({ where: { ownerId: effectiveOwnerId, landId } });
  if (!sensors.length) {
    return { landId, sensorCode: null, range, items: [], dataWindow: null };
  }

  sensors.sort((a, b) => {
    const ta = a.lastReadingAt ? new Date(a.lastReadingAt).getTime() : 0;
    const tb = b.lastReadingAt ? new Date(b.lastReadingAt).getTime() : 0;
    return tb - ta;
  });
  const sensor = sensors[0];

  const tempOffset = Number(sensor.calibrationTempOffsetC || 0);
  const humOffset = Number(sensor.calibrationHumidityOffsetPct || 0);

  const period = resolveReadingsPeriod({ range, from, to });

  const [readings, first, last] = await Promise.all([
    Reading.findAll({
      where: { sensorId: sensor.id, ...(period.where ? { recordedAt: period.where } : {}) },
      order: [["recorded_at", "ASC"]],
    }),
    // Overall span of stored data, so clients can offer a sensible "history" window
    Reading.min("recordedAt", { where: { sensorId: sensor.id } }),
    Reading.max("recordedAt", { where: { sensorId: sensor.id } }),
  ]);

  return {
    landId,
    sensorCode: sensor.sensorCode,
    range: period.range,
    from: period.from ? period.from.toISOString() : null,
    to: period.to ? period.to.toISOString() : null,
    dataWindow: first && last ? { first: new Date(first).toISOString(), last: new Date(last).toISOString() } : null,
    items: readings.map((r) => ({
      recordedAt: r.recordedAt,
      temperatureC: Number(r.temperatureC) + tempOffset,
      humidityPct: Number(r.humidityPct) + humOffset,
      soilMoisturePct: r.soilMoisturePct != null ? Number(r.soilMoisturePct) : null,
    })),
  };
}

module.exports = { listReadingsByLand };