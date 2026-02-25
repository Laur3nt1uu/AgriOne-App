import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMaps";
import { normalizeLatLngPairs } from "../../utils/geometry";

export default function GooglePolygonViewMap({
  center,
  zoom = 14,
  polygon,
  marker,
  className,
  height = "100%",
}) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const polygonRef = useRef(null);
  const markerRef = useRef(null);

  const [err, setErr] = useState("");

  const startCenter = useMemo(() => {
    if (Array.isArray(center) && center.length >= 2) return { lat: center[0], lng: center[1] };
    if (center?.lat != null && center?.lng != null) return center;
    return { lat: 45.9432, lng: 24.9668 };
  }, [center]);

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        const google = await loadGoogleMaps();
        if (disposed) return;

        if (!mapElRef.current) return;

        mapRef.current = new google.maps.Map(mapElRef.current, {
          center: startCenter,
          zoom,
          mapTypeId: "hybrid",
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
        });

        const pts = normalizeLatLngPairs(polygon);
        if (pts.length) {
          polygonRef.current = new google.maps.Polygon({
            paths: pts.map(([lat, lng]) => ({ lat, lng })),
            editable: false,
            strokeColor: "#16a34a",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: "#16a34a",
            fillOpacity: 0.14,
          });
          polygonRef.current.setMap(mapRef.current);

          const bounds = new google.maps.LatLngBounds();
          for (const [lat, lng] of pts) bounds.extend({ lat, lng });
          if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
        }

        if (marker?.lat != null && marker?.lng != null) {
          markerRef.current = new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapRef.current,
            title: marker.title || "",
          });
        }
      } catch (e) {
        setErr(e?.message || "Nu pot încărca Google Maps.");
      }
    })();

    return () => {
      disposed = true;
      polygonRef.current?.setMap?.(null);
      markerRef.current?.setMap?.(null);
      polygonRef.current = null;
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [startCenter, zoom, polygon, marker]);

  return (
    <div className={className} style={{ height }}>
      {err ? (
        <div className="card p-4 text-sm" style={{ height }}>
          <div className="font-semibold">Hartă indisponibilă</div>
          <div className="muted mt-1">{err}</div>
        </div>
      ) : (
        <div ref={mapElRef} style={{ height, width: "100%", borderRadius: 24 }} />
      )}
    </div>
  );
}
