const ApiError = require("../../utils/ApiError");
const { AlertRule, Alert, Land, Sensor } = require("../../models");
const { Op } = require("sequelize");

async function upsertRule(ownerId, payload) {
  const land = await Land.findOne({ where: { id: payload.landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const existing = await AlertRule.findOne({ where: { ownerId, landId: payload.landId } });

  if (!existing) {
    return AlertRule.create({
      ownerId,
      landId: payload.landId,
      enabled: payload.enabled ?? true,
      tempMin: payload.tempMin ?? null,
      tempMax: payload.tempMax ?? null,
      humMin: payload.humMin ?? null,
      humMax: payload.humMax ?? null,
    });
  }

  if (payload.enabled !== undefined) existing.enabled = payload.enabled;
  if (payload.tempMin !== undefined) existing.tempMin = payload.tempMin;
  if (payload.tempMax !== undefined) existing.tempMax = payload.tempMax;
  if (payload.humMin !== undefined) existing.humMin = payload.humMin;
  if (payload.humMax !== undefined) existing.humMax = payload.humMax;

  await existing.save();
  return existing;
}

async function getRules(ownerId, landId) {
  const where = { ownerId };
  if (landId) where.landId = landId;

  return AlertRule.findAll({ where, order: [["updated_at", "DESC"]] });
}

async function listAlerts(ownerId, { landId, limit = 50 }) {
  const where = { ownerId };
  if (landId) where.landId = landId;

  return Alert.findAll({
    where,
    order: [["created_at", "DESC"]],
    limit,
  });
}

/**
 * Called by IoT ingest after a new reading is stored.
 * Generate alerts based on land rule thresholds.
 */
async function evaluateReadingAndCreateAlerts({ sensor, temperatureC, humidityPct, recordedAt }) {
  if (!sensor.landId) return [];

  const rule = await AlertRule.findOne({
    where: { ownerId: sensor.ownerId, landId: sensor.landId, enabled: true },
  });
  if (!rule) return [];

  const alerts = [];

  // temperature checks
  if (rule.tempMin != null && temperatureC < rule.tempMin) {
    alerts.push(
      await Alert.create({
        ownerId: sensor.ownerId,
        landId: sensor.landId,
        sensorId: sensor.id,
        severity: "WARNING",
        type: "TEMP_LOW",
        message: `Temperature is too low: ${temperatureC}°C (min ${rule.tempMin}°C)`,
        value: temperatureC,
        threshold: rule.tempMin,
        created_at: recordedAt,
      })
    );
  }

  if (rule.tempMax != null && temperatureC > rule.tempMax) {
    alerts.push(
      await Alert.create({
        ownerId: sensor.ownerId,
        landId: sensor.landId,
        sensorId: sensor.id,
        severity: "WARNING",
        type: "TEMP_HIGH",
        message: `Temperature is too high: ${temperatureC}°C (max ${rule.tempMax}°C)`,
        value: temperatureC,
        threshold: rule.tempMax,
        created_at: recordedAt,
      })
    );
  }

  // humidity checks
  if (rule.humMin != null && humidityPct < rule.humMin) {
    alerts.push(
      await Alert.create({
        ownerId: sensor.ownerId,
        landId: sensor.landId,
        sensorId: sensor.id,
        severity: "WARNING",
        type: "HUM_LOW",
        message: `Humidity is too low: ${humidityPct}% (min ${rule.humMin}%)`,
        value: humidityPct,
        threshold: rule.humMin,
        created_at: recordedAt,
      })
    );
  }

  if (rule.humMax != null && humidityPct > rule.humMax) {
    alerts.push(
      await Alert.create({
        ownerId: sensor.ownerId,
        landId: sensor.landId,
        sensorId: sensor.id,
        severity: "WARNING",
        type: "HUM_HIGH",
        message: `Humidity is too high: ${humidityPct}% (max ${rule.humMax}%)`,
        value: humidityPct,
        threshold: rule.humMax,
        created_at: recordedAt,
      })
    );
  }

  return alerts;
}

module.exports = {
  upsertRule,
  getRules,
  listAlerts,
  evaluateReadingAndCreateAlerts,
};