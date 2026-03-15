"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "apia_parcels",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },

          land_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "lands", key: "id" },
            onDelete: "CASCADE",
          },

          owner_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },

          tarla_number: {
            type: "VARCHAR(50)",
            allowNull: true,
          },

          parcel_number: {
            type: "VARCHAR(50)",
            allowNull: true,
          },

          siruta_code: {
            type: "VARCHAR(20)",
            allowNull: true,
          },

          cadastral_number: {
            type: "VARCHAR(100)",
            allowNull: true,
          },

          land_category: {
            type: "VARCHAR(50)", // arabil, pasune, faneata, livada, vie, legume
            allowNull: false,
            defaultValue: "arabil",
          },

          apia_area_ha: {
            type: "DECIMAL(10,2)",
            allowNull: false,
          },

          is_eco_scheme: {
            type: "BOOLEAN",
            allowNull: false,
            defaultValue: false,
          },

          eco_scheme_type: {
            type: "VARCHAR(50)", // biodiversitate, reducere_pesticide, pajisti, conversia_eco, rotatie_culturi
            allowNull: true,
          },

          young_farmer: {
            type: "BOOLEAN",
            allowNull: false,
            defaultValue: false,
          },

          notes: {
            type: "TEXT",
            allowNull: true,
          },

          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },

          updated_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addIndex("apia_parcels", ["land_id"], {
        unique: true,
        transaction: t,
      });
      await qi.addIndex("apia_parcels", ["owner_id"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("apia_parcels");
  },
};
