const { Op } = require("sequelize");

/**
 * Resolve the period a readings query covers.
 *  - range "24h" | "7d"           → relative to now (default behaviour)
 *  - range "custom" + from / to   → explicit window; YYYY-MM-DD is treated as whole UTC days
 * Returns { range, from, to, where } where `where` is the Sequelize clause for recorded_at.
 */
function parseDate(value, { endOfDay = false } = {}) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + (endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z"));
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function resolveReadingsPeriod({ range = "24h", from, to } = {}) {
  const fromDate = parseDate(from);
  const toDate = parseDate(to, { endOfDay: true });

  if (range === "custom" || fromDate || toDate) {
    // Op.* keys are symbols, so build the clause explicitly (Object.keys would miss them)
    let where;
    if (fromDate && toDate) where = { [Op.between]: [fromDate, toDate] };
    else if (fromDate) where = { [Op.gte]: fromDate };
    else if (toDate) where = { [Op.lte]: toDate };
    return { range: "custom", from: fromDate, to: toDate, where };
  }

  const hours = range === "7d" ? 7 * 24 : 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return { range: range === "7d" ? "7d" : "24h", from: since, to: null, where: { [Op.gte]: since } };
}

module.exports = { resolveReadingsPeriod };
