const PDFDocument = require("pdfkit");
const RATES = require("./apia.rates");

function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toISOString().replace("T", " ").slice(0, 16);
}

function eur(n) {
  if (n == null) return "-";
  return `${Number(n).toFixed(2)} EUR`;
}

function ron(n) {
  if (n == null) return "-";
  return `${Number(n).toFixed(2)} RON`;
}

function buildApiaPdf(res, data) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="apia-report-${Date.now()}.pdf"`
  );

  doc.pipe(res);

  // ─── Header ──────────────────────────────────────
  doc.fontSize(22).text("AgriOne — Raport APIA", { align: "left" });
  doc.moveDown(0.2);
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Generat: ${formatDate(new Date())}  |  Campania ${RATES.year}`);
  doc.fillColor("black");
  doc.moveDown(0.2);
  doc
    .fontSize(9)
    .fillColor("gray")
    .text(`Curs EUR/RON: ${RATES.eurToRon}`);
  doc.fillColor("black");
  doc.moveDown(1);

  // ─── Summary ─────────────────────────────────────
  const sub = data.subsidies;

  doc.fontSize(15).text("Sumar Estimare Subvenții", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  doc.text(`Parcele declarate APIA: ${sub.parcelsCount}`);
  doc.text(`Suprafață totală: ${sub.totalAreaHa} ha`);
  doc.text(`Total estimat: ${eur(sub.grandTotalEur)}  (${ron(sub.grandTotalRon)})`);
  doc.moveDown(1);

  // ─── Detailed parcels ───────────────────────────
  doc
    .fontSize(15)
    .text("Detalii Parcele APIA", { underline: true });
  doc.moveDown(0.5);

  const parcels = Array.isArray(data.parcels) ? data.parcels : [];
  if (!parcels.length) {
    doc.fontSize(12).text("Nu au fost declarate parcele APIA.");
  } else {
    parcels.forEach((p, idx) => {
      const pData = p.toJSON ? p.toJSON() : p;
      const land = pData.Land || {};

      // Parcel header
      doc
        .fontSize(12)
        .fillColor("#166534")
        .text(`${idx + 1}. ${land.name || "Teren nedefinit"}`, {
          underline: true,
        });
      doc.fillColor("black").fontSize(11);

      doc.text(`   Cultură: ${land.cropType || "-"}`);
      doc.text(`   Suprafață AgriOne: ${land.areaHa || "-"} ha`);
      doc.text(`   Suprafață APIA: ${pData.apiaAreaHa} ha`);
      doc.text(`   Categorie: ${pData.landCategory}`);

      if (pData.tarlaNumber)
        doc.text(`   Tarlaua: ${pData.tarlaNumber}`);
      if (pData.parcelNumber)
        doc.text(`   Parcela: ${pData.parcelNumber}`);
      if (pData.sirutaCode)
        doc.text(`   Cod SIRUTA: ${pData.sirutaCode}`);
      if (pData.cadastralNumber)
        doc.text(`   Nr. Cadastral: ${pData.cadastralNumber}`);

      if (pData.isEcoScheme)
        doc.text(`   Eco-schemă: ${pData.ecoSchemeType || "Da"}`);
      if (pData.youngFarmer) doc.text(`   Tânăr Fermier: Da`);

      // Show subsidy breakdown for this parcel
      const parcelSub = sub.parcels?.find(
        (s) => s.landId === pData.landId
      );
      if (parcelSub) {
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor("gray").text("   Estimare subvenții:");
        doc.fillColor("black");
        parcelSub.breakdown.forEach((b) => {
          doc.text(
            `     • ${b.label}: ${b.area} ha × ${b.perHa} EUR = ${eur(b.eur)}`
          );
        });
        doc
          .fontSize(11)
          .text(
            `   TOTAL: ${eur(parcelSub.totalEur)}  (${ron(parcelSub.totalRon)})`
          );
      }

      if (pData.notes) {
        doc.fontSize(10).fillColor("gray").text(`   Note: ${pData.notes}`);
        doc.fillColor("black");
      }

      doc.moveDown(0.8);
    });
  }

  // ─── Disclaimer ──────────────────────────────────
  doc.moveDown(0.5);
  doc
    .fontSize(9)
    .fillColor("gray")
    .text(
      "Estimare orientativă — valorile finale sunt stabilite de APIA și pot diferi. Ratele utilizate sunt pentru campania " +
        RATES.year +
        ".",
      { align: "center" }
    );

  doc.end();
}

module.exports = { buildApiaPdf };
