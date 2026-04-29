import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { api } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { StatusBadge } from "../../components/agri/StatusBadge";
import { LandsSkeleton } from "../../ui/skeleton";
import { Cloud, CloudRain, CloudSun, Cpu, Leaf, Ruler, Sun, Crown } from "lucide-react";
import { authStore } from "../../auth/auth.store";

const PLAN_LIMITS = { STARTER: 2, PRO: Infinity, ENTERPRISE: Infinity };

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
  if (kind === "rain") return { Icon: CloudRain, label: "Ploaie" };
  if (kind === "cloud") return { Icon: Cloud, label: "Înnorat" };
  if (kind === "partly") return { Icon: CloudSun, label: "Nori" };
  return { Icon: Sun, label: "Senin" };
}

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

  const user = authStore.getUser();
  const _userRole = user?.role || user?.app_metadata?.role || user?.['https://agri.one/role'];
  const isAdmin = user?.role === "ADMIN";

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

  // Show full skeleton on initial load
  if (busy && items.length === 0) {
    return <LandsSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-4 sm:p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">{isAdmin ? "Toate terenurile" : "Terenurile mele"}</div>
          <div className="muted text-sm">{isAdmin ? "Administrare globală" : "Monitorizare personală"} • parcele • senzori</div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {!isAdmin && (() => {
            const plan = authStore.getPlan();
            const max = PLAN_LIMITS[plan] ?? PLAN_LIMITS.STARTER;
            if (max === Infinity) return null;
            return (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                <Crown size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">{count}/{max} terenuri</span>
              </div>
            );
          })()}
          <Button onClick={load} variant="ghost">Actualizează</Button>
          <Button onClick={() => nav("/app/lands/new")} variant="primary">
            + Adaugă teren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 lg:gap-6">
        <div className="space-y-4">
          {busy ? (
            <div className="card p-6 muted">Se încarcă…</div>
          ) : items.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-xl font-extrabold">{isAdmin ? "Nu există terenuri" : "Nu ai încă terenuri"}</div>
              <div className="muted mt-2">
                {isAdmin
                  ? "Încă nu sunt terenuri în sistem. Când utilizatorii adaugă parcele, vor apărea aici."
                  : "Creează primul teren și desenează limita pe hartă."}
              </div>
              <Button onClick={() => nav("/app/lands/new")} variant="primary" className="mt-5">
                {isAdmin ? "Adaugă teren" : "Creează primul teren"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
              {items.map((it, index) => {
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

                const wx = weatherVisual(weather);
                const WxIcon = wx.Icon;

                const hasCoords =
                  (it.centroidLat != null && it.centroidLng != null) ||
                  (it.centroid?.lat != null && it.centroid?.lng != null);

                const ownerLabel = isAdmin
                  ? it?.owner?.name || it?.owner?.username || (it?.owner?.email ? String(it.owner.email).split("@")[0] : "") || it?.owner?.email || ""
                  : "";

                return (
                  <Motion.div
                    key={it.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                  <button
                    onClick={() => nav(`/app/lands/${it.id}`)}
                    className="text-left card p-4 sm:p-5 card-hover agri-pattern relative overflow-hidden group w-full"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-extrabold truncate">{it.name}</div>
                        <div className="muted text-sm mt-1">
                          {it.cropType || "—"} • {fmtHa(it.areaHa)}
                          {isAdmin && ownerLabel ? ` • ${ownerLabel}` : ""}
                        </div>
                      </div>

                      <StatusBadge status={online ? "online" : "offline"} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="card-soft p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="muted text-xs">Cultură</div>
                          <Leaf size={16} className="text-muted-foreground" />
                        </div>
                        <div className="text-sm font-extrabold mt-2 truncate">{it.cropType || "—"}</div>
                      </div>

                      <div className="card-soft p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="muted text-xs">Suprafață</div>
                          <Ruler size={16} className="text-muted-foreground" />
                        </div>
                        <div className="text-sm font-extrabold mt-2">{fmtHa(it.areaHa)}</div>
                      </div>

                      <div className="card-soft p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="muted text-xs">Senzor</div>
                          <Cpu size={16} className="text-muted-foreground" />
                        </div>
                        <div className="text-sm font-extrabold mt-2 truncate">{it.sensorId ? it.sensorId : "Neasociat"}</div>
                      </div>

                      <div className="card-soft p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="muted text-xs">Vreme</div>
                          <WxIcon size={16} className="text-muted-foreground" />
                        </div>
                        {!hasCoords ? (
                          <div className="text-sm font-extrabold mt-2">Fără coordonate</div>
                        ) : rec?.busy ? (
                          <div className="text-sm font-extrabold mt-2">Se încarcă…</div>
                        ) : rec?.error ? (
                          <div className="text-sm font-extrabold mt-2">Indisponibil</div>
                        ) : (
                          <>
                            <div className="text-sm font-extrabold mt-2">
                              {tempC != null ? `${tempC}°C` : "—"}
                            </div>
                            <div className="muted text-xs mt-1">
                              {rainMm != null ? `Ploaie ~${rainMm}mm` : wx.label}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {rec?.busy ? (
                        <Badge>Recomandări: se încarcă…</Badge>
                      ) : rec?.error ? (
                        <Badge>Recomandări: indisponibile</Badge>
                      ) : top.length ? (
                        top.map((a, idx) => (
                          <Badge key={`${a.type || "A"}-${idx}`}>
                            P{a.priority ?? "-"}: {a.title}
                          </Badge>
                        ))
                      ) : (
                        <Badge>Recomandări: nimic critic</Badge>
                      )}
                    </div>

                    <div className="mt-4 muted text-xs">
                      Apasă pentru detalii → hartă, limită, senzor și istoric
                    </div>
                  </button>
                  </Motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-4 sm:p-5">
            <div className="text-sm font-bold">Statistici</div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="card-soft p-3 sm:p-4">
                <div className="muted text-xs">Total</div>
                <div className="text-xl sm:text-2xl font-extrabold mt-1">{count}</div>
              </div>
              <div className="card-soft p-3 sm:p-4">
                <div className="muted text-xs">Online</div>
                <div className="text-xl sm:text-2xl font-extrabold mt-1">{onlineCount}</div>
              </div>
              <div className="card-soft p-3 sm:p-4">
                <div className="muted text-xs">Offline</div>
                <div className="text-xl sm:text-2xl font-extrabold mt-1">{offlineCount}</div>
              </div>
            </div>

            {!isAdmin && (() => {
              const plan = authStore.getPlan();
              const max = PLAN_LIMITS[plan] ?? PLAN_LIMITS.STARTER;
              return (
                <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={14} className="text-primary" />
                    <span className="text-xs font-semibold text-foreground">Plan {plan}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Terenuri: {count}/{max === Infinity ? "∞" : max}
                    {max !== Infinity && count >= max && (
                      <span className="text-amber-500 ml-2 font-semibold">• Limită atinsă</span>
                    )}
                  </div>
                </div>
              );
            })()}

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
              {isAdmin
                ? "Deschide un teren pentru detalii (hartă, senzor, istoric). Ca ADMIN vezi și owner-ul fiecărui teren."
                : "Deschide un teren pentru hartă, limită, senzor și istoric. Recomandările se bazează pe vreme + context."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}