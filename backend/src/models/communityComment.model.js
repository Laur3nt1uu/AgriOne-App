const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "CommunityComment",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      postId: { type: DataTypes.UUID, allowNull: false, field: "post_id" },
      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      body: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "community_comments",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
