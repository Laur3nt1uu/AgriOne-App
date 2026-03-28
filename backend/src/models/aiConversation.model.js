const { DataTypes } = require("sequelize");

/**
 * AI Conversation Model
 * Stores conversation sessions for the AI assistant
 */
module.exports = (sequelize) =>
  sequelize.define(
    "AiConversation",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "owner_id",
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      context: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: "Context data: landId, cropType, etc.",
      },
      totalTokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "total_tokens",
      },
    },
    {
      tableName: "ai_conversations",
      underscored: true,
      timestamps: true,
    }
  );
