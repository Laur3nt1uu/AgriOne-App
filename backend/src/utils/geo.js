
const EARTH_RADIUS_M = 6371000;

const toRad = (deg) => (deg * Math.PI) / 180;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

function pointInPolygon(lng, lat, polygon) {
  if (!Array.isArray(polygon) || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (typeof xi !== "number" || typeof yi !== "number") continue;
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function extractRing(geometry) {
  if (!geometry) return null;

  if (geometry?.type === "Feature") return extractRing(geometry.geometry);

  if (geometry?.type === "Polygon" && Array.isArray(geometry.coordinates?.[0])) {
    return geometry.coordinates[0];
  }

  if (Array.isArray(geometry)) {
    if (geometry.length === 0) return null;
    const first = geometry[0];
    if (Array.isArray(first) && first.length >= 2) return geometry;
    if (first && typeof first === "object" && "lat" in first && "lng" in first) {
      return geometry.map((p) => [p.lng, p.lat]);
    }
  }

  return null;
}

function isPointInLand(lat, lng, land, { bufferMeters = 20 } = {}) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return { inside: false, method: "none" };
  }

  const ring = extractRing(land?.geometry);
  if (ring && ring.length >= 3) {
    const inside = pointInPolygon(lng, lat, ring);
    return { inside, method: "polygon" };
  }

  if (
    typeof land?.centroidLat === "number" &&
    typeof land?.centroidLng === "number" &&
    typeof land?.areaHa === "number"
  ) {
    const areaM2 = land.areaHa * 10000;
    const radius = Math.sqrt(areaM2 / Math.PI) + bufferMeters;
    const distanceM = haversineMeters(lat, lng, land.centroidLat, land.centroidLng);
    return { inside: distanceM <= radius, method: "radius", distanceM, radiusM: radius };
  }

  return { inside: false, method: "none" };
}

module.exports = { haversineMeters, pointInPolygon, extractRing, isPointInLand };
