const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Op } = require("sequelize");
const { sequelize, User, Land, Sensor, Reading } = require("../src/models");

async function run() {
  await sequelize.authenticate();

  const verifyUsers = await User.findAll({
    where: {
      [Op.or]: [
        { email: { [Op.like]: "test_%@example.com" } },
        { email: { [Op.like]: "admin_%@example.com" } },
      ],
    },
    attributes: ["id", "email"],
  });

  const verifyUserIds = verifyUsers.map((u) => u.id);

  const verifyLands = verifyUserIds.length
    ? await Land.count({ where: { ownerId: { [Op.in]: verifyUserIds } } })
    : 0;

  const verifySensors = verifyUserIds.length
    ? await Sensor.count({ where: { ownerId: { [Op.in]: verifyUserIds } } })
    : 0;

  const verifyReadings = verifyUserIds.length
    ? await Reading.count({
        include: [{ model: Sensor, where: { ownerId: { [Op.in]: verifyUserIds } }, attributes: [] }],
      })
    : 0;

  const totals = {
    users: await User.count(),
    lands: await Land.count(),
    sensors: await Sensor.count(),
    readings: await Reading.count(),
  };

  console.log("Verification leftovers:");
  console.log(
    JSON.stringify(
      {
        verifyUsers: verifyUsers.length,
        verifyUserEmails: verifyUsers.map((u) => u.email),
        verifyLands,
        verifySensors,
        verifyReadings,
        totals,
      },
      null,
      2
    )
  );

  process.exit(verifyUsers.length ? 2 : 0);
}

run().catch((e) => {
  console.error("db:check failed:", e);
  process.exit(1);
});
