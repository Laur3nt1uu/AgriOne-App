"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "alerts",
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

          sensor_id: {
            type: "UUID",
            allowNull: true,
            references: { model: "sensors", key: "id" },
            onDelete: "SET NULL",
          },

          severity: {
            type: "VARCHAR(20)", // INFO | WARNING | CRITICAL
            allowNull: false,
          },

          type: {
            type: "VARCHAR(30)", // TEMP_LOW | TEMP_HIGH | HUM_LOW | HUM_HIGH
            allowNull: false,
          },

          message: {
            type: "TEXT",
            allowNull: false,
          },

          value: { type: "DOUBLE PRECISION", allowNull: true },
          threshold: { type: "DOUBLE PRECISION", allowNull: true },

          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addIndex("alerts", ["owner_id"], { transaction: t });
      await qi.addIndex("alerts", ["land_id"], { transaction: t });
      await qi.addIndex("alerts", ["created_at"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("alerts");
  },
};