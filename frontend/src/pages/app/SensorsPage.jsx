import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import ReadingsChart from "../../components/charts/ReadingsChart";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { SensorsSkeleton } from "../../ui/skeleton";
import { Cpu, Droplets, Download, FileSpreadsheet, Thermometer, RefreshCw, Wifi, WifiOff, Sprout } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { motion as Motion } from "framer-motion";
import { StatusBadge } from "../../components/agri/StatusBadge";

function clamp01(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function isOnline(lastAt) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 15 * 60 * 1000;
}

function mockSeries(hours = 24) {
  const now = Date.now();
  const points = [];
  let t = 20 + Math.random() * 4;
  let h = 55 + Math.random() * 10;
  let s = 45 + Math.random() * 15;
  for (let i = hours - 1; i >= 0; i--) {
    t += (Math.random() - 0.5) * 0.9;
    h += (Math.random() - 0.5) * 1.8;
    s += (Math.random() - 0.5) * 1.2;
    points.push({
      ts: new Date(now - i * 60 * 60 * 1000).toISOString(),
      temperature: Number(t.toFixed(1)),
      humidity: Math.max(0, Math.min(100, Math.round(h))),
      soilMoisture: Math.max(0, Math.min(100, Math.round(s))),
    });
  }
  return points;
}

function normalizeReadings(rows) {
  return rows.map((r) => ({
    ts: r.recordedAt || r.ts || r.createdAt || r.timestamp || new Date().toISOString(),
    temperature: Number(r.temperatureC ?? r.temperature ?? r.temp ?? 0),
    humidity: Number(r.humidityPct ?? r.humidity ?? r.hum ?? 0),
    soilMoisture: r.soilMoisturePct != null ? Number(r.soilMoisturePct) : null,
  }));
}

export default function SensorsPage() {
  const [params] = useSearchParams();
  const landId = params.get("landId");

  const user = authStore.getUser();
  const _userRole = user?.role || user?.app_metadata?.role || user?.['https://agri.one/role'];
  const isAdmin = user?.role === "ADMIN";

  const [lands, setLands] = useState([]);
  const [busy, setBusy] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [range, setRange] = useState("24h"); // 24h / 7d
  const [series, setSeries] = useState([]);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await api.lands.list();
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setLands(arr);

      // readings: prefer backend, fallback mock
      if (landId) {
        try {
          const r = await api.readings.byLand(landId, range);
          const rows = Array.isArray(r) ? r : (r?.items || []);
          if (rows.length) setSeries(normalizeReadings(rows));
          else setSeries(range === "24h" ? mockSeries(24) : mockSeries(24 * 7));
        } catch {
          setSeries(range === "24h" ? mockSeries(24) : mockSeries(24 * 7));
        }
      } else {
        setSeries(range === "24h" ? mockSeries(24) : mockSeries(24 * 7));
      }
    } catch (e) {
      toastError(e, "Nu pot încărca senzorii.");
    } finally {
      setBusy(false);
    }
  }, [landId, range]);

  useEffect(() => { load(); }, [load]);

  // CSV Export function
  async function exportCsv() {
    if (!landId || exporting) return;
    setExporting(true);
    try {
      const blob = await api.exports.readingsCsv(landId, { range });
      const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgriOne_Readings_${selectedLand?.name || landId}_${range}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toastSuccess("CSV exportat cu succes!");
    } catch (e) {
      toastError(e, "Nu pot exporta CSV-ul.");
    } finally {
      setExporting(false);
    }
  }

  const selectedLand = useMemo(
    () => lands.find((x) => String(x.id) === String(landId)),
    [lands, landId]
  );

  const selectedLandOwnerLabel = useMemo(() => {
    if (!isAdmin) return "";
    const owner = selectedLand?.owner;
    return owner?.name || owner?.username || (owner?.email ? String(owner.email).split("@")[0] : "") || owner?.email || "";
  }, [isAdmin, selectedLand]);

  const online = isOnline(selectedLand?.lastSensorAt);

  const stats = useMemo(() => {
    if (!series?.length) return null;
    const temps = series.map(x => x.temperature);
    const hums = series.map(x => x.humidity);
    const soils = series.filter(x => x.soilMoisture != null).map(x => x.soilMoisture);
    const avg = (arr) => arr.reduce((a,b)=>a+b,0) / arr.length;

    return {
      tNow: temps[temps.length-1],
      hNow: hums[hums.length-1],
      sNow: soils.length ? soils[soils.length-1] : null,
      lastTs: series[series.length-1]?.ts,
      tAvg: avg(temps),
      hAvg: avg(hums),
      sAvg: soils.length ? avg(soils) : null,
      tMax: Math.max(...temps),
      tMin: Math.min(...temps),
      hMax: Math.max(...hums),
      hMin: Math.min(...hums),
      sMax: soils.length ? Math.max(...soils) : null,
      sMin: soils.length ? Math.min(...soils) : null,
      hasSoil: soils.length > 0,
    };
  }, [series]);

  const tempNorm = useMemo(() => {
    if (!stats) return 0;
    // scale -10..40C
    return clamp01((Number(stats.tNow) + 10) / 50);
  }, [stats]);
  const humNorm = useMemo(() => {
    if (!stats) return 0;
    return clamp01(Number(stats.hNow) / 100);
  }, [stats]);
  const soilNorm = useMemo(() => {
    if (!stats || stats.sNow == null) return 0;
    return clamp01(Number(stats.sNow) / 100);
  }, [stats]);

  const lastLabel = useMemo(() => {
    const ts = stats?.lastTs;
    if (!ts) return null;
    const t = new Date(ts);
    if (Number.isNaN(t.getTime())) return null;
    return t.toLocaleString("ro-RO", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }, [stats]);

  // Show skeleton on initial load
  if (busy && lands.length === 0) {
    return <SensorsSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card p-6 agri-pattern">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="page-title">{isAdmin ? "Senzori (admin)" : "Senzori"}</div>
              <div className="muted text-sm">
                {selectedLand
                  ? `Teren: ${selectedLand.name}${selectedLandOwnerLabel ? ` • ${selectedLandOwnerLabel}` : ""}`
                  : isAdmin
                    ? "Deschide din Terenuri → detalii → Vezi istoricul"
                    : "Deschide din detaliile terenului → Istoric"}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={load} variant="ghost" size="sm" disabled={busy}>
                <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
              </Button>
              {landId && (
                <Button onClick={exportCsv} variant="ghost" size="sm" disabled={exporting || !landId} title="Exportă date CSV">
                  <FileSpreadsheet size={14} className="mr-1" />
                  {exporting ? "Export..." : "CSV"}
                </Button>
              )}
            </div>
          </div>

          {/* Range selector + Live status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-2">
              <Button onClick={() => setRange("24h")} variant="tab" className={range === "24h" ? "is-active" : ""}>
                24 ore
              </Button>
              <Button onClick={() => setRange("7d")} variant="tab" className={range === "7d" ? "is-active" : ""}>
                7 zile
              </Button>
            </div>

            {selectedLand && (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${online ? "bg-green-500/10 text-green-500" : "bg-muted/50 text-muted-foreground"}`}>
                  {online ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {online ? "Live" : "Offline"}
                </div>
                {selectedLand.sensorId && (
                  <Badge variant="outline">
                    <Cpu size={12} className="mr-1" />
                    {selectedLand.sensorId}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {busy ? (
        <div className="card p-6 muted">Se încarcă…</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
          {/* Chart Area */}
          <div className="space-y-4">
            <ReadingsChart data={series} />

            {!selectedLand && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5"
              >
                <div className="text-sm font-bold">Cum folosești pagina</div>
                <div className="muted text-sm mt-2">
                  Pentru a vedea citirile unui teren: deschide detaliile terenului → Istoricul senzorilor.
                </div>
              </Motion.div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            {stats && (
              <div className={`grid gap-3 ${stats.hasSoil ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-soft p-4 agri-pattern relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="muted text-xs">Temperatură</div>
                      <Thermometer size={16} className="text-orange-500" />
                    </div>
                    <div className="text-2xl font-extrabold mt-1">{stats.tNow.toFixed(1)}°C</div>
                    <div className="mt-2 progress h-1.5">
                      <div className="progress-bar bg-orange-500" style={{ width: `${Math.round(tempNorm * 100)}%` }} />
                    </div>
                  </div>
                </Motion.div>

                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="card-soft p-4 agri-pattern relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="muted text-xs">Umiditate Aer</div>
                      <Droplets size={16} className="text-blue-500" />
                    </div>
                    <div className="text-2xl font-extrabold mt-1">{stats.hNow.toFixed(0)}%</div>
                    <div className="mt-2 progress h-1.5">
                      <div className="progress-bar bg-blue-500" style={{ width: `${Math.round(humNorm * 100)}%` }} />
                    </div>
                  </div>
                </Motion.div>

                {stats.hasSoil && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card-soft p-4 agri-pattern relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <div className="muted text-xs">Umiditate Sol</div>
                        <Sprout size={16} className="text-emerald-500" />
                      </div>
                      <div className="text-2xl font-extrabold mt-1">{stats.sNow.toFixed(0)}%</div>
                      <div className="mt-2 progress h-1.5">
                        <div className="progress-bar bg-emerald-500" style={{ width: `${Math.round(soilNorm * 100)}%` }} />
                      </div>
                    </div>
                  </Motion.div>
                )}
              </div>
            )}

            {/* Detailed Stats */}
            <div className="card p-5">
              <div className="text-sm font-bold mb-3">Statistici ({range === "24h" ? "24 ore" : "7 zile"})</div>
              {!stats ? (
                <div className="muted">Nu există date.</div>
              ) : (
                <div className="space-y-4">
                  {/* Temperature Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Thermometer size={14} className="text-orange-500" />
                      Temperatură
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Min</div>
                        <div className="font-bold text-sm">{stats.tMin.toFixed(1)}°C</div>
                      </div>
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Medie</div>
                        <div className="font-bold text-sm">{stats.tAvg.toFixed(1)}°C</div>
                      </div>
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Max</div>
                        <div className="font-bold text-sm">{stats.tMax.toFixed(1)}°C</div>
                      </div>
                    </div>
                  </div>

                  {/* Humidity Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Droplets size={14} className="text-blue-500" />
                      Umiditate Aer
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Min</div>
                        <div className="font-bold text-sm">{stats.hMin.toFixed(0)}%</div>
                      </div>
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Medie</div>
                        <div className="font-bold text-sm">{stats.hAvg.toFixed(0)}%</div>
                      </div>
                      <div className="card-soft p-2">
                        <div className="text-xs muted">Max</div>
                        <div className="font-bold text-sm">{stats.hMax.toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Soil Moisture Stats */}
                  {stats.hasSoil && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <Sprout size={14} className="text-emerald-500" />
                        Umiditate Sol
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="card-soft p-2">
                          <div className="text-xs muted">Min</div>
                          <div className="font-bold text-sm">{stats.sMin.toFixed(0)}%</div>
                        </div>
                        <div className="card-soft p-2">
                          <div className="text-xs muted">Medie</div>
                          <div className="font-bold text-sm">{stats.sAvg.toFixed(0)}%</div>
                        </div>
                        <div className="card-soft p-2">
                          <div className="text-xs muted">Max</div>
                          <div className="font-bold text-sm">{stats.sMax.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Card */}
            {selectedLand && (
              <div className="card p-5">
                <div className="text-sm font-bold mb-3">Status Senzor</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Conexiune</span>
                    <StatusBadge status={online ? "online" : "offline"} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Ultima citire</span>
                    <span className="text-sm font-medium">{lastLabel || "—"}</span>
                  </div>
                  {selectedLand.cropType && (
                    <div className="flex items-center justify-between">
                      <span className="muted text-sm">Cultură</span>
                      <Badge>{selectedLand.cropType}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="muted text-sm">Date în grafic</span>
                    <Badge variant="outline">{series.length} citiri</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Export Options */}
            {landId && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5"
              >
                <div className="text-sm font-bold mb-3">Export Date</div>
                <div className="space-y-2">
                  <Button
                    onClick={exportCsv}
                    variant="ghost"
                    className="w-full justify-start"
                    disabled={exporting}
                  >
                    <Download size={14} className="mr-2" />
                    {exporting ? "Se exportă..." : `Descarcă CSV (${range})`}
                  </Button>
                  <div className="text-xs muted">
                    Exportă toate citirile din perioada selectată în format CSV pentru analiză în Excel.
                  </div>
                </div>
              </Motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
