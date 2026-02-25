const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Transaction",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

      ownerId: { type: DataTypes.UUID, allowNull: false, field: "owner_id" },
      landId: { type: DataTypes.UUID, allowNull: true, field: "land_id" },

      type: { type: DataTypes.STRING(10), allowNull: false }, // EXPENSE | REVENUE
      category: { type: DataTypes.STRING(60), allowNull: false },
      description: { type: DataTypes.STRING(255), allowNull: true },

      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

      occurredAt: { type: DataTypes.DATE, allowNull: false, field: "occurred_at" },
    },
    {
      tableName: "transactions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );