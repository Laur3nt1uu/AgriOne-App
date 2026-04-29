const { z } = require("zod");

const subscribeSchema = z.object({
  email: z.string().email("Email invalid."),
  language: z.enum(["ro", "en"]).optional().default("ro"),
  source: z.string().max(50).optional().default("blog_page"),
});

const sendCampaignSchema = z.object({
  campaignKey: z.string().min(1).max(50),
});

module.exports = {
  subscribeSchema,
  sendCampaignSchema,
};
