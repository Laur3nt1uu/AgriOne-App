/**
 * Migration: Create AI Conversations Table
 * Stores conversation sessions for the AI assistant
 */

module.exports = {
  async up({ context: qi }) {
    const { DataTypes } = require("sequelize");

    await qi.createTable("ai_conversations", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
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
      total_tokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes for faster queries
    await qi.addIndex("ai_conversations", ["owner_id"]);
    await qi.addIndex("ai_conversations", ["created_at"]);
  },

  async down({ context: qi }) {
    await qi.dropTable("ai_conversations");
  },
};
