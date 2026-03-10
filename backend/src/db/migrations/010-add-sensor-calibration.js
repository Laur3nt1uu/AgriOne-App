"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.addColumn(
        "sensors",
        "calibration_temp_offset_c",
        {
          type: "DOUBLE PRECISION",
          allowNull: false,
          defaultValue: 0,
        },
        { transaction: t }
      );

      await qi.addColumn(
        "sensors",
        "calibration_humidity_offset_pct",
        {
          type: "DOUBLE PRECISION",
          allowNull: false,
          defaultValue: 0,
        },
        { transaction: t }
      );
    });
  },

  async down({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeColumn("sensors", "calibration_temp_offset_c", { transaction: t });
      await qi.removeColumn("sensors", "calibration_humidity_offset_pct", { transaction: t });
    });
  },
};
