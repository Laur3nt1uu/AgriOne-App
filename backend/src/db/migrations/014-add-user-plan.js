"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.addColumn("users", "plan", {
      type: "VARCHAR(20)",
      allowNull: false,
      defaultValue: "STARTER",
    });
  },

  async down({ context: qi }) {
    await qi.removeColumn("users", "plan");
  },
};
