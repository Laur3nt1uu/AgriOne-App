const ApiError = require("../../utils/ApiError");
const { Op } = require("sequelize");
const { Land, Sensor, Reading } = require("../../models");

async function listReadingsByLand(actor, landId, range = "24h") {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  const sensors = await Sensor.findAll({ where: { ownerId: effectiveOwnerId, landId } });
  if (!sensors.length) {
    return { landId, sensorCode: null, range, items: [] };
  }

  sensors.sort((a, b) => {
    const ta = a.lastReadingAt ? new Date(a.lastReadingAt).getTime() : 0;
    const tb = b.lastReadingAt ? new Date(b.lastReadingAt).getTime() : 0;
    return tb - ta;
  });
  const sensor = sensors[0];

  const tempOffset = Number(sensor.calibrationTempOffsetC || 0);
  const humOffset = Number(sensor.calibrationHumidityOffsetPct || 0);

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

  return {
    landId,
    sensorCode: sensor.sensorCode,
    range,
    items: readings.map((r) => ({
      recordedAt: r.recordedAt,
      temperatureC: Number(r.temperatureC) + tempOffset,
      humidityPct: Number(r.humidityPct) + humOffset,
      soilMoisturePct: r.soilMoisturePct != null ? Number(r.soilMoisturePct) : null,
    })),
  };
}

module.exports = { listReadingsByLand };