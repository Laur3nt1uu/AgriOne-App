/**
 * Geo utilities for verifying sensor location against land geometry.
 * Self-contained — no external dependencies. Pure functions, easy to unit-test.
 */

const EARTH_RADIUS_M = 6371000;

const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Haversine distance between two lat/lng points, in meters.
 */
function haversineMeters(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/**
 * Ray-casting point-in-polygon. polygon is array of [lng, lat] pairs.
 * Closed or open ring — both work.
 */
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

/**
 * Extract the outer ring of a polygon from a GeoJSON-like geometry.
 * Supports common shapes:
 *   - GeoJSON Polygon: { type:"Polygon", coordinates:[[[lng,lat],...]] }
 *   - GeoJSON Feature wrapping a Polygon
 *   - Plain array of [lng,lat] points
 *   - Leaflet "latlngs" shape: array of {lat,lng} objects
 */
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

/**
 * Decide if (lat,lng) is inside a Land's footprint.
 * Tries polygon first; falls back to centroid+radius derived from areaHa.
 *
 * Returns { inside: bool, method: "polygon"|"radius"|"none", distanceM?: number }
 */
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
    // Treat the land as a disk of equivalent area; add small buffer for GPS noise.
    const areaM2 = land.areaHa * 10000;
    const radius = Math.sqrt(areaM2 / Math.PI) + bufferMeters;
    const distanceM = haversineMeters(lat, lng, land.centroidLat, land.centroidLng);
    return { inside: distanceM <= radius, method: "radius", distanceM, radiusM: radius };
  }

  return { inside: false, method: "none" };
}

module.exports = { haversineMeters, pointInPolygon, extractRing, isPointInLand };
