const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const env = require("../../config/env");
const { ingestSchema } = require("./iot.validation");
const service = require("./iot.service");

const ingest = asyncHandler(async (req, res) => {
  const key = req.headers["x-iot-key"];
  if (!key || key !== env.IOT_MASTER_KEY) throw new ApiError(401, "Invalid IoT key", null, "IOT_INVALID_KEY");

  const parsed = ingestSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const result = await service.ingest(parsed.data);
  res.status(201).json(result);
});

module.exports = { ingest };
