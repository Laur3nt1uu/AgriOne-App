/**
 * Seed a "showcase" land for the thesis demo.
 *
 * Ensures ONE land owned by the chosen user has everything a live demo needs:
 *   • a paired sensor marked online (lastReadingAt = now → "Live" badge)
 *   • ~7 days of realistic, deterministic readings (chart / CSV / PDF)
 *   • an APIA parcel (subsidy estimate + PDF)
 *   • an alert rule + a couple of alerts
 *   • a set of economic transactions (revenue + expenses)
 *
 * Safe & idempotent: re-running refreshes readings and tops up only what is
 * missing; it never touches other users' data.
 *
 * Usage:
 *   node scripts/seed-demo.js --email=user@example.com
 *   node scripts/seed-demo.js --landId=<uuid>
 *   node scripts/seed-demo.js                 (auto-picks the user with most lands)
 * Options: --land="Nume teren"  --days=7  --dry
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Op } = require("sequelize");
const {
  sequelize,
  User,
  Land,
  Sensor,
  Reading,
  ApiaParcel,
  Transaction,
  Alert,
  AlertRule,
} = require("../src/models");
const { generateDemoReadings } = require("../src/utils/demoReadings");

function arg(name, def) {
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (p) return p.split("=").slice(1).join("=");
  return process.argv.includes(`--${name}`) ? true : def;
}

const OPT = {
  email: arg("email"),
  landId: arg("landId"),
  land: arg("land"),
  days: Number(arg("days", "7")),
  from: arg("from"), // e.g. 2026-05-15  → explicit collection campaign window
  to: arg("to"), //   e.g. 2026-05-30
  dry: !!arg("dry"),
};
const CAMPAIGN = typeof OPT.from === "string" && typeof OPT.to === "string";

const isUuid = (s) => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(s);
const log = (...a) => console.log(...a);

async function pickUser() {
  if (OPT.email) {
    const u = await User.findOne({ where: sequelize.where(sequelize.fn("lower", sequelize.col("email")), OPT.email.toLowerCase()) });
    if (!u) throw new Error(`No user with email ${OPT.email}`);
    return u;
  }
  if (OPT.landId) {
    const l = await Land.findByPk(OPT.landId);
    if (!l) throw new Error(`No land with id ${OPT.landId}`);
    return User.findByPk(l.ownerId);
  }
  // Auto: the (non-test) user that owns the most lands.
  const users = await User.findAll();
  let best = null;
  let bestCount = -1;
  for (const u of users) {
    if (/test_|admin_.*@example|verify/i.test(u.email)) continue;
    const c = await Land.count({ where: { ownerId: u.id } });
    if (c > bestCount) {
      best = u;
      bestCount = c;
    }
  }
  if (!best) throw new Error("No suitable user found. Pass --email=...");
  return best;
}

async function pickOrCreateLand(user) {
  if (OPT.landId) {
    const l = await Land.findOne({ where: { id: OPT.landId, ownerId: user.id } });
    if (!l) throw new Error(`Land ${OPT.landId} not owned by ${user.email}`);
    return { land: l, created: false };
  }
  if (OPT.land && !isUuid(OPT.land)) {
    const l = await Land.findOne({ where: { ownerId: user.id, name: OPT.land } });
    if (l) return { land: l, created: false };
  }
  // Prefer the user's newest existing land.
  const existing = await Land.findOne({ where: { ownerId: user.id }, order: [["created_at", "DESC"]] });
  if (existing && !OPT.land) return { land: existing, created: false };

  // Create a fresh showcase land (small parcel on the Bărăgan plain).
  const name = typeof OPT.land === "string" ? OPT.land : "Tarla Nord (Demo)";
  const lat = 44.9;
  const lng = 27.55;
  const d = 0.01; // ~1.1 km box
  const ring = [
    [lng - d, lat - d],
    [lng + d, lat - d],
    [lng + d, lat + d],
    [lng - d, lat + d],
    [lng - d, lat - d],
  ];
  const land = await Land.create({
    ownerId: user.id,
    name,
    cropType: "Grau",
    areaHa: 12.5,
    geometry: { type: "Polygon", coordinates: [ring] },
    centroidLat: lat,
    centroidLng: lng,
  });
  return { land, created: true };
}

async function seedSensor(land) {
  let sensor = await Sensor.findOne({ where: { landId: land.id } });
  // For a historical campaign the last reading is the end of the window
  // (sensor reads "Offline" — it was collected then removed). Otherwise now.
  const lastAt = CAMPAIGN ? new Date(OPT.to + "T20:00:00") : new Date();
  if (OPT.dry) {
    log(`  = sensor: ${sensor ? `would refresh ${sensor.sensorCode}` : "would create AGRI-DEMO-*"} (dry run)`);
    return sensor || { id: "00000000-0000-0000-0000-000000000000", sensorCode: `AGRI-DEMO-${String(land.id).slice(0, 8).toUpperCase()}` };
  }
  if (!sensor) {
    sensor = await Sensor.create({
      ownerId: land.ownerId,
      landId: land.id,
      sensorCode: `AGRI-DEMO-${String(land.id).slice(0, 8).toUpperCase()}`,
      name: "Senzor Demo AgriOne",
      lastReadingAt: lastAt,
      lastLat: land.centroidLat,
      lastLng: land.centroidLng,
      locationVerified: true,
      locationCheckedAt: lastAt,
    });
    log(`  + sensor created: ${sensor.sensorCode}`);
  } else {
    sensor.lastReadingAt = lastAt;
    sensor.locationVerified = true;
    if (sensor.lastLat == null) sensor.lastLat = land.centroidLat;
    if (sensor.lastLng == null) sensor.lastLng = land.centroidLng;
    await sensor.save();
    log(`  ~ sensor updated: ${sensor.sensorCode} (last reading ${lastAt.toISOString().slice(0, 10)})`);
  }
  return sensor;
}

async function seedReadings(sensor) {
  let src;
  let label;
  if (CAMPAIGN) {
    // Explicit field-campaign window, hourly samples (e.g. 15–30 May 2026).
    src = generateDemoReadings({
      seed: sensor.sensorCode,
      from: OPT.from + "T00:00:00",
      to: OPT.to + "T23:59:59",
      stepMinutes: 60,
    });
    label = `campania ${OPT.from} → ${OPT.to}`;
  } else {
    // Dense recent (last 24h @30min) + week history (7d @2h), deduped by minute.
    const wide = generateDemoReadings({ seed: sensor.sensorCode, range: "7d" });
    const dense = generateDemoReadings({ seed: sensor.sensorCode, range: "24h" });
    const byKey = new Map();
    for (const r of [...wide, ...dense]) byKey.set(new Date(r.recordedAt).toISOString().slice(0, 16), r);
    src = [...byKey.values()];
    label = `ultimele 7 zile`;
  }

  const rows = src
    .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
    .map((r) => ({
      sensorId: sensor.id,
      temperatureC: r.temperatureC,
      humidityPct: r.humidityPct,
      soilMoisturePct: r.soilMoisturePct,
      recordedAt: r.recordedAt,
    }));

  if (OPT.dry) return log(`  = readings: would insert ${rows.length} (${label}) (dry run)`);
  await Reading.destroy({ where: { sensorId: sensor.id } });
  await Reading.bulkCreate(rows);
  log(`  + readings: inserted ${rows.length} points (${label})`);
}

async function seedApia(land) {
  if (OPT.dry) return log("  = APIA parcel: would find-or-create (dry run)");
  const [parcel, created] = await ApiaParcel.findOrCreate({
    where: { landId: land.id },
    defaults: {
      ownerId: land.ownerId,
      landId: land.id,
      tarlaNumber: "T14",
      parcelNumber: "P3",
      sirutaCode: "54975",
      cadastralNumber: "CF 100234",
      landCategory: "arabil",
      apiaAreaHa: Number(land.areaHa) || 12.5,
      isEcoScheme: true,
      ecoSchemeType: "biodiversitate",
      youngFarmer: true,
      notes: "Parcelă irigată, sol cernoziom. Rotație grâu–porumb.",
    },
  });
  log(created ? "  + APIA parcel created" : "  = APIA parcel already exists (kept)");
  return parcel;
}

async function seedAlertRule(land) {
  if (OPT.dry) return log("  = alert rule: would find-or-create (dry run)");
  const [rule, created] = await AlertRule.findOrCreate({
    where: { ownerId: land.ownerId, landId: land.id },
    defaults: { ownerId: land.ownerId, landId: land.id, enabled: true, tempMin: 2, tempMax: 35, humMin: 30, humMax: 85 },
  });
  log(created ? "  + alert rule created" : "  = alert rule already exists (kept)");
  return rule;
}

async function seedAlerts(land, sensor) {
  const existing = await Alert.count({ where: { landId: land.id } });
  // Outside a campaign, keep existing alerts. In campaign mode, refresh them so
  // their timestamps fall inside the collection window.
  if (existing > 0 && !CAMPAIGN) return log(`  = alerts: ${existing} already present (skipped)`);
  if (OPT.dry) return log(`  = alerts: would ${CAMPAIGN ? "refresh" : "insert"} 3 (dry run)`);
  if (CAMPAIGN && existing > 0) await Alert.destroy({ where: { landId: land.id } });

  // Anchor alert timeline at the end of the campaign (or now).
  const anchor = CAMPAIGN ? new Date(OPT.to + "T18:00:00").getTime() : Date.now();
  const rows = [
    { severity: "CRITICAL", type: "TEMP_HIGH", message: "Temperatură ridicată detectată (34.6 °C) — risc de stres termic.", value: 34.6, threshold: 35, ago: 6 * 3600e3 },
    { severity: "WARNING", type: "SOIL_LOW", message: "Umiditate sol scăzută (32%) — se recomandă irigare.", value: 32, threshold: 35, ago: 3 * 86400e3 },
    { severity: "WARNING", type: "HUM_HIGH", message: "Umiditate aer crescută pe timp de noapte.", value: 88, threshold: 85, ago: 6 * 86400e3 },
  ];
  for (const r of rows) {
    const a = await Alert.create({
      ownerId: land.ownerId,
      landId: land.id,
      sensorId: sensor.id,
      severity: r.severity,
      type: r.type,
      message: r.message,
      value: r.value,
      threshold: r.threshold,
    });
    // Backdate created_at for a realistic timeline.
    await sequelize.query("UPDATE alerts SET created_at = :d WHERE id = :id", {
      replacements: { d: new Date(anchor - r.ago), id: a.id },
    });
  }
  log(`  + alerts: inserted ${rows.length}`);
}

const CROP_RO = {
  Corn: "porumb", Porumb: "porumb",
  Wheat: "grâu", Grau: "grâu", "Grâu": "grâu",
  Sunflower: "floarea-soarelui", "Floarea-soarelui": "floarea-soarelui",
  Barley: "orz", Orz: "orz", Rapeseed: "rapiță", Rapita: "rapiță",
  Legume: "legume", Vegetables: "legume", Potato: "cartof", Cartof: "cartof",
};

async function seedTransactions(land) {
  const existing = await Transaction.count({ where: { landId: land.id } });
  if (existing > 0) return log(`  = transactions: ${existing} already present (skipped)`);
  const crop = CROP_RO[land.cropType] || String(land.cropType || "recoltă").toLowerCase();
  const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400e3);
  const rows = [
    { type: "REVENUE", category: "Subvenție APIA", amount: 12362.88, description: "Plată directă campania 2026 (estimat)", occurredAt: d(20) },
    { type: "REVENUE", category: "Vânzare recoltă", amount: 18500.0, description: `Vânzare ${crop} — recoltă valorificată`, occurredAt: d(60) },
    { type: "EXPENSE", category: "Îngrășăminte", amount: 4200.0, description: "NPK complex 16-16-16", occurredAt: d(120) },
    { type: "EXPENSE", category: "Motorină", amount: 3100.0, description: "Alimentare utilaje — arat & semănat", occurredAt: d(110) },
    { type: "EXPENSE", category: "Semințe", amount: 2650.0, description: `Sămânță ${crop} certificată`, occurredAt: d(150) },
    { type: "EXPENSE", category: "Erbicide", amount: 1450.0, description: "Tratament ierbicidare de primăvară", occurredAt: d(45) },
  ].map((r) => ({ ...r, ownerId: land.ownerId, landId: land.id }));

  if (OPT.dry) return log(`  = transactions: would insert ${rows.length} (dry run)`);
  await Transaction.bulkCreate(rows);
  log(`  + transactions: inserted ${rows.length}`);
}

async function run() {
  await sequelize.authenticate();
  const user = await pickUser();
  log(`\nUser: ${user.email} (${user.role})  id=${user.id}`);

  const { land, created } = await pickOrCreateLand(user);
  log(`Land: "${land.name}" [${land.cropType}, ${land.areaHa} ha]  ${created ? "(CREATED)" : "(existing)"}  id=${land.id}\n`);

  if (OPT.dry) log("— DRY RUN: no writes for readings/transactions —\n");

  const sensor = await seedSensor(land);
  await seedReadings(sensor);
  await seedApia(land);
  await seedAlertRule(land);
  await seedAlerts(land, sensor);
  await seedTransactions(land);

  log(`\n✅ Showcase land ready.`);
  log(`   Login as: ${user.email}`);
  log(`   Open the land, then Senzori / Subvenții APIA / Economics → Export PDF.`);
  process.exit(0);
}

// Only run when executed directly (never on require()).
if (require.main === module) {
  run().catch((e) => {
    console.error("\n❌ seed-demo failed:", e.message);
    process.exit(1);
  });
}

module.exports = { run };
