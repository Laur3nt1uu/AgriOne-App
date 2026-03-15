const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      username: { type: DataTypes.STRING(50), allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: "password_hash" },
      role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "USER" },
      plan: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "STARTER",
        validate: { isIn: [["STARTER", "PRO", "ENTERPRISE"]] },
      },

      globalLocationName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "global_location_name",
      },
      globalLocationLat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "global_location_lat",
      },
      globalLocationLng: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "global_location_lng",
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
