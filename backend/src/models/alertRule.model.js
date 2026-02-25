const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "AlertRule",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      landId: { type: DataTypes.UUID, allowNull: false, field: "land_id" },

      enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

      tempMin: { type: DataTypes.DOUBLE, allowNull: true, field: "temp_min" },
      tempMax: { type: DataTypes.DOUBLE, allowNull: true, field: "temp_max" },
      humMin: { type: DataTypes.DOUBLE, allowNull: true, field: "hum_min" },
      humMax: { type: DataTypes.DOUBLE, allowNull: true, field: "hum_max" },
    },
    {
      tableName: "alert_rules",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );