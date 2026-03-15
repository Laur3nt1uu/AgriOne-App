const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const {
  createApiaParcelSchema,
  updateApiaParcelSchema,
} = require("./apia.validation");
const service = require("./apia.service");
const RATES = require("./apia.rates");
const { getCalendarEvents } = require("./apia.calendar");
const { buildApiaPdf } = require("./apia.pdf");

// ─── Parcels CRUD ────────────────────────────────────

const listParcels = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parcels = await service.listParcels(req.user);
    res.json({ parcels });
  }),
];

const getParcel = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parcel = await service.getParcelByLand(req.user, req.params.landId);
    res.json({ parcel: parcel || null });
  }),
];

const createParcel = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = createApiaParcelSchema.safeParse(req.body);
    if (!parsed.success)
      throw new ApiError(
        400,
        "Validation error",
        parsed.error.flatten(),
        "VALIDATION_ERROR"
      );

    const parcel = await service.createParcel(req.user.sub, parsed.data);
    res.status(201).json({ parcel });
  }),
];

const updateParcel = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = updateApiaParcelSchema.safeParse(req.body);
    if (!parsed.success)
      throw new ApiError(
        400,
        "Validation error",
        parsed.error.flatten(),
        "VALIDATION_ERROR"
      );

    const parcel = await service.updateParcel(req.user, req.params.id, parsed.data);
    res.json({ parcel });
  }),
];

const deleteParcel = [
  requireAuth,
  asyncHandler(async (req, res) => {
    await service.deleteParcel(req.user, req.params.id);
    res.status(204).send();
  }),
];

// ─── Calendar ────────────────────────────────────────

const calendar = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const year = Number(req.query.year) || new Date().getFullYear();
    const events = getCalendarEvents(year);

    const now = new Date();
    const enriched = events.map((e) => {
      const eventDate = new Date(e.date);
      const diffMs = eventDate.getTime() - now.getTime();
      const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { ...e, daysUntil, isPast: daysUntil < 0 };
    });

    res.json({ year, events: enriched });
  }),
];

// ─── Rates ───────────────────────────────────────────

const rates = [
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ rates: RATES });
  }),
];

// ─── Calculator ──────────────────────────────────────

const calculate = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { landId } = req.query;
    const result = await service.calculateSubsidies(req.user, landId);
    res.json(result);
  }),
];

// ─── Export PDF ──────────────────────────────────────

const exportPdf = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.getExportData(req.user);
    buildApiaPdf(res, data);
  }),
];

module.exports = {
  listParcels,
  getParcel,
  createParcel,
  updateParcel,
  deleteParcel,
  calendar,
  rates,
  calculate,
  exportPdf,
};
