const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "CommunityLike",
    {
      postId: { type: DataTypes.UUID, primaryKey: true, field: "post_id" },
      ownerId: { type: DataTypes.UUID, primaryKey: true, field: "owner_id" },
    },
    {
      tableName: "community_likes",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
