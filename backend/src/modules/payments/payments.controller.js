const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');
const stripeService = require('./stripe.service');
const { User } = require('../../models');
const {
  createPaymentSessionSchema,
  verifyPaymentSchema,
  simulatePaymentSchema,
} = require('./payments.validation');

const createPaymentSession = asyncHandler(async (req, res) => {
  const parsed = createPaymentSessionSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const { plan } = parsed.data;
  const user = await User.findByPk(req.user.sub);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Validate plan
  if (!['PRO', 'ENTERPRISE'].includes(plan)) {
    throw new ApiError(400, 'Invalid plan selected');
  }

  // Check if user is already on the plan
  if (user.plan === plan) {
    throw new ApiError(400, 'User is already on this plan');
  }

  const publicUrl = env.APP_PUBLIC_URL.replace(/\/$/, "");
  const successUrl = `${publicUrl}/app/plan/success`;
  const cancelUrl = `${publicUrl}/app/plan`;

  try {
    const session = await stripeService.createPaymentSession({
      planType: plan,
      userId: user.id,
      userEmail: user.email,
      successUrl,
      cancelUrl,
    });

    res.json({
      ok: true,
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to create payment session', error.message);
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const parsed = verifyPaymentSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const { sessionId } = parsed.data;
  const user = await User.findByPk(req.user.sub);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  try {
    const session = await stripeService.verifyPaymentSession(sessionId);

    if (session.status === 'paid') {
      const newPlan = session.metadata.plan;
      if (!['PRO', 'ENTERPRISE'].includes(newPlan)) {
        throw new ApiError(400, 'Invalid payment plan', null, 'PAYMENT_INVALID_PLAN');
      }
      if (session.metadata.userId && String(session.metadata.userId) !== String(user.id)) {
        throw new ApiError(403, 'Payment session belongs to another user', null, 'PAYMENT_SESSION_OWNER_MISMATCH');
      }
      if (session.metadata.userEmail && String(session.metadata.userEmail).toLowerCase() !== String(user.email).toLowerCase()) {
        throw new ApiError(403, 'Payment session belongs to another user', null, 'PAYMENT_SESSION_OWNER_MISMATCH');
      }

      user.plan = newPlan;
      await user.save();

      res.json({
        ok: true,
        plan: newPlan,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          plan: user.plan
        },
      });
    } else {
      throw new ApiError(400, 'Payment not completed');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to verify payment', error.message);
  }
});

const simulatePayment = asyncHandler(async (req, res) => {
  if (!env.PAYMENTS_DEMO_MODE) {
    throw new ApiError(403, 'Demo payments are disabled', null, 'PAYMENT_DEMO_DISABLED');
  }

  const parsed = simulatePaymentSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const { plan } = parsed.data;
  const user = await User.findByPk(req.user.sub);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Validate plan
  if (!['PRO', 'ENTERPRISE'].includes(plan)) {
    throw new ApiError(400, 'Invalid plan selected');
  }

  // For demo purposes, simulate a successful payment
  try {
    const simulatedPayment = await stripeService.simulatePayment(plan, user.id, user.email);

    // Update user plan immediately
    user.plan = plan;
    await user.save();

    res.json({
      ok: true,
      plan: plan,
      simulation: true,
      payment: simulatedPayment,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        plan: user.plan
      },
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to simulate payment', error.message);
  }
});

module.exports = {
  createPaymentSession,
  verifyPayment,
  simulatePayment,
};
