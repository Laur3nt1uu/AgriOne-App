const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const { subscribeSchema } = require("./newsletter.validation");
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

module.exports = {
  subscribe,
};
