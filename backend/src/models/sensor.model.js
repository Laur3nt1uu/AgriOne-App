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
