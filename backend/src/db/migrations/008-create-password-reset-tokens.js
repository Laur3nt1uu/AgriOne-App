"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "password_reset_tokens",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },
          user_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },
          token_hash: { type: "VARCHAR(64)", allowNull: false },
          expires_at: { type: "TIMESTAMPTZ", allowNull: false },
          used_at: { type: "TIMESTAMPTZ", allowNull: true },
          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addIndex("password_reset_tokens", ["token_hash"], { unique: true, transaction: t });
      await qi.addIndex("password_reset_tokens", ["user_id"], { transaction: t });
      await qi.addIndex("password_reset_tokens", ["expires_at"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("password_reset_tokens");
  },
};
