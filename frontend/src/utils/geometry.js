const EARTH_RADIUS_M = 6378137;

export function normalizeLatLngPairs(latlngPairs) {
  const arr = Array.isArray(latlngPairs) ? latlngPairs : [];
  const out = [];
  for (const p of arr) {
    if (!Array.isArray(p) || p.length < 2) continue;
    const lat = Number(p[0]);
    const lng = Number(p[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    out.push([lat, lng]);
  }
  return out;
}

export function centroidFromLatLngPairs(latlngPairs) {
  const pts = normalizeLatLngPairs(latlngPairs);
  if (!pts.length) return null;
  let sumLat = 0;
  let sumLng = 0;
  for (const [lat, lng] of pts) {
    sumLat += lat;
    sumLng += lng;
  }
  return { lat: sumLat / pts.length, lng: sumLng / pts.length };
}

export function closeRingLngLat(ringLngLat) {
  const ring = Array.isArray(ringLngLat) ? [...ringLngLat] : [];
  if (ring.length < 1) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last) return ring;
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
  return ring;
}

export function toGeoJsonPolygonFromLatLngPairs(latlngPairs) {
  const pts = normalizeLatLngPairs(latlngPairs);
  const ring = closeRingLngLat(pts.map(([lat, lng]) => [lng, lat]));
  return { type: "Polygon", coordinates: [ring] };
}

// Approx geodesic area on WGS84 sphere.
// Formula: https://trs.jpl.nasa.gov/handle/2014/40409 (common spherical polygon area implementation)
export function polygonAreaM2(latlngPairs) {
  const pts = normalizeLatLngPairs(latlngPairs);
  if (pts.length < 3) return 0;

  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const [lat1, lng1] = pts[i];
    const [lat2, lng2] = pts[(i + 1) % pts.length];

    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const lam1 = (lng1 * Math.PI) / 180;
    const lam2 = (lng2 * Math.PI) / 180;

    const dLam = lam2 - lam1;
    sum += dLam * (2 + Math.sin(phi1) + Math.sin(phi2));
  }

  return Math.abs((sum * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

export function polygonAreaHa(latlngPairs) {
  return polygonAreaM2(latlngPairs) / 10000;
}

export function validateLatLngPairs(latlngPairs, { maxPoints = 2000 } = {}) {
  const pts = normalizeLatLngPairs(latlngPairs);
  if (pts.length < 3) return { ok: false, message: "Poligonul trebuie să aibă cel puțin 3 puncte." };
  if (pts.length > maxPoints) return { ok: false, message: `Poligon prea complex (${pts.length} puncte). Max: ${maxPoints}.` };

  for (const [lat, lng] of pts) {
    if (lat < -90 || lat > 90) return { ok: false, message: "Latitudine invalidă în poligon." };
    if (lng < -180 || lng > 180) return { ok: false, message: "Longitudine invalidă în poligon." };
  }

  return { ok: true, message: "" };
}

function toLocalXYMeters(lat, lng, lat0) {
  const x = (lng * Math.PI / 180) * EARTH_RADIUS_M * Math.cos(lat0);
  const y = (lat * Math.PI / 180) * EARTH_RADIUS_M;
  return [x, y];
}

function rdp(points, epsilon, lat0) {
  if (points.length <= 2) return points;

  const [latA, lngA] = points[0];
  const [latB, lngB] = points[points.length - 1];
  const [xA, yA] = toLocalXYMeters(latA, lngA, lat0);
  const [xB, yB] = toLocalXYMeters(latB, lngB, lat0);

  let maxDist = -1;
  let idx = -1;

  for (let i = 1; i < points.length - 1; i++) {
    const [latP, lngP] = points[i];
    const [xP, yP] = toLocalXYMeters(latP, lngP, lat0);

    const dx = xB - xA;
    const dy = yB - yA;
    const denom = dx * dx + dy * dy;

    let t = 0;
    if (denom > 0) {
      t = ((xP - xA) * dx + (yP - yA) * dy) / denom;
      t = Math.max(0, Math.min(1, t));
    }

    const xProj = xA + t * dx;
    const yProj = yA + t * dy;
    const dist = Math.hypot(xP - xProj, yP - yProj);

    if (dist > maxDist) {
      maxDist = dist;
      idx = i;
    }
  }

  if (maxDist <= epsilon || idx < 0) {
    return [points[0], points[points.length - 1]];
  }

  const left = rdp(points.slice(0, idx + 1), epsilon, lat0);
  const right = rdp(points.slice(idx), epsilon, lat0);
  return [...left.slice(0, -1), ...right];
}

export function simplifyLatLngPairs(latlngPairs, { epsilonMeters = 2, maxPoints = 200 } = {}) {
  const pts = normalizeLatLngPairs(latlngPairs);
  if (pts.length <= 3) return pts;

  const c = centroidFromLatLngPairs(pts);
  const lat0 = ((c?.lat ?? 0) * Math.PI) / 180;

  // keep as open ring points; do not duplicate last point here
  const simplified = rdp(pts, epsilonMeters, lat0);

  if (simplified.length > maxPoints) {
    // If still too big, increase epsilon progressively.
    let eps = epsilonMeters;
    let best = simplified;
    while (best.length > maxPoints && eps < 200) {
      eps *= 1.5;
      best = rdp(pts, eps, lat0);
    }
    return best;
  }

  return simplified;
}

export function toArduinoPolygonPayload({ landId, landName, latlngPairs, maxPoints = 120 } = {}) {
  const raw = normalizeLatLngPairs(latlngPairs);
  const simplified = simplifyLatLngPairs(raw, { epsilonMeters: 2, maxPoints });

  const validation = validateLatLngPairs(simplified, { maxPoints });
  if (!validation.ok) {
    return {
      ok: false,
      error: validation.message,
      payload: null,
    };
  }

  const c = centroidFromLatLngPairs(simplified);
  const geo = toGeoJsonPolygonFromLatLngPairs(simplified);

  return {
    ok: true,
    error: null,
    payload: {
      version: 1,
      type: "LAND_POLYGON",
      landId: landId ?? null,
      landName: landName ?? null,
      centroid: c,
      points: simplified.map(([lat, lng]) => ({ lat, lng })),
      geoJson: geo,
      constraints: {
        maxPoints,
        simplifiedFrom: raw.length,
      },
    },
  };
}
