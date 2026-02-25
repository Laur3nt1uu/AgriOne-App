const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "PasswordResetToken",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
      tokenHash: { type: DataTypes.STRING(64), allowNull: false, field: "token_hash" }, // sha256 hex
      expiresAt: { type: DataTypes.DATE, allowNull: false, field: "expires_at" },
      usedAt: { type: DataTypes.DATE, allowNull: true, field: "used_at" },
    },
    {
      tableName: "password_reset_tokens",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
