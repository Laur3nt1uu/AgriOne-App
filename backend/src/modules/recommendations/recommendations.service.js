const ApiError = require("../../utils/ApiError");
const { Land, Sensor, Reading, AlertRule, User } = require("../../models");
const { Op } = require("sequelize");
const env = require("../../config/env");
const weatherService = require("../weather/weather.service");

function riskFromScore(score, online) {
  if (!online) return "HIGH";
  if (score == null) return "UNKNOWN";
  if (score >= 80) return "LOW";
  if (score >= 55) return "MEDIUM";
  return "HIGH";
}

function addAction(actions, a) {
  actions.push(a);
  actions.sort((x, y) => x.priority - y.priority);
}

function addActionDedupByType(actions, a) {
  if (!a?.type) return;
  const idx = actions.findIndex((x) => x?.type === a.type);
  if (idx >= 0) {
    const prev = actions[idx];
    const prevP = typeof prev?.priority === "number" ? prev.priority : 99;
    const nextP = typeof a?.priority === "number" ? a.priority : 99;
    if (nextP < prevP) actions[idx] = a;
    actions.sort((x, y) => x.priority - y.priority);
    return;
  }
  addAction(actions, a);
}

function riskFromActions(actions) {
  const arr = Array.isArray(actions) ? actions : [];
  if (!arr.length) return "UNKNOWN";
  const minP = Math.min(
    ...arr.map((a) => (typeof a?.priority === "number" ? a.priority : 99))
  );
  if (minP <= 1) return "HIGH";
  if (minP <= 2) return "MEDIUM";
  return "LOW";
}

function addWeatherActions(actions, weather) {
  if (!weather?.current && !weather?.forecast) return;

  const t = weather?.current?.tempC;
  const humAir = weather?.current?.humidityPct;
  const wind = weather?.current?.windMs;
  const clouds = weather?.current?.cloudsPct;
  const minNext = weather?.forecast?.nextHoursMinTempC;
  const rainNext = weather?.forecast?.nextHoursRainMm;

  // Frost: current or near-future minimum
  if (typeof t === "number" && t <= 2) {
    addActionDedupByType(actions, {
      type: "FROST",
      priority: 1,
      title: "Risc de îngheț (acum)",
      detail: `Temperatură curentă ${t}°C. Protejează cultura dacă este cazul.`,
    });
  } else if (typeof minNext === "number" && minNext <= 2) {
    addActionDedupByType(actions, {
      type: "FROST",
      priority: 2,
      title: "Risc de îngheț (prognoză)",
      detail: `Minim estimat ${minNext}°C în următoarele ore.`,
    });
  }

  // Cold + wet: higher stress & possible damage
  if (
    typeof t === "number" &&
    t >= -1 &&
    t <= 6 &&
    typeof rainNext === "number" &&
    rainNext >= 3
  ) {
    addActionDedupByType(actions, {
      type: "COLD_WET",
      priority: 2,
      title: "Rece + umed",
      detail: `Temperatură ${t}°C și ploaie estimată ~${rainNext}mm. Risc pentru lucrări și unele culturi sensibile.`,
    });
  }

  // Rain: advise postponing irrigation / field work
  if (typeof rainNext === "number") {
    if (rainNext >= 10) {
      addActionDedupByType(actions, {
        type: "RAIN",
        priority: 1,
        title: "Ploaie probabilă (cantitate mare)",
        detail: `Se estimează ~${rainNext}mm în următoarele ore. Planifică lucrările în consecință.`,
      });
    } else if (rainNext >= 3) {
      addActionDedupByType(actions, {
        type: "RAIN",
        priority: 2,
        title: "Posibilă ploaie",
        detail: `Se estimează ~${rainNext}mm în următoarele ore. Poți amâna irigarea.`,
      });
    } else if (rainNext >= 0.5) {
      addActionDedupByType(actions, {
        type: "RAIN",
        priority: 3,
        title: "Ușoară ploaie posibilă",
        detail: `Se estimează ~${rainNext}mm în următoarele ore. Ține cont de asta la tratamente/lucrări.`,
      });
    }
  }

  // Heat: simple heat-stress signal
  if (typeof t === "number") {
    if (t >= 35) {
      addActionDedupByType(actions, {
        type: "HEAT",
        priority: 1,
        title: "Val de căldură (acum)",
        detail: `Temperatură curentă ${t}°C. Verifică stresul termic și hidratarea culturii.`,
      });
    } else if (t >= 30) {
      addActionDedupByType(actions, {
        type: "HEAT",
        priority: 2,
        title: "Temperaturi ridicate (acum)",
        detail: `Temperatură curentă ${t}°C. Monitorizează consumul de apă și evaporarea.`,
      });
    }
  }

  // Wind: field-work caution
  if (typeof wind === "number") {
    if (wind >= 15) {
      addActionDedupByType(actions, {
        type: "WIND",
        priority: 1,
        title: "Vânt puternic",
        detail: `Vânt ~${Math.round(wind * 3.6)} km/h. Evită tratamentele/împrăștierea dacă e cazul.`,
      });
    } else if (wind >= 10) {
      addActionDedupByType(actions, {
        type: "WIND",
        priority: 2,
        title: "Vânt moderat",
        detail: `Vânt ~${Math.round(wind * 3.6)} km/h. Atenție la deriva tratamentelor.`,
      });
    }
  }

  // Dry air: increases evapotranspiration
  if (typeof humAir === "number" && humAir <= 35) {
    addActionDedupByType(actions, {
      type: "DRY_AIR",
      priority: 3,
      title: "Aer uscat",
      detail: `Umiditate relativă ${humAir}%. Evaporarea poate fi mai mare; urmărește necesarul de apă.`,
    });
  }

  // Irrigation check: hot + dry air + no rain expected
  if (
    typeof t === "number" &&
    t >= 26 &&
    typeof humAir === "number" &&
    humAir <= 45 &&
    (typeof rainNext !== "number" || rainNext < 1)
  ) {
    addActionDedupByType(actions, {
      type: "IRRIGATION_CHECK",
      priority: 3,
      title: "Verifică necesarul de apă",
      detail: `Calm meteo relativ, dar temperatură ${t}°C și umiditate aer ${humAir}%. Dacă solul e uscat, ia în calcul o irigare.`,
    });
  }

  // Spraying window: low wind + no rain soon + mild temperature
  if (
    typeof wind === "number" &&
    wind <= 4 &&
    (typeof rainNext !== "number" || rainNext < 0.5) &&
    typeof t === "number" &&
    t >= 10 &&
    t <= 25
  ) {
    addActionDedupByType(actions, {
      type: "SPRAY_WINDOW",
      priority: 5,
      title: "Fereastră bună pentru tratamente",
      detail: `Vânt redus și fără ploaie imediată. Condiții ok pentru stropiri (verifică eticheta produsului).`,
    });
  }

  // Fungal risk proxy: high humidity + mild temp + cloudy/rainy
  if (
    typeof humAir === "number" &&
    humAir >= 85 &&
    typeof t === "number" &&
    t >= 8 &&
    t <= 25 &&
    ((typeof clouds === "number" && clouds >= 70) || (typeof rainNext === "number" && rainNext >= 0.5))
  ) {
    addActionDedupByType(actions, {
      type: "FUNGAL_RISK",
      priority: 2,
      title: "Risc mai mare de boli fungice",
      detail: `Umiditate aer ${humAir}% și condiții umede/înnorate. Monitorizează cultura și planifică intervenții dacă e cazul.`,
    });
  }

  // Very cloudy: lower drying, slower evaporation
  if (typeof clouds === "number" && clouds >= 85) {
    addActionDedupByType(actions, {
      type: "CLOUDY",
      priority: 6,
      title: "Cer foarte acoperit",
      detail: `Nebulozitate ${clouds}%. Uscarea frunzelor/solului poate fi mai lentă; ajustează planul de lucrări.`,
    });
  }
}

async function pickCoordsForOwner(ownerId) {
  // Prefer user's saved global location (if any). Otherwise use a land centroid, else env defaults.

  const user = await User.findByPk(ownerId, {
    attributes: ["id", "globalLocationName", "globalLocationLat", "globalLocationLng"],
  });

  if (user?.globalLocationLat != null && user?.globalLocationLng != null) {
    return {
      source: "USER_PREF",
      landId: null,
      landName: null,
      name: user.globalLocationName || null,
      lat: Number(user.globalLocationLat),
      lng: Number(user.globalLocationLng),
    };
  }

  const land = await Land.findOne({
    where: {
      ownerId,
      centroidLat: { [Op.ne]: null },
      centroidLng: { [Op.ne]: null },
    },
    order: [["updated_at", "DESC"]],
  });

  if (land?.centroidLat != null && land?.centroidLng != null) {
    return {
      source: "LAND",
      landId: land.id,
      landName: land.name,
      lat: Number(land.centroidLat),
      lng: Number(land.centroidLng),
    };
  }

  return {
    source: "DEFAULT",
    landId: null,
    landName: null,
    name: null,
    lat: env.WEATHER_DEFAULT_LAT,
    lng: env.WEATHER_DEFAULT_LNG,
  };
}

async function getLatestForLand(actor, landId) {
  const ownerId = actor?.sub;
  const isAdmin = actor?.role === "ADMIN";

  const land = await Land.findOne({ where: isAdmin ? { id: landId } : { id: landId, ownerId } });
  if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");

  const effectiveOwnerId = land.ownerId;

  const sensors = await Sensor.findAll({ where: { ownerId: effectiveOwnerId, landId } });
  sensors.sort((a, b) => {
    const ta = a.lastReadingAt ? new Date(a.lastReadingAt).getTime() : 0;
    const tb = b.lastReadingAt ? new Date(b.lastReadingAt).getTime() : 0;
    return tb - ta;
  });

  const sensor = sensors.length ? sensors[0] : null;

  let latest = null;
  let online = false;

  if (sensor?.lastReadingAt) {
    online = Date.now() - new Date(sensor.lastReadingAt).getTime() <= 15 * 60 * 1000;
    latest = await Reading.findOne({
      where: { sensorId: sensor.id },
      order: [["recorded_at", "DESC"]],
    });
  }

  const rule = await AlertRule.findOne({
    where: { ownerId: effectiveOwnerId, landId, enabled: true },
  });

  return { land, sensor, latest, online, rule };
}

async function recommendationsForLand(actor, landId) {
  const { land, sensor, latest, online, rule } = await getLatestForLand(actor, landId);

  // weather: folosim centroid dacă există
  const lat = land.centroidLat;
  const lng = land.centroidLng;

  const weather = await weatherService.getWeatherBundle(lat, lng);

  const actions = [];

  // Dacă nu ai senzor sau nu ai citire → recomandare “setup”
  if (!sensor || !latest) {
    addAction(actions, {
      type: "SETUP",
      priority: 5,
      title: "Nu există date de la senzor",
      detail: "Asociază un senzor sau trimite citiri mock pentru a primi recomandări.",
    });

    // Recomandări pe bază de vreme (chiar și fără senzor)
    addWeatherActions(actions, weather);

    return {
      landId,
      landName: land.name,
      online,
      risk: riskFromActions(actions),
      inputs: { sensor: sensor ? sensor.sensorCode : null, latest: null, weather },
      actions,
    };
  }

  const temp = latest.temperatureC;
  const hum = latest.humidityPct;

  // --- Recomandări pe bază de praguri (dacă există) ---
  if (rule) {
    if (rule.humMin != null && hum < rule.humMin) {
      const diff = (rule.humMin - hum).toFixed(1);
      addAction(actions, {
        type: "IRRIGATION",
        priority: 1,
        title: "Recomandare irigare",
        detail: `Umiditate ${hum}% sub pragul ${rule.humMin}% (−${diff}pp).`,
      });
    }

    if (rule.tempMin != null && temp < rule.tempMin) {
      addActionDedupByType(actions, {
        type: "FROST",
        priority: 1,
        title: "Risc de temperaturi scăzute",
        detail: `Temperatură ${temp}°C sub pragul ${rule.tempMin}°C.`,
      });
    }

    if (rule.tempMax != null && temp > rule.tempMax) {
      addActionDedupByType(actions, {
        type: "HEAT",
        priority: 1,
        title: "Risc de stres termic",
        detail: `Temperatură ${temp}°C peste pragul ${rule.tempMax}°C.`,
      });
    }
  } else {
    addAction(actions, {
      type: "CONFIG",
      priority: 3,
      title: "Configurează pragurile",
      detail: "Setează praguri de temperatură/umiditate pentru recomandări mai precise.",
    });
  }

  // Combinații senzor + vreme (mai practice)
  {
    const rainNext = weather?.forecast?.nextHoursRainMm;
    const wind = weather?.current?.windMs;

    // Dacă solul e uscat dar urmează ploaie → amână irigarea
    if (
      typeof hum === "number" &&
      hum <= 35 &&
      typeof rainNext === "number" &&
      rainNext >= 3
    ) {
      addActionDedupByType(actions, {
        type: "IRRIGATION",
        priority: 2,
        title: "Amână irigarea (ploaie în prognoză)",
        detail: `Umiditate ${hum}%, dar se estimează ~${rainNext}mm în următoarele ore.`,
      });
    }

    // Dacă e foarte umed pe teren + ploaie → risc de băltire/drenaj
    if (
      typeof hum === "number" &&
      hum >= 85 &&
      typeof rainNext === "number" &&
      rainNext >= 10
    ) {
      addActionDedupByType(actions, {
        type: "DRAINAGE",
        priority: 2,
        title: "Risc de exces de apă",
        detail: `Umiditate ridicată (${hum}%) și ploaie mare estimată (~${rainNext}mm). Verifică drenajul/rigolele.`,
      });
    }

    // Dacă e cald pe teren + vânt → evapotranspirație crescută
    if (
      typeof temp === "number" &&
      temp >= 28 &&
      typeof wind === "number" &&
      wind >= 8
    ) {
      addActionDedupByType(actions, {
        type: "EVAP",
        priority: 3,
        title: "Evapotranspirație crescută",
        detail: `Temperatură ${temp}°C și vânt ~${Math.round(wind * 3.6)} km/h. Poate crește consumul de apă.`,
      });
    }
  }

  // --- Recomandări pe bază de vreme ---
  addWeatherActions(actions, weather);

  // risc overall
  const risk = !online ? "HIGH" : riskFromActions(actions);

  return {
    landId,
    landName: land.name,
    online,
    risk,
    inputs: {
      sensor: sensor.sensorCode,
      latest: { temperatureC: temp, humidityPct: hum, recordedAt: latest.recordedAt },
      weather,
    },
    actions,
  };
}

async function recommendationsToday(ownerId) {
  const loc = await pickCoordsForOwner(ownerId);
  const weather = await weatherService.getWeatherBundle(loc.lat, loc.lng);

  const actions = [];
  addWeatherActions(actions, weather);

  if (!actions.length) {
    addAction(actions, {
      type: "INFO",
      priority: 4,
      title: "Nimic critic azi",
      detail: "Nu am detectat riscuri meteo evidente pentru următoarele ore.",
    });
  }

  return {
    scope: "GLOBAL",
    location: loc,
    inputs: { weather },
    actions,
  };
}

async function recommendationsTodayForCoords(ownerId, lat, lng) {
  const loc = {
    source: "QUERY",
    ownerId,
    landId: null,
    landName: null,
    name: null,
    lat: Number(lat),
    lng: Number(lng),
  };

  const weather = await weatherService.getWeatherBundle(loc.lat, loc.lng);
  const actions = [];
  addWeatherActions(actions, weather);

  if (!actions.length) {
    addAction(actions, {
      type: "INFO",
      priority: 4,
      title: "Nimic critic azi",
      detail: "Nu am detectat riscuri meteo evidente pentru următoarele ore.",
    });
  }

  return {
    scope: "GLOBAL",
    location: loc,
    inputs: { weather },
    actions,
  };
}

module.exports = { recommendationsForLand, recommendationsToday, recommendationsTodayForCoords };