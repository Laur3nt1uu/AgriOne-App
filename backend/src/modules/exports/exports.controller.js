const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./exports.service");
const { buildLandPdf, buildEconomicsPdf } = require("./exports.pdf");

const landPdf = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.getLandReportData(req.user, req.params.landId, {
      from: req.query.from,
      to: req.query.to,
    });
    buildLandPdf(res, data);
  }),
];

const readingsCsv = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { range = "24h", from, to } = req.query;
    const { land, csv } = await service.getReadingsCsv(req.user, req.params.landId, { range, from, to });
    const label = from || to ? `${from || "start"}_${to || "end"}` : range;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="readings-${land.id}-${label}.csv"`);
    res.send(csv);
  }),
];

const economicsPdf = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.getEconomicsReportData(req.user, {
      from: req.query.from,
      to: req.query.to,
    });
    buildEconomicsPdf(res, data);
  }),
];

module.exports = { landPdf, economicsPdf, readingsCsv };