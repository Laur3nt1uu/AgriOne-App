import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

const portPath = getArg("--port", null);
const baudRate = Number(getArg("--baud", "115200"));
const url = getArg("--url", "http://localhost:5000/api/iot/ingest");
const iotKey = getArg("--key", null);

if (!portPath) {
  console.error("Missing --port (example: --port COM5)");
  process.exit(1);
}
if (!iotKey) {
  console.error("Missing --key (must match backend/.env IOT_MASTER_KEY)");
  process.exit(1);
}

console.log("AgriOne Serial Bridge");
console.log("port:", portPath);
console.log("baud:", baudRate);
console.log("url:", url);

const sp = new SerialPort({ path: portPath, baudRate });
const parser = sp.pipe(new ReadlineParser({ delimiter: "\n" }));

sp.on("open", () => console.log("Serial port open."));
sp.on("error", (e) => console.error("Serial error:", e.message || e));

async function postJSON(payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-iot-key": iotKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return text;
}

parser.on("data", async (line) => {
  const trimmed = String(line).trim();
  if (!trimmed) return;

  let obj;
  try {
    obj = JSON.parse(trimmed);
  } catch {
    console.warn("Non-JSON line:", trimmed);
    return;
  }

  if (obj?.error) {
    console.warn("Device error:", obj.error);
    return;
  }

  if (!obj?.sensorCode || obj?.temperatureC == null || obj?.humidityPct == null) {
    console.warn("Invalid payload (missing fields):", obj);
    return;
  }

  try {
    const out = await postJSON(obj);
    console.log("OK", new Date().toISOString(), out);
  } catch (e) {
    console.error("POST failed:", e.message || e);
  }
});
