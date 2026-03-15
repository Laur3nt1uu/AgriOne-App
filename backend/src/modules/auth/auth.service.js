const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const env = require("../../config/env");
const ApiError = require("../../utils/ApiError");
const { User, RefreshToken, PasswordResetToken, sequelize } = require("../../models");
const { sendMail, hasSmtpConfig } = require("../../utils/mailer");

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createRefreshToken() {
  return crypto.randomBytes(48).toString("hex"); // long random string
}

function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function decodeJwtPayload(jwtToken) {
  const parts = String(jwtToken || "").split(".");
  if (parts.length < 2) throw new ApiError(400, "Invalid Google credential", null, "AUTH_GOOGLE_INVALID_CREDENTIAL");
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(base64, "base64").toString("utf8");
  return JSON.parse(json);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeUsername(username) {
  const raw = String(username || "").trim();
  if (!raw) return "";
  // keep it simple: store as-is but lowercased for consistency
  return raw.toLowerCase();
}

function usernameFromEmail(email) {
  const normalized = normalizeEmail(email);
  const base = normalized.split("@")[0] || "user";
  // keep allowed chars only
  const cleaned = base.replace(/[^a-z0-9._-]/gi, "");
  return normalizeUsername(cleaned || "user");
}

async function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  return User.findOne({
    where: sequelize.where(sequelize.fn("lower", sequelize.col("email")), normalized),
  });
}

async function findUserByUsername(username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  return User.findOne({
    where: sequelize.where(sequelize.fn("lower", sequelize.col("username")), normalized),
  });
}

async function ensureUniqueUsername(desired, maxAttempts = 6) {
  const base = normalizeUsername(desired);
  if (!base) return "";

  // First try exact
  const existing = await findUserByUsername(base);
  if (!existing) return base;

  // Try with short random suffix
  for (let i = 0; i < maxAttempts; i++) {
    const suffix = crypto.randomBytes(2).toString("hex");
    const candidate = String(base).slice(0, 42) + "_" + suffix;
    // eslint-disable-next-line no-await-in-loop
    const hit = await findUserByUsername(candidate);
    if (!hit) return candidate;
  }

  // last resort: long random
  return "user_" + crypto.randomBytes(4).toString("hex");
}

async function register(email, password, role = "USER", username = undefined, name = undefined) {
  const normalized = normalizeEmail(email);
  const existing = await findUserByEmail(normalized);
  if (existing) throw new ApiError(409, "Email already registered", null, "AUTH_EMAIL_ALREADY_REGISTERED");

  const requestedUsername = username != null ? normalizeUsername(username) : "";
  const baseUsername = requestedUsername || usernameFromEmail(normalized);
  if (requestedUsername) {
    const uExisting = await findUserByUsername(requestedUsername);
    if (uExisting) throw new ApiError(409, "Username already taken", null, "AUTH_USERNAME_TAKEN");
  }
  const finalUsername = await ensureUniqueUsername(baseUsername);

  const trimmedName = name ? String(name).trim() : null;

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email: normalized, username: finalUsername, name: trimmedName, passwordHash, role });

  const accessToken = signAccessToken(user);
  const refreshToken = createRefreshToken();

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return { user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, plan: user.plan }, accessToken, refreshToken };
}

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user)
    throw new ApiError(
      401,
      env.AUTH_DETAILED_ERRORS ? "User not found" : "Invalid credentials",
      null,
      env.AUTH_DETAILED_ERRORS ? "AUTH_USER_NOT_FOUND" : "AUTH_INVALID_CREDENTIALS"
    );

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    throw new ApiError(
      401,
      env.AUTH_DETAILED_ERRORS ? "Incorrect password" : "Invalid credentials",
      null,
      env.AUTH_DETAILED_ERRORS ? "AUTH_INCORRECT_PASSWORD" : "AUTH_INVALID_CREDENTIALS"
    );

  const accessToken = signAccessToken(user);
  const refreshToken = createRefreshToken();

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return { user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, plan: user.plan }, accessToken, refreshToken };
}

async function loginWithGoogle(credential, profile = {}) {
  let payload = null;
  try {
    payload = decodeJwtPayload(credential);
  } catch {
    throw new ApiError(401, "Google credential invalid", null, "AUTH_GOOGLE_INVALID_CREDENTIAL");
  }

  const email = normalizeEmail(payload?.email || profile?.email || "");
  if (!email) throw new ApiError(400, "Missing Google email", null, "AUTH_GOOGLE_MISSING_EMAIL");
  if (payload?.email_verified === false) {
    throw new ApiError(401, "Google email not verified", null, "AUTH_GOOGLE_EMAIL_NOT_VERIFIED");
  }

  let user = await findUserByEmail(email);

  if (!user) {
    const baseUsername = usernameFromEmail(email);
    const finalUsername = await ensureUniqueUsername(baseUsername);
    const randomPass = crypto.randomBytes(24).toString("hex");
    const passwordHash = await bcrypt.hash(randomPass, 12);
    const name = String(payload?.name || profile?.name || "").trim() || null;

    user = await User.create({
      email,
      username: finalUsername,
      name,
      passwordHash,
      role: "USER",
    });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return {
    user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, plan: user.plan },
    accessToken,
    refreshToken,
  };
}

async function refresh(refreshToken) {
  const tokenHash = hashToken(refreshToken);

  const row = await RefreshToken.findOne({ where: { tokenHash } });
  if (!row) throw new ApiError(401, "Invalid refresh token", null, "AUTH_INVALID_REFRESH_TOKEN");
  if (row.revokedAt) throw new ApiError(401, "Refresh token revoked", null, "AUTH_REVOKED_REFRESH_TOKEN");
  if (row.expiresAt.getTime() < Date.now()) throw new ApiError(401, "Refresh token expired", null, "AUTH_EXPIRED_REFRESH_TOKEN");

  const user = await User.findByPk(row.userId);
  if (!user) throw new ApiError(401, "User not found", null, "AUTH_USER_NOT_FOUND");

  // rotate refresh token (recommended)
  row.revokedAt = new Date();
  await row.save();

  const newRefresh = createRefreshToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(newRefresh),
    expiresAt,
  });

  const accessToken = signAccessToken(user);
  return { accessToken, refreshToken: newRefresh };
}

async function logout(refreshToken) {
  const tokenHash = hashToken(refreshToken);
  const row = await RefreshToken.findOne({ where: { tokenHash } });
  if (!row) return; // idempotent
  if (!row.revokedAt) {
    row.revokedAt = new Date();
    await row.save();
  }
}

async function requestPasswordReset(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const user = await findUserByEmail(normalized);
  // always behave the same (avoid user enumeration)
  if (!user) return null;

  const raw = createResetToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // best effort cleanup
  await PasswordResetToken.destroy({
    where: {
      userId: user.id,
      // cleanup old used/expired tokens
      expiresAt: { [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  }).catch(() => {});

  await PasswordResetToken.create({ userId: user.id, tokenHash, expiresAt });

  const resetLink = `${env.APP_PUBLIC_URL.replace(/\/$/, "")}/auth/reset-password?token=${raw}`;

  const subject = "Reset your AgriOne password";
  const text =
    `You requested a password reset.\n\n` +
    `Open this link to set a new password (valid 1 hour):\n${resetLink}\n\n` +
    `If you didn't request this, you can ignore this email.`;

  const html = `
    <p>You requested a password reset.</p>
    <p><a href="${resetLink}">Click here to reset your password</a> (valid 1 hour).</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  if (!hasSmtpConfig()) {
    // Dev-friendly: return link so you can test without SMTP
    if (process.env.NODE_ENV !== "production") return { resetLink };
    return null;
  }

  await sendMail({ to: user.email, subject, text, html });
  return process.env.NODE_ENV !== "production" ? { resetLink } : null;
}

async function resetPasswordWithToken(rawToken, newPassword) {
  const token = String(rawToken || "").trim();
  if (!token) throw new ApiError(400, "Invalid reset token", null, "AUTH_INVALID_RESET_TOKEN");

  const tokenHash = hashToken(token);
  const row = await PasswordResetToken.findOne({ where: { tokenHash } });
  if (!row) throw new ApiError(400, "Invalid or expired reset token", null, "AUTH_INVALID_RESET_TOKEN");
  if (row.usedAt) throw new ApiError(400, "Invalid or expired reset token", null, "AUTH_INVALID_RESET_TOKEN");
  if (row.expiresAt.getTime() < Date.now())
    throw new ApiError(400, "Invalid or expired reset token", null, "AUTH_INVALID_RESET_TOKEN");

  const user = await User.findByPk(row.userId);
  if (!user) throw new ApiError(400, "Invalid or expired reset token", null, "AUTH_INVALID_RESET_TOKEN");

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await sequelize.transaction(async (trx) => {
    await user.update({ passwordHash }, { transaction: trx });
    await row.update({ usedAt: new Date() }, { transaction: trx });
    // revoke all refresh tokens (force relogin everywhere)
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id }, transaction: trx });
  });
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found", null, "AUTH_USER_NOT_FOUND");

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok)
    throw new ApiError(
      401,
      env.AUTH_DETAILED_ERRORS ? "Incorrect password" : "Invalid credentials",
      null,
      env.AUTH_DETAILED_ERRORS ? "AUTH_INCORRECT_PASSWORD" : "AUTH_INVALID_CREDENTIALS"
    );

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await sequelize.transaction(async (trx) => {
    await user.update({ passwordHash }, { transaction: trx });
    // revoke all refresh tokens (force relogin on other devices)
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id }, transaction: trx });
  });

  return { ok: true };
}

module.exports = {
  register,
  login,
  loginWithGoogle,
  refresh,
  logout,
  requestPasswordReset,
  resetPasswordWithToken,
  changePassword,
};
