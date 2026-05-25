"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable(
        "community_posts",
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
          title: { type: "VARCHAR(200)", allowNull: false },
          body: { type: "TEXT", allowNull: false },
          category: { type: "VARCHAR(30)", allowNull: false },
          likes_count: { type: "INTEGER", allowNull: false, defaultValue: 0 },
          comments_count: { type: "INTEGER", allowNull: false, defaultValue: 0 },
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

      await qi.addIndex("community_posts", ["owner_id"], { transaction: t });
      await qi.addIndex("community_posts", ["category"], { transaction: t });
      await qi.addIndex("community_posts", ["created_at"], { transaction: t });

      await qi.createTable(
        "community_comments",
        {
          id: {
            type: "UUID",
            defaultValue: qi.sequelize.literal("gen_random_uuid()"),
            primaryKey: true,
          },
          post_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "community_posts", key: "id" },
            onDelete: "CASCADE",
          },
          owner_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },
          body: { type: "TEXT", allowNull: false },
          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addIndex("community_comments", ["post_id"], { transaction: t });
      await qi.addIndex("community_comments", ["owner_id"], { transaction: t });

      await qi.createTable(
        "community_likes",
        {
          post_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "community_posts", key: "id" },
            onDelete: "CASCADE",
          },
          owner_id: {
            type: "UUID",
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },
          created_at: {
            type: "TIMESTAMPTZ",
            allowNull: false,
            defaultValue: qi.sequelize.literal("NOW()"),
          },
        },
        { transaction: t }
      );

      await qi.addConstraint("community_likes", {
        fields: ["post_id", "owner_id"],
        type: "primary key",
        name: "community_likes_pkey",
        transaction: t,
      });

      await qi.addIndex("community_likes", ["owner_id"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.dropTable("community_likes");
    await qi.dropTable("community_comments");
    await qi.dropTable("community_posts");
  },
};
