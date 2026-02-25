"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "users",
        {
          id: { type: "UUID", defaultValue: qi.sequelize.literal("gen_random_uuid()"), primaryKey: true },
          email: { type: "VARCHAR(255)", allowNull: false, unique: true },
          password_hash: { type: "VARCHAR(255)", allowNull: false },
          role: { type: "VARCHAR(20)", allowNull: false, defaultValue: "USER" },
          created_at: { type: "TIMESTAMPTZ", allowNull: false, defaultValue: qi.sequelize.literal("NOW()") },
          updated_at: { type: "TIMESTAMPTZ", allowNull: false, defaultValue: qi.sequelize.literal("NOW()") },
        },
        { transaction: t }
      );

      await qi.createTable(
        "refresh_tokens",
        {
          id: { type: "UUID", defaultValue: qi.sequelize.literal("gen_random_uuid()"), primaryKey: true },
          user_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },
          token_hash: { type: "VARCHAR(255)", allowNull: false },
          revoked_at: { type: "TIMESTAMPTZ", allowNull: true },
          expires_at: { type: "TIMESTAMPTZ", allowNull: false },
          created_at: { type: "TIMESTAMPTZ", allowNull: false, defaultValue: qi.sequelize.literal("NOW()") },
        },
        { transaction: t }
      );

      await qi.addIndex("refresh_tokens", ["user_id"], { transaction: t });
      await qi.addIndex("refresh_tokens", ["expires_at"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("refresh_tokens");
    await qi.dropTable("users");
  },
};
