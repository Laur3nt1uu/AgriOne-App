const PDFDocument = require("pdfkit");

function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toISOString().replace("T", " ").slice(0, 16);
}

function money(n) {
  if (n == null) return "-";
  return `${Number(n).toFixed(2)} RON`;
}

function buildLandPdf(res, data) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="land-report-${data.land.id}.pdf"`);

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("AgriOne - Land Report", { align: "left" });
  doc.moveDown(0.2);
  doc.fontSize(10).fillColor("gray").text(`Generated: ${formatDate(new Date())}`);
  doc.fillColor("black");
  doc.moveDown();

  // Land info
  doc.fontSize(14).text("Land Information", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Name: ${data.land.name}`);
  doc.text(`Crop: ${data.land.cropType}`);
  doc.text(`Area: ${Number(data.land.areaHa).toFixed(2)} ha`);
  doc.text(`Centroid: ${data.land.centroidLat}, ${data.land.centroidLng}`);
  doc.moveDown();

  // Sensor
  doc.fontSize(14).text("Sensor Status", { underline: true });
  doc.moveDown(0.5);
  if (!data.sensor) {
    doc.fontSize(12).text("Sensor: Not paired");
  } else {
    doc.fontSize(12).text(`Sensor: ${data.sensor.sensorCode}`);
    doc.text(`Online: ${data.online ? "YES" : "NO"}`);
    doc.text(`Last reading at: ${formatDate(data.sensor.lastReadingAt)}`);
  }
  doc.moveDown();

  // Rules
  doc.fontSize(14).text("Alert Thresholds", { underline: true });
  doc.moveDown(0.5);
  if (!data.rule) {
    doc.fontSize(12).text("No rules configured.");
  } else {
    doc.fontSize(12).text(`Enabled: ${data.rule.enabled ? "YES" : "NO"}`);
    doc.text(`Temp min: ${data.rule.tempMin ?? "-"} °C`);
    doc.text(`Temp max: ${data.rule.tempMax ?? "-"} °C`);
    doc.text(`Hum min: ${data.rule.humMin ?? "-"} %`);
    doc.text(`Hum max: ${data.rule.humMax ?? "-"} %`);
  }
  doc.moveDown();

  // Latest readings
  doc.fontSize(14).text("Latest Readings", { underline: true });
  doc.moveDown(0.5);
  if (!data.latestReadings.length) {
    doc.fontSize(12).text("No readings available.");
  } else {
    doc.fontSize(11);
    data.latestReadings.forEach((r) => {
      doc.text(`${formatDate(r.recordedAt)}  |  ${r.temperatureC} °C  |  ${r.humidityPct} %`);
    });
  }
  doc.moveDown();

  // Economics summary
  doc.fontSize(14).text("Economic Summary (last transactions)", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Revenue: ${money(data.summary.revenue)}`);
  doc.text(`Expense: ${money(data.summary.expense)}`);
  doc.text(`Profit: ${money(data.summary.profit)}`);
  doc.moveDown(0.5);

  if (!data.transactions.length) {
    doc.fontSize(12).text("No transactions recorded.");
  } else {
    doc.fontSize(11);
    data.transactions.forEach((t) => {
      doc.text(
        `${formatDate(t.occurredAt)}  |  ${t.type}  |  ${t.category}  |  ${money(t.amount)}  |  ${t.description || ""}`
      );
    });
  }
  doc.moveDown();

  // Alerts
  doc.fontSize(14).text("Recent Alerts", { underline: true });
  doc.moveDown(0.5);
  if (!data.alerts.length) {
    doc.fontSize(12).text("No alerts.");
  } else {
    doc.fontSize(11);
    data.alerts.forEach((a) => {
      doc.text(`${formatDate(a.created_at)}  |  ${a.severity}  |  ${a.type}  |  ${a.message}`);
    });
  }

  doc.end();
}

module.exports = { buildLandPdf };