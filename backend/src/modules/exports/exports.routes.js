const router = require("express").Router();
const c = require("./exports.controller");

router.get("/land/:landId/pdf", c.landPdf);
router.get("/economics/pdf", c.economicsPdf);
router.get("/land/:landId/readings.csv", c.readingsCsv);

module.exports = router;