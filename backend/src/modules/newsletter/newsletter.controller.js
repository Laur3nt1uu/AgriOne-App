const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const { subscribeSchema, sendCampaignSchema } = require("./newsletter.validation");
const newsletterService = require("./newsletter.service");

const subscribe = asyncHandler(async (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const result = await newsletterService.subscribeEmail(
    parsed.data.email,
    parsed.data.language,
    parsed.data.source
  );

  res.status(result.alreadySubscribed ? 200 : 201).json({
    ok: true,
    message: result.alreadySubscribed
      ? "Ești deja abonat la newsletter."
      : "Abonare reușită! Verifică emailul pentru confirmare.",
  });
});

const getCampaigns = asyncHandler(async (req, res) => {
  const language = req.query.language || "ro";
  const campaigns = newsletterService.getCampaigns(language);
  res.json({ ok: true, campaigns });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await newsletterService.getSubscriberStats();
  res.json({ ok: true, stats });
});

const unsubscribe = asyncHandler(async (req, res) => {
  const result = await newsletterService.unsubscribeByToken(req.params.token);
  res.json({ ok: true, ...result });
});

const sendCampaign = asyncHandler(async (req, res) => {
  const parsed = sendCampaignSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
  }

  const result = await newsletterService.sendCampaign(parsed.data.campaignKey);
  res.json({ ok: true, ...result });
});

module.exports = {
  subscribe,
  unsubscribe,
  getCampaigns,
  getStats,
  sendCampaign,
};
