const Stripe = require('stripe');
const ApiError = require('../../utils/ApiError');

// Initialize Stripe with test key for simulation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51ABC...demo_key');

class StripeService {
  async createPaymentSession({ planType, priceId, userEmail, successUrl, cancelUrl }) {
    try {
      // Plan pricing in Romanian Lei (RON)
      const planPrices = {
        PRO: 4900, // 49 RON in bani (cents)
        ENTERPRISE: 29900 // 299 RON in bani (cents) - custom but we set a demo price
      };

      // For simulation, we'll create a simple checkout session
      const session = await stripe.checkout.sessions.create({
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
          userEmail: userEmail,
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
        status: 'created'
      };
    } catch (error) {
      console.error('Stripe payment session creation error:', error);
      throw new ApiError(400, 'Failed to create payment session', error.message);
    }
  }

  async verifyPaymentSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return {
        id: session.id,
        status: session.payment_status,
        metadata: session.metadata,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
      };
    } catch (error) {
      console.error('Stripe session verification error:', error);
      throw new ApiError(400, 'Failed to verify payment session', error.message);
    }
  }

  async createPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        url: session.url
      };
    } catch (error) {
      console.error('Stripe portal session error:', error);
      throw new ApiError(400, 'Failed to create portal session', error.message);
    }
  }

  // For simulation purposes - creates a fake successful payment
  async simulatePayment(planType, userEmail) {
    // In a real implementation, this would be handled by Stripe webhooks
    return {
      id: `sim_${Date.now()}`,
      status: 'paid',
      metadata: {
        plan: planType,
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