"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "newsletter_subscribers",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },
          email: {
            type: "VARCHAR(255)",
            allowNull: false,
            unique: true,
          },
          status: {
            type: 'VARCHAR(20)',
            allowNull: false,
            defaultValue: "subscribed",
          },
          language: {
            type: "VARCHAR(2)",
            allowNull: false,
            defaultValue: "ro",
          },
          subscription_source: {
            type: "VARCHAR(50)",
            allowNull: true,
          },
          unsubscribe_token: {
            type: "VARCHAR(64)",
            allowNull: true,
            unique: true,
          },
          created_at: {
            type: "TIMESTAMP WITH TIME ZONE",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
          updated_at: {
            type: "TIMESTAMP WITH TIME ZONE",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("newsletter_subscribers");
  },
};
