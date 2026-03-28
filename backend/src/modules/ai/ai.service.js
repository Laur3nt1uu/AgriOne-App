/**
 * AI Service
 * Handles OpenAI integration and conversation management
 */

const OpenAI = require("openai");
const { AiConversation, AiMessage, User } = require("../../models");
const { getSystemPrompt, IMAGE_ANALYSIS_PROMPT } = require("./ai.prompts");
const { buildUserContext, getQuickContextSummary } = require("./ai.context");
const { PLAN_LIMITS } = require("../../config/planLimits");
const ApiError = require("../../utils/ApiError");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model configurations
const MODELS = {
  chat: "gpt-4-turbo-preview",
  vision: "gpt-4-turbo",
};

const MAX_HISTORY_MESSAGES = 10;

/**
 * Check if user has reached their daily AI message limit
 */
async function checkRateLimit(userId, userPlan) {
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.STARTER;
  const dailyLimit = limits.aiMessagesPerDay || 5;

  if (dailyLimit === Infinity) return true;

  // Count today's messages
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMessages = await AiMessage.count({
    include: [{
      model: AiConversation,
      where: { ownerId: userId },
      required: true,
    }],
    where: {
      role: "user",
      createdAt: { [require("sequelize").Op.gte]: today },
    },
  });

  if (todayMessages >= dailyLimit) {
    throw new ApiError(
      429,
      `Ai atins limita de ${dailyLimit} mesaje AI pe zi. Actualizează planul pentru mai multe mesaje.`,
      { limit: dailyLimit, used: todayMessages },
      "AI_RATE_LIMIT_EXCEEDED"
    );
  }

  return true;
}

/**
 * Get or create a conversation
 */
async function getOrCreateConversation(userId, conversationId, context = {}) {
  if (conversationId) {
    const existing = await AiConversation.findOne({
      where: { id: conversationId, ownerId: userId },
    });

    if (!existing) {
      throw new ApiError(404, "Conversația nu a fost găsită", null, "CONVERSATION_NOT_FOUND");
    }

    return existing;
  }

  // Create new conversation
  const userContext = await buildUserContext(userId, context);
  const title = context.landId
    ? `Chat despre ${userContext.currentLand?.name || "teren"}`
    : `Conversație nouă - ${new Date().toLocaleDateString("ro-RO")}`;

  return AiConversation.create({
    ownerId: userId,
    title,
    context: userContext,
    totalTokens: 0,
  });
}

/**
 * Get conversation history for context
 */
async function getConversationHistory(conversationId, limit = MAX_HISTORY_MESSAGES) {
  const messages = await AiMessage.findAll({
    where: { conversationId },
    order: [["createdAt", "ASC"]],
    limit,
    attributes: ["role", "content"],
  });

  return messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * Send a chat message and get AI response
 */
async function chat(userId, userPlan, conversationId, message, contextOptions = {}) {
  // Check rate limit
  await checkRateLimit(userId, userPlan);

  // Get or create conversation
  const conversation = await getOrCreateConversation(userId, conversationId, contextOptions);

  // Build user context
  const userContext = conversation.context || await buildUserContext(userId, contextOptions);
  const systemPrompt = getSystemPrompt(userContext);

  // Get conversation history
  const history = await getConversationHistory(conversation.id);

  // Save user message
  await AiMessage.create({
    conversationId: conversation.id,
    role: "user",
    content: message,
  });

  try {
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: MODELS.chat,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content || "Nu am putut genera un răspuns.";
    const tokensUsed = response.usage?.total_tokens || 0;

    // Save assistant message
    const savedMessage = await AiMessage.create({
      conversationId: conversation.id,
      role: "assistant",
      content: assistantMessage,
      tokensUsed,
    });

    // Update conversation token count
    await conversation.increment("totalTokens", { by: tokensUsed });

    return {
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      message: {
        id: savedMessage.id,
        role: "assistant",
        content: assistantMessage,
        tokensUsed,
        createdAt: savedMessage.createdAt,
      },
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.code === "insufficient_quota") {
      throw new ApiError(503, "Serviciul AI este temporar indisponibil. Vă rugăm încercați mai târziu.", null, "AI_SERVICE_UNAVAILABLE");
    }

    throw new ApiError(500, "Eroare la procesarea mesajului AI", null, "AI_PROCESSING_ERROR");
  }
}

/**
 * Analyze an image using GPT-4 Vision
 */
async function analyzeImage(userId, userPlan, conversationId, imageUrl, question, contextOptions = {}) {
  // Check rate limit
  await checkRateLimit(userId, userPlan);

  // Get or create conversation
  const conversation = await getOrCreateConversation(userId, conversationId, contextOptions);

  // Build context
  const userContext = conversation.context || await buildUserContext(userId, contextOptions);
  const systemPrompt = getSystemPrompt(userContext);

  // Save user message with image
  await AiMessage.create({
    conversationId: conversation.id,
    role: "user",
    content: question || "Analizează această imagine.",
    imageUrl,
  });

  try {
    // Call OpenAI Vision
    const response = await openai.chat.completions.create({
      model: MODELS.vision,
      messages: [
        { role: "system", content: systemPrompt + "\n\n" + IMAGE_ANALYSIS_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: question || "Analizează această imagine și identifică eventualele probleme agricole." },
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const assistantMessage = response.choices[0]?.message?.content || "Nu am putut analiza imaginea.";
    const tokensUsed = response.usage?.total_tokens || 0;

    // Save assistant message
    const savedMessage = await AiMessage.create({
      conversationId: conversation.id,
      role: "assistant",
      content: assistantMessage,
      tokensUsed,
    });

    // Update conversation token count
    await conversation.increment("totalTokens", { by: tokensUsed });

    return {
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      message: {
        id: savedMessage.id,
        role: "assistant",
        content: assistantMessage,
        tokensUsed,
        createdAt: savedMessage.createdAt,
      },
    };
  } catch (error) {
    console.error("OpenAI Vision API Error:", error);
    throw new ApiError(500, "Eroare la analiza imaginii", null, "AI_VISION_ERROR");
  }
}

/**
 * List user conversations
 */
async function listConversations(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const { rows, count } = await AiConversation.findAndCountAll({
    where: { ownerId: userId },
    order: [["updatedAt", "DESC"]],
    limit,
    offset,
    attributes: ["id", "title", "context", "totalTokens", "createdAt", "updatedAt"],
  });

  return {
    conversations: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Get conversation with messages
 */
async function getConversation(userId, conversationId) {
  const conversation = await AiConversation.findOne({
    where: { id: conversationId, ownerId: userId },
    include: [{
      model: AiMessage,
      as: "messages",
      order: [["createdAt", "ASC"]],
    }],
  });

  if (!conversation) {
    throw new ApiError(404, "Conversația nu a fost găsită", null, "CONVERSATION_NOT_FOUND");
  }

  return conversation;
}

/**
 * Delete a conversation
 */
async function deleteConversation(userId, conversationId) {
  const deleted = await AiConversation.destroy({
    where: { id: conversationId, ownerId: userId },
  });

  if (!deleted) {
    throw new ApiError(404, "Conversația nu a fost găsită", null, "CONVERSATION_NOT_FOUND");
  }

  return { deleted: true };
}

/**
 * Get user's AI usage stats
 */
async function getUsageStats(userId, userPlan) {
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.STARTER;
  const dailyLimit = limits.aiMessagesPerDay || 5;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMessages = await AiMessage.count({
    include: [{
      model: AiConversation,
      where: { ownerId: userId },
      required: true,
    }],
    where: {
      role: "user",
      createdAt: { [require("sequelize").Op.gte]: today },
    },
  });

  const totalConversations = await AiConversation.count({
    where: { ownerId: userId },
  });

  return {
    todayMessages,
    dailyLimit: dailyLimit === Infinity ? "nelimitat" : dailyLimit,
    remainingToday: dailyLimit === Infinity ? "nelimitat" : Math.max(0, dailyLimit - todayMessages),
    totalConversations,
    plan: userPlan,
  };
}

module.exports = {
  chat,
  analyzeImage,
  listConversations,
  getConversation,
  deleteConversation,
  getUsageStats,
};
