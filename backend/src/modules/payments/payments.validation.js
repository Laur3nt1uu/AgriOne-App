const { z } = require('zod');

const createPaymentSessionSchema = z.object({
  plan: z.enum(['PRO', 'ENTERPRISE'], {
    required_error: 'Plan is required',
    invalid_type_error: 'Invalid plan type',
  }),
});

const verifyPaymentSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

const simulatePaymentSchema = z.object({
  plan: z.enum(['PRO', 'ENTERPRISE'], {
    required_error: 'Plan is required',
    invalid_type_error: 'Invalid plan type',
  }),
});

module.exports = {
  createPaymentSessionSchema,
  verifyPaymentSchema,
  simulatePaymentSchema,
};