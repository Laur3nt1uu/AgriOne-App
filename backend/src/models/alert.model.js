const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Alert",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      landId: { type: DataTypes.UUID, allowNull: false, field: "land_id" },
      sensorId: { type: DataTypes.UUID, allowNull: true, field: "sensor_id" },

      severity: { type: DataTypes.STRING(20), allowNull: false },
      type: { type: DataTypes.STRING(30), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },

      value: { type: DataTypes.DOUBLE, allowNull: true },
      threshold: { type: DataTypes.DOUBLE, allowNull: true },
    },
    {
      tableName: "alerts",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );