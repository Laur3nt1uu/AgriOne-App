/**
 * AI Controller
 * Handles HTTP requests for AI assistant features
 */

const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const aiService = require("./ai.service");
const { User } = require("../../models");
const {
  chatMessageSchema,
  analyzeImageSchema,
  getConversationSchema,
  paginationSchema,
  publicChatSchema,
} = require("./ai.validation");

/**
 * POST /api/ai/public-chat
 * Public chat endpoint for landing page (no auth, rate-limited, app Q&A only)
 */
const publicChat = asyncHandler(async (req, res) => {
  const parsed = publicChatSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Date invalide", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const { message, sessionId } = parsed.data;
  const result = await aiService.publicChat(message, sessionId, req.ip);
  return res.status(200).json(result);
});

/**
 * POST /api/ai/chat
 * Send a message and get AI response
 */
const chat = asyncHandler(async (req, res) => {
  const parsed = chatMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Date invalide", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const { conversationId, message, context } = parsed.data;
  const userId = req.user.sub;

  // Get user's plan
  const user = await User.findByPk(userId, { attributes: ["plan"] });
  const userPlan = user?.plan || "STARTER";

  const result = await aiService.chat(userId, userPlan, conversationId, message, context);

  return res.status(200).json(result);
});

/**
 * POST /api/ai/analyze-image
 * Analyze an image using GPT-4 Vision
 */
const analyzeImage = asyncHandler(async (req, res) => {
  const parsed = analyzeImageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Date invalide", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const { conversationId, imageUrl, question, context } = parsed.data;
  const userId = req.user.sub;

  // Get user's plan
  const user = await User.findByPk(userId, { attributes: ["plan"] });
  const userPlan = user?.plan || "STARTER";

  const result = await aiService.analyzeImage(userId, userPlan, conversationId, imageUrl, question, context);

  return res.status(200).json(result);
});

/**
 * GET /api/ai/conversations
 * List user's conversations
 */
const listConversations = asyncHandler(async (req, res) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, "Parametri invalizi", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const { page, limit } = parsed.data;
  const userId = req.user.sub;

  const result = await aiService.listConversations(userId, page, limit);

  return res.status(200).json(result);
});

/**
 * GET /api/ai/conversations/:id
 * Get a specific conversation with messages
 */
const getConversation = asyncHandler(async (req, res) => {
  const parsed = getConversationSchema.safeParse({ id: req.params.id });
  if (!parsed.success) {
    throw new ApiError(400, "ID conversație invalid", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const userId = req.user.sub;
  const conversation = await aiService.getConversation(userId, parsed.data.id);

  return res.status(200).json({ conversation });
});

/**
 * DELETE /api/ai/conversations/:id
 * Delete a conversation
 */
const deleteConversation = asyncHandler(async (req, res) => {
  const parsed = getConversationSchema.safeParse({ id: req.params.id });
  if (!parsed.success) {
    throw new ApiError(400, "ID conversație invalid", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const userId = req.user.sub;
  const result = await aiService.deleteConversation(userId, parsed.data.id);

  return res.status(200).json(result);
});

/**
 * GET /api/ai/usage
 * Get user's AI usage statistics
 */
const getUsage = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  // Get user's plan
  const user = await User.findByPk(userId, { attributes: ["plan"] });
  const userPlan = user?.plan || "STARTER";

  const stats = await aiService.getUsageStats(userId, userPlan);

  return res.status(200).json(stats);
});

/**
 * GET /api/ai/quick-actions
 * Get available quick actions for the AI assistant
 */
const getQuickActions = asyncHandler(async (req, res) => {
  const { QUICK_ACTIONS } = require("./ai.prompts");

  return res.status(200).json({
    actions: Object.entries(QUICK_ACTIONS).map(([key, prompt]) => ({
      id: key,
      prompt,
    })),
  });
});

module.exports = {
  publicChat,
  chat,
  analyzeImage,
  listConversations,
  getConversation,
  deleteConversation,
  getUsage,
  getQuickActions,
};
