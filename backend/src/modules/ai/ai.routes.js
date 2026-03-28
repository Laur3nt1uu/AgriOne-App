/**
 * AI Routes
 * Express router for AI assistant endpoints
 */

const { Router } = require("express");
const requireAuth = require("../../middlewares/auth.middleware");
const controller = require("./ai.controller");

const router = Router();

// All routes require authentication
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
