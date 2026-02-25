"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "lands",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },

          owner_id: {
            type: "UUID",
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
            onDelete: "CASCADE",
          },

          name: {
            type: "VARCHAR(255)",
            allowNull: false,
          },

          crop_type: {
            type: "VARCHAR(100)",
            allowNull: false,
          },

          area_ha: {
            type: "DECIMAL(10,2)",
            allowNull: false,
          },

          geometry: {
            type: "JSONB", // GeoJSON
            allowNull: false,
          },

          centroid_lat: {
            type: "DOUBLE PRECISION",
            allowNull: false,
          },

          centroid_lng: {
            type: "DOUBLE PRECISION",
            allowNull: false,
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

      await qi.addIndex("lands", ["owner_id"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("lands");
  },
};
