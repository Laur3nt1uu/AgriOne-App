import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import ReadingsChart from "../../components/charts/ReadingsChart";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Clock, Cpu, Droplets, Thermometer } from "lucide-react";

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
  for (let i = hours - 1; i >= 0; i--) {
    t += (Math.random() - 0.5) * 0.9;
    h += (Math.random() - 0.5) * 1.8;
    points.push({
      ts: new Date(now - i * 60 * 60 * 1000).toISOString(),
      temperature: Number(t.toFixed(1)),
      humidity: Math.max(0, Math.min(100, Math.round(h))),
    });
  }
  return points;
}

function normalizeReadings(rows) {
  return rows.map((r) => ({
    ts: r.recordedAt || r.ts || r.createdAt || r.timestamp || new Date().toISOString(),
    temperature: Number(r.temperatureC ?? r.temperature ?? r.temp ?? 0),
    humidity: Number(r.humidityPct ?? r.humidity ?? r.hum ?? 0),
  }));
}

export default function SensorsPage() {
  const [params] = useSearchParams();
  const landId = params.get("landId");

  const [lands, setLands] = useState([]);
  const [busy, setBusy] = useState(true);

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

  const selectedLand = useMemo(
    () => lands.find((x) => String(x.id) === String(landId)),
    [lands, landId]
  );

  const online = isOnline(selectedLand?.lastSensorAt);

  const stats = useMemo(() => {
    if (!series?.length) return null;
    const temps = series.map(x => x.temperature);
    const hums = series.map(x => x.humidity);
    const avg = (arr) => arr.reduce((a,b)=>a+b,0) / arr.length;

    return {
      tNow: temps[temps.length-1],
      hNow: hums[hums.length-1],
      lastTs: series[series.length-1]?.ts,
      tAvg: avg(temps),
      hAvg: avg(hums),
      tMax: Math.max(...temps),
      tMin: Math.min(...temps),
      hMax: Math.max(...hums),
      hMin: Math.min(...hums),
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

  const lastLabel = useMemo(() => {
    const ts = stats?.lastTs;
    if (!ts) return null;
    const t = new Date(ts);
    if (Number.isNaN(t.getTime())) return null;
    return t.toLocaleString("ro-RO", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }, [stats]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Senzori</div>
          <div className="muted text-sm">
            {selectedLand ? `Teren: ${selectedLand.name}` : "Deschide din detaliile terenului → Istoric"}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setRange("24h")} variant="tab" className={range === "24h" ? "is-active" : ""}>
            24h
          </Button>
          <Button onClick={() => setRange("7d")} variant="tab" className={range === "7d" ? "is-active" : ""}>
            7 days
          </Button>
        </div>
      </div>

      {busy ? (
        <div className="card p-6 muted">Se încarcă…</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
          <div className="space-y-4">
            <ReadingsChart data={series} />

            {!selectedLand ? (
              <div className="card p-5">
                <div className="text-sm font-bold">Cum folosești pagina</div>
                <div className="muted text-sm mt-2">
                  Pentru un teren anume, deschide din detaliile terenului: Istoric → Senzori.
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="text-sm font-bold">Status</div>
              {selectedLand ? (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge>
                      <span className={`dot ${online ? "dot-online" : "dot-offline"}`} />
                      {online ? "Online" : "Offline"}
                    </Badge>
                    <Badge>Senzor: {selectedLand.sensorId || "Neasociat"}</Badge>
                    {selectedLand.cropType ? (
                      <Badge>Cultură: {selectedLand.cropType}</Badge>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="card-soft p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="muted text-xs">Interval</div>
                        <Cpu size={16} className="text-slate-700" />
                      </div>
                      <div className="text-sm font-extrabold mt-2">{range}</div>
                      <div className="muted text-xs mt-1">Grafic + statistici</div>
                    </div>
                    <div className="card-soft p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="muted text-xs">Ultima citire</div>
                        <Clock size={16} className="text-slate-700" />
                      </div>
                      <div className="text-sm font-extrabold mt-2">{lastLabel || "—"}</div>
                      <div className="muted text-xs mt-1">Timp local</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="muted mt-2">Selectează un teren pentru status real.</div>
              )}
            </div>

            <div className="card p-5">
              <div className="text-sm font-bold">Statistici ({range})</div>
              {!stats ? (
                <div className="muted mt-2">Nu există date.</div>
              ) : (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="card-soft p-4 agri-pattern">
                    <div className="flex items-center justify-between gap-3">
                      <div className="muted text-xs">Temperatură</div>
                      <span className="icon-chip w-10 h-10 rounded-2xl">
                        <Thermometer size={18} className="text-slate-700" />
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold mt-2">{stats.tNow.toFixed(1)}°C</div>
                    <div className="mt-3 progress">
                      <div className="progress-bar" style={{ width: `${Math.round(tempNorm * 100)}%` }} />
                    </div>
                    <div className="muted text-xs mt-2">medie {stats.tAvg.toFixed(1)} • min {stats.tMin.toFixed(1)} • max {stats.tMax.toFixed(1)}</div>
                  </div>

                  <div className="card-soft p-4 agri-pattern">
                    <div className="flex items-center justify-between gap-3">
                      <div className="muted text-xs">Umiditate</div>
                      <span className="icon-chip w-10 h-10 rounded-2xl">
                        <Droplets size={18} className="text-slate-700" />
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold mt-2">{stats.hNow.toFixed(0)}%</div>
                    <div className="mt-3 progress">
                      <div className="progress-bar" style={{ width: `${Math.round(humNorm * 100)}%` }} />
                    </div>
                    <div className="muted text-xs mt-2">medie {stats.hAvg.toFixed(0)} • min {stats.hMin.toFixed(0)} • max {stats.hMax.toFixed(0)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}