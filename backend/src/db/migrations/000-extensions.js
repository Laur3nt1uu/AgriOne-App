"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  },
  async down({ context: qi }) {
    // optional: do nothing
  },
};
