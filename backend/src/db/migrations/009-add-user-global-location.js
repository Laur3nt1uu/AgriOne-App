"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.addColumn(
        "users",
        "global_location_name",
        {
          type: "VARCHAR(255)",
          allowNull: true,
        },
        { transaction: t }
      );

      await qi.addColumn(
        "users",
        "global_location_lat",
        {
          type: "DOUBLE PRECISION",
          allowNull: true,
        },
        { transaction: t }
      );

      await qi.addColumn(
        "users",
        "global_location_lng",
        {
          type: "DOUBLE PRECISION",
          allowNull: true,
        },
        { transaction: t }
      );

      await qi.addIndex("users", ["global_location_lat"], { transaction: t });
      await qi.addIndex("users", ["global_location_lng"], { transaction: t });
    });
  },

  async down({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeIndex("users", ["global_location_lat"], { transaction: t }).catch(() => {});
      await qi.removeIndex("users", ["global_location_lng"], { transaction: t }).catch(() => {});

      await qi.removeColumn("users", "global_location_lng", { transaction: t });
      await qi.removeColumn("users", "global_location_lat", { transaction: t });
      await qi.removeColumn("users", "global_location_name", { transaction: t });
    });
  },
};
