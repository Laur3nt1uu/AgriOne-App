const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Reading",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

      sensorId: { type: DataTypes.UUID, allowNull: false, field: "sensor_id" },
      temperatureC: { type: DataTypes.DOUBLE, allowNull: false, field: "temperature_c" },
      humidityPct: { type: DataTypes.DOUBLE, allowNull: false, field: "humidity_pct" },
      soilMoisturePct: { type: DataTypes.DOUBLE, allowNull: true, field: "soil_moisture_pct" },
      recordedAt: { type: DataTypes.DATE, allowNull: false, field: "recorded_at" },
    },
    {
      tableName: "readings",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
