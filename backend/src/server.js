const app = require("./app");
const env = require("./config/env");
const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    app.listen(env.PORT, () => {
      console.log(`✅ API running on http://localhost:${env.PORT}`);
    });
  } catch (e) {
    console.error("❌ Startup failed:", e);
    process.exit(1);
  }
})();
