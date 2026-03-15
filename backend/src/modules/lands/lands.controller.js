const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const { createLandSchema, updateLandSchema } = require("./lands.validation");
const service = require("./lands.service");
const { Land, User } = require("../../models");
const { getLimits } = require("../../config/planLimits");

const create = asyncHandler(async (req, res) => {
  const parsed = createLandSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  const requestedOwnerId = parsed.data.ownerId;
  const ownerId = req.user?.role === "ADMIN" && requestedOwnerId ? requestedOwnerId : req.user.sub;

  // Enforce plan limit on lands (skip for admins)
  if (req.user?.role !== "ADMIN") {
    const owner = await User.findByPk(ownerId, { attributes: ["plan"] });
    const limits = getLimits(owner?.plan);
    if (limits.maxLands !== Infinity) {
      const count = await Land.count({ where: { ownerId } });
      if (count >= limits.maxLands) {
        throw new ApiError(403, `Planul tău (${owner?.plan || "STARTER"}) permite maxim ${limits.maxLands} terenuri. Fă upgrade pentru mai multe.`, null, "PLAN_LAND_LIMIT");
      }
    }
  }

  const { ownerId: _ignore, ...payload } = parsed.data;
  const land = await service.createLand(ownerId, payload);

  // For admin, include owner info in response (useful for UI confirmation)
  if (req.user?.role === "ADMIN") {
    const landRow = await Land.findByPk(land.id, {
      include: [{ model: User, attributes: ["id", "email", "username", "role"] }],
    });
    return res.status(201).json({
      land: {
        ...(landRow?.toJSON ? landRow.toJSON() : land),
        owner: landRow?.User ? { id: landRow.User.id, email: landRow.User.email, username: landRow.User.username, role: landRow.User.role } : undefined,
      },
    });
  }

  return res.status(201).json({ land });
});

const listMine = asyncHandler(async (req, res) => {
  if (req.user?.role === "ADMIN") {
    const lands = await Land.findAll({
      include: [{ model: User, attributes: ["id", "email", "username", "role"] }],
      order: [["created_at", "DESC"]],
    });

    const out = await service.attachArduinoMeta(null, lands);
    return res.json({
      lands: out.map((l) => ({
        ...l,
        owner: l.User ? { id: l.User.id, email: l.User.email, username: l.User.username, role: l.User.role } : undefined,
      })),
    });
  }

  const lands = await service.listMyLands(req.user.sub);
  return res.json({ lands });
});

const getOne = asyncHandler(async (req, res) => {
  if (req.user?.role === "ADMIN") {
    const landRow = await Land.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "email", "username", "role"] }],
    });
    if (!landRow) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

    const [enriched] = await service.attachArduinoMeta(null, [landRow]);
    const land = {
      ...(enriched || (landRow.toJSON ? landRow.toJSON() : landRow)),
      owner: landRow.User ? { id: landRow.User.id, email: landRow.User.email, username: landRow.User.username, role: landRow.User.role } : undefined,
    };
    return res.json({ land });
  }

  const land = await service.getMyLandByIdWithMeta(req.user.sub, req.params.id);
  return res.json({ land });
});

const update = asyncHandler(async (req, res) => {
  const parsed = updateLandSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");

  if (req.user?.role === "ADMIN") {
    const landRow = await Land.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "email", "username", "role"] }],
    });
    if (!landRow) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

    if (parsed.data.name !== undefined) landRow.name = parsed.data.name;
    if (parsed.data.cropType !== undefined) landRow.cropType = parsed.data.cropType;
    if (parsed.data.areaHa !== undefined) landRow.areaHa = parsed.data.areaHa;
    if (parsed.data.geometry !== undefined) landRow.geometry = parsed.data.geometry;
    if (parsed.data.centroid?.lat !== undefined) landRow.centroidLat = parsed.data.centroid.lat;
    if (parsed.data.centroid?.lng !== undefined) landRow.centroidLng = parsed.data.centroid.lng;

    await landRow.save();
    const [enriched] = await service.attachArduinoMeta(null, [landRow]);
    return res.json({
      land: {
        ...(enriched || (landRow.toJSON ? landRow.toJSON() : landRow)),
        owner: landRow.User ? { id: landRow.User.id, email: landRow.User.email, username: landRow.User.username, role: landRow.User.role } : undefined,
      },
    });
  }

  const land = await service.updateMyLand(req.user.sub, req.params.id, parsed.data);
  const enriched = await service.getMyLandByIdWithMeta(req.user.sub, land.id);
  return res.json({ land: enriched });
});

const remove = asyncHandler(async (req, res) => {
  if (req.user?.role === "ADMIN") {
    const land = await Land.findByPk(req.params.id);
    if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");
    await land.destroy();
    return res.status(204).send();
  }

  await service.deleteMyLand(req.user.sub, req.params.id);
  return res.status(204).send();
});

module.exports = { create, listMine, getOne, update, remove };
