import { useEffect, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Activity, BarChart3, Cpu, Leaf, Thermometer, TrendingUp } from "lucide-react";

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function scoreColor(score){
  // doar returnăm clase (no hard colors in charts, dar aici e ok)
  if (score >= 80) return "border-primary/25";
  if (score >= 55) return "border-warn/35";
  return "border-destructive/35";
}

function scoreVariant(score){
  if (score >= 80) return "";
  if (score >= 55) return "warn";
  return "bad";
}

export default function AnalyticsPage() {
  const [busy, setBusy] = useState(true);
  const [overview, setOverview] = useState(null);
  const [health, setHealth] = useState([]);

  async function load() {
    setBusy(true);
    try {
      const o = await api.analytics.overview().catch(() => null);
      const h = null;

      // fallback demo dacă backend încă nu returnează
      const normalized = o
        ? {
            totalLands: pick(o, ["totalLands", "landsCount"], 0),
            activeSensors: pick(o, ["activeSensors", "sensorsCount"], 0),
            avgTemp: pick(o, ["avgTemp", "avgTemperature24h"], 0),
            totalProfit: pick(o, ["totalProfit", "profitTotal"], 0),
          }
        : null;
      setOverview(normalized || { totalLands: 1, activeSensors: 0, avgTemp: 22.4, totalProfit: 0 });
      setHealth(Array.isArray(h) ? h : (h?.items || [
        { landId: 1, landName: "Parcela A", score: 76, label: "Bun", reasons: ["Temperatură stabilă", "Umiditate ok"] },
      ]));
    } catch (e) {
      toastError(e, "Nu pot încărca analytics.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Analize</div>
          <div className="muted text-sm">Scor sănătate • recomandări • overview</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={load} variant="ghost">Actualizează</Button>
          <span className="icon-chip hidden sm:inline-flex" title="Analize">
            <BarChart3 size={20} className="text-muted-foreground" />
          </span>
        </div>
      </div>
      {busy ? (
        <div className="card p-6 muted">Se încarcă…</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
          <div className="card p-5">
            <div className="text-sm font-bold">Sănătatea terenurilor</div>
            <div className="muted text-sm mt-1">
              Scor = indicator demo (excelent pentru licență). Ulterior poate deveni bazat pe reguli/ML.
            </div>

            <div className="mt-4 space-y-3">
              {health.map((h) => {
                const score = clamp(Number(h.score || 0), 0, 100);
                return (
                  <div key={h.landId} className={`card-soft p-4 border ${scoreColor(score)} agri-pattern card-hover`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate">{h.landName}</div>
                        <div className="muted text-sm">{h.label || "—"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Scor: {score}</Badge>
                        <span className="icon-chip hidden sm:inline-flex" title="Health score">
                          <Activity size={18} className="text-muted-foreground" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="progress">
                        <div
                          className={`progress-bar ${scoreVariant(score)}`}
                          style={{
                            width: `${score}%`,
                          }}
                        />
                      </div>
                    </div>

                    {h.reasons?.length ? (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {h.reasons.slice(0, 4).map((r, idx) => (
                          <Badge key={idx}>{r}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <div className="text-sm font-bold">Overview</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Total terenuri</div>
                    <span className="icon-chip w-10 h-10 rounded-2xl"><Leaf size={18} className="text-muted-foreground" /></span>
                  </div>
                  <div className="text-2xl font-extrabold mt-2">{overview.totalLands}</div>
                </div>
                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Senzori activi</div>
                    <span className="icon-chip w-10 h-10 rounded-2xl"><Cpu size={18} className="text-muted-foreground" /></span>
                  </div>
                  <div className="text-2xl font-extrabold mt-2">{overview.activeSensors}</div>
                </div>
                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Temp. medie</div>
                    <span className="icon-chip w-10 h-10 rounded-2xl"><Thermometer size={18} className="text-muted-foreground" /></span>
                  </div>
                  <div className="text-2xl font-extrabold mt-2">{Number(overview.avgTemp || 0).toFixed(1)}°C</div>
                </div>
                <div className="card-soft p-4 agri-pattern">
                  <div className="flex items-center justify-between gap-3">
                    <div className="muted text-xs">Profit total</div>
                    <span className="icon-chip w-10 h-10 rounded-2xl"><TrendingUp size={18} className="text-muted-foreground" /></span>
                  </div>
                  <div className="text-2xl font-extrabold mt-2">{Number(overview.totalProfit || 0).toFixed(0)} RON</div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="text-sm font-bold">Recomandări</div>
              <div className="muted text-sm mt-2">
                • Dacă umiditatea scade sub prag → recomandă irigare
                <br />• Dacă temperatura crește rapid → recomandă umbrire / udare
                <br />• Dacă senzorul e offline → verifică alimentarea / semnalul
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}