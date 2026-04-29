const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePreferencesSchema,
  changePasswordSchema,
  changePlanSchema,
} = require("./auth.validation");
const authService = require("./auth.service");
const { User } = require("../../models");

const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  const result = await authService.register(parsed.data.email, parsed.data.password, parsed.data.username, parsed.data.name);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  const result = await authService.login(parsed.data.email, parsed.data.password);
  res.json(result);
});

const googleLogin = asyncHandler(async (req, res) => {
  const parsed = googleLoginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  const result = await authService.loginWithGoogle(parsed.data.credential, parsed.data.user);
  res.json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  const result = await authService.refresh(parsed.data.refreshToken);
  res.json(result);
});

const logout = asyncHandler(async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  await authService.logout(parsed.data.refreshToken);
  res.status(204).send();
});

const forgotPassword = asyncHandler(async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const result = await authService.requestPasswordReset(parsed.data.email);
  // avoid user enumeration: always return ok
  res.json({ ok: true, ...(result?.resetLink ? { resetLink: result.resetLink } : {}) });
});

const resetPassword = asyncHandler(async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  await authService.resetPasswordWithToken(parsed.data.token, parsed.data.password);
  res.json({ ok: true });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.sub, {
    attributes: ["id", "email", "username", "role", "plan", "globalLocationName", "globalLocationLat", "globalLocationLng"],
  });
  if (!user) throw new ApiError(404, "User not found", null, "AUTH_USER_NOT_FOUND");
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      plan: user.plan,
      globalLocation: user.globalLocationLat != null && user.globalLocationLng != null
        ? {
            name: user.globalLocationName || null,
            lat: Number(user.globalLocationLat),
            lng: Number(user.globalLocationLng),
          }
        : null,
    },
  });
});

const getPreferences = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.sub, {
    attributes: ["id", "globalLocationName", "globalLocationLat", "globalLocationLng"],
  });
  if (!user) throw new ApiError(404, "User not found", null, "AUTH_USER_NOT_FOUND");

  res.json({
    preferences: {
      globalLocation:
        user.globalLocationLat != null && user.globalLocationLng != null
          ? {
              name: user.globalLocationName || null,
              lat: Number(user.globalLocationLat),
              lng: Number(user.globalLocationLng),
            }
          : null,
    },
  });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const parsed = updatePreferencesSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const user = await User.findByPk(req.user.sub);
  if (!user) throw new ApiError(404, "User not found", null, "AUTH_USER_NOT_FOUND");

  if (Object.prototype.hasOwnProperty.call(parsed.data, "globalLocation")) {
    const gl = parsed.data.globalLocation;
    if (!gl) {
      user.globalLocationName = null;
      user.globalLocationLat = null;
      user.globalLocationLng = null;
    } else {
      user.globalLocationName = gl.name || null;
      user.globalLocationLat = gl.lat;
      user.globalLocationLng = gl.lng;
    }
  }

  await user.save();

  res.json({
    preferences: {
      globalLocation:
        user.globalLocationLat != null && user.globalLocationLng != null
          ? {
              name: user.globalLocationName || null,
              lat: Number(user.globalLocationLat),
              lng: Number(user.globalLocationLng),
            }
          : null,
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const result = await authService.changePassword(req.user.sub, parsed.data.currentPassword, parsed.data.newPassword);
  res.json(result);
});

const changePlan = asyncHandler(async (req, res) => {
  const parsed = changePlanSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const user = await User.findByPk(req.user.sub);
  if (!user) throw new ApiError(404, "User not found", null, "AUTH_USER_NOT_FOUND");

  if (parsed.data.plan !== "STARTER") {
    throw new ApiError(
      403,
      "Paid plan upgrades must use the payment flow.",
      null,
      "PLAN_DIRECT_UPGRADE_DISABLED"
    );
  }

  user.plan = parsed.data.plan;
  await user.save();

  res.json({
    ok: true,
    plan: user.plan,
    user: { id: user.id, email: user.email, username: user.username, role: user.role, plan: user.plan },
  });
});

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
  getPreferences,
  updatePreferences,
  changePassword,
  changePlan,
};
