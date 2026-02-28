const ApiError = require("../../utils/ApiError");
const { Land, Sensor } = require("../../models");
const { Op } = require("sequelize");

async function attachArduinoMeta(ownerId, lands) {
  const arr = Array.isArray(lands) ? lands : [lands];
  const landIds = arr.map((l) => l?.id).filter(Boolean);
  if (!landIds.length) return arr;

  const sensors = await Sensor.findAll({
    where: { ownerId, landId: { [Op.in]: landIds } },
    order: [["updated_at", "DESC"]],
  });

  const byLand = new Map();
  for (const s of sensors) {
    if (!s.landId) continue;
    if (!byLand.has(String(s.landId))) byLand.set(String(s.landId), s);
  }

  return arr.map((l) => {
    const sensor = byLand.get(String(l.id));
    const json = l.toJSON ? l.toJSON() : l;
    return {
      ...json,
      // backwards-compat for existing UI
      sensorId: sensor ? sensor.sensorCode : null,
      lastSensorAt: sensor ? sensor.lastReadingAt : null,

      // new clearer fields
      arduinoCode: sensor ? sensor.sensorCode : null,
      arduinoName: sensor ? sensor.name : null,
    };
  });
}

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
  const lands = await Land.findAll({
    where: { ownerId },
    order: [["created_at", "DESC"]],
  });

  return attachArduinoMeta(ownerId, lands);
}

async function getMyLandById(ownerId, landId) {
  const land = await Land.findOne({ where: { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");
  return land;
}

async function getMyLandByIdWithMeta(ownerId, landId) {
  const land = await getMyLandById(ownerId, landId);
  const [enriched] = await attachArduinoMeta(ownerId, [land]);
  return enriched;
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
  getMyLandByIdWithMeta,
  updateMyLand,
  deleteMyLand,
};
