const { DataTypes } = require("sequelize");

const CATEGORIES = ["success", "tips", "guides", "support", "apia"];

module.exports = (sequelize) =>
  sequelize.define(
    "CommunityPost",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      title: { type: DataTypes.STRING(200), allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: { isIn: [CATEGORIES] },
      },
      likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "likes_count" },
      commentsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "comments_count" },
    },
    {
      tableName: "community_posts",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

module.exports.CATEGORIES = CATEGORIES;
