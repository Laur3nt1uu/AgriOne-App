const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Op } = require("sequelize");
const {
  sequelize,
  User,
  RefreshToken,
  Land,
  Sensor,
  Reading,
  AlertRule,
  Alert,
  Transaction,
} = require("../src/models");

async function run() {
  await sequelize.authenticate();

  const likeTest = { [Op.like]: "test_%@example.com" };
  const likeAdmin = { [Op.like]: "admin_%@example.com" };

  const users = await User.findAll({
    where: {
      [Op.or]: [{ email: likeTest }, { email: likeAdmin }],
    },
    attributes: ["id", "email"],
  });

  if (!users.length) {
    console.log("No verification users found. Nothing to clean.");
    process.exit(0);
  }

  const userIds = users.map((u) => u.id);

  const summary = {
    users: users.length,
    refreshTokens: 0,
    lands: 0,
    sensors: 0,
    readings: 0,
    alertRules: 0,
    alerts: 0,
    transactions: 0,
  };

  await sequelize.transaction(async (trx) => {
    const lands = await Land.findAll({
      where: { ownerId: { [Op.in]: userIds } },
      attributes: ["id"],
      transaction: trx,
    });

    const sensors = await Sensor.findAll({
      where: { ownerId: { [Op.in]: userIds } },
      attributes: ["id"],
      transaction: trx,
    });

    const landIds = lands.map((l) => l.id);
    const sensorIds = sensors.map((s) => s.id);

    if (sensorIds.length) {
      summary.readings = await Reading.destroy({
        where: { sensorId: { [Op.in]: sensorIds } },
        transaction: trx,
      });
    }

    summary.alerts = await Alert.destroy({
      where: { ownerId: { [Op.in]: userIds } },
      transaction: trx,
    });

    summary.alertRules = await AlertRule.destroy({
      where: { ownerId: { [Op.in]: userIds } },
      transaction: trx,
    });

    if (Transaction) {
      summary.transactions = await Transaction.destroy({
        where: { ownerId: { [Op.in]: userIds } },
        transaction: trx,
      });
    }

    summary.sensors = await Sensor.destroy({
      where: { ownerId: { [Op.in]: userIds } },
      transaction: trx,
    });

    if (landIds.length) {
      summary.lands = await Land.destroy({
        where: { id: { [Op.in]: landIds } },
        transaction: trx,
      });
    }

    summary.refreshTokens = await RefreshToken.destroy({
      where: { userId: { [Op.in]: userIds } },
      transaction: trx,
    });

    await User.destroy({ where: { id: { [Op.in]: userIds } }, transaction: trx });
  });

  console.log("Removed verification data:");
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

run().catch((e) => {
  console.error("Cleanup failed:", e);
  process.exit(1);
});
