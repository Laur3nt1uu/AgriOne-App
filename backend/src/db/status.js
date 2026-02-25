const umzug = require("./umzug");
const sequelize = require("../config/db");

(async () => {
  try {
    await sequelize.authenticate();
    const pending = await umzug.pending();
    const executed = await umzug.executed();
    console.log("Executed:", executed.map(m => m.name));
    console.log("Pending:", pending.map(m => m.name));
    process.exit(0);
  } catch (e) {
    console.error("❌ Status failed:", e);
    process.exit(1);
  }
})();
