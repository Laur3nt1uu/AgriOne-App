/**
 * AI Validation Schemas
 * Zod schemas for AI module request validation
 */

const { z } = require("zod");

const chatMessageSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  message: z
    .string()
    .min(1, "Mesajul nu poate fi gol")
    .max(4000, "Mesajul este prea lung (max 4000 caractere)"),
  context: z
    .object({
      landId: z.string().uuid().optional(),
      cropType: z.string().optional(),
    })
    .optional(),
});

const analyzeImageSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url("URL-ul imaginii nu este valid"),
  question: z
    .string()
    .max(1000, "Întrebarea este prea lungă")
    .optional()
    .default("Analizează această imagine și identifică eventualele probleme."),
  context: z
    .object({
      landId: z.string().uuid().optional(),
      cropType: z.string().optional(),
    })
    .optional(),
});

const getConversationSchema = z.object({
  id: z.string().uuid("ID conversație invalid"),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const publicChatSchema = z.object({
  message: z
    .string()
    .min(1, "Mesajul nu poate fi gol")
    .max(500, "Mesajul este prea lung (max 500 caractere)"),
  sessionId: z.string().max(64).optional().nullable(),
});

module.exports = {
  chatMessageSchema,
  analyzeImageSchema,
  getConversationSchema,
  paginationSchema,
  publicChatSchema,
};
