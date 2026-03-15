"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.addColumn("users", "name", {
      type: "VARCHAR(100)",
      allowNull: true,
    });
  },

  async down({ context: qi }) {
    await qi.removeColumn("users", "name");
  },
};
