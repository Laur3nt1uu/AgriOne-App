const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const { createLandSchema, updateLandSchema } = require("./lands.validation");
const service = require("./lands.service");

const create = asyncHandler(async (req, res) => {
  const parsed = createLandSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const land = await service.createLand(req.user.sub, parsed.data);
  res.status(201).json({ land });
});

const listMine = asyncHandler(async (req, res) => {
  const lands = await service.listMyLands(req.user.sub);
  res.json({ lands });
});

const getOne = asyncHandler(async (req, res) => {
  const land = await service.getMyLandByIdWithMeta(req.user.sub, req.params.id);
  res.json({ land });
});

const update = asyncHandler(async (req, res) => {
  const parsed = updateLandSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const land = await service.updateMyLand(req.user.sub, req.params.id, parsed.data);
  // return enriched land for UI convenience
  const enriched = await service.getMyLandByIdWithMeta(req.user.sub, land.id);
  res.json({ land: enriched });
});

const remove = asyncHandler(async (req, res) => {
  await service.deleteMyLand(req.user.sub, req.params.id);
  res.status(204).send();
});

module.exports = { create, listMine, getOne, update, remove };
