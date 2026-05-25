"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.addColumn(
        "sensors",
        "last_lat",
        { type: "DOUBLE PRECISION", allowNull: true },
        { transaction: t }
      );
      await qi.addColumn(
        "sensors",
        "last_lng",
        { type: "DOUBLE PRECISION", allowNull: true },
        { transaction: t }
      );
      await qi.addColumn(
        "sensors",
        "location_verified",
        { type: "BOOLEAN", allowNull: false, defaultValue: false },
        { transaction: t }
      );
      await qi.addColumn(
        "sensors",
        "location_checked_at",
        { type: "TIMESTAMPTZ", allowNull: true },
        { transaction: t }
      );
    });
  },

  async down({ context: qi }) {
    await qi.removeColumn("sensors", "location_checked_at");
    await qi.removeColumn("sensors", "location_verified");
    await qi.removeColumn("sensors", "last_lng");
    await qi.removeColumn("sensors", "last_lat");
  },
};
