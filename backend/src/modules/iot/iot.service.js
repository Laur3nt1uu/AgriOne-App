const ApiError = require("../../utils/ApiError");
const { Sensor, Reading } = require("../../models");

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

module.exports = { ingest };
