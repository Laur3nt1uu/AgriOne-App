const { DataTypes } = require("sequelize");

/**
 * AI Message Model
 * Stores individual messages in AI conversations
 */
module.exports = (sequelize) =>
  sequelize.define(
    "AiMessage",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "conversation_id",
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [["user", "assistant", "system"]],
        },
        comment: "user | assistant | system",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "image_url",
        comment: "URL of attached image for vision analysis",
      },
      tokensUsed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "tokens_used",
        comment: "Tokens consumed by this message exchange",
      },
    },
    {
      tableName: "ai_messages",
      underscored: true,
      timestamps: true,
      updatedAt: false, // Messages don't get updated
    }
  );
