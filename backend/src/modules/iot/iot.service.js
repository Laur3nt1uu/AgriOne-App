const ApiError = require("../../utils/ApiError");
const { Sensor, Reading, Land } = require("../../models");
const { Op } = require("sequelize");
const { checkSensorLimit } = require("../sensors/sensors.service");

async function ingest({ sensorCode, temperatureC, humidityPct, soilMoisturePct, recordedAt }) {
  const sensor = await Sensor.findOne({ where: { sensorCode } });
  if (!sensor) throw new ApiError(404, "Sensor not registered", null, "SENSOR_NOT_REGISTERED");

  const ts = recordedAt ? new Date(recordedAt) : new Date();

  const reading = await Reading.create({
    sensorId: sensor.id,
    temperatureC,
    humidityPct,
    soilMoisturePct: soilMoisturePct ?? null,
    recordedAt: ts,
  });

  sensor.lastReadingAt = ts;
  await sensor.save();

  const alertsService = require("../alerts/alerts.service");
  

 const createdAlerts = await alertsService.evaluateReadingAndCreateAlerts({
  sensor,
  temperatureC,
  humidityPct,
  recordedAt: ts,
});

return { sensorId: sensor.id, reading, createdAlerts };
}

async function pairBoard(actor, { landId, boardCode, name }) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  let board = await Sensor.findOne({ where: { sensorCode: boardCode } });

  if (!board) {
    // Check plan sensor limit before auto-creating
    if (!isAdmin) await checkSensorLimit(effectiveOwnerId);
    board = await Sensor.create({ ownerId: effectiveOwnerId, sensorCode: boardCode, name: name || null });
  } else if (String(board.ownerId) !== String(effectiveOwnerId)) {
    if (!isAdmin) {
      throw new ApiError(409, "Board code already owned", null, "BOARD_CODE_EXISTS");
    }

    // Admin can reassign a board to the land owner.
    board.ownerId = effectiveOwnerId;
    board.landId = null;
  } else if (name !== undefined) {
    board.name = name || null;
  }

  // Enforce: one board per land (for this owner)
  await Sensor.update(
    { landId: null },
    { where: { ownerId: effectiveOwnerId, landId, sensorCode: { [Op.ne]: boardCode } } }
  );

  board.landId = landId;
  await board.save();

  return board;
}

async function unpairBoard(actor, { landId, boardCode }) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  let board = null;

  if (boardCode) {
    board = await Sensor.findOne({ where: isAdmin ? { sensorCode: boardCode } : { ownerId, sensorCode: boardCode } });
  } else if (landId) {
    board = await Sensor.findOne({ where: isAdmin ? { landId } : { ownerId, landId } });
  }

  if (!board) throw new ApiError(404, "Board not found", null, "BOARD_NOT_FOUND");

  board.landId = null;
  await board.save();
  return board;
}

module.exports = { ingest, pairBoard, unpairBoard };
