import { useCallback, useEffect, useMemo, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card } from "../../ui/card";
import {
  BellRing,
  CheckCircle2,
  Cloud,
  CloudRain,
  CloudSun,
  Cpu,
  Droplets,
  Leaf,
  MapPin,
  ShieldAlert,
  Sun,
  Thermometer,
  TrendingUp,
  TriangleAlert,
  Wind,
} from "lucide-react";

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
  if (kind === "rain") {
    return { Icon: CloudRain, accentClass: "text-primary", label: "Ploaie posibilă" };
  }
  if (kind === "cloud") {
    return { Icon: Cloud, accentClass: "text-muted-foreground", label: "Înnorat" };
  }
  if (kind === "partly") {
    return { Icon: CloudSun, accentClass: "text-primary", label: "Parțial noros" };
  }
  return { Icon: Sun, accentClass: "text-warn", label: "Senin" };
}

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentAlertsBusy, setRecentAlertsBusy] = useState(false);

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

  const loadRecentAlerts = useCallback(async (silent = true) => {
    setRecentAlertsBusy(true);
    try {
      const data = await api.alerts.list({ limit: 6 });
      const arr = Array.isArray(data) ? data : (data?.items || data?.alerts || []);
      setRecentAlerts(arr);
    } catch (e) {
      setRecentAlerts([]);
      if (!silent) toastError(e, "Nu pot încărca alertele recente.");
    } finally {
      setRecentAlertsBusy(false);
    }
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
    loadRecentAlerts(true);
  }, [loadRecentAlerts]);

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

  const kpiCards = [
    { label: "Total terenuri", value: pick(overview, ["totalLands","lands","countLands","landsCount"], "—"), Icon: Leaf },
    { label: "Senzori activi", value: pick(overview, ["activeSensors","sensorsOnline"], "—"), Icon: Cpu },
    { label: "Temp. medie (24h)", value: pick(overview, ["avgTemp","avgTemperature","avgTemperature24h"], "—"), Icon: Thermometer },
    { label: "Umid. medie (24h)", value: pick(overview, ["avgHumidity","avgHum","avgHumidity24h"], "—"), Icon: Droplets },
    { label: "Profit total", value: pick(overview, ["totalProfit","profit","profitTotal"], "—"), Icon: TrendingUp },
    { label: "Alerte (7 zile)", value: pick(overview, ["activeAlerts","alertsActive","recentAlerts"], "—"), Icon: BellRing },
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

  const landWeatherVisual = useMemo(() => weatherVisual(weather), [weather]);
  const globalWeatherVisual = useMemo(() => weatherVisual(globalWeather), [globalWeather]);

  const landTempNorm = useMemo(() => {
    const t = weather?.current?.tempC;
    if (typeof t !== "number") return 0;
    // scale -10..40C
    return clamp01((t + 10) / 50);
  }, [weather]);
  const landHumNorm = useMemo(() => {
    const h = weather?.current?.humidityPct;
    if (typeof h !== "number") return 0;
    return clamp01(h / 100);
  }, [weather]);

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

  const LandWeatherIcon = landWeatherVisual.Icon;
  const GlobalWeatherIcon = globalWeatherVisual.Icon;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-warn/10" />
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-xl font-semibold tracking-tight">Dashboard</div>
            <div className="text-muted-foreground text-sm mt-1 capitalize">{roDate} • {roTime}</div>
            {globalLocationLabel ? (
              <div className="text-muted-foreground text-xs mt-2 flex items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" />
                <span className="truncate">
                  {globalLocationLabel}
                  {globalPlace && (!String(globalLocationLabel).includes(globalPlace)) ? ` • ${globalPlace}` : ""}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => loadGlobalRec(false)} disabled={globalBusy}>
              Actualizează
            </Button>
            <Button
              variant="outline"
              onClick={useDeviceLocation}
              disabled={globalBusy}
              title="Folosește coordonatele dispozitivului"
            >
              Locația mea
            </Button>
            <Button
              variant="ghost"
              onClick={openPreferences}
              disabled={globalBusy}
              title="Setează locația globală salvată"
            >
              Setează
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiCards.map(({ label, value, Icon }) => (
              <Card key={label} className="relative overflow-hidden p-5 group">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-muted-foreground text-sm">{label}</div>
                    <div className="text-3xl font-semibold mt-2 truncate">{String(value)}</div>
                    <div className="text-muted-foreground text-xs mt-1">Actualizat din backend</div>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-xl border border-border/15 bg-background/50 grid place-items-center">
                    <Icon size={18} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="relative mt-4 h-2 rounded-full bg-border/25 overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-primary/40 to-transparent" />
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Acțiuni rapide</div>
                <div className="text-muted-foreground text-sm">Folosește meniul pentru navigare</div>
              </div>
              <div className="h-9 w-9 rounded-xl border border-border/15 bg-background/50 grid place-items-center">
                <TrendingUp size={18} className="text-muted-foreground" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[{ title: "Terenuri", desc: "Gestionează parcele și hartă", Icon: Leaf }, { title: "Senzori", desc: "Istoric citiri și status", Icon: Cpu }, { title: "Economie", desc: "Venituri / cheltuieli", Icon: TrendingUp }].map(({ title, desc, Icon }) => (
                <div key={title} className="rounded-xl border border-border/15 bg-background/40 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-border/15 bg-background/60 grid place-items-center">
                    <Icon size={18} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{title}</div>
                    <div className="text-muted-foreground text-xs truncate">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Alerte recente</div>
                <div className="text-muted-foreground text-sm">Ultimele alerte generate de reguli.</div>
              </div>
              <Button variant="ghost" onClick={() => loadRecentAlerts(false)} disabled={recentAlertsBusy}>
                Actualizează
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {recentAlertsBusy ? (
                <div className="text-muted-foreground text-sm">Se încarcă…</div>
              ) : recentAlerts.length ? (
                recentAlerts.slice(0, 6).map((a) => {
                  const id = pick(a, ["id", "uuid"], "");
                  const sev = (pick(a, ["severity", "level"], "WARNING") || "WARNING").toUpperCase();
                  const title = pick(a, ["title", "message"], "Alert");
                  const landName = pick(a, ["landName", "land"], "");
                  const isAck = !!pick(a, ["acknowledged", "isAcknowledged"], false);
                  const ts = pick(a, ["createdAt", "ts"], "");
                  const when = ts ? new Date(ts).toLocaleString("ro-RO") : "";

                  const badgeVariant = sev === "CRITICAL" ? "danger" : "warn";
                  const SevIcon = sev === "CRITICAL" ? ShieldAlert : TriangleAlert;
                  const borderClass = sev === "CRITICAL" ? "border-destructive/25" : "border-warn/25";

                  return (
                    <div
                      key={id || `${title}-${when}`}
                      className={`rounded-xl border ${borderClass} bg-background/40 p-4 flex items-start justify-between gap-3`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={badgeVariant}>{sev}</Badge>
                          {landName ? <Badge>{landName}</Badge> : null}
                          {isAck ? (
                            <Badge variant="success">
                              <CheckCircle2 size={14} className="text-primary" /> Confirmată
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-2 font-semibold truncate">{title}</div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-muted-foreground text-xs whitespace-nowrap">{when}</div>
                        <div className="h-9 w-9 rounded-xl border border-border/15 bg-background/60 hidden sm:grid place-items-center">
                          <SevIcon size={18} className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground text-sm">Nu există alerte.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="relative overflow-hidden p-6">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">Vreme (teren)</div>
                <div className="text-muted-foreground text-sm mt-1">
                  {weatherLand ? `Teren: ${weatherLand.name}` : "Nu există terenuri cu coordonate."}
                </div>
                {weatherPlace ? <div className="text-muted-foreground text-xs mt-2">Locație: {weatherPlace}</div> : null}
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
              <div className="mt-4 text-muted-foreground text-sm">
                Adaugă un teren cu delimitare (centroid) pentru meteo local.
              </div>
            ) : !weather?.current ? (
              <div className="text-muted-foreground mt-4">Vreme indisponibilă momentan.</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/15 bg-background/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-muted-foreground text-xs">Acum</div>
                      <div className="text-3xl font-semibold mt-1">{Number(weather.current.tempC).toFixed(1)}°C</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {landWeatherVisual.label}
                        {weather.current.description ? ` • ${weather.current.description}` : ""}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl border border-border/15 bg-background/60 grid place-items-center">
                      <LandWeatherIcon size={22} className={landWeatherVisual.accentClass} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Thermometer size={14} className="text-muted-foreground" /> Temperatură
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-border/25 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary/40 to-transparent"
                          style={{ width: `${Math.round(landTempNorm * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Droplets size={14} className="text-muted-foreground" /> Umiditate
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-border/25 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary/40 to-transparent"
                          style={{ width: `${Math.round(landHumNorm * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/15 bg-background/40 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Wind size={14} className="text-muted-foreground" /> Vânt
                      </div>
                      <div className="text-2xl font-semibold mt-2">
                        {weather.current.windMs != null ? `${Math.round(Number(weather.current.windMs) * 3.6)} km/h` : "—"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">(≈ {weather.current.windMs != null ? `${Number(weather.current.windMs).toFixed(1)} m/s` : "—"})</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CloudSun size={14} className="text-muted-foreground" /> Nori
                      </div>
                      <div className="text-2xl font-semibold mt-2">{weather.current.cloudsPct ?? "—"}%</div>
                      <div className="text-muted-foreground text-xs mt-1">Nebulozitate</div>
                    </div>
                  </div>

                  {weather?.forecast ? (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {weather.forecast.nextHoursMinTempC != null ? (
                        <Badge>Min ~12h: {Number(weather.forecast.nextHoursMinTempC).toFixed(1)}°C</Badge>
                      ) : null}
                      {weather.forecast.nextHoursRainMm != null ? (
                        <Badge>Ploaie ~12h: {Number(weather.forecast.nextHoursRainMm).toFixed(1)} mm</Badge>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Meteo (global) • recomandări azi</div>
                <div className="text-muted-foreground text-sm mt-1">Rezumat rapid pe baza vremii (independent de senzor).</div>
                {globalLocationLabel ? <div className="text-muted-foreground text-xs mt-2">{globalLocationLabel}</div> : null}
                {globalPlace && (!globalLocationLabel || !String(globalLocationLabel).includes(globalPlace)) ? (
                  <div className="text-muted-foreground text-xs mt-1">Locație: {globalPlace}</div>
                ) : null}
              </div>
              <Button variant="ghost" onClick={() => loadGlobalRec(false)} disabled={globalBusy}>
                Actualizează
              </Button>
            </div>

            {globalBusy ? (
              <div className="mt-4 text-muted-foreground">Se încarcă…</div>
            ) : !globalWeather?.current ? (
              <div className="mt-4 text-muted-foreground">Vreme indisponibilă momentan.</div>
            ) : (
              <>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex gap-2 flex-wrap">
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
                  <div className="h-10 w-10 rounded-xl border border-border/15 bg-background/60 hidden sm:grid place-items-center">
                    <GlobalWeatherIcon size={20} className={globalWeatherVisual.accentClass} />
                  </div>
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
          </Card>
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
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <Card className="relative w-full max-w-md p-6 gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Locație globală</div>
                <div className="text-muted-foreground text-sm mt-1">Salvată în cont și folosită pentru meteo/recomandări globale.</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setPrefOpen(false)} disabled={prefSaving} title="Închide">
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prefName">Nume (opțional)</Label>
                <Input
                  id="prefName"
                  value={prefName}
                  onChange={(e) => setPrefName(e.target.value)}
                  placeholder="ex: Iași / Ferma bunicilor"
                  disabled={prefSaving}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prefLat">Latitudine</Label>
                  <Input
                    id="prefLat"
                    value={prefLat}
                    onChange={(e) => setPrefLat(e.target.value)}
                    placeholder="ex: 47.158"
                    disabled={prefSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefLng">Longitudine</Label>
                  <Input
                    id="prefLng"
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
          </Card>
        </div>
      ) : null}
    </div>
  );
}