const ApiError = require("../../utils/ApiError");
const { ApiaParcel, Land } = require("../../models");
const RATES = require("./apia.rates");

// ─── CRUD ────────────────────────────────────────────

async function listParcels(actor) {
  const isAdmin = actor?.role === "ADMIN";
  const where = isAdmin ? {} : { ownerId: actor.sub };

  const parcels = await ApiaParcel.findAll({
    where,
    include: [{ model: Land, attributes: ["id", "name", "cropType", "areaHa"] }],
    order: [["created_at", "DESC"]],
  });

  return parcels;
}

async function getParcelByLand(actor, landId) {
  const isAdmin = actor?.role === "ADMIN";
  const where = isAdmin ? { landId } : { landId, ownerId: actor.sub };

  const parcel = await ApiaParcel.findOne({
    where,
    include: [{ model: Land, attributes: ["id", "name", "cropType", "areaHa"] }],
  });

  return parcel;
}

async function createParcel(ownerId, data) {
  // Verify land exists and belongs to user
  const land = await Land.findOne({ where: { id: data.landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  // Check if APIA data already exists for this land
  const existing = await ApiaParcel.findOne({ where: { landId: data.landId } });
  if (existing) throw new ApiError(409, "APIA data already exists for this land", null, "APIA_PARCEL_EXISTS");

  const parcel = await ApiaParcel.create({
    ...data,
    ownerId,
  });

  return parcel;
}

async function updateParcel(actor, parcelId, data) {
  const isAdmin = actor?.role === "ADMIN";
  const where = isAdmin ? { id: parcelId } : { id: parcelId, ownerId: actor.sub };

  const parcel = await ApiaParcel.findOne({ where });
  if (!parcel) throw new ApiError(404, "APIA parcel not found", null, "APIA_PARCEL_NOT_FOUND");

  await parcel.update(data);
  return parcel;
}

async function deleteParcel(actor, parcelId) {
  const isAdmin = actor?.role === "ADMIN";
  const where = isAdmin ? { id: parcelId } : { id: parcelId, ownerId: actor.sub };

  const parcel = await ApiaParcel.findOne({ where });
  if (!parcel) throw new ApiError(404, "APIA parcel not found", null, "APIA_PARCEL_NOT_FOUND");

  await parcel.destroy();
}

// ─── CALCULATOR ──────────────────────────────────────

function calculateSubsidyForParcel(parcel, land) {
  const area = Number(parcel.apiaAreaHa);
  const breakdown = [];

  // 1. SAPS
  const saps = area * RATES.saps.perHa;
  breakdown.push({
    type: "SAPS",
    label: RATES.saps.label,
    area,
    perHa: RATES.saps.perHa,
    eur: round2(saps),
  });

  // 2. Redistributive (only first 30 ha count)
  const redistArea = Math.min(area, RATES.redistributive.maxHa);
  const redist = redistArea * RATES.redistributive.perHa;
  breakdown.push({
    type: "REDISTRIBUTIVE",
    label: RATES.redistributive.label,
    area: redistArea,
    perHa: RATES.redistributive.perHa,
    eur: round2(redist),
  });

  // 3. Eco-scheme (if enrolled)
  let ecoAmount = 0;
  if (parcel.isEcoScheme && parcel.ecoSchemeType) {
    const scheme = RATES.ecoSchemes[parcel.ecoSchemeType];
    if (scheme && scheme.applicableTo.includes(parcel.landCategory)) {
      ecoAmount = area * scheme.perHa;
      breakdown.push({
        type: "ECO_SCHEME",
        label: scheme.label,
        area,
        perHa: scheme.perHa,
        eur: round2(ecoAmount),
      });
    }
  }

  // 4. Coupled support (based on crop type)
  let coupledAmount = 0;
  const cropType = land?.cropType;
  if (cropType && RATES.coupledSupport[cropType]) {
    const coupled = RATES.coupledSupport[cropType];
    coupledAmount = area * coupled.perHa;
    breakdown.push({
      type: "COUPLED_SUPPORT",
      label: coupled.label,
      area,
      perHa: coupled.perHa,
      eur: round2(coupledAmount),
    });
  }

  // 5. Young farmer supplement
  let youngAmount = 0;
  if (parcel.youngFarmer) {
    const yfArea = Math.min(area, RATES.youngFarmer.maxHa);
    youngAmount = yfArea * RATES.youngFarmer.perHa;
    breakdown.push({
      type: "YOUNG_FARMER",
      label: RATES.youngFarmer.label,
      area: yfArea,
      perHa: RATES.youngFarmer.perHa,
      eur: round2(youngAmount),
    });
  }

  const totalEur = saps + redist + ecoAmount + coupledAmount + youngAmount;
  const totalRon = totalEur * RATES.eurToRon;

  return {
    parcelId: parcel.id,
    landId: parcel.landId,
    landName: land?.name || "N/A",
    cropType: land?.cropType || "N/A",
    apiaAreaHa: area,
    landCategory: parcel.landCategory,
    isEcoScheme: parcel.isEcoScheme,
    ecoSchemeType: parcel.ecoSchemeType,
    youngFarmer: parcel.youngFarmer,
    breakdown,
    totalEur: round2(totalEur),
    totalRon: round2(totalRon),
  };
}

async function calculateSubsidies(actor, landId) {
  const isAdmin = actor?.role === "ADMIN";
  const where = isAdmin ? {} : { ownerId: actor.sub };
  if (landId) where.landId = landId;

  const parcels = await ApiaParcel.findAll({
    where,
    include: [{ model: Land, attributes: ["id", "name", "cropType", "areaHa"] }],
  });

  const results = parcels.map((p) => calculateSubsidyForParcel(p, p.Land));

  const grandTotalEur = results.reduce((sum, r) => sum + r.totalEur, 0);
  const grandTotalRon = grandTotalEur * RATES.eurToRon;
  const totalAreaHa = results.reduce((sum, r) => sum + r.apiaAreaHa, 0);

  return {
    year: RATES.year,
    eurToRon: RATES.eurToRon,
    parcelsCount: results.length,
    totalAreaHa: round2(totalAreaHa),
    grandTotalEur: round2(grandTotalEur),
    grandTotalRon: round2(grandTotalRon),
    parcels: results,
  };
}

// ─── EXPORT DATA ─────────────────────────────────────

async function getExportData(actor) {
  const parcels = await listParcels(actor);
  const subsidies = await calculateSubsidies(actor);
  return { parcels, subsidies };
}

// ─── HELPERS ─────────────────────────────────────────

function round2(n) {
  return Number(Number(n).toFixed(2));
}

module.exports = {
  listParcels,
  getParcelByLand,
  createParcel,
  updateParcel,
  deleteParcel,
  calculateSubsidies,
  getExportData,
};
