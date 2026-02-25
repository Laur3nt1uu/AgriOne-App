const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "RefreshToken",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
      tokenHash: { type: DataTypes.STRING(255), allowNull: false, field: "token_hash" },
      revokedAt: { type: DataTypes.DATE, allowNull: true, field: "revoked_at" },
      expiresAt: { type: DataTypes.DATE, allowNull: false, field: "expires_at" },
    },
    {
      tableName: "refresh_tokens",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
