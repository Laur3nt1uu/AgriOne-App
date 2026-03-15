const ApiError = require("../../utils/ApiError");
const { Sensor, Land, User } = require("../../models");
const { getLimits } = require("../../config/planLimits");

function isOnline(lastReadingAt, minutes = 15) {
  if (!lastReadingAt) return false;
  return Date.now() - new Date(lastReadingAt).getTime() <= minutes * 60 * 1000;
}

async function checkSensorLimit(ownerId) {
  const owner = await User.findByPk(ownerId, { attributes: ["plan"] });
  const limits = getLimits(owner?.plan);
  if (limits.maxSensors !== Infinity) {
    const count = await Sensor.count({ where: { ownerId } });
    if (count >= limits.maxSensors) {
      throw new ApiError(403, `Planul tău (${owner?.plan || "STARTER"}) permite maxim ${limits.maxSensors} senzori. Fă upgrade pentru mai mulți.`, null, "PLAN_SENSOR_LIMIT");
    }
  }
}

async function createSensor(ownerId, { sensorCode, name }) {
  const existing = await Sensor.findOne({ where: { sensorCode } });
  if (existing) throw new ApiError(409, "Sensor code already exists", null, "SENSOR_CODE_EXISTS");

  await checkSensorLimit(ownerId);

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

async function listSensorsForActor(actor) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  if (!isAdmin) return listMySensors(ownerId);

  const sensors = await Sensor.findAll({
    include: [
      { model: User, attributes: ["id", "email", "username", "role"] },
      { model: Land, attributes: ["id", "name"], required: false },
    ],
    order: [["created_at", "DESC"]],
  });

  return sensors.map((s) => ({
    ...s.toJSON(),
    online: isOnline(s.lastReadingAt),
    owner: s.User ? { id: s.User.id, email: s.User.email, username: s.User.username, role: s.User.role } : undefined,
    land: s.Land ? { id: s.Land.id, name: s.Land.name } : undefined,
  }));
}

async function pairSensor(actor, { sensorCode, landId }) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const sensor = await Sensor.findOne({ where: isAdmin ? { sensorCode } : { sensorCode, ownerId } });
  if (!sensor) throw new ApiError(404, "Sensor not found", null, "SENSOR_NOT_FOUND");

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  // Keep invariants: sensor ownership follows land ownership when admin pairs.
  if (isAdmin && String(sensor.ownerId) !== String(land.ownerId)) {
    sensor.ownerId = land.ownerId;
  }

  sensor.landId = landId;
  await sensor.save();
  return sensor;
}

async function unpairSensor(actor, sensorCode) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const sensor = await Sensor.findOne({ where: isAdmin ? { sensorCode } : { sensorCode, ownerId } });
  if (!sensor) throw new ApiError(404, "Sensor not found", null, "SENSOR_NOT_FOUND");

  sensor.landId = null;
  await sensor.save();
  return sensor;
}

async function updateCalibration(actor, sensorCode, { tempOffsetC, humidityOffsetPct }) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const sensor = await Sensor.findOne({ where: isAdmin ? { sensorCode } : { sensorCode, ownerId } });
  if (!sensor) throw new ApiError(404, "Sensor not found", null, "SENSOR_NOT_FOUND");

  sensor.calibrationTempOffsetC = Number(tempOffsetC);
  sensor.calibrationHumidityOffsetPct = Number(humidityOffsetPct);
  await sensor.save();

  return sensor;
}

module.exports = {
  createSensor,
  checkSensorLimit,
  listMySensors,
  listSensorsForActor,
  pairSensor,
  unpairSensor,
  updateCalibration,
};
