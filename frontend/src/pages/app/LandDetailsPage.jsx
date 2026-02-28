import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import GooglePolygonViewMap from "../../components/maps/GooglePolygonViewMap";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Cloud, CloudRain, CloudSun, Droplets, Sun, Thermometer, Wind } from "lucide-react";


function isOnline(lastAt) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 15 * 60 * 1000;
}

function clamp01(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function weatherKind(weather) {
  const rain = weather?.forecast?.nextHoursRainMm;
  const clouds = weather?.current?.cloudsPct;

  if (typeof rain === "number" && rain >= 0.5) return "rain";
  if (typeof clouds === "number" && clouds >= 75) return "cloud";
  if (typeof clouds === "number" && clouds >= 35) return "partly";
  return "sun";
}

function weatherVisual(weather) {
  const kind = weatherKind(weather);
  if (kind === "rain") return { Icon: CloudRain, tintClass: "weather-tint-rain", label: "Ploaie" };
  if (kind === "cloud") return { Icon: Cloud, tintClass: "weather-tint-cloud", label: "Înnorat" };
  if (kind === "partly") return { Icon: CloudSun, tintClass: "weather-tint-cloud", label: "Parțial noros" };
  return { Icon: Sun, tintClass: "weather-tint-sun", label: "Senin" };
}

export default function LandDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [land, setLand] = useState(null);
  const [busy, setBusy] = useState(true);

  // mock readings demo (până ai Arduino)
  const [temp, setTemp] = useState(null);
  const [hum, setHum] = useState(null);

  // export state
  const [exporting, setExporting] = useState(false);

  // delete state
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // weather + recommendations
  const [weather, setWeather] = useState(null);
  const [weatherBusy, setWeatherBusy] = useState(false);
  const [weatherPlace, setWeatherPlace] = useState(null);
  const [actions, setActions] = useState([]);
  const [actionsBusy, setActionsBusy] = useState(false);

  // pair sensor modal
  const [pairOpen, setPairOpen] = useState(false);
  const [pairCode, setPairCode] = useState("");
  const [pairing, setPairing] = useState(false);

  const polygonPairs = useMemo(() => {
    const poly = land?.polygon;
    if (Array.isArray(poly) && poly.length) {
      if (Array.isArray(poly[0])) return poly.map(([lat, lng]) => [Number(lat), Number(lng)]);
      // if stored as [{lat,lng}]
      if (typeof poly[0] === "object") return poly.map((p) => [Number(p.lat), Number(p.lng)]);
    }

    const coords = land?.geometry?.coordinates?.[0];
    if (Array.isArray(coords) && coords.length) {
      // GeoJSON: [lng,lat]
      return coords.map(([lng, lat]) => [Number(lat), Number(lng)]);
    }
    return [];
  }, [land]);

  const center = useMemo(() => {
    const c = land?.centroid || (land?.centroidLat && land?.centroidLng ? { lat: land.centroidLat, lng: land.centroidLng } : null);
    if (c?.lat && c?.lng) return [c.lat, c.lng];
    if (polygonPairs.length) return [polygonPairs[0][0], polygonPairs[0][1]];
    return [45.9432, 24.9668]; // RO default
  }, [land, polygonPairs]);

  const coords = useMemo(() => {
    const latRaw = land?.centroid?.lat ?? land?.centroidLat ?? null;
    const lngRaw = land?.centroid?.lng ?? land?.centroidLng ?? null;
    const lat = typeof latRaw === "number" ? latRaw : (latRaw != null ? Number(latRaw) : null);
    const lng = typeof lngRaw === "number" ? lngRaw : (lngRaw != null ? Number(lngRaw) : null);
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  }, [land]);

  async function loadWeather(silent = true) {
    if (!coords?.lat || !coords?.lng) {
      setWeather(null);
      setWeatherPlace(null);
      return;
    }

    setWeatherBusy(true);
    try {
      const data = await api.weather.byCoords(coords.lat, coords.lng);
      setWeather(data || null);

      const loc = await api.weather.reverseGeocode(coords.lat, coords.lng).catch(() => null);
      setWeatherPlace(loc?.name || null);
    } catch (e) {
      setWeather(null);
      setWeatherPlace(null);
      if (!silent) toastError(e, "Nu pot încărca vremea.");
    } finally {
      setWeatherBusy(false);
    }
  }

  async function loadRecommendations(silent = true) {
    setActionsBusy(true);
    try {
      const data = await api.recommendations.byLand(id);
      setActions(Array.isArray(data?.actions) ? data.actions : []);
    } catch (e) {
      setActions([]);
      if (!silent) toastError(e, "Nu pot încărca recomandările.");
    } finally {
      setActionsBusy(false);
    }
  }

  async function load() {
    setBusy(true);
    try {
      const data = await api.lands.get(id);
      setLand(data);

      // mock readings local (demo)
      setTemp((Math.random() * 10 + 18).toFixed(1));
      setHum((Math.random() * 30 + 45).toFixed(0));
    } catch (e) {
      setLand(null);
      toastError(e, "Nu pot încărca terenul.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!land?.id) return;
    loadWeather(true);
    loadRecommendations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [land?.id, coords?.lat, coords?.lng]);

  // close modal on ESC
  useEffect(() => {
    if (!pairOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPairOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pairOpen]);

  useEffect(() => {
    if (!deleteOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setDeleteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteOpen]);

  // mapRef kept for compatibility (no-op for Google map)

  function openPair() {
    setPairCode("");
    setPairOpen(true);
  }

  function openDelete() {
    if (!land?.id || deleting) return;
    setDeleteOpen(true);
  }

  async function submitPair(e) {
    e?.preventDefault?.();
    const code = pairCode.trim();
    if (!code) {
      toastError(null, "Completează codul plăcii Arduino.");
      return;
    }

    setPairing(true);
    try {
      await api.iot.pairBoard({ boardCode: code, landId: id });
      toastSuccess("Placă Arduino asociată cu succes.");
      setPairOpen(false);
      setPairCode("");
      await load();
    } catch (e2) {
      toastError(e2, "Nu pot asocia placa Arduino.");
    } finally {
      setPairing(false);
    }
  }

  async function exportPdf() {
    if (!land?.id) return;

    setExporting(true);
    try {
      const blob = await api.exports.landReport(land.id);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = `AgriOne_Land_${land.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toastSuccess("Raportul a fost descărcat.");
    } catch (e) {
      toastError(e, "Nu pot exporta raportul.");
    } finally {
      setExporting(false);
    }
  }

  async function onDeleteLand() {
    if (!land?.id || deleting) return;

    setDeleting(true);
    try {
      await api.lands.remove(land.id);
      toastSuccess("Teren șters cu succes.");
      setDeleteOpen(false);
      nav("/lands", { replace: true });
    } catch (e) {
      toastError(e, "Nu pot șterge terenul.");
    } finally {
      setDeleting(false);
    }
  }

  const wx = useMemo(() => weatherVisual(weather), [weather]);
  const WxIcon = wx.Icon;
  const tempNorm = useMemo(() => {
    const t = weather?.current?.tempC;
    if (typeof t !== "number") return 0;
    return clamp01((t + 10) / 50);
  }, [weather]);
  const humNorm = useMemo(() => {
    const h = weather?.current?.humidityPct;
    if (typeof h !== "number") return 0;
    return clamp01(h / 100);
  }, [weather]);

  if (busy) return <div className="card p-6 muted">Se încarcă…</div>;
  if (!land)
    return (
      <div className="card p-6">
        <div className="text-lg font-bold">Teren indisponibil</div>
        <div className="muted mt-1">Nu am putut încărca datele acestui teren.</div>
        <div className="mt-4">
          <Button onClick={() => nav("/lands")} variant="ghost">← Înapoi</Button>
        </div>
      </div>
    );

  const online = isOnline(land.lastSensorAt);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="card p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="page-title truncate">{land.name}</div>
          <div className="muted text-sm mt-1">
            {land.cropType || "—"} • {(Number(land.areaHa || 0)).toFixed(2)} ha
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => nav("/lands")} variant="ghost">
            ← Înapoi
          </Button>

          <Button onClick={openPair} variant="ghost">
            Asociază Arduino
          </Button>

          <Button onClick={() => nav(`/sensors?landId=${land.id}`)} variant="primary">
            Vezi istoricul
          </Button>

          <Button onClick={exportPdf} variant="ghost" disabled={exporting} title="Descarcă raport PDF">
            {exporting ? "Se exportă..." : "Exportă PDF"}
          </Button>

          <Button
            onClick={openDelete}
            variant="ghost"
            disabled={deleting}
            className="text-[hsl(var(--danger))] border-[hsl(var(--danger)/0.28)] hover:bg-[hsl(var(--danger)/0.08)]"
            title="Șterge terenul"
          >
            {deleting ? "Se șterge..." : "Șterge"}
          </Button>
        </div>
      </div>

      {/* badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge>
          <span className={`dot ${online ? "dot-online" : "dot-offline"}`} />
          {online ? "Online" : "Offline"}
        </Badge>
        <Badge>Arduino: {land.arduinoCode || land.sensorId || "Neasociat"}</Badge>
        <Badge>
          Centroid: {land.centroid?.lat?.toFixed?.(4) || land.centroidLat?.toFixed?.(4) || "-"},{" "}
          {land.centroid?.lng?.toFixed?.(4) || land.centroidLng?.toFixed?.(4) || "-"}
        </Badge>
      </div>

      {pairOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPairOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Asociază placă Arduino</div>
                <div className="muted text-sm mt-1">Introdu codul plăcii (Arduino Uno) pentru a o asocia cu acest teren.</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setPairOpen(false)} disabled={pairing} title="Închide">
                ✕
              </Button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={submitPair}>
              <div>
                <div className="muted text-xs mb-1">Cod Arduino</div>
                <input
                  className="input"
                  value={pairCode}
                  onChange={(e) => setPairCode(e.target.value)}
                  placeholder="ex: UNO-123456 / AGRI-UNO-01"
                  autoFocus
                  disabled={pairing}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setPairOpen(false)} disabled={pairing}>
                  Renunță
                </Button>
                <Button type="submit" variant="primary" disabled={pairing}>
                  {pairing ? "Se asociază..." : "Asociază Arduino"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) setDeleteOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Șterge terenul</div>
                <div className="muted text-sm mt-1">
                  Sigur dorești să ștergi terenul <span className="font-semibold">{land.name}</span>?
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                title="Închide"
              >
                ✕
              </Button>
            </div>

            <div className="mt-4 card-soft p-4 text-sm">
              <div className="font-semibold">Atenție</div>
              <div className="muted mt-1">Această acțiune este permanentă.</div>
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                Renunță
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onDeleteLand}
                disabled={deleting}
                className="text-[hsl(var(--danger))] border-[hsl(var(--danger)/0.28)] hover:bg-[hsl(var(--danger)/0.08)]"
              >
                {deleting ? "Se șterge..." : "Da, șterge"}
              </Button>
            </div>
          </div>
        </div>
      )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
          {/* map */}
          <div className="card p-3 h-[560px] md:h-[720px]">
            <GooglePolygonViewMap
              center={center}
              zoom={14}
              polygon={polygonPairs}
              marker={coords ? { lat: coords.lat, lng: coords.lng, title: land.name } : null}
              height="100%"
            />
          </div>

          {/* widgets */}
          <div className="space-y-4">
          <div className="card p-5">
            <div className="text-sm font-bold">Ultimele citiri (demo)</div>
            <div className="muted text-sm mt-1">
              Până conectezi Arduino, afișăm valori simulate.
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="card-soft p-4">
                <div className="muted text-xs">Temperatură</div>
                <div className="text-2xl font-extrabold mt-1">
                  {temp ?? "—"}°C
                </div>
              </div>
              <div className="card-soft p-4">
                <div className="muted text-xs">Umiditate</div>
                <div className="text-2xl font-extrabold mt-1">
                  {hum ?? "—"}%
                </div>
              </div>
            </div>
          </div>

          <div className={`card p-6 agri-pattern ${wx.tintClass}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Vreme</div>
                <div className="muted text-sm mt-1">
                  {coords ? "Pe baza coordonatelor terenului" : "Adaugă coordonate (centroid) pentru vreme"}
                </div>
                {weatherPlace ? (
                  <div className="muted text-xs mt-2">Locație: {weatherPlace}</div>
                ) : null}
              </div>
              {weather?.current ? (
                <span className="icon-chip anim-float hidden sm:inline-flex" title={wx.label}>
                  <WxIcon size={20} className="text-slate-700" />
                </span>
              ) : null}
              <Button
                variant="ghost"
                onClick={() => loadWeather(false)}
                disabled={weatherBusy || !coords}
                title="Actualizează vremea"
              >
                Actualizează
              </Button>
            </div>

            {weatherBusy ? (
              <div className="mt-4 muted">Se încarcă…</div>
            ) : !coords ? (
              <div className="mt-4 muted">Nu există coordonate pentru acest teren.</div>
            ) : !weather?.current ? (
              <div className="mt-4 muted">Vreme indisponibilă momentan.</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Temperatură</div>
                    <Thermometer size={16} className="text-slate-700" />
                  </div>
                  <div className="text-3xl font-extrabold mt-2">{weather.current.tempC ?? "—"}°C</div>
                  <div className="mt-3 progress">
                    <div className="progress-bar" style={{ width: `${Math.round(tempNorm * 100)}%` }} />
                  </div>
                  {weather.current.description ? (
                    <div className="muted text-xs mt-2">{weather.current.description}</div>
                  ) : (
                    <div className="muted text-xs mt-2">{wx.label}</div>
                  )}
                </div>

                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Umiditate</div>
                    <Droplets size={16} className="text-slate-700" />
                  </div>
                  <div className="text-3xl font-extrabold mt-2">{weather.current.humidityPct ?? "—"}%</div>
                  <div className="mt-3 progress">
                    <div className="progress-bar" style={{ width: `${Math.round(humNorm * 100)}%` }} />
                  </div>
                  <div className="muted text-xs mt-2">Aer (RH)</div>
                </div>

                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Vânt</div>
                    <Wind size={16} className="text-slate-700" />
                  </div>
                  <div className="text-3xl font-extrabold mt-2">
                    {weather.current.windMs != null ? `${(Number(weather.current.windMs) * 3.6).toFixed(0)} km/h` : "—"}
                  </div>
                  <div className="muted text-xs mt-2">Derivă / evaporare</div>
                </div>

                <div className="card-soft p-4 agri-pattern">
                  <div className="muted text-xs">Prognoză (urm. ore)</div>
                  <div className="text-sm font-bold mt-2">
                    Min: {weather?.forecast?.nextHoursMinTempC != null ? `${weather.forecast.nextHoursMinTempC}°C` : "—"}
                  </div>
                  <div className="muted text-xs mt-1">
                    Ploaie: {weather?.forecast?.nextHoursRainMm != null ? `${weather.forecast.nextHoursRainMm} mm` : "—"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Recomandări (azi)</div>
                <div className="muted text-sm mt-1">În funcție de citiri + vreme</div>
              </div>
              <Button
                variant="ghost"
                onClick={() => loadRecommendations(false)}
                disabled={actionsBusy}
                title="Actualizează recomandările"
              >
                Actualizează
              </Button>
            </div>

            {actionsBusy ? (
              <div className="mt-4 muted">Se încarcă…</div>
            ) : actions?.length ? (
              <div className="mt-4 space-y-3">
                  {actions.slice(0, 8).map((a, idx) => (
                  <div key={`${a.type || "A"}-${idx}`} className="card-soft p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate">{a.title || "—"}</div>
                        {a.detail ? <div className="muted text-sm mt-1">{a.detail}</div> : null}
                      </div>
                      <Badge>P{a.priority ?? "-"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 muted">Nu există recomandări momentan.</div>
            )}
          </div>

          <div className="card p-5">
            <div className="text-sm font-bold">Delimitare</div>
            <div className="muted text-sm mt-1">
              {polygonPairs.length ? `Puncte poligon: ${polygonPairs.length}` : "Nu există poligon salvat."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}