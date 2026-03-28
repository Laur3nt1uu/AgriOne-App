/**
 * Migration: Create AI Messages Table
 * Stores individual messages in AI conversations
 */

module.exports = {
  async up({ context: qi }) {
    const { DataTypes } = require("sequelize");

    await qi.createTable("ai_messages", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      conversation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "ai_conversations",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "user | assistant | system",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "URL of attached image for vision analysis",
      },
      tokens_used: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Tokens consumed by this message exchange",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes for faster queries
    await qi.addIndex("ai_messages", ["conversation_id"]);
    await qi.addIndex("ai_messages", ["created_at"]);
  },

  async down({ context: qi }) {
    await qi.dropTable("ai_messages");
  },
};
