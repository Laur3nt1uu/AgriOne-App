import { useCallback, useEffect, useMemo, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const [weatherLand, setWeatherLand] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherPlace, setWeatherPlace] = useState(null);

  const [globalRec, setGlobalRec] = useState(null);
  const [globalBusy, setGlobalBusy] = useState(false);
  const [globalPlace, setGlobalPlace] = useState(null);

  const [prefOpen, setPrefOpen] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefName, setPrefName] = useState("");
  const [prefLat, setPrefLat] = useState("");
  const [prefLng, setPrefLng] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.analytics.overview();
        setOverview(data);
      } catch (e) {
        toastError(e, "Nu pot încărca dashboard-ul.");
      }
    })();
  }, []);

  const loadGlobalRec = useCallback(async (silent = true, coords = null) => {
    setGlobalBusy(true);
    try {
      const data = coords?.lat != null && coords?.lng != null
        ? await api.recommendations.today(coords.lat, coords.lng)
        : await api.recommendations.today();
      setGlobalRec(data || null);
    } catch (e) {
      setGlobalRec(null);
      if (!silent) toastError(e, "Nu pot încărca vremea globală.");
    } finally {
      setGlobalBusy(false);
    }
  }, []);

  async function useDeviceLocation() {
    if (!navigator?.geolocation) {
      toastError(null, "Browser-ul nu suportă geolocație.");
      return;
    }

    if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      toastError(null, "Geolocația necesită HTTPS sau acces pe localhost.");
      return;
    }

    setGlobalBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = Number(pos?.coords?.latitude);
          const lng = Number(pos?.coords?.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            toastError(null, "Nu pot obține coordonatele.");
            return;
          }
          await loadGlobalRec(false, { lat, lng });
        } finally {
          setGlobalBusy(false);
        }
      },
      (err) => {
        setGlobalBusy(false);
        const code = err?.code;
        if (code === 1) return toastError(null, "Permisiunea pentru locație a fost refuzată.");
        if (code === 2) return toastError(null, "Nu pot determina locația (indisponibil). Încearcă din nou.");
        if (code === 3) return toastError(null, "Timeout la geolocație. Încearcă din nou.");
        return toastError(null, "Nu pot obține locația.");
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 }
    );
  }

  async function openPreferences() {
    try {
      const p = await api.auth.getPreferences().catch(() => null);
      const gl = p?.globalLocation || null;
      setPrefName(gl?.name || "");
      setPrefLat(gl?.lat != null ? String(gl.lat) : "");
      setPrefLng(gl?.lng != null ? String(gl.lng) : "");
    } catch {
      // best-effort
      setPrefName("");
      setPrefLat("");
      setPrefLng("");
    } finally {
      setPrefOpen(true);
    }
  }

  async function fillPrefsFromDevice() {
    if (!navigator?.geolocation) {
      toastError(null, "Browser-ul nu suportă geolocație.");
      return;
    }

    if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      toastError(null, "Geolocația necesită HTTPS sau acces pe localhost.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos?.coords?.latitude);
        const lng = Number(pos?.coords?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          toastError(null, "Nu pot obține coordonatele.");
          return;
        }
        setPrefLat(String(lat));
        setPrefLng(String(lng));
        if (!prefName) setPrefName("Locația mea");
      },
      (err) => {
        const code = err?.code;
        if (code === 1) return toastError(null, "Permisiunea pentru locație a fost refuzată.");
        if (code === 2) return toastError(null, "Nu pot determina locația (indisponibil). Încearcă din nou.");
        if (code === 3) return toastError(null, "Timeout la geolocație. Încearcă din nou.");
        return toastError(null, "Nu pot obține locația.");
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 }
    );
  }

  async function savePreferences() {
    const lat = Number(prefLat);
    const lng = Number(prefLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      toastError(null, "Coordonate invalide.");
      return;
    }

    setPrefSaving(true);
    try {
      await api.auth.updatePreferences({
        globalLocation: {
          name: prefName?.trim?.() || undefined,
          lat,
          lng,
        },
      });
      setPrefOpen(false);
      await loadGlobalRec(false);
    } catch (e) {
      toastError(e, "Nu pot salva locația globală.");
    } finally {
      setPrefSaving(false);
    }
  }

  async function clearPreferences() {
    setPrefSaving(true);
    try {
      await api.auth.updatePreferences({ globalLocation: null });
      setPrefName("");
      setPrefLat("");
      setPrefLng("");
      setPrefOpen(false);
      await loadGlobalRec(false);
    } catch (e) {
      toastError(e, "Nu pot șterge locația globală.");
    } finally {
      setPrefSaving(false);
    }
  }

  useEffect(() => {
    loadGlobalRec(true);
  }, [loadGlobalRec]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const lands = await api.lands.list().catch(() => []);
        const arr = Array.isArray(lands) ? lands : (lands?.items || []);
        const land = arr.find((x) => x?.centroidLat != null && x?.centroidLng != null) || null;
        setWeatherLand(land);
        if (!land) return;

        const w = await api.weather.byCoords(land.centroidLat, land.centroidLng);
        setWeather(w);

        const loc = await api.weather.reverseGeocode(land.centroidLat, land.centroidLng).catch(() => null);
        setWeatherPlace(loc?.name || null);
      } catch {
        setWeather(null);
        setWeatherPlace(null);
        // weather is best-effort; don't spam error toasts on dashboard
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const loc = globalRec?.location;
        if (!loc?.lat || !loc?.lng) {
          setGlobalPlace(null);
          return;
        }

        if (loc.source === "USER_PREF" && loc.name) {
          setGlobalPlace(loc.name);
          return;
        }

        const r = await api.weather.reverseGeocode(loc.lat, loc.lng).catch(() => null);
        setGlobalPlace(r?.name || null);
      } catch {
        setGlobalPlace(null);
      }
    })();
  }, [globalRec]);

  const cards = [
    { label: "Total terenuri", value: pick(overview, ["totalLands","lands","countLands","landsCount"], "—") },
    { label: "Senzori activi", value: pick(overview, ["activeSensors","sensorsOnline"], "—") },
    { label: "Temp. medie (24h)", value: pick(overview, ["avgTemp","avgTemperature","avgTemperature24h"], "—") },
    { label: "Profit total", value: pick(overview, ["totalProfit","profit","profitTotal"], "—") },
    { label: "Alerte (7 zile)", value: pick(overview, ["activeAlerts","alertsActive","recentAlerts"], "—") },
    { label: "Umid. medie (24h)", value: pick(overview, ["avgHumidity","avgHum","avgHumidity24h"], "—") },
  ];

  const roDate = useMemo(
    () => now.toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    [now]
  );
  const roTime = useMemo(
    () => now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    [now]
  );

  const globalWeather = globalRec?.inputs?.weather || null;
  const globalActions = Array.isArray(globalRec?.actions) ? globalRec.actions : [];

  const globalLocationLabel = useMemo(() => {
    const loc = globalRec?.location;
    if (!loc) return null;

    if (loc.source === "LAND") {
      if (loc.landName) return `Locație: ${loc.landName} (din teren)`;
      return "Locație: dintr-un teren";
    }

    if (loc.source === "QUERY") {
      return "Locație: dispozitiv (geolocație)";
    }

    if (loc.source === "USER_PREF") {
      if (loc.name) return `Locație: ${loc.name} (salvată)`;
      return "Locație: salvată";
    }

    return "Locație: implicită (România)";
  }, [globalRec]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="muted text-sm mt-1 capitalize">{roDate} • {roTime}</div>
          {globalLocationLabel ? (
            <div className="muted text-xs mt-2">
              {globalLocationLabel}
              {globalPlace && (!String(globalLocationLabel).includes(globalPlace)) ? ` • ${globalPlace}` : ""}
            </div>
          ) : null}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" onClick={() => loadGlobalRec(false)} disabled={globalBusy}>
            Actualizează
          </Button>
          <Button variant="ghost" onClick={useDeviceLocation} disabled={globalBusy} title="Folosește coordonatele dispozitivului">
            Locația mea
          </Button>
          <Button variant="ghost" onClick={openPreferences} disabled={globalBusy} title="Setează locația globală salvată">
            Setează
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="card p-5 card-hover">
                <div className="muted text-sm">{c.label}</div>
                <div className="text-3xl font-extrabold mt-2">{String(c.value)}</div>
                <div className="text-xs muted mt-1">Actualizat din backend</div>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <div className="text-sm font-bold">Acțiuni rapide</div>
            <div className="muted text-sm">Folosește meniul pentru navigare</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card-soft p-4">Terenuri → gestionează parcele</div>
              <div className="card-soft p-4">Senzori → istoric citiri</div>
              <div className="card-soft p-4">Economie → venituri/cheltuieli</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Vreme (teren)</div>
                <div className="muted text-sm mt-1">
                  {weatherLand ? `Teren: ${weatherLand.name}` : "Nu există terenuri cu coordonate."}
                </div>
                {weatherPlace ? <div className="muted text-xs mt-2">Locație: {weatherPlace}</div> : null}
              </div>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    if (!weatherLand) return;
                    const w = await api.weather.byCoords(weatherLand.centroidLat, weatherLand.centroidLng);
                    setWeather(w);

                    const loc = await api.weather.reverseGeocode(weatherLand.centroidLat, weatherLand.centroidLng).catch(() => null);
                    setWeatherPlace(loc?.name || null);
                  } catch {
                    setWeather(null);
                    setWeatherPlace(null);
                  }
                }}
                disabled={!weatherLand}
              >
                Actualizează
              </Button>
            </div>

            {!weatherLand ? (
              <div className="mt-4 muted text-sm">
                Adaugă un teren cu delimitare (centroid) pentru meteo local.
              </div>
            ) : !weather?.current ? (
              <div className="muted mt-4">Vreme indisponibilă momentan.</div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="card-soft p-4">
                  <div className="muted text-xs">Temperatură</div>
                  <div className="text-2xl font-extrabold mt-1">{Number(weather.current.tempC).toFixed(1)}°C</div>
                  <div className="muted text-xs mt-2">Umiditate {weather.current.humidityPct ?? "—"}%</div>
                </div>
                <div className="card-soft p-4">
                  <div className="muted text-xs">Vânt / nori</div>
                  <div className="text-2xl font-extrabold mt-1">{weather.current.windMs != null ? `${Number(weather.current.windMs).toFixed(1)} m/s` : "—"}</div>
                  <div className="muted text-xs mt-2">Nebulozitate {weather.current.cloudsPct ?? "—"}%</div>
                </div>
              </div>
            )}

            {weather?.forecast ? (
              <div className="mt-4 flex gap-2 flex-wrap">
                {weather.forecast.nextHoursMinTempC != null ? (
                  <Badge>Min. ~12h: {Number(weather.forecast.nextHoursMinTempC).toFixed(1)}°C</Badge>
                ) : null}
                {weather.forecast.nextHoursRainMm != null ? (
                  <Badge>Ploaie ~12h: {Number(weather.forecast.nextHoursRainMm).toFixed(1)} mm</Badge>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Meteo (global) • recomandări azi</div>
                <div className="muted text-sm mt-1">Rezumat rapid pe baza vremii (independent de senzor).</div>
                {globalLocationLabel ? <div className="muted text-xs mt-2">{globalLocationLabel}</div> : null}
                {globalPlace && (!globalLocationLabel || !String(globalLocationLabel).includes(globalPlace)) ? (
                  <div className="muted text-xs mt-1">Locație: {globalPlace}</div>
                ) : null}
              </div>
              <Button variant="ghost" onClick={() => loadGlobalRec(false)} disabled={globalBusy}>
                Actualizează
              </Button>
            </div>

            {globalBusy ? (
              <div className="mt-4 muted">Se încarcă…</div>
            ) : !globalWeather?.current ? (
              <div className="mt-4 muted">Vreme indisponibilă momentan.</div>
            ) : (
              <>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge>Temp: {globalWeather.current.tempC ?? "—"}°C</Badge>
                  <Badge>Umid: {globalWeather.current.humidityPct ?? "—"}%</Badge>
                  <Badge>
                    Vânt: {globalWeather.current.windMs != null ? `${Math.round(Number(globalWeather.current.windMs) * 3.6)} km/h` : "—"}
                  </Badge>
                  {globalWeather?.forecast?.nextHoursRainMm != null ? (
                    <Badge>Ploaie ~12h: {Number(globalWeather.forecast.nextHoursRainMm).toFixed(1)} mm</Badge>
                  ) : null}
                  {globalWeather?.forecast?.nextHoursMinTempC != null ? (
                    <Badge>Min. ~12h: {Number(globalWeather.forecast.nextHoursMinTempC).toFixed(1)}°C</Badge>
                  ) : null}
                </div>

                {globalActions.length ? (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {globalActions.slice(0, 6).map((a, idx) => (
                      <Badge key={`${a.type || "A"}-${idx}`}>
                        P{a.priority ?? "-"}: {a.title}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {prefOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPrefOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Locație globală</div>
                <div className="muted text-sm mt-1">Salvată în cont și folosită pentru meteo/recomandări globale.</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setPrefOpen(false)} disabled={prefSaving} title="Închide">
                ✕
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="muted text-xs mb-1">Nume (opțional)</div>
                <input
                  className="input"
                  value={prefName}
                  onChange={(e) => setPrefName(e.target.value)}
                  placeholder="ex: Iași / Ferma bunicilor"
                  disabled={prefSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="muted text-xs mb-1">Latitudine</div>
                  <input
                    className="input"
                    value={prefLat}
                    onChange={(e) => setPrefLat(e.target.value)}
                    placeholder="ex: 47.158"
                    disabled={prefSaving}
                  />
                </div>
                <div>
                  <div className="muted text-xs mb-1">Longitudine</div>
                  <input
                    className="input"
                    value={prefLng}
                    onChange={(e) => setPrefLng(e.target.value)}
                    placeholder="ex: 27.601"
                    disabled={prefSaving}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-between">
                <Button type="button" variant="ghost" onClick={fillPrefsFromDevice} disabled={prefSaving}>
                  Locația mea
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={clearPreferences} disabled={prefSaving}>
                    Șterge
                  </Button>
                  <Button type="button" variant="primary" onClick={savePreferences} disabled={prefSaving}>
                    {prefSaving ? "Se salvează..." : "Salvează"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}