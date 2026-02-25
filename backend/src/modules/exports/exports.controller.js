const asyncHandler = require("../../utils/asyncHandler");
const requireAuth = require("../../middlewares/auth.middleware");
const service = require("./exports.service");
const { buildLandPdf } = require("./exports.pdf");

const landPdf = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await service.getLandReportData(req.user.sub, req.params.landId);
    buildLandPdf(res, data);
  }),
];

const readingsCsv = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const range = req.query.range || "24h";
    const { land, csv } = await service.getReadingsCsv(req.user.sub, req.params.landId, range);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="readings-${land.id}-${range}.csv"`);
    res.send(csv);
  }),
];

module.exports = { landPdf, readingsCsv };