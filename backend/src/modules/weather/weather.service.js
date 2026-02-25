const env = require("../../config/env");

async function safeFetchJson(url, init = undefined) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const r = await fetch(url, { ...(init || {}), signal: controller.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const _revCache = new Map();
const REV_TTL_MS = 12 * 60 * 60 * 1000;

function cacheGet(key) {
  const it = _revCache.get(key);
  if (!it) return null;
  if (Date.now() - it.ts > REV_TTL_MS) {
    _revCache.delete(key);
    return null;
  }
  return it.val;
}

function cacheSet(key, val) {
  _revCache.set(key, { ts: Date.now(), val });
  if (_revCache.size > 500) {
    // remove oldest entry
    let oldestKey = null;
    let oldestTs = Infinity;
    for (const [k, v] of _revCache.entries()) {
      if (v.ts < oldestTs) {
        oldestTs = v.ts;
        oldestKey = k;
      }
    }
    if (oldestKey) _revCache.delete(oldestKey);
  }
}

function pickLocality(addr) {
  return (
    addr?.city ||
    addr?.town ||
    addr?.village ||
    addr?.municipality ||
    addr?.county ||
    addr?.state ||
    null
  );
}

async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) return null;
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return null;

  const key = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  // Nominatim policy: identify your application via User-Agent
  const url =
    "https://nominatim.openstreetmap.org/reverse" +
    `?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}` +
    "&zoom=10&addressdetails=1";

  const data = await safeFetchJson(url, {
    headers: {
      "User-Agent": "AgriOne/1.0 (dev)",
      "Accept-Language": "ro",
    },
  });

  if (!data) return null;

  const addr = data.address || null;
  const locality = pickLocality(addr);
  const county = addr?.county || addr?.state || null;
  const country = addr?.country || null;

  const parts = [locality, county, country].filter(Boolean);
  const name = parts.length ? parts.join(", ") : (data.display_name || null);

  const out = {
    name: name || null,
    locality: locality || null,
    county: county || null,
    country: country || null,
  };

  cacheSet(key, out);
  return out;
}

async function getCurrent(lat, lng) {
  if (!env.OPENWEATHER_API_KEY) return null;

  const url =
    `${env.OPENWEATHER_BASE}/weather?lat=${lat}&lon=${lng}` +
    `&appid=${env.OPENWEATHER_API_KEY}&units=${env.OPENWEATHER_UNITS}`;

  const data = await safeFetchJson(url);
  if (!data) return null;

  return {
    tempC: data?.main?.temp ?? null,
    humidityPct: data?.main?.humidity ?? null,
    windMs: data?.wind?.speed ?? null,
    cloudsPct: data?.clouds?.all ?? null,
    description: data?.weather?.[0]?.description ?? null,
  };
}

async function getForecast(lat, lng) {
  if (!env.OPENWEATHER_API_KEY) return null;

  // 5 day / 3 hour forecast
  const url =
    `${env.OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lng}` +
    `&appid=${env.OPENWEATHER_API_KEY}&units=${env.OPENWEATHER_UNITS}`;

  const data = await safeFetchJson(url);
  if (!data?.list?.length) return null;

  // next ~12h (4 entries * 3h)
  const next = data.list.slice(0, 4);

  const temps = next.map(x => x.main?.temp).filter(v => typeof v === "number");
  const minTemp = temps.length ? Math.min(...temps) : null;

  // sum rain (mm) if exists
  let rainMm = 0;
  for (const it of next) {
    const mm = it?.rain?.["3h"];
    if (typeof mm === "number") rainMm += mm;
  }

  return {
    nextHoursMinTempC: minTemp,
    nextHoursRainMm: Number(rainMm.toFixed(2)),
  };
}

async function getBundleFromOpenMeteo(lat, lng) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lng}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover" +
    "&hourly=temperature_2m,precipitation" +
    "&forecast_days=1&timezone=auto";

  const data = await safeFetchJson(url);
  if (!data) return null;

  const current = data.current
    ? {
        tempC: data.current.temperature_2m ?? null,
        humidityPct: data.current.relative_humidity_2m ?? null,
        windMs: data.current.wind_speed_10m != null ? Number(data.current.wind_speed_10m) / 3.6 : null, // km/h -> m/s
        cloudsPct: data.current.cloud_cover ?? null,
        description: null,
      }
    : null;

  // Forecast: next 12h (or whatever is available)
  const times = data?.hourly?.time || [];
  const temps = data?.hourly?.temperature_2m || [];
  const precs = data?.hourly?.precipitation || [];

  let startIdx = 0;
  const now = Date.now();
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (!Number.isNaN(t) && t >= now) {
      startIdx = i;
      break;
    }
  }

  const endIdx = Math.min(times.length, startIdx + 12);

  const nextTemps = [];
  let rainMm = 0;
  for (let i = startIdx; i < endIdx; i++) {
    const v = temps[i];
    if (typeof v === "number") nextTemps.push(v);
    const mm = precs[i];
    if (typeof mm === "number") rainMm += mm;
  }

  const minTemp = nextTemps.length ? Math.min(...nextTemps) : null;

  const forecast = {
    nextHoursMinTempC: minTemp,
    nextHoursRainMm: Number(rainMm.toFixed(2)),
  };

  return { current, forecast };
}

async function getWeatherBundle(lat, lng) {
  if (lat == null || lng == null) return null;

  // Default: if OpenWeather isn't configured, fallback to Open-Meteo (no API key required)
  if (!env.OPENWEATHER_API_KEY) {
    return await getBundleFromOpenMeteo(lat, lng);
  }

  const [current, forecast] = await Promise.all([
    getCurrent(lat, lng),
    getForecast(lat, lng),
  ]);

  // If OpenWeather is configured but fails (invalid key/network), don't return empty bundle.
  if (!current && !forecast) {
    const fallback = await getBundleFromOpenMeteo(lat, lng);
    if (fallback) return fallback;
  }

  return { current, forecast };
}

module.exports = { getWeatherBundle, reverseGeocode };