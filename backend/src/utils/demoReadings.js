
function hashSeed(str) {
  let h = 0x811c9dc5;
  const s = String(str || "agrione");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function generateDemoReadings({ seed = "agrione", range = "24h", endTime, from, to, stepMinutes } = {}) {
  const windowMode = from != null && to != null;

  let start;
  let end;
  let step; // ms
  if (windowMode) {
    start = new Date(from).getTime();
    end = new Date(to).getTime();
    step = (stepMinutes || 60) * 60 * 1000;
  } else {
    end = endTime instanceof Date ? endTime.getTime() : Date.now();
    const cfg = {
      "24h": { hours: 24, stepMin: 30 },
      "7d": { hours: 7 * 24, stepMin: 120 },
      "30d": { hours: 30 * 24, stepMin: 360 },
      all: { hours: 30 * 24, stepMin: 360 },
    }[range] || { hours: 24, stepMin: 30 };
    step = cfg.stepMin * 60 * 1000;
    start = end - (Math.floor((cfg.hours * 60) / cfg.stepMin) - 1) * step;
  }

  const stepMinutesEff = step / 60000;
  const count = Math.max(1, Math.floor((end - start) / step) + 1);

  const rand = mulberry32(hashSeed(seed));
  const tempMean = 16.5 + rand() * 3; // 16.5–19.5 °C baseline
  const tempAmp = 5.5 + rand() * 2.5; // 5.5–8 °C day/night swing
  const humBase = 62 + rand() * 10; // 62–72 %
  const soilStart = 58 + rand() * 8; // 58–66 %
  const wateringEveryH = 30 + Math.floor(rand() * 18); // irrigation cadence 30–48h

  const multiDay = (end - start) > 2 * 24 * 60 * 60 * 1000;

  const points = [];
  let soil = soilStart;

  for (let k = 0; k < count; k++) {
    const ts = new Date(start + k * step);
    const hourOfDay = ts.getHours() + ts.getMinutes() / 60;

    const diurnal = Math.sin((2 * Math.PI * (hourOfDay - 9)) / 24);
    const noiseT = (rand() - 0.5) * 1.1;
    const drift = multiDay ? Math.sin((2 * Math.PI * k) / count) * 1.6 : 0;
    const temperature = tempMean + tempAmp * diurnal + drift + noiseT;

    const noiseH = (rand() - 0.5) * 4;
    const humidity = clamp(humBase - (temperature - tempMean) * 2.3 + noiseH, 38, 94);

    const hoursFromStart = k * stepMinutesEff / 60;
    const drainedSinceWatering = hoursFromStart % wateringEveryH;
    if (k > 0 && drainedSinceWatering < stepMinutesEff / 60) {
      soil = soilStart + (rand() - 0.5) * 3;
    } else {
      soil -= 0.22 * (stepMinutesEff / 60) + rand() * 0.05;
    }
    const soilMoisture = clamp(soil, 30, 72);

    points.push({
      recordedAt: ts,
      temperatureC: Number(temperature.toFixed(1)),
      humidityPct: Math.round(humidity),
      soilMoisturePct: Math.round(soilMoisture),
    });
  }

  return points;
}

module.exports = { generateDemoReadings };
