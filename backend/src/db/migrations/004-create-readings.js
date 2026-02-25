"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "readings",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },

          sensor_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "sensors", key: "id" },
            onDelete: "CASCADE",
          },

          temperature_c: {
            type: "DOUBLE PRECISION",
            allowNull: false,
          },

          humidity_pct: {
            type: "DOUBLE PRECISION",
            allowNull: false,
          },

          recorded_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
          },

          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addIndex("readings", ["sensor_id"], { transaction: t });
      await qi.addIndex("readings", ["recorded_at"], { transaction: t });
      await qi.addIndex("readings", ["sensor_id", "recorded_at"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("readings");
  },
};
