import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

function isOnline(lastAt) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 15 * 60 * 1000; // 15 min
}

function fmtHa(x) {
  const n = Number(x || 0);
  return `${n.toFixed(2)} ha`;
}

export default function LandsPage() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);

  const [recByLand, setRecByLand] = useState({});

  const pMap = useCallback(async (list, mapper, concurrency = 4) => {
    const results = [];
    let idx = 0;
    const workers = Array.from({ length: Math.min(concurrency, list.length) }, async () => {
      while (idx < list.length) {
        const i = idx++;
        results[i] = await mapper(list[i], i);
      }
    });
    await Promise.all(workers);
    return results;
  }, []);

  const loadRecs = useCallback(async (lands) => {
    const withIds = (lands || [])
      .filter((x) => x?.id != null)
      .filter((x) => (x?.centroidLat != null && x?.centroidLng != null) || (x?.centroid?.lat != null && x?.centroid?.lng != null));
    if (!withIds.length) {
      setRecByLand({});
      return;
    }

    setRecByLand(() => {
      const init = {};
      for (const it of withIds) init[it.id] = { busy: true, data: null, error: null };
      return init;
    });

    await pMap(
      withIds,
      async (it) => {
        try {
          const data = await api.recommendations.byLand(it.id);
          setRecByLand((prev) => ({
            ...prev,
            [it.id]: { busy: false, data, error: null },
          }));
        } catch (e) {
          setRecByLand((prev) => ({
            ...prev,
            [it.id]: { busy: false, data: null, error: e },
          }));
        }
      },
      4
    );
  }, [pMap]);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await api.lands.list();
      // acceptă array direct sau {items:[]}
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setItems(arr);
      loadRecs(arr);
    } catch (e) {
      toastError(e, "Nu pot încărca terenurile.");
    } finally {
      setBusy(false);
    }
  }, [loadRecs]);

  useEffect(() => { load(); }, [load]);

  const count = useMemo(() => items.length, [items]);
  const onlineCount = useMemo(
    () => items.filter((x) => isOnline(x.lastSensorAt)).length,
    [items]
  );
  const offlineCount = useMemo(() => Math.max(0, count - onlineCount), [count, onlineCount]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <div className="page-title">Terenurile mele</div>
          <div className="muted text-sm">Parcele • senzori • monitorizare</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={load} variant="ghost">Actualizează</Button>
          <Button onClick={() => nav("/lands/new")} variant="primary">
            + Adaugă teren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="space-y-4">
          {busy ? (
            <div className="card p-6 muted">Se încarcă…</div>
          ) : items.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-xl font-extrabold">Nu ai încă terenuri</div>
              <div className="muted mt-2">Creează primul teren și desenează limita pe hartă.</div>
              <Button onClick={() => nav("/lands/new")} variant="primary" className="mt-5">
                Creează primul teren
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map((it) => {
                const online = isOnline(it.lastSensorAt);
                const rec = recByLand[it.id];
                const weather = rec?.data?.inputs?.weather;
                const actionList = Array.isArray(rec?.data?.actions) ? rec.data.actions : [];
                const top = actionList
                  .filter((a) => a && a.title)
                  .filter((a) => a.type !== "SETUP" && a.type !== "CONFIG")
                  .slice(0, 2);
                const tempC = weather?.current?.tempC;
                const rainMm = weather?.forecast?.nextHoursRainMm;

                const hasCoords =
                  (it.centroidLat != null && it.centroidLng != null) ||
                  (it.centroid?.lat != null && it.centroid?.lng != null);

                return (
                  <button
                    key={it.id}
                    onClick={() => nav(`/lands/${it.id}`)}
                    className="text-left card p-5 card-hover"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-extrabold truncate">{it.name}</div>
                        <div className="muted text-sm mt-1">
                          {it.cropType || "—"} • {fmtHa(it.areaHa)}
                        </div>
                      </div>

                      <Badge>
                        <span className={`dot ${online ? "dot-online" : "dot-offline"}`} />
                        {online ? "Online" : "Offline"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Badge>Cultură: {it.cropType || "-"}</Badge>
                      <Badge>Suprafață: {fmtHa(it.areaHa)}</Badge>
                      <Badge>
                        Senzor: {it.sensorId ? it.sensorId : "Neasociat"}
                      </Badge>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {!hasCoords ? (
                        <Badge>Vreme: fără coordonate</Badge>
                      ) : rec?.busy ? (
                        <Badge>Recomandări: se încarcă…</Badge>
                      ) : rec?.error ? (
                        <Badge>Recomandări: indisponibile</Badge>
                      ) : (
                        <>
                          <Badge>
                            Vreme azi: {tempC != null ? `${tempC}°C` : "—"}
                            {rainMm != null ? ` • ploaie ~${rainMm}mm` : ""}
                          </Badge>

                          {top.length ? (
                            top.map((a, idx) => (
                              <Badge key={`${a.type || "A"}-${idx}`}>
                                P{a.priority ?? "-"}: {a.title}
                              </Badge>
                            ))
                          ) : (
                            <Badge>Recomandări: nimic critic</Badge>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-4 muted text-xs">
                      Apasă pentru detalii → hartă, limită, senzor și istoric
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-sm font-bold">Statistici</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="card-soft p-4">
                <div className="muted text-xs">Total</div>
                <div className="text-2xl font-extrabold mt-1">{count}</div>
              </div>
              <div className="card-soft p-4">
                <div className="muted text-xs">Online</div>
                <div className="text-2xl font-extrabold mt-1">{onlineCount}</div>
              </div>
              <div className="card-soft p-4">
                <div className="muted text-xs">Offline</div>
                <div className="text-2xl font-extrabold mt-1">{offlineCount}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Badge>
                <span className="dot dot-online" /> Total: {count}
              </Badge>
              <Badge>
                <span className="dot dot-online" /> Online: {onlineCount}
              </Badge>
              <Badge>
                <span className="dot dot-offline" /> Offline: {offlineCount}
              </Badge>
            </div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-bold">Hint</div>
            <div className="muted text-sm mt-2">
              Deschide un teren pentru hartă, limită, senzor și istoric. Recomandările se bazează pe vreme + context.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}