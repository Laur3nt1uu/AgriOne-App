const umzug = require("./umzug");
const sequelize = require("../config/db");

(async () => {
  try {
    await sequelize.authenticate();
    const m = await umzug.down();
    console.log("✅ Rolled back:", m ? m.name : "none");
    process.exit(0);
  } catch (e) {
    console.error("❌ Rollback failed:", e);
    process.exit(1);
  }
})();
