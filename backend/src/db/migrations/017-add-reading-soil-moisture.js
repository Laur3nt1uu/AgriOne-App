"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.addColumn("readings", "soil_moisture_pct", {
      type: "DOUBLE PRECISION",
      allowNull: true,
      defaultValue: null,
    });
  },

  async down({ context: qi }) {
    await qi.removeColumn("readings", "soil_moisture_pct");
  },
};
