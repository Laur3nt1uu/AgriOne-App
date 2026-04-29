const Stripe = require('stripe');
const ApiError = require('../../utils/ApiError');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function requireStripe() {
  if (!stripe) {
    throw new ApiError(503, 'Stripe is not configured', null, 'STRIPE_NOT_CONFIGURED');
  }
  return stripe;
}

class StripeService {
  async createPaymentSession({ planType, userId, userEmail, successUrl, cancelUrl }) {
    try {
      const client = requireStripe();

      // Plan pricing in Romanian Lei (RON)
      const planPrices = {
        PRO: 4900, // 49 RON in bani (cents)
        ENTERPRISE: 29900 // 299 RON in bani (cents) - custom but we set a demo price
      };

      // For simulation, we'll create a simple checkout session
      const session = await client.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'ron',
              product_data: {
                name: `AgriOne ${planType} Plan`,
                description: `Subscription to AgriOne ${planType} Plan`,
                images: ['https://agriOne.com/logo.png'], // Optional
              },
              unit_amount: planPrices[planType],
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        customer_email: userEmail,
        metadata: {
          plan: planType,
          userId,
          userEmail: userEmail,
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
        status: 'created'
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Stripe payment session creation error:', error);
      throw new ApiError(400, 'Failed to create payment session', error.message);
    }
  }

  async verifyPaymentSession(sessionId) {
    try {
      const client = requireStripe();
      const session = await client.checkout.sessions.retrieve(sessionId);

      return {
        id: session.id,
        status: session.payment_status,
        metadata: session.metadata,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Stripe session verification error:', error);
      throw new ApiError(400, 'Failed to verify payment session', error.message);
    }
  }

  async createPortalSession(customerId, returnUrl) {
    try {
      const client = requireStripe();
      const session = await client.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        url: session.url
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Stripe portal session error:', error);
      throw new ApiError(400, 'Failed to create portal session', error.message);
    }
  }

  // For simulation purposes - creates a fake successful payment
  async simulatePayment(planType, userId, userEmail) {
    // In a real implementation, this would be handled by Stripe webhooks
    return {
      id: `sim_${Date.now()}`,
      status: 'paid',
      metadata: {
        plan: planType,
        userId,
        userEmail: userEmail,
      },
      customer_email: userEmail,
      amount_total: planType === 'PRO' ? 4900 : 29900,
      currency: 'ron',
      simulation: true
    };
  }
}

module.exports = new StripeService();
