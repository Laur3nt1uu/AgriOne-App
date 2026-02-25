import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMaps";
import { normalizeLatLngPairs } from "../../utils/geometry";

export default function GooglePolygonDrawMap({
  center,
  zoom = 7,
  value,
  onChange,
  className,
  height = "100%",
}) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const drawingRef = useRef(null);
  const polygonRef = useRef(null);
  const pathListenersRef = useRef([]);

  const [err, setErr] = useState("");

  const startCenter = useMemo(() => {
    if (Array.isArray(center) && center.length >= 2) return { lat: center[0], lng: center[1] };
    if (center?.lat != null && center?.lng != null) return center;
    return { lat: 45.9432, lng: 24.9668 };
  }, [center]);

  const clearPathListeners = useCallback(() => {
    for (const l of pathListenersRef.current) l?.remove?.();
    pathListenersRef.current = [];
  }, []);

  const emitCurrentPolygon = useCallback(() => {
    const poly = polygonRef.current;
    if (!poly) return;
    const path = poly.getPath();
    const pts = [];
    for (let i = 0; i < path.getLength(); i++) {
      const p = path.getAt(i);
      pts.push([Number(p.lat()), Number(p.lng())]);
    }
    onChange?.(normalizeLatLngPairs(pts));
  }, [onChange]);

  const attachPathListeners = useCallback((google) => {
    clearPathListeners();
    const poly = polygonRef.current;
    if (!poly) return;
    const path = poly.getPath();

    pathListenersRef.current = [
      google.maps.event.addListener(path, "set_at", emitCurrentPolygon),
      google.maps.event.addListener(path, "insert_at", emitCurrentPolygon),
      google.maps.event.addListener(path, "remove_at", emitCurrentPolygon),
    ];
  }, [clearPathListeners, emitCurrentPolygon]);

  const setPolygonFromValue = useCallback((google, latlngPairs) => {
    const pts = normalizeLatLngPairs(latlngPairs);
    if (!pts.length) return;

    const paths = pts.map(([lat, lng]) => ({ lat, lng }));

    if (polygonRef.current) {
      polygonRef.current.setPath(paths);
    } else {
      polygonRef.current = new google.maps.Polygon({
        paths,
        editable: true,
        draggable: false,
        strokeColor: "#16a34a",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: "#16a34a",
        fillOpacity: 0.18,
      });
      polygonRef.current.setMap(mapRef.current);
    }

    attachPathListeners(google);

    // fit bounds
    const bounds = new google.maps.LatLngBounds();
    for (const [lat, lng] of pts) bounds.extend({ lat, lng });
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
  }, [attachPathListeners]);

  const clearPolygon = useCallback(() => {
    clearPathListeners();
    polygonRef.current?.setMap?.(null);
    polygonRef.current = null;
    onChange?.(null);
  }, [clearPathListeners, onChange]);

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
          mapTypeId: "satellite",
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
        });

        const drawing = new google.maps.drawing.DrawingManager({
          drawingMode: null,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            clickable: true,
            editable: true,
            strokeColor: "#16a34a",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: "#16a34a",
            fillOpacity: 0.18,
          },
        });

        drawing.setMap(mapRef.current);
        drawingRef.current = drawing;

        google.maps.event.addListener(drawing, "overlaycomplete", (e) => {
          if (e.type !== google.maps.drawing.OverlayType.POLYGON) return;

          // one polygon only
          polygonRef.current?.setMap?.(null);
          clearPathListeners();

          polygonRef.current = e.overlay;
          polygonRef.current.setEditable(true);

          attachPathListeners(google);
          emitCurrentPolygon();

          // stop drawing after create
          drawing.setDrawingMode(null);
        });

        // Add a tiny clear button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Șterge";
        btn.className = "gmap-clear";
        btn.onclick = () => clearPolygon();
        mapRef.current.controls[google.maps.ControlPosition.TOP_LEFT].push(btn);
      } catch (e) {
        setErr(e?.message || "Nu pot încărca Google Maps.");
      }
    })();

    return () => {
      disposed = true;
      clearPathListeners();
      polygonRef.current?.setMap?.(null);
      polygonRef.current = null;
      drawingRef.current?.setMap?.(null);
      drawingRef.current = null;
      mapRef.current = null;
    };
    // Intenționat rulează o singură dată: Maps API e imperativ;
    // actualizările pentru poligon sunt tratate în effect-ul separat (value).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep polygon synced if value changes externally.
  useEffect(() => {
    (async () => {
      if (!value || !value.length) {
        if (polygonRef.current) clearPolygon();
        return;
      }
      try {
        const google = await loadGoogleMaps();
        if (!mapRef.current) return;
        setPolygonFromValue(google, value);
      } catch {
        // ignore
      }
    })();
  }, [value, setPolygonFromValue, clearPolygon]);

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
