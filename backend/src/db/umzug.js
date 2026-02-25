const { Umzug, SequelizeStorage } = require("umzug");
const sequelize = require("../config/db");

const umzug = new Umzug({
  migrations: {
    glob: "src/db/migrations/*.js",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

module.exports = umzug;
