const express = require('express');
const router = express.Router();
const requireAuth = require('../../middlewares/auth.middleware');
const c = require('./payments.controller');

// Payment routes
router.post('/create-session', requireAuth, c.createPaymentSession);
router.post('/verify', requireAuth, c.verifyPayment);
router.post('/simulate', requireAuth, c.simulatePayment);

module.exports = router;