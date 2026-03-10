"use strict";

module.exports = {
  async up({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.addColumn(
        "users",
        "username",
        { type: "VARCHAR(50)", allowNull: true },
        { transaction: t }
      );

      // Backfill usernames from email prefix and ensure uniqueness.
      await qi.sequelize.query(
        `
        WITH base AS (
          SELECT id,
                 lower(split_part(email, '@', 1)) AS base
          FROM users
        ),
        clean AS (
          SELECT id,
                 CASE
                   WHEN base IS NULL OR base = '' THEN 'user'
                   ELSE regexp_replace(base, '[^a-z0-9._-]', '', 'g')
                 END AS b
          FROM base
        ),
        ranked AS (
          SELECT id, b,
                 row_number() OVER (PARTITION BY b ORDER BY id) AS rn
          FROM clean
        ),
        final AS (
          SELECT id,
                 CASE
                   WHEN rn = 1 THEN left(b, 50)
                   ELSE left(left(b, 42) || '_' || substring(replace(id::text, '-', ''), 1, 6), 50)
                 END AS uname
          FROM ranked
        )
        UPDATE users u
        SET username = f.uname
        FROM final f
        WHERE u.id = f.id;
        `,
        { transaction: t }
      );

      await qi.changeColumn(
        "users",
        "username",
        { type: "VARCHAR(50)", allowNull: false },
        { transaction: t }
      );

      // Case-insensitive uniqueness.
      await qi.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_unique ON users (LOWER(username));`,
        { transaction: t }
      );
    });
  },

  async down({ context: qi }) {
    await qi.sequelize.transaction(async (t) => {
      await qi.sequelize.query(`DROP INDEX IF EXISTS users_username_lower_unique;`, { transaction: t });
      await qi.removeColumn("users", "username", { transaction: t });
    });
  },
};
