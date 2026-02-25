const http = require("http");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = require("../src/app");

const PORT = 5056;

function request(method, urlPath, { headers = {}, body } = {}) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path: urlPath,
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      },
      (res) => {
        let buf = "";
        res.on("data", (d) => (buf += d));
        res.on("end", () => {
          const contentType = res.headers["content-type"] || "";
          let json = null;
          if (contentType.includes("application/json")) {
            try {
              json = JSON.parse(buf);
            } catch {
              json = null;
            }
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: buf,
            json,
          });
        });
      }
    );

    req.on("error", (e) => resolve({ status: 0, error: e.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  const results = [];
  const add = (name, ok, details) => results.push({ name, ok, details });

  const server = app.listen(PORT, async () => {
    try {
      const email = `test_${Date.now()}@example.com`;
      const password = "Passw0rd!";

      let res = await request("POST", "/api/auth/register", {
        body: { email, password, role: "USER" },
      });
      add("auth.register", res.status === 201 && res.json?.accessToken, res.json || res.body);

      const userToken = res.json?.accessToken;

      res = await request("POST", "/api/auth/login", { body: { email, password } });
      add("auth.login", res.status === 200 && res.json?.accessToken, res.json || res.body);

      res = await request("GET", "/api/auth/me", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      add("auth.me", res.status === 200 && res.json?.user?.email === email, res.json || res.body);

      const landPayload = {
        name: "Test Land",
        cropType: "Wheat",
        areaHa: 1.5,
        centroid: { lat: 45.005, lng: 25.005 },
        geometry: {
          type: "Polygon",
          coordinates: [[[25.0, 45.0],[25.0, 45.01],[25.01, 45.01],[25.01, 45.0],[25.0, 45.0]]],
        },
      };

      res = await request("POST", "/api/lands", {
        headers: { Authorization: `Bearer ${userToken}` },
        body: landPayload,
      });
      const landId = res.json?.land?.id;
      add("lands.create", res.status === 201 && landId, res.json || res.body);

      res = await request("GET", "/api/lands", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const hasLand = Array.isArray(res.json?.lands) && res.json.lands.some((l) => l.id === landId);
      add("lands.list", res.status === 200 && hasLand, res.json || res.body);

      res = await request("PUT", `/api/lands/${landId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        body: { name: "Test Land Updated" },
      });
      add("lands.update", res.status === 200 && res.json?.land?.name === "Test Land Updated", res.json || res.body);

      const sensorCode = `S-${Date.now()}`;
      res = await request("POST", "/api/sensors", {
        headers: { Authorization: `Bearer ${userToken}` },
        body: { sensorCode, name: "Test Sensor" },
      });
      add("sensors.create", res.status === 201 && res.json?.sensor?.sensorCode === sensorCode, res.json || res.body);

      res = await request("GET", "/api/sensors", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const hasSensor = Array.isArray(res.json?.sensors) && res.json.sensors.some((s) => s.sensorCode === sensorCode);
      add("sensors.list", res.status === 200 && hasSensor, res.json || res.body);

      res = await request("POST", "/api/sensors/pair", {
        headers: { Authorization: `Bearer ${userToken}` },
        body: { sensorCode, landId },
      });
      add("sensors.pair", res.status === 200 && res.json?.sensor?.landId === landId, res.json || res.body);

      const iotKey = process.env.IOT_MASTER_KEY || "";
      res = await request("POST", "/api/iot/ingest", {
        headers: { "x-iot-key": iotKey },
        body: { sensorCode, temperatureC: 18, humidityPct: 40, recordedAt: new Date().toISOString() },
      });
      add("iot.ingest", res.status === 201 && res.json?.reading?.id, res.json || res.body);

      res = await request("GET", `/api/readings/land/${landId}?range=24h`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const itemsOk = Array.isArray(res.json?.items) && res.json.items.length >= 1;
      add("readings.listByLand", res.status === 200 && itemsOk, res.json || res.body);

      res = await request("POST", "/api/alerts/rules", {
        headers: { Authorization: `Bearer ${userToken}` },
        body: { landId, tempMax: 20, humMax: 50 },
      });
      add("alerts.upsertRule", res.status === 200 && res.json?.rule?.landId === landId, res.json || res.body);

      res = await request("POST", "/api/iot/ingest", {
        headers: { "x-iot-key": iotKey },
        body: { sensorCode, temperatureC: 30, humidityPct: 80, recordedAt: new Date().toISOString() },
      });
      const createdAlertsCount = Array.isArray(res.json?.createdAlerts) ? res.json.createdAlerts.length : 0;
      add("iot.ingest.alerts", res.status === 201 && createdAlertsCount >= 1, res.json || res.body);

      res = await request("GET", `/api/alerts?landId=${landId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const alertsOk = Array.isArray(res.json?.alerts) && res.json.alerts.length >= 1;
      add("alerts.list", res.status === 200 && alertsOk, res.json || res.body);

      res = await request("POST", "/api/economics/transactions", {
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          landId,
          type: "REVENUE",
          category: "Yield",
          description: "Test revenue",
          amount: 100,
          occurredAt: new Date().toISOString(),
        },
      });
      add("economics.add", res.status === 201 && res.json?.transaction?.id, res.json || res.body);

      res = await request("GET", `/api/economics/transactions?landId=${landId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const txOk = Array.isArray(res.json?.transactions) && res.json.transactions.length >= 1;
      add("economics.list", res.status === 200 && txOk, res.json || res.body);

      res = await request("GET", `/api/economics/summary?landId=${landId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const summaryOk = res.status === 200 && res.json?.summary && typeof res.json.summary.profit === "number";
      add("economics.summary", summaryOk, res.json || res.body);

      res = await request("GET", "/api/analytics/overview", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      add("analytics.overview", res.status === 200 && typeof res.json?.landsCount === "number", res.json || res.body);

      res = await request("GET", `/api/recommendations/land/${landId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      add("recommendations.byLand", res.status === 200 && res.json?.landId === landId, res.json || res.body);

      res = await request("GET", `/api/weather/by-coords?lat=45&lng=25`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      add("weather.byCoords", res.status === 200, res.json || res.body);

      res = await request("GET", `/api/exports/land/${landId}/readings.csv?range=24h`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const csvOk = res.status === 200 && (res.headers["content-type"] || "").includes("text/csv");
      add("exports.readingsCsv", csvOk, res.body?.slice?.(0, 80) || res.body);

      const adminEmail = `admin_${Date.now()}@example.com`;
      res = await request("POST", "/api/auth/register", {
        body: { email: adminEmail, password, role: "ADMIN" },
      });
      const adminToken = res.json?.accessToken;
      add("admin.register", res.status === 201 && adminToken, res.json || res.body);

      res = await request("GET", "/api/admin/stats", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      add("admin.stats", res.status === 200 && typeof res.json?.totalUsers === "number", res.json || res.body);

      res = await request("POST", `/api/dev/seed-readings/${landId}`, {
        headers: { Authorization: `Bearer ${userToken}`, "x-dev-key": iotKey },
        body: { days: 1, pointsPerDay: 2 },
      });
      add("dev.seedReadings", res.status === 200 && res.json?.inserted >= 1, res.json || res.body);

      const okCount = results.filter((r) => r.ok).length;
      const failCount = results.length - okCount;

      console.log(`\nVerification summary: ${okCount}/${results.length} passed, ${failCount} failed.`);
      for (const r of results) {
        if (!r.ok) {
          console.log(`FAIL: ${r.name}`, r.details);
        }
      }

      process.exit(failCount ? 1 : 0);
    } catch (e) {
      console.error("Verification failed with error:", e);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

run();
