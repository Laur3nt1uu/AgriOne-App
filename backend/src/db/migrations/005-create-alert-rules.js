"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "alert_rules",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },

          owner_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },

          land_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "lands", key: "id" },
            onDelete: "CASCADE",
          },

          enabled: {
            type: "BOOLEAN",
            allowNull: false,
            defaultValue: true,
          },

          temp_min: { type: "DOUBLE PRECISION", allowNull: true },
          temp_max: { type: "DOUBLE PRECISION", allowNull: true },

          hum_min: { type: "DOUBLE PRECISION", allowNull: true },
          hum_max: { type: "DOUBLE PRECISION", allowNull: true },

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

      await qi.addIndex("alert_rules", ["owner_id"], { transaction: t });
      await qi.addIndex("alert_rules", ["land_id"], { transaction: t });
      await qi.addIndex("alert_rules", ["owner_id", "land_id"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("alert_rules");
  },
};