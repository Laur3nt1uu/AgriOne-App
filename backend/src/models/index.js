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

const ApiaParcelModel = require("./apiaParcel.model");
const ApiaParcel = ApiaParcelModel(sequelize);

Land.hasOne(ApiaParcel, { foreignKey: "landId" });
ApiaParcel.belongsTo(Land, { foreignKey: "landId" });

User.hasMany(ApiaParcel, { foreignKey: "ownerId" });
ApiaParcel.belongsTo(User, { foreignKey: "ownerId" });

const NewsletterSubscriberModel = require("./newsletterSubscriber.model");
const NewsletterSubscriber = NewsletterSubscriberModel(sequelize);

const BlogModel = require("./blog.model");
const Blog = BlogModel(sequelize);

const AiConversationModel = require("./aiConversation.model");
const AiMessageModel = require("./aiMessage.model");

const AiConversation = AiConversationModel(sequelize);
const AiMessage = AiMessageModel(sequelize);

User.hasMany(AiConversation, { foreignKey: "ownerId" });
AiConversation.belongsTo(User, { foreignKey: "ownerId" });

AiConversation.hasMany(AiMessage, { foreignKey: "conversationId", as: "messages" });
AiMessage.belongsTo(AiConversation, { foreignKey: "conversationId" });

const CommunityPostModel = require("./communityPost.model");
const CommunityCommentModel = require("./communityComment.model");
const CommunityLikeModel = require("./communityLike.model");

const CommunityPost = CommunityPostModel(sequelize);
const CommunityComment = CommunityCommentModel(sequelize);
const CommunityLike = CommunityLikeModel(sequelize);

User.hasMany(CommunityPost, { foreignKey: "ownerId" });
CommunityPost.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

CommunityPost.hasMany(CommunityComment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" });
CommunityComment.belongsTo(CommunityPost, { foreignKey: "postId" });
CommunityComment.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(CommunityComment, { foreignKey: "ownerId" });

CommunityPost.hasMany(CommunityLike, { foreignKey: "postId", onDelete: "CASCADE" });
CommunityLike.belongsTo(CommunityPost, { foreignKey: "postId" });
CommunityLike.belongsTo(User, { foreignKey: "ownerId" });

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
	ApiaParcel,
	NewsletterSubscriber,
	Blog,
	AiConversation,
	AiMessage,
	CommunityPost,
	CommunityComment,
	CommunityLike,
};
