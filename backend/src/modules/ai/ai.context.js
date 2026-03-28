/**
 * AI Context Builder
 * Builds user context from database for better AI responses
 */

const { Land, Sensor, Reading, Alert } = require("../../models");
const { Op } = require("sequelize");

/**
 * Build complete context for a user
 */
async function buildUserContext(userId, options = {}) {
  const context = {};

  try {
    // Get user's lands with basic info
    const lands = await Land.findAll({
      where: { ownerId: userId },
      attributes: ["id", "name", "cropType", "areaHa"],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    if (lands.length > 0) {
      context.lands = lands.map(l => ({
        id: l.id,
        name: l.name,
        cropType: l.cropType,
        areaHa: l.areaHa,
      }));
    }

    // If a specific land is selected
    if (options.landId) {
      const selectedLand = lands.find(l => l.id === options.landId);
      if (selectedLand) {
        context.currentLand = {
          id: selectedLand.id,
          name: selectedLand.name,
          cropType: selectedLand.cropType,
          areaHa: selectedLand.areaHa,
        };

        // Get latest sensor reading for the selected land
        const sensor = await Sensor.findOne({
          where: { landId: options.landId },
        });

        if (sensor) {
          const latestReading = await Reading.findOne({
            where: { sensorId: sensor.id },
            order: [["recordedAt", "DESC"]],
          });

          if (latestReading) {
            context.sensorData = {
              temperature: latestReading.temperatureC,
              humidity: latestReading.humidityPct,
              recordedAt: latestReading.recordedAt,
            };
          }
        }
      }
    }

    // Get active alerts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const alerts = await Alert.findAll({
      where: {
        ownerId: userId,
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      attributes: ["severity", "type", "message", "createdAt"],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    if (alerts.length > 0) {
      context.alerts = alerts.map(a => ({
        severity: a.severity,
        type: a.type,
        message: a.message,
      }));
    }

    // Add current season context
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) {
      context.season = "primăvară";
      context.seasonTips = "Perioada de semănat și plantare activă";
    } else if (month >= 6 && month <= 8) {
      context.season = "vară";
      context.seasonTips = "Atenție la irigație și protecție solară";
    } else if (month >= 9 && month <= 11) {
      context.season = "toamnă";
      context.seasonTips = "Perioada de recoltare și pregătire pentru iarnă";
    } else {
      context.season = "iarnă";
      context.seasonTips = "Planificare pentru sezonul următor";
    }

  } catch (error) {
    console.error("Error building user context:", error);
  }

  return context;
}

/**
 * Get quick context summary for a conversation
 */
function getQuickContextSummary(context) {
  const parts = [];

  if (context.lands && context.lands.length > 0) {
    parts.push(`${context.lands.length} terenuri înregistrate`);
  }

  if (context.currentLand) {
    parts.push(`Teren selectat: ${context.currentLand.name}`);
  }

  if (context.sensorData) {
    parts.push(`Ultima citire: ${context.sensorData.temperature}°C, ${context.sensorData.humidity}%`);
  }

  if (context.alerts && context.alerts.length > 0) {
    parts.push(`${context.alerts.length} alerte active`);
  }

  return parts.join(" • ") || "Fără context specific";
}

module.exports = {
  buildUserContext,
  getQuickContextSummary,
};
