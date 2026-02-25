const ApiError = require("../../utils/ApiError");
const { Sensor, Land } = require("../../models");

function isOnline(lastReadingAt, minutes = 15) {
  if (!lastReadingAt) return false;
  return Date.now() - new Date(lastReadingAt).getTime() <= minutes * 60 * 1000;
}

async function createSensor(ownerId, { sensorCode, name }) {
  const existing = await Sensor.findOne({ where: { sensorCode } });
  if (existing) throw new ApiError(409, "Sensor code already exists", null, "SENSOR_CODE_EXISTS");

  return Sensor.create({ ownerId, sensorCode, name: name || null });
}

async function listMySensors(ownerId) {
  const sensors = await Sensor.findAll({
    where: { ownerId },
    order: [["created_at", "DESC"]],
  });

  // add derived status (not stored)
  return sensors.map((s) => ({
    ...s.toJSON(),
    online: isOnline(s.lastReadingAt),
  }));
}

async function pairSensor(ownerId, { sensorCode, landId }) {
  const sensor = await Sensor.findOne({ where: { sensorCode, ownerId } });
  if (!sensor) throw new ApiError(404, "Sensor not found", null, "SENSOR_NOT_FOUND");

  const land = await Land.findOne({ where: { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  sensor.landId = landId;
  await sensor.save();
  return sensor;
}

async function unpairSensor(ownerId, sensorCode) {
  const sensor = await Sensor.findOne({ where: { sensorCode, ownerId } });
  if (!sensor) throw new ApiError(404, "Sensor not found", null, "SENSOR_NOT_FOUND");

  sensor.landId = null;
  await sensor.save();
  return sensor;
}

module.exports = { createSensor, listMySensors, pairSensor, unpairSensor };
