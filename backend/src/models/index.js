const sequelize = require("../config/db");

const UserModel = require("./user.model");
const RefreshTokenModel = require("./refreshToken.model");

const User = UserModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);

User.hasMany(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

const LandModel = require("./land.model");
const Land = LandModel(sequelize);

User.hasMany(Land, { foreignKey: "ownerId" });
Land.belongsTo(User, { foreignKey: "ownerId" });

const SensorModel = require("./sensor.model");
const ReadingModel = require("./reading.model");

const Sensor = SensorModel(sequelize);
const Reading = ReadingModel(sequelize);

User.hasMany(Sensor, { foreignKey: "ownerId" });
Sensor.belongsTo(User, { foreignKey: "ownerId" });

Land.hasMany(Sensor, { foreignKey: "landId" });
Sensor.belongsTo(Land, { foreignKey: "landId" });

Sensor.hasMany(Reading, { foreignKey: "sensorId" });
Reading.belongsTo(Sensor, { foreignKey: "sensorId" });

const AlertRuleModel = require("./alertRule.model");
const AlertModel = require("./alert.model");

const AlertRule = AlertRuleModel(sequelize);
const Alert = AlertModel(sequelize);

User.hasMany(AlertRule, { foreignKey: "ownerId" });
AlertRule.belongsTo(User, { foreignKey: "ownerId" });
Land.hasMany(AlertRule, { foreignKey: "landId" });
AlertRule.belongsTo(Land, { foreignKey: "landId" });

User.hasMany(Alert, { foreignKey: "ownerId" });
Alert.belongsTo(User, { foreignKey: "ownerId" });
Land.hasMany(Alert, { foreignKey: "landId" });
Alert.belongsTo(Land, { foreignKey: "landId" });
Sensor.hasMany(Alert, { foreignKey: "sensorId" });
Alert.belongsTo(Sensor, { foreignKey: "sensorId" });


const TransactionModel = require("./transaction.model");
const Transaction = TransactionModel(sequelize);

User.hasMany(Transaction, { foreignKey: "ownerId" });
Transaction.belongsTo(User, { foreignKey: "ownerId" });

Land.hasMany(Transaction, { foreignKey: "landId" });
Transaction.belongsTo(Land, { foreignKey: "landId" });

const PasswordResetTokenModel = require("./passwordResetToken.model");
const PasswordResetToken = PasswordResetTokenModel(sequelize);

User.hasMany(PasswordResetToken, { foreignKey: "userId" });
PasswordResetToken.belongsTo(User, { foreignKey: "userId" });

module.exports = {
	sequelize,
	User,
	RefreshToken,
	Land,
	Sensor,
	Reading,
	AlertRule,
	Alert,
	Transaction,
	PasswordResetToken,
};
