const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Land",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "owner_id",
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      cropType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "crop_type",
      },

      areaHa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "area_ha",
      },

      geometry: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      centroidLat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "centroid_lat",
      },

      centroidLng: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "centroid_lng",
      },
    },
    {
      tableName: "lands",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
