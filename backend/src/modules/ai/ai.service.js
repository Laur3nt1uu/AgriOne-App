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

// Initialize OpenAI client (lazy — checked before each call)
let openai = null;

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new ApiError(
      503,
      "Cheia API OpenAI nu este configurată. Adaugă OPENAI_API_KEY în fișierul .env al backend-ului.",
      null,
      "AI_NOT_CONFIGURED"
    );
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

// Model configurations — use current stable models
const MODELS = {
  chat: process.env.OPENAI_MODEL || "gpt-4o",
  vision: process.env.OPENAI_VISION_MODEL || "gpt-4o",
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
    const client = getOpenAIClient();

    // Call OpenAI
    const response = await client.chat.completions.create({
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
    // Re-throw ApiError (e.g. from getOpenAIClient)
    if (error instanceof ApiError) throw error;

    console.error("OpenAI API Error:", error?.message || error);

    // Save a fallback assistant message so the conversation isn't broken
    const fallbackContent = "Serviciul AI nu este disponibil momentan. Administratorul trebuie să configureze cheia OPENAI_API_KEY. Între timp, poți folosi celelalte funcții ale platformei.";
    const savedFallback = await AiMessage.create({
      conversationId: conversation.id,
      role: "assistant",
      content: fallbackContent,
      tokensUsed: 0,
    });

    return {
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      message: {
        id: savedFallback.id,
        role: "assistant",
        content: fallbackContent,
        tokensUsed: 0,
        createdAt: savedFallback.createdAt,
      },
    };
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
    const client = getOpenAIClient();

    // Call OpenAI Vision
    const response = await client.chat.completions.create({
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
    if (error instanceof ApiError) throw error;
    console.error("OpenAI Vision API Error:", error?.message || error);
    throw new ApiError(500, "Eroare la analiza imaginii. Verifică logurile serverului.", null, "AI_VISION_ERROR");
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

// In-memory rate limit for public chat (per IP, simple approach)
const publicChatRateMap = new Map();
const PUBLIC_CHAT_LIMIT = 10; // max 10 messages per hour per IP
const PUBLIC_CHAT_WINDOW = 60 * 60 * 1000;

// Conversation history for public chat sessions (in-memory, simple)
const publicChatSessions = new Map();
const PUBLIC_SESSION_MAX_MESSAGES = 6;

/**
 * FAQ fallback for when OpenAI API key is not configured.
 * Matches user questions to curated answers so the landing page widget
 * always works, even without an API key.
 */
const FAQ_ENTRIES = [
  {
    keywords: ["ce este", "what is", "agrione", "platformă", "platform", "despre"],
    answer: "**AgriOne** este o platformă completă de management agricol inteligent. Oferă monitorizare IoT în timp real, dashboard cu date meteo, alerte automate, management financiar, rapoarte APIA și un asistent AI dedicat. Creează un cont gratuit pentru a începe! 🌱",
  },
  {
    keywords: ["preț", "pret", "cost", "tarif", "price", "plan", "gratuit", "free", "abonament"],
    answer: "AgriOne oferă **3 planuri**:\n\n• **Starter** (gratuit) — 2 terenuri, 5 senzori, funcții de bază\n• **Pro** — Terenuri nelimitate, 50 senzori, AI avansat, analize\n• **Enterprise** — Tot nelimitat, suport dedicat, integrări custom\n\nPoți începe gratuit și face upgrade oricând!",
  },
  {
    keywords: ["senzor", "sensor", "iot", "arduino", "temperatur", "umiditate", "humidity"],
    answer: "AgriOne se conectează la **senzori IoT** (Arduino) care măsoară temperatura și umiditatea solului în timp real. Datele sunt afișate pe dashboard cu grafice și poți seta **alerte automate** când valorile depășesc pragurile dorite. 📡",
  },
  {
    keywords: ["meteo", "vreme", "weather", "prognoz", "forecast"],
    answer: "Platforma integrează **OpenWeather API** pentru prognoză meteo localizată pe terenurile tale. Primești date despre temperatură, precipitații, vânt și umiditate, cu predicții pe 5 zile. ☀️🌧️",
  },
  {
    keywords: ["alert", "notificar", "notification"],
    answer: "Sistemul de **alerte** te notifică automat când:\n\n• Temperatura sau umiditatea depășesc pragurile setate\n• Condițiile meteo sunt nefavorabile\n• Senzorii nu mai trimit date\n\nPoți configura reguli personalizate pentru fiecare teren.",
  },
  {
    keywords: ["apia", "subvenți", "subventii", "raport", "report", "document"],
    answer: "AgriOne generează automat **rapoarte compatibile APIA** pentru subvenții agricole. Include date despre terenuri, parcele, culturi și suprafețe, exportabile în format PDF. 📄",
  },
  {
    keywords: ["financiar", "bani", "money", "cheltuial", "venit", "tranzacți", "tranzactii", "economic"],
    answer: "Modulul de **management financiar** urmărește veniturile, cheltuielile și tranzacțiile fermei. Oferă grafice, rapoarte și export CSV/PDF pentru o evidență completă a activității economice. 💰",
  },
  {
    keywords: ["cont", "înregistr", "inregistr", "register", "signup", "sign up", "cum încep", "cum incep", "start"],
    answer: "Crearea unui cont este **simplă și gratuită**:\n\n1. Apasă butonul **Creează cont** din pagina principală\n2. Completează formularul sau conectează-te cu **Google**\n3. Adaugă primul teren și opțional conectează senzori\n\nÎn câteva minute ești gata! 🚀",
  },
  {
    keywords: ["ai", "inteligență", "inteligenta", "artificial", "asistent", "chat", "gpt"],
    answer: "AgriOne include un **asistent AI** bazat pe GPT-4 care te ajută cu:\n\n• Sfaturi personalizate pentru culturi\n• Analiza imaginilor cu plante\n• Recomandări bazate pe datele senzorilor\n• Întrebări generale despre agricultură\n\nDisponibil în planurile Pro și Enterprise (bază în Starter).",
  },
  {
    keywords: ["teren", "land", "parcel", "fermă", "ferma", "farm"],
    answer: "Poți gestiona **multiple terenuri** în AgriOne:\n\n• Adaugă terenuri cu coordonate GPS\n• Definește parcele și culturi\n• Monitorizează fiecare teren separat\n• Generează rapoarte per teren\n\nPlanul Starter permite 2 terenuri, Pro și Enterprise — nelimitat.",
  },
  {
    keywords: ["export", "pdf", "csv", "descărc", "descarc", "download"],
    answer: "AgriOne permite **export** în mai multe formate:\n\n• **PDF** — Rapoarte detaliate, documente APIA\n• **CSV** — Date brute pentru analiză externă\n\nExportul este disponibil pentru date senzori, tranzacții financiare și rapoarte agricole.",
  },
  {
    keywords: ["sigur", "securit", "security", "safe", "date person", "gdpr", "privacy"],
    answer: "Securitatea datelor este prioritară:\n\n• Autentificare **JWT** cu refresh tokens\n• Suport **Google OAuth** \n• Criptare parole cu bcrypt\n• Rate limiting pe endpoints\n• Standarde GDPR\n\nDatele tale agricole sunt în siguranță. 🔒",
  },
];

/**
 * Find the best FAQ match for a user message.
 * Returns the answer string or null if no match.
 */
function matchFAQ(message) {
  const lower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let bestMatch = null;
  let bestScore = 0;

  for (const faq of FAQ_ENTRIES) {
    let score = 0;
    for (const kw of faq.keywords) {
      const kwNorm = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (lower.includes(kwNorm)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 ? bestMatch.answer : null;
}

const FAQ_DEFAULT_ANSWER = `Bună! 👋 Sunt asistentul AgriOne. Pot să te ajut cu informații despre:

• **Ce este AgriOne** — platformă de agricultură inteligentă
• **Planuri și prețuri** — Starter (gratuit), Pro, Enterprise
• **Senzori IoT** — monitorizare temperatură și umiditate
• **Funcționalități** — alerte, meteo, AI, rapoarte APIA, finanțe

Creează un cont gratuit pentru a explora toate funcțiile! 🌱`;

const LANDING_SYSTEM_PROMPT = `Ești **AgriOne Assistant** - un asistent virtual pentru platforma AgriOne de agricultură inteligentă.

## DESPRE AGRIONE
AgriOne este o platformă completă de management agricol care oferă:
- **Monitorizare IoT**: Senzori de temperatură și umiditate conectați la Arduino
- **Dashboard inteligent**: Vizualizare date în timp real cu grafice și KPI-uri
- **Alerte automate**: Notificări când valorile depășesc pragurile setate
- **Management terenuri**: Administrare multiplă a terenurilor agricole
- **Prognoză meteo**: Integrare cu OpenWeather API
- **Recomandări agricole**: Sfaturi bazate pe date și sezon
- **Management financiar**: Urmărire tranzacții, venituri, cheltuieli
- **Asistent AI**: Chat cu expert agricol bazat pe GPT-4
- **Rapoarte APIA**: Generare documente pentru subvenții
- **Export PDF/CSV**: Rapoarte detaliate pentru ferme

## PLANURI DISPONIBILE
- **Starter** (gratuit): 2 terenuri, 5 senzori, funcții de bază
- **Pro**: Terenuri nelimitate, 50 senzori, analiză avansată, AI complet
- **Enterprise**: Tot nelimitat, suport dedicat, integrări custom

## REGULI
1. Răspunde DOAR în limba română
2. Fii concis și informativ (max 200 cuvinte)
3. Concentrează-te pe funcționalitățile AgriOne
4. Încurajează utilizatorul să creeze un cont gratuit
5. Nu oferi sfaturi agricole detaliate - direcționează utilizatorul să folosească platforma
6. Fii prietenos și profesional`;

/**
 * Public chat for landing page (no auth required)
 * Simple, rate-limited, in-memory history
 */
async function publicChat(message, sessionId, clientIp) {
  // Rate limit check
  const ip = clientIp || "unknown";
  const now = Date.now();
  const ipEntry = publicChatRateMap.get(ip);

  if (ipEntry) {
    // Clean old entries
    ipEntry.timestamps = ipEntry.timestamps.filter(t => now - t < PUBLIC_CHAT_WINDOW);
    if (ipEntry.timestamps.length >= PUBLIC_CHAT_LIMIT) {
      throw new ApiError(429, "Prea multe mesaje. Încercați mai târziu.", null, "PUBLIC_CHAT_RATE_LIMIT");
    }
    ipEntry.timestamps.push(now);
  } else {
    publicChatRateMap.set(ip, { timestamps: [now] });
  }

  // Build conversation history from session
  const sid = sessionId || `anon-${ip}-${Date.now()}`;
  const history = publicChatSessions.get(sid) || [];

  // Add user message to history
  history.push({ role: "user", content: message });

  // Keep only last N messages
  while (history.length > PUBLIC_SESSION_MAX_MESSAGES) history.shift();

  // --- Check if OpenAI is available; if not, use FAQ fallback ---
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (!hasOpenAI) {
    const faqAnswer = matchFAQ(message) || FAQ_DEFAULT_ANSWER;
    history.push({ role: "assistant", content: faqAnswer });
    publicChatSessions.set(sid, history);

    return {
      sessionId: sid,
      message: {
        role: "assistant",
        content: faqAnswer,
        createdAt: new Date().toISOString(),
      },
    };
  }

  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: MODELS.chat,
      messages: [
        { role: "system", content: LANDING_SYSTEM_PROMPT },
        ...history,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "Vă rugăm să încercați din nou.";

    // Save assistant reply to session history
    history.push({ role: "assistant", content: reply });
    publicChatSessions.set(sid, history);

    // Clean up old sessions periodically (every ~1% of calls)
    if (Math.random() < 0.01) {
      for (const [key] of publicChatSessions) {
        if (publicChatSessions.size > 500) publicChatSessions.delete(key);
      }
      for (const [key, val] of publicChatRateMap) {
        val.timestamps = val.timestamps.filter(t => Date.now() - t < PUBLIC_CHAT_WINDOW);
        if (val.timestamps.length === 0) publicChatRateMap.delete(key);
      }
    }

    return {
      sessionId: sid,
      message: {
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Public Chat OpenAI Error:", error?.message || error);

    // Fallback to FAQ on any OpenAI error so the widget always works
    const faqAnswer = matchFAQ(message) || FAQ_DEFAULT_ANSWER;
    history.push({ role: "assistant", content: faqAnswer });
    publicChatSessions.set(sid, history);

    return {
      sessionId: sid,
      message: {
        role: "assistant",
        content: faqAnswer,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

module.exports = {
  publicChat,
  chat,
  analyzeImage,
  listConversations,
  getConversation,
  deleteConversation,
  getUsageStats,
};
