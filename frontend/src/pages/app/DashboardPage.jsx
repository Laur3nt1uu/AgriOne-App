import { createElement, memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { authStore } from "../../auth/auth.store";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card } from "../../ui/card";
import { KPICard } from "../../components/agri/KPICard";
import { DashboardSkeleton } from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowRight,
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

/* ── Isolated clock so it doesn't re-render the whole page ── */
const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const roDate = now.toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const roTime = now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return <span className="capitalize">{roDate} • {roTime}</span>;
});

/* ── Chart tooltip ── */
function MiniChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/15 bg-background/90 backdrop-blur-sm p-3 text-sm shadow-lg">
      <div className="font-semibold text-xs text-muted-foreground mb-1">
        {new Date(label).toLocaleString("ro-RO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.dataKey === "temperature" ? "Temp" : "Umid"}:</span>
          <span className="font-semibold">{Number(p.value).toFixed(1)}{p.dataKey === "temperature" ? "°C" : "%"}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Normalize reading from API shape ── */
function normalizeReading(r) {
  return {
    ts: r.recordedAt || r.ts || r.createdAt || new Date().toISOString(),
    temperature: Number(r.temperatureC ?? r.temperature ?? 0),
    humidity: Number(r.humidityPct ?? r.humidity ?? 0),
  };
}

/* ── Stagger animation variants ── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function DashboardPage() {
  const nav = useNavigate();
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  const [initialLoading, setInitialLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  const [readings, setReadings] = useState([]);
  const [readingsLandName, setReadingsLandName] = useState(null);

  const [adminStats, setAdminStats] = useState(null);

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
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const s = await api.admin.getStats();
        setAdminStats(s || null);
      } catch {
        setAdminStats(null);
      }
    })();
  }, [isAdmin]);

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

        // Fetch sensor readings for chart
        try {
          const rd = await api.readings.byLand(land.id, "7d");
          const items = Array.isArray(rd?.items) ? rd.items : (Array.isArray(rd) ? rd : []);
          setReadings(items.map(normalizeReading));
          setReadingsLandName(land.name || null);
        } catch {
          setReadings([]);
        }
      } catch {
        setWeather(null);
        setWeatherPlace(null);
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
    { label: "Total terenuri", value: pick(overview, ["totalLands","lands","countLands","landsCount"], "—"), Icon: Leaf, sub: "Parcele agricole" },
    { label: "Senzori activi", value: pick(overview, ["activeSensors","sensorsOnline"], "—"), Icon: Cpu, sub: `din ${pick(overview, ["sensorsCount","totalSensors"], "?")} total` },
    { label: "Temp. medie (24h)", value: pick(overview, ["avgTemp","avgTemperature","avgTemperature24h"], "—"), Icon: Thermometer, sub: "Ultimele 24 de ore", suffix: "°C" },
    { label: "Umid. medie (24h)", value: pick(overview, ["avgHumidity","avgHum","avgHumidity24h"], "—"), Icon: Droplets, sub: "Ultimele 24 de ore", suffix: "%" },
    { label: "Profit total", value: pick(overview, ["totalProfit","profit","profitTotal"], "—"), Icon: TrendingUp, sub: "Venituri − cheltuieli", suffix: " RON" },
    { label: "Alerte (7 zile)", value: pick(overview, ["activeAlerts","alertsActive","recentAlerts"], "—"), Icon: BellRing, sub: "Ultimele 7 zile" },
  ];

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

  // Show skeleton while initial data is loading
  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-warn/10" />
        <div className="relative flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-xl font-semibold tracking-tight">
              {user?.name ? `Bun venit, ${user.name.split(" ")[0]}!` : "Dashboard"}
            </div>
            <div className="text-muted-foreground text-sm mt-1"><LiveClock /></div>
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

          <div className="flex gap-2 flex-wrap shrink-0">
            <Button variant="secondary" onClick={() => loadGlobalRec(false)} disabled={globalBusy} className="text-sm">
              Actualizează
            </Button>
            <Button
              variant="outline"
              onClick={useDeviceLocation}
              disabled={globalBusy}
              title="Folosește coordonatele dispozitivului"
              className="text-sm"
            >
              Locația mea
            </Button>
            <Button
              variant="ghost"
              onClick={openPreferences}
              disabled={globalBusy}
              title="Setează locația globală salvată"
              className="text-sm"
            >
              Setează
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-4 lg:gap-6">
        <div className="space-y-4">
          {isAdmin ? (
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Admin dashboard</div>
                  <div className="text-muted-foreground text-sm">Acțiuni și statistici globale.</div>
                </div>
                <Badge variant="success">ADMIN</Badge>
              </div>

              <div className="mt-3 text-muted-foreground text-xs">
                Fluxuri rapide: <span className="font-medium">Adaugă teren</span> (Utilizatori → Adaugă teren) • <span className="font-medium">Pair senzor</span> (Setări sistem → Asociere)
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/15 bg-background/40 p-4">
                  <div className="text-muted-foreground text-xs">Utilizatori</div>
                  <div className="text-2xl font-semibold mt-2">{adminStats?.totalUsers ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-border/15 bg-background/40 p-4">
                  <div className="text-muted-foreground text-xs">Terenuri</div>
                  <div className="text-2xl font-semibold mt-2">{adminStats?.totalLands ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-border/15 bg-background/40 p-4">
                  <div className="text-muted-foreground text-xs">Senzori</div>
                  <div className="text-2xl font-semibold mt-2">{adminStats?.totalSensors ?? "—"}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                <Button variant="primary" onClick={() => nav("/app/admin/users")}>Utilizatori</Button>
                <Button variant="secondary" onClick={() => nav("/app/admin/settings")}>Setări sistem</Button>
                <Button variant="ghost" onClick={() => nav("/app/admin/users")}>Adaugă teren pentru utilizator</Button>
                <Button variant="ghost" onClick={() => nav("/app/admin/settings")}>Asociază senzor</Button>
                <Button variant="ghost" onClick={() => nav("/app/lands")}>Toate terenurile</Button>
              </div>
            </Card>
          ) : null}

          <Motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {kpiCards.map(({ label, value, Icon: KpiIcon, sub, suffix }, index) => {
              const display = value != null && value !== "—" && suffix ? `${value}${suffix}` : String(value);
              return (
                <Motion.div key={label} variants={fadeUp}>
                  <KPICard
                    title={label}
                    value={display}
                    subtitle={sub}
                    icon={createElement(KpiIcon, { size: 24 })}
                    variant={index === 5 && String(value) !== "—" && Number(value) > 0 ? "warning" : "default"}
                  />
                </Motion.div>
              );
            })}
          </Motion.div>

          {/* ── Sensor readings chart ── */}
          {readings.length > 0 && (
            <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-sm font-semibold">Citiri senzori (7 zile)</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {readingsLandName ? `Teren: ${readingsLandName}` : "Ultimele citiri disponibile"}
                        {" • "}{readings.length} puncte
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => nav("/app/sensors")} className="text-xs gap-1">
                      Detalii <ArrowRight size={14} />
                    </Button>
                  </div>
                  <div className="h-[180px] sm:h-[220px] md:h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={readings} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="dashTempGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary, #10b981)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--color-primary, #10b981)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="dashHumGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" strokeOpacity={0.15} />
                        <XAxis
                          dataKey="ts"
                          tickFormatter={(v) => new Date(v).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
                          stroke="var(--color-muted-foreground, #9ca3af)"
                          tick={{ fontSize: 11 }}
                          strokeOpacity={0.4}
                        />
                        <YAxis stroke="var(--color-muted-foreground, #9ca3af)" tick={{ fontSize: 11 }} strokeOpacity={0.4} />
                        <RTooltip content={<MiniChartTooltip />} />
                        <Area type="monotone" dataKey="temperature" stroke="var(--color-primary, #10b981)" strokeWidth={2} fill="url(#dashTempGrad)" dot={false} />
                        <Area type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={1.5} fill="url(#dashHumGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded bg-primary" />Temperatură (°C)</span>
                    <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ background: "#3b82f6" }} />Umiditate (%)</span>
                  </div>
                </div>
              </Card>
            </Motion.div>
          )}

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

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[{ title: "Terenuri", desc: "Gestionează parcele și hartă", Icon: Leaf, to: "/app/lands" }, { title: "Senzori", desc: "Istoric citiri și status", Icon: Cpu, to: "/app/sensors" }, { title: "Economie", desc: "Venituri / cheltuieli", Icon: TrendingUp, to: "/app/economics" }].map(({ title, desc, Icon: QuickIcon, to }) => (
                <div
                  key={title}
                  onClick={() => nav(to)}
                  className="rounded-xl border border-border/15 bg-background/40 p-4 flex items-center gap-3 cursor-pointer hover:bg-background/60 hover:border-primary/20 transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl border border-border/15 bg-background/60 grid place-items-center">
                    {createElement(QuickIcon, { size: 18, className: "text-muted-foreground" })}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{title}</div>
                    <div className="text-muted-foreground text-xs truncate">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10">
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
                recentAlerts.slice(0, 6).map((a, index) => {
                  const id = pick(a, ["id", "uuid"], "");
                  const sev = (pick(a, ["severity", "level"], "WARNING") || "WARNING").toUpperCase();
                  const title = pick(a, ["title", "message"], "Alert");
                  const landName = pick(a, ["landName", "land"], "");
                  const isAck = !!pick(a, ["acknowledged", "isAcknowledged"], false);
                  const ts = pick(a, ["createdAt", "ts"], "");
                  const when = ts ? new Date(ts).toLocaleString("ro-RO") : "";

                  const badgeVariant = sev === "CRITICAL" ? "danger" : "warn";
                  const SevIcon = sev === "CRITICAL" ? ShieldAlert : TriangleAlert;

                  return (
                    <Motion.div
                      key={id || `${title}-${when}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      onClick={() => nav("/app/alerts")}
                      className={`rounded-xl border p-4 flex items-start justify-between gap-3 cursor-pointer relative overflow-hidden transition-all duration-300 group ${
                        sev === "CRITICAL"
                          ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
                          : "bg-gradient-to-br from-warn/10 to-warn/5 border-warn/30"
                      }`}
                      style={{
                        "--hover-shadow": sev === "CRITICAL" ? "var(--shadow-destructive-hover)" : "var(--shadow-warn-hover)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = sev === "CRITICAL"
                          ? "0 8px 24px rgba(220, 38, 38, 0.15)"
                          : "0 8px 24px rgba(245, 158, 11, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="min-w-0 relative z-10">
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

                      <div className="flex items-center gap-3 shrink-0 relative z-10">
                        <div className="text-muted-foreground text-xs whitespace-nowrap">{when}</div>
                        <div className="h-9 w-9 rounded-xl border border-border/15 bg-background/60 hidden sm:grid place-items-center">
                          <SevIcon size={18} className="text-muted-foreground" />
                        </div>
                      </div>
                    </Motion.div>
                  );
                })
              ) : (
                <div className="text-muted-foreground text-sm">Nu există alerte.</div>
              )}
            </div>

            {recentAlerts.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={() => nav("/app/alerts")} className="text-xs gap-1">
                  Vezi toate alertele <ArrowRight size={14} />
                </Button>
              </div>
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

      <AnimatePresence>
      {prefOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPrefOpen(false);
          }}
        >
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
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
          </Motion.div>
        </div>
      ) : null}
      </AnimatePresence>
    </div>
  );
}