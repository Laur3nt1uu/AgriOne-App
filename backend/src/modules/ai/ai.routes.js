/**
 * AI Routes
 * Express router for AI assistant endpoints
 */

const { Router } = require("express");
const requireAuth = require("../../middlewares/auth.middleware");
const controller = require("./ai.controller");

const router = Router();

// Public chat endpoint (for landing page widget - no auth required)
router.post("/public-chat", controller.publicChat);

// All routes below require authentication
router.use(requireAuth);

// Chat endpoints
router.post("/chat", controller.chat);
router.post("/analyze-image", controller.analyzeImage);

// Conversation management
router.get("/conversations", controller.listConversations);
router.get("/conversations/:id", controller.getConversation);
router.delete("/conversations/:id", controller.deleteConversation);

// Usage and quick actions
router.get("/usage", controller.getUsage);
router.get("/quick-actions", controller.getQuickActions);

module.exports = router;
