const router = require("express").Router();
const c = require("./apia.controller");

router.get("/parcels", c.listParcels);
router.get("/parcels/:landId", c.getParcel);
router.post("/parcels", c.createParcel);
router.put("/parcels/:id", c.updateParcel);
router.delete("/parcels/:id", c.deleteParcel);

router.get("/calendar", c.calendar);
router.get("/rates", c.rates);
router.get("/calculate", c.calculate);
router.get("/export/pdf", c.exportPdf);

module.exports = router;
