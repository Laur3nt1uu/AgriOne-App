const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "NewsletterSubscriber",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      status: {
        type: DataTypes.ENUM("subscribed", "unsubscribed"),
        allowNull: false,
        defaultValue: "subscribed",
      },
      language: {
        type: DataTypes.STRING(2),
        allowNull: false,
        defaultValue: "ro",
        validate: {
          isIn: [["ro", "en"]],
        },
      },
      subscriptionSource: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "subscription_source",
      },
      unsubscribeToken: {
        type: DataTypes.STRING(64),
        allowNull: true,
        unique: true,
        field: "unsubscribe_token",
      },
    },
    {
      tableName: "newsletter_subscribers",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
