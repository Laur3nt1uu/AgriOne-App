
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const COLORS = {
  brand: "#16A34A",
  brandDark: "#15803D",
  brandDeep: "#0B4A2F",
  ink: "#0F172A",
  body: "#334155",
  muted: "#64748B",
  faint: "#94A3B8",
  line: "#E2E8F0",
  panel: "#F1F5F9",
  panelAlt: "#F8FAFC",
  mint: "#DCFCE7",
  white: "#FFFFFF",
  danger: "#DC2626",
  amber: "#D97706",
  blue: "#2563EB",
};

const FONTS_DIR = path.join(__dirname, "..", "assets", "fonts");
const LOGO_PATH = path.join(__dirname, "..", "assets", "brand", "agrione.png");
const HAS_LOGO = (() => {
  try {
    return fs.existsSync(LOGO_PATH);
  } catch {
    return false;
  }
})();

const FONT = { regular: "Helvetica", bold: "Helvetica-Bold", italic: "Helvetica-Oblique" };

function registerFonts(doc) {
  try {
    const reg = path.join(FONTS_DIR, "Calibri-Regular.ttf");
    const bold = path.join(FONTS_DIR, "Calibri-Bold.ttf");
    const italic = path.join(FONTS_DIR, "Calibri-LightItalic.ttf");
    if (fs.existsSync(reg) && fs.existsSync(bold)) {
      doc.registerFont("Body", reg);
      doc.registerFont("Bold", bold);
      doc.registerFont("Italic", fs.existsSync(italic) ? italic : reg);
      FONT.regular = "Body";
      FONT.bold = "Bold";
      FONT.italic = "Italic";
    }
  } catch {
  }
}

function createDoc({ margin = 48 } = {}) {
  const doc = new PDFDocument({
    size: "A4",
    margin,
    bufferPages: true,
    info: { Producer: "AgriOne", Creator: "AgriOne" },
  });
  registerFonts(doc);
  doc._agri = { margin };
  doc.font(FONT.regular).fillColor(COLORS.body);
  return doc;
}

const pageWidth = (doc) => doc.page.width;
const contentLeft = (doc) => doc._agri.margin;
const contentRight = (doc) => doc.page.width - doc._agri.margin;
const contentWidth = (doc) => doc.page.width - doc._agri.margin * 2;

function drawHeader(doc, { title, subtitle, tag, meta = [] }) {
  const w = pageWidth(doc);
  const h = 118;

  doc.save();
  doc.rect(0, 0, w, h).fill(COLORS.brand);
  doc.rect(0, h - 6, w, 6).fill(COLORS.brandDark);
  doc.restore();

  const left = doc._agri.margin;
  const badgeX = left;
  const badgeY = 30;
  const badgeR = 20;

  doc.save();
  doc.circle(badgeX + badgeR, badgeY + badgeR, badgeR).fill(COLORS.white);
  if (HAS_LOGO) {
    const pad = 5;
    const size = badgeR * 2 - pad * 2;
    try {
      doc.image(LOGO_PATH, badgeX + pad, badgeY + pad, {
        fit: [size, size],
        align: "center",
        valign: "center",
      });
    } catch {
      doc
        .fillColor(COLORS.brandDark)
        .font(FONT.bold)
        .fontSize(22)
        .text("A", badgeX, badgeY + 8, { width: badgeR * 2, align: "center" });
    }
  } else {
    doc
      .fillColor(COLORS.brandDark)
      .font(FONT.bold)
      .fontSize(22)
      .text("A", badgeX, badgeY + 8, { width: badgeR * 2, align: "center" });
  }
  doc.restore();

  const textX = badgeX + badgeR * 2 + 14;

  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(11)
    .text("AGRIONE", textX, badgeY + 2, { characterSpacing: 2 });

  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(20)
    .text(title || "", textX, badgeY + 16, { width: w - textX - left - 120 });

  if (subtitle) {
    doc
      .fillColor("#EAFBF0")
      .font(FONT.regular)
      .fontSize(10)
      .text(subtitle, textX, doc.y + 1, { width: w - textX - left - 120 });
  }

  if (tag) {
    doc.font(FONT.bold).fontSize(9);
    const tw = doc.widthOfString(tag) + 20;
    const tx = contentRight(doc) - tw;
    const ty = 34;
    doc.roundedRect(tx, ty, tw, 20, 10).fill("rgba(255,255,255,0.18)");
    doc.fillColor(COLORS.white).text(tag, tx, ty + 5, { width: tw, align: "center" });
  }

  let y = h + 16;
  if (meta.length) {
    doc.font(FONT.regular).fontSize(9).fillColor(COLORS.muted);
    const line = meta.filter(Boolean).join("     •     ");
    doc.text(line, left, y, { width: contentWidth(doc) });
    y = doc.y + 8;
    doc
      .moveTo(left, y)
      .lineTo(contentRight(doc), y)
      .lineWidth(1)
      .strokeColor(COLORS.line)
      .stroke();
    y += 16;
  }

  doc.y = y;
  doc.x = left;
  return y;
}

function sectionTitle(doc, text) {
  ensureSpace(doc, 40);
  const left = doc._agri.margin;
  const y = doc.y + 4;
  doc.save();
  doc.roundedRect(left, y, 4, 15, 2).fill(COLORS.brand);
  doc.restore();
  doc
    .fillColor(COLORS.ink)
    .font(FONT.bold)
    .fontSize(13)
    .text(text, left + 12, y - 1);
  doc.moveDown(0.6);
  doc.x = left;
  doc.fillColor(COLORS.body).font(FONT.regular).fontSize(10);
}

function kpiCards(doc, cards) {
  const left = doc._agri.margin;
  const gap = 12;
  const n = cards.length;
  const w = (contentWidth(doc) - gap * (n - 1)) / n;
  const h = 62;
  ensureSpace(doc, h + 8);
  const y = doc.y;

  cards.forEach((c, i) => {
    const x = left + i * (w + gap);
    doc.save();
    doc.roundedRect(x, y, w, h, 8).fill(COLORS.panelAlt);
    doc.roundedRect(x, y, w, h, 8).lineWidth(1).strokeColor(COLORS.line).stroke();
    doc.roundedRect(x, y, 4, h, 2).fill(c.color || COLORS.brand);
    doc.restore();

    doc
      .fillColor(COLORS.muted)
      .font(FONT.bold)
      .fontSize(8)
      .text(String(c.label || "").toUpperCase(), x + 14, y + 12, {
        width: w - 22,
        characterSpacing: 0.5,
      });
    const valStr = String(c.value ?? "-");
    const maxW = w - 22;
    let vSize = 16;
    doc.font(FONT.bold);
    while (vSize > 9 && doc.fontSize(vSize).widthOfString(valStr) > maxW) vSize -= 0.5;
    doc
      .fillColor(COLORS.ink)
      .font(FONT.bold)
      .fontSize(vSize)
      .text(valStr, x + 14, y + 26, { width: maxW, lineBreak: false });
    if (c.sub) {
      doc
        .fillColor(COLORS.faint)
        .font(FONT.regular)
        .fontSize(8)
        .text(String(c.sub), x + 14, y + 45, { width: w - 22, lineBreak: false });
    }
  });

  doc.y = y + h + 12;
  doc.x = left;
}

function infoGrid(doc, rows, { columns = 2 } = {}) {
  const left = doc._agri.margin;
  const gap = 18;
  const colW = (contentWidth(doc) - gap * (columns - 1)) / columns;
  const rowH = 20;
  const perCol = Math.ceil(rows.length / columns);
  ensureSpace(doc, perCol * rowH + 6);
  const startY = doc.y;

  rows.forEach((r, i) => {
    const col = Math.floor(i / perCol);
    const rowInCol = i % perCol;
    const x = left + col * (colW + gap);
    const y = startY + rowInCol * rowH;
    doc
      .fillColor(COLORS.muted)
      .font(FONT.regular)
      .fontSize(9)
      .text(String(r[0]) + ":", x, y + 4, { width: 110, lineBreak: false });
    doc
      .fillColor(COLORS.ink)
      .font(FONT.bold)
      .fontSize(9.5)
      .text(String(r[1] ?? "-"), x + 112, y + 3.5, { width: colW - 112, lineBreak: false });
  });

  doc.y = startY + perCol * rowH + 6;
  doc.x = left;
}

function drawTable(doc, { columns, rows, zebra = true, emptyText = "Nu există date." }) {
  const left = doc._agri.margin;
  const totalW = contentWidth(doc);
  const headerH = 24;
  const cellPadX = 8;
  const fontSize = 9;
  const lineH = 13;

  const rawWidths = columns.map((c) => c.width || 1);
  const flexMode = rawWidths.every((w) => w <= 4);
  let widths;
  if (flexMode) {
    const sum = rawWidths.reduce((a, b) => a + b, 0);
    widths = rawWidths.map((w) => (w / sum) * totalW);
  } else {
    const sum = rawWidths.reduce((a, b) => a + b, 0);
    widths = rawWidths.map((w) => (w / sum) * totalW);
  }
  const xs = [];
  let acc = left;
  for (const w of widths) {
    xs.push(acc);
    acc += w;
  }

  const cellValue = (row, col, idx) =>
    Array.isArray(row) ? row[idx] : row[col.key];

  const drawHeaderRow = () => {
    const y = doc.y;
    doc.save();
    doc.roundedRect(left, y, totalW, headerH, 4).fill(COLORS.brandDeep);
    doc.restore();
    columns.forEach((c, i) => {
      doc
        .fillColor(COLORS.white)
        .font(FONT.bold)
        .fontSize(8.5)
        .text(String(c.label).toUpperCase(), xs[i] + cellPadX, y + 7, {
          width: widths[i] - cellPadX * 2,
          align: c.align || "left",
          characterSpacing: 0.3,
          lineBreak: false,
        });
    });
    doc.y = y + headerH;
  };

  ensureSpace(doc, headerH + 30);
  drawHeaderRow();

  if (!rows.length) {
    const y = doc.y;
    doc.rect(left, y, totalW, 26).fill(COLORS.panelAlt);
    doc
      .fillColor(COLORS.muted)
      .font(FONT.italic)
      .fontSize(9)
      .text(emptyText, left + cellPadX, y + 8);
    doc.y = y + 26;
    tableBorder(doc, left, totalW);
    doc.x = left;
    doc.fillColor(COLORS.body).font(FONT.regular);
    return;
  }

  const startY = doc.y;
  rows.forEach((row, ri) => {
    let rowH = lineH + 10;
    const rendered = columns.map((c, i) => {
      const val = cellValue(row, c, i);
      const str = val == null ? "" : String(val);
      const wPx = widths[i] - cellPadX * 2;
      doc.font(c.strong ? FONT.bold : FONT.regular).fontSize(fontSize);
      const h = doc.heightOfString(str, { width: wPx, align: c.align || "left" }) + 10;
      if (h > rowH) rowH = h;
      return str;
    });

    if (doc.y + rowH > doc.page.height - doc._agri.margin - 24) {
      doc.addPage();
      doc.y = doc._agri.margin;
      drawHeaderRow();
    }

    const y = doc.y;
    if (zebra && ri % 2 === 1) {
      doc.save();
      doc.rect(left, y, totalW, rowH).fill(COLORS.panelAlt);
      doc.restore();
    }
    columns.forEach((c, i) => {
      const color = c.colorFn ? c.colorFn(row) : c.color || COLORS.body;
      doc
        .fillColor(color)
        .font(c.strong ? FONT.bold : FONT.regular)
        .fontSize(fontSize)
        .text(rendered[i], xs[i] + cellPadX, y + 5, {
          width: widths[i] - cellPadX * 2,
          align: c.align || "left",
        });
    });
    doc
      .moveTo(left, y + rowH)
      .lineTo(left + totalW, y + rowH)
      .lineWidth(0.5)
      .strokeColor(COLORS.line)
      .stroke();
    doc.y = y + rowH;
  });

  tableBorder(doc, left, totalW, startY);
  doc.x = left;
  doc.moveDown(0.5);
  doc.fillColor(COLORS.body).font(FONT.regular);
}

function tableBorder(doc, left, totalW, fromY) {
  const top = fromY != null ? fromY : doc.y;
  doc
    .roundedRect(left, top - (fromY != null ? 0 : 0), totalW, doc.y - top, 0)
    .lineWidth(0.5)
    .strokeColor(COLORS.line)
    .stroke();
}

function totalBanner(doc, { label, value, sub }) {
  const left = doc._agri.margin;
  const w = contentWidth(doc);
  const h = 46;
  ensureSpace(doc, h + 10);
  const y = doc.y;
  doc.save();
  doc.roundedRect(left, y, w, h, 8).fill(COLORS.mint);
  doc.roundedRect(left, y, w, h, 8).lineWidth(1).strokeColor("#BBF7D0").stroke();
  doc.restore();
  doc
    .fillColor(COLORS.brandDeep)
    .font(FONT.bold)
    .fontSize(11)
    .text(label, left + 16, y + 10);
  if (sub)
    doc
      .fillColor(COLORS.brandDark)
      .font(FONT.regular)
      .fontSize(8.5)
      .text(sub, left + 16, y + 27);
  doc
    .fillColor(COLORS.brandDeep)
    .font(FONT.bold)
    .fontSize(18)
    .text(String(value), left + w / 2, y + 13, { width: w / 2 - 16, align: "right" });
  doc.y = y + h + 12;
  doc.x = left;
}

function note(doc, text) {
  ensureSpace(doc, 30);
  const left = doc._agri.margin;
  doc
    .fillColor(COLORS.faint)
    .font(FONT.italic)
    .fontSize(8)
    .text(text, left, doc.y, { width: contentWidth(doc), align: "left" });
  doc.x = left;
  doc.fillColor(COLORS.body).font(FONT.regular);
}

function ensureSpace(doc, needed) {
  if (doc.y + needed > doc.page.height - doc._agri.margin - 24) {
    doc.addPage();
    doc.y = doc._agri.margin;
  }
}

function finalize(doc, { brand = "AgriOne", note: footNote } = {}) {
  const range = doc.bufferedPageRange();
  const total = range.count;
  for (let i = 0; i < total; i++) {
    doc.switchToPage(range.start + i);
    doc.page.margins.bottom = 0;
    const left = doc._agri.margin;
    const y = doc.page.height - 34;
    doc
      .moveTo(left, y)
      .lineTo(contentRight(doc), y)
      .lineWidth(0.5)
      .strokeColor(COLORS.line)
      .stroke();
    doc
      .fillColor(COLORS.faint)
      .font(FONT.regular)
      .fontSize(8)
      .text(
        footNote ? `${brand}  ·  ${footNote}` : brand,
        left,
        y + 8,
        { width: contentWidth(doc) / 2, align: "left" }
      );
    doc
      .fillColor(COLORS.faint)
      .font(FONT.regular)
      .fontSize(8)
      .text(`Pagina ${i + 1} din ${total}`, left + contentWidth(doc) / 2, y + 8, {
        width: contentWidth(doc) / 2,
        align: "right",
      });
  }
  doc.flushPages();
  doc.end();
}

module.exports = {
  COLORS,
  FONT,
  createDoc,
  drawHeader,
  sectionTitle,
  kpiCards,
  infoGrid,
  drawTable,
  totalBanner,
  note,
  ensureSpace,
  finalize,
  contentWidth,
  contentLeft,
  contentRight,
};
