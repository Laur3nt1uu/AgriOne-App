const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
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

  const successUrl = `${process.env.FRONTEND_URL}/app/plan/success`;
  const cancelUrl = `${process.env.FRONTEND_URL}/app/plan`;

  try {
    const session = await stripeService.createPaymentSession({
      planType: plan,
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
      // Update user plan
      const newPlan = session.metadata.plan;
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
    throw new ApiError(500, 'Failed to verify payment', error.message);
  }
});

const simulatePayment = asyncHandler(async (req, res) => {
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
    const simulatedPayment = await stripeService.simulatePayment(plan, user.email);

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
    throw new ApiError(500, 'Failed to simulate payment', error.message);
  }
});

module.exports = {
  createPaymentSession,
  verifyPayment,
  simulatePayment,
};