const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Sensor",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      landId: { type: DataTypes.UUID, allowNull: true, field: "land_id" },

      sensorCode: { type: DataTypes.STRING(80), allowNull: false, unique: true, field: "sensor_code" },
      name: { type: DataTypes.STRING(255), allowNull: true },

      calibrationTempOffsetC: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: "calibration_temp_offset_c",
      },
      calibrationHumidityOffsetPct: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: "calibration_humidity_offset_pct",
      },

      lastReadingAt: { type: DataTypes.DATE, allowNull: true, field: "last_reading_at" },
    },
    {
      tableName: "sensors",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
