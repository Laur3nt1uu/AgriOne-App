const ApiError = require("../../utils/ApiError");
const { Land } = require("../../models");

async function createLand(ownerId, payload) {
  return Land.create({
    ownerId,
    name: payload.name,
    cropType: payload.cropType,
    areaHa: payload.areaHa,
    geometry: payload.geometry,
    centroidLat: payload.centroid.lat,
    centroidLng: payload.centroid.lng,
  });
}

async function listMyLands(ownerId) {
  return Land.findAll({
    where: { ownerId },
    order: [["created_at", "DESC"]],
  });
}

async function getMyLandById(ownerId, landId) {
  const land = await Land.findOne({ where: { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");
  return land;
}

async function updateMyLand(ownerId, landId, patch) {
  const land = await getMyLandById(ownerId, landId);

  if (patch.name !== undefined) land.name = patch.name;
  if (patch.cropType !== undefined) land.cropType = patch.cropType;
  if (patch.areaHa !== undefined) land.areaHa = patch.areaHa;
  if (patch.geometry !== undefined) land.geometry = patch.geometry;
  if (patch.centroid?.lat !== undefined) land.centroidLat = patch.centroid.lat;
  if (patch.centroid?.lng !== undefined) land.centroidLng = patch.centroid.lng;

  await land.save();
  return land;
}

async function deleteMyLand(ownerId, landId) {
  const land = await getMyLandById(ownerId, landId);
  await land.destroy();
}

module.exports = {
  createLand,
  listMyLands,
  getMyLandById,
  updateMyLand,
  deleteMyLand,
};
