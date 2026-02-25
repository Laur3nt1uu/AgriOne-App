const umzug = require("./umzug");
const sequelize = require("../config/db");

(async () => {
  try {
    await sequelize.authenticate();
    const migrations = await umzug.up();
    console.log("✅ Migrations applied:", migrations.map(m => m.name));
    process.exit(0);
  } catch (e) {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  }
})();
