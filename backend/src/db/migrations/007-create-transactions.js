"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "transactions",
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

          type: {
            type: "VARCHAR(10)", // EXPENSE | REVENUE
            allowNull: false,
          },

          category: {
            type: "VARCHAR(60)", // fuel, seeds, labor, subsidy, harvest, etc.
            allowNull: false,
          },

          description: {
            type: "VARCHAR(255)",
            allowNull: true,
          },

          amount: {
            type: "DECIMAL(12,2)",
            allowNull: false,
          },

          occurred_at: {
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

      await qi.addIndex("transactions", ["owner_id"], { transaction: t });
      await qi.addIndex("transactions", ["land_id"], { transaction: t });
      await qi.addIndex("transactions", ["occurred_at"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("transactions");
  },
};