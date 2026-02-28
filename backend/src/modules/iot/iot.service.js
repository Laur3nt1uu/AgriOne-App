const ApiError = require("../../utils/ApiError");
const { Sensor, Reading, Land } = require("../../models");
const { Op } = require("sequelize");

async function ingest({ sensorCode, temperatureC, humidityPct, recordedAt }) {
  const sensor = await Sensor.findOne({ where: { sensorCode } });
  if (!sensor) throw new ApiError(404, "Sensor not registered", null, "SENSOR_NOT_REGISTERED");

  const ts = recordedAt ? new Date(recordedAt) : new Date();

  const reading = await Reading.create({
    sensorId: sensor.id,
    temperatureC,
    humidityPct,
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

async function pairBoard(ownerId, { landId, boardCode, name }) {
  const land = await Land.findOne({ where: { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  let board = await Sensor.findOne({ where: { sensorCode: boardCode } });

  if (!board) {
    board = await Sensor.create({ ownerId, sensorCode: boardCode, name: name || null });
  } else if (String(board.ownerId) !== String(ownerId)) {
    throw new ApiError(409, "Board code already owned", null, "BOARD_CODE_EXISTS");
  } else if (name !== undefined) {
    board.name = name || null;
  }

  // Enforce: one board per land (for this owner)
  await Sensor.update(
    { landId: null },
    { where: { ownerId, landId, sensorCode: { [Op.ne]: boardCode } } }
  );

  board.landId = landId;
  await board.save();

  return board;
}

async function unpairBoard(ownerId, { landId, boardCode }) {
  let board = null;

  if (boardCode) {
    board = await Sensor.findOne({ where: { ownerId, sensorCode: boardCode } });
  } else if (landId) {
    board = await Sensor.findOne({ where: { ownerId, landId } });
  }

  if (!board) throw new ApiError(404, "Board not found", null, "BOARD_NOT_FOUND");

  board.landId = null;
  await board.save();
  return board;
}

module.exports = { ingest, pairBoard, unpairBoard };
