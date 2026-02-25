import { useEffect, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function scoreColor(score){
  // doar returnăm clase (no hard colors in charts, dar aici e ok)
  if (score >= 80) return "border-[hsl(var(--primary)/0.25)]";
  if (score >= 55) return "border-[hsl(var(--warn)/0.35)]";
  return "border-[hsl(var(--danger)/0.35)]";
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
      <div className="card p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <div className="page-title">Analize</div>
          <div className="muted text-sm">Scor sănătate • recomandări • overview</div>
        </div>
        <Button onClick={load} variant="ghost">Actualizează</Button>
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
                  <div key={h.landId} className={`card-soft p-4 border ${scoreColor(score)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate">{h.landName}</div>
                        <div className="muted text-sm">{h.label || "—"}</div>
                      </div>
                      <Badge>Scor: {score}</Badge>
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
                <div className="card-soft p-4">
                  <div className="muted text-xs">Total terenuri</div>
                  <div className="text-2xl font-extrabold mt-1">{overview.totalLands}</div>
                </div>
                <div className="card-soft p-4">
                  <div className="muted text-xs">Senzori activi</div>
                  <div className="text-2xl font-extrabold mt-1">{overview.activeSensors}</div>
                </div>
                <div className="card-soft p-4">
                  <div className="muted text-xs">Temp. medie</div>
                  <div className="text-2xl font-extrabold mt-1">{Number(overview.avgTemp || 0).toFixed(1)}°C</div>
                </div>
                <div className="card-soft p-4">
                  <div className="muted text-xs">Profit total</div>
                  <div className="text-2xl font-extrabold mt-1">{Number(overview.totalProfit || 0).toFixed(0)} RON</div>
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