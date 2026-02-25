"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "sensors",
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
            allowNull: true,
            references: { model: "lands", key: "id" },
            onDelete: "SET NULL",
          },

          sensor_code: {
            type: "VARCHAR(80)",
            allowNull: false,
            unique: true,
          },

          name: {
            type: "VARCHAR(255)",
            allowNull: true,
          },

          last_reading_at: {
            type: "TIMESTAMPTZ",
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

      await qi.addIndex("sensors", ["owner_id"], { transaction: t });
      await qi.addIndex("sensors", ["land_id"], { transaction: t });
      await qi.addIndex("sensors", ["sensor_code"], { unique: true, transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("sensors");
  },
};
