const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "ApiaParcel",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      landId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "land_id",
        unique: true,
      },

      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "owner_id",
      },

      tarlaNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "tarla_number",
      },

      parcelNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "parcel_number",
      },

      sirutaCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "siruta_code",
      },

      cadastralNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "cadastral_number",
      },

      landCategory: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "arabil",
        field: "land_category",
      },

      apiaAreaHa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "apia_area_ha",
      },

      isEcoScheme: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_eco_scheme",
      },

      ecoSchemeType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "eco_scheme_type",
      },

      youngFarmer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "young_farmer",
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "apia_parcels",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
