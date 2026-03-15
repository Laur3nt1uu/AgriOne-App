import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { EconomicsSkeleton } from "../../ui/skeleton";
import { ArrowDownRight, ArrowUpRight, Calendar, ChartLine, ReceiptText, Target, TrendingDown, TrendingUp, Wallet, X } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useConfirm } from "../../components/confirm/ConfirmProvider";

function money(x) {
  const n = Number(x || 0);
  return n.toLocaleString("ro-RO", { style: "currency", currency: "RON" });
}

export default function EconomicsPage() {
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  const confirm = useConfirm();

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0, count: 0 });
  const [busy, setBusy] = useState(true);

  // export pdf state
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportPreset, setExportPreset] = useState("ALL");
  const [exportYear, setExportYear] = useState(String(new Date().getFullYear()));
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [occurredDate, setOccurredDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

  const [activePeriodLabel, setActivePeriodLabel] = useState("Toate");
  const [activePeriodParams, setActivePeriodParams] = useState(undefined);

  async function load(paramsOverride = activePeriodParams) {
    setBusy(true);
    try {
      const params = paramsOverride;

      const s = await api.economics.summary(params).catch(() => null);
      if (s) {
        setSummary({
          revenue: Number(s.revenue || 0),
          expenses: Number((s.expenses ?? s.expense) || 0),
          profit: Number(s.profit || 0),
          count: Number(s.count || 0),
        });
      }

      const data = await api.economics.list({ ...(params || {}), limit: 500 });
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setItems(arr);
    } catch (e) {
      toastError(e, "Nu pot încărca economia.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ymd(d) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function computeExportParams() {
    const now = new Date();
    if (exportPreset === "ALL") return undefined;

    if (exportPreset === "YESTERDAY") {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      const s = ymd(d);
      return { from: s, to: s };
    }

    if (exportPreset === "LAST_7_DAYS") {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      return { from: ymd(from), to: ymd(now) };
    }

    if (exportPreset === "YEAR") {
      const y = Number(exportYear);
      if (!Number.isFinite(y) || y < 1970 || y > 2100) return null;
      return { from: `${y}-01-01`, to: `${y}-12-31` };
    }

    if (exportPreset === "CUSTOM") {
      if (!exportFrom || !exportTo) return null;
      if (exportFrom > exportTo) return null;
      return { from: exportFrom, to: exportTo };
    }

    return undefined;
  }

  function computePeriodLabel(params) {
    if (!params?.from && !params?.to) return "Toate";
    if (exportPreset === "YESTERDAY" && params?.from && params?.to && params.from === params.to) return "Ieri";
    if (exportPreset === "LAST_7_DAYS") return "Ultimele 7 zile";
    if (exportPreset === "YEAR") return `An ${exportYear}`;
    if (exportPreset === "CUSTOM" && params?.from && params?.to) return `${params.from} → ${params.to}`;
    if (params?.from && params?.to) return `${params.from} → ${params.to}`;
    if (params?.from) return `De la ${params.from}`;
    if (params?.to) return `Până la ${params.to}`;
    return "Toate";
  }

  async function applyPeriod() {
    if (exporting) return;
    const params = computeExportParams();
    if (params === null) {
      toastError(null, "Perioadă invalidă. Verifică datele.");
      return;
    }

    setActivePeriodParams(params);
    setActivePeriodLabel(computePeriodLabel(params));
    setExportOpen(false);
    await load(params);
  }

  async function exportPdf() {
    if (exporting) return;
    const params = computeExportParams();
    if (params === null) {
      toastError(null, "Perioadă invalidă. Verifică datele.");
      return;
    }

    setActivePeriodParams(params);
    setActivePeriodLabel(computePeriodLabel(params));

    setExporting(true);
    try {
      const blob = await api.exports.economicsReport(params);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

      const a = document.createElement("a");
      a.href = url;
      const suffix = params?.from && params?.to ? `_${params.from}_to_${params.to}` : "";
      a.download = `AgriOne_Economie${suffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setExportOpen(false);
      toastSuccess("Raportul a fost descărcat.");

      await load(params);
    } catch (e) {
      toastError(e, "Nu pot exporta raportul.");
    } finally {
      setExporting(false);
    }
  }

  const calc = useMemo(() => {
    const revenue = items.filter(x => x.type === "REVENUE").reduce((a,b)=>a+Number(b.amount||0),0);
    const expenses = items.filter(x => x.type === "EXPENSE").reduce((a,b)=>a+Number(b.amount||0),0);
    return { revenue, expenses, profit: revenue - expenses };
  }, [items]);

  // Budget Forecasting
  const forecast = useMemo(() => {
    if (items.length < 3) return null;

    // Group by month
    const byMonth = {};
    items.forEach(t => {
      const d = new Date(t.occurredAt || t.createdAt || t.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) byMonth[key] = { revenue: 0, expenses: 0 };
      if (t.type === "REVENUE") byMonth[key].revenue += Number(t.amount || 0);
      else byMonth[key].expenses += Number(t.amount || 0);
    });

    const months = Object.keys(byMonth).sort().slice(-6); // Last 6 months
    if (months.length < 2) return null;

    const avgRevenue = months.reduce((a, m) => a + byMonth[m].revenue, 0) / months.length;
    const avgExpenses = months.reduce((a, m) => a + byMonth[m].expenses, 0) / months.length;
    const avgProfit = avgRevenue - avgExpenses;

    // Trend calculation
    const revenueValues = months.map(m => byMonth[m].revenue);
    const expenseValues = months.map(m => byMonth[m].expenses);

    const revenueTrend = revenueValues.length > 1
      ? ((revenueValues[revenueValues.length - 1] - revenueValues[0]) / (revenueValues[0] || 1)) * 100
      : 0;
    const expenseTrend = expenseValues.length > 1
      ? ((expenseValues[expenseValues.length - 1] - expenseValues[0]) / (expenseValues[0] || 1)) * 100
      : 0;

    return {
      avgRevenue,
      avgExpenses,
      avgProfit,
      revenueTrend,
      expenseTrend,
      monthsAnalyzed: months.length,
      nextMonthEstimate: {
        revenue: avgRevenue * (1 + revenueTrend / 100 / 6),
        expenses: avgExpenses * (1 + expenseTrend / 100 / 6),
      },
    };
  }, [items]);

  async function onAdd() {
    const a = Number(amount);
    if (!desc.trim()) { toast.error("Completează descrierea."); return; }
    if (!a || a <= 0) { toast.error("Introdu o sumă validă."); return; }

    try {
      const iso = new Date(`${occurredDate}T12:00:00`).toISOString();
      await api.economics.create({
        type,
        amount: a,
        description: desc.trim(),
        category: "General",
        occurredAt: iso,
      });
      setAmount("");
      setDesc("");
      toastSuccess("Tranzacția a fost adăugată.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot crea tranzacția.");
    }
  }

  async function onDelete(id) {
    const ok = await confirm({
      title: "Ștergere tranzacție",
      message: isAdmin ? "Ștergi această tranzacție? (ADMIN)" : "Ștergi această tranzacție?",
      confirmText: "Șterge",
      cancelText: "Renunță",
      destructive: true,
    });
    if (!ok) return;
    try {
      await api.economics.remove(id);
      toastSuccess("Tranzacția a fost ștearsă.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot șterge tranzacția.");
    }
  }

  const s = summary?.profit !== undefined ? summary : calc;

  if (busy && items.length === 0) {
    return <EconomicsSkeleton />;
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="card p-4 sm:p-6 agri-pattern">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="page-title">Economie</div>
            <div className="muted text-sm truncate">
              {isAdmin ? "Tranzacții globale" : "Tranzacțiile tale"} • {activePeriodLabel}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={() => load()} variant="ghost" size="sm">Actualizează</Button>
            <Button onClick={() => setExportOpen(true)} variant="ghost" size="sm" disabled={exporting}>
              {exporting ? "Export..." : "Exportă"}
            </Button>
            <span className="icon-chip hidden sm:inline-flex" title="Economie">
              <Wallet size={20} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-3 sm:p-4 text-center"
        >
          <TrendingUp size={16} className="mx-auto text-green-500 mb-1" />
          <div className="text-lg sm:text-xl font-extrabold text-green-500">{money(s.revenue)}</div>
          <div className="muted text-xs">Venituri</div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-soft p-3 sm:p-4 text-center"
        >
          <TrendingDown size={16} className="mx-auto text-red-500 mb-1" />
          <div className="text-lg sm:text-xl font-extrabold text-red-500">{money(s.expenses)}</div>
          <div className="muted text-xs">Cheltuieli</div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft p-3 sm:p-4 text-center"
        >
          <ReceiptText size={16} className="mx-auto text-primary mb-1" />
          <div className={`text-lg sm:text-xl font-extrabold ${s.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
            {money(s.profit)}
          </div>
          <div className="muted text-xs">Profit</div>
        </Motion.div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
      {exportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !exporting) setExportOpen(false);
          }}
        >
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Export raport</div>
                <div className="muted text-sm mt-1">Alege perioada pentru raport.</div>
              </div>
              <Button variant="ghost" onClick={() => setExportOpen(false)} disabled={exporting}>
                <X size={18} />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "ALL", label: "Toate" },
                  { key: "YESTERDAY", label: "Ieri" },
                  { key: "LAST_7_DAYS", label: "7 zile" },
                  { key: "YEAR", label: "Un an" },
                ].map(({ key, label }) => (
                  <Button key={key} variant="tab" className={exportPreset === key ? "is-active" : ""} onClick={() => setExportPreset(key)}>
                    {label}
                  </Button>
                ))}
                <Button variant="tab" className={`col-span-2 ${exportPreset === "CUSTOM" ? "is-active" : ""}`} onClick={() => setExportPreset("CUSTOM")}>
                  Personalizat
                </Button>
              </div>

              {exportPreset === "YEAR" && (
                <input className="input" value={exportYear} onChange={(e) => setExportYear(e.target.value)} placeholder="ex: 2025" disabled={exporting} />
              )}

              {exportPreset === "CUSTOM" && (
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="input" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} disabled={exporting} placeholder="De la" />
                  <input type="date" className="input" value={exportTo} onChange={(e) => setExportTo(e.target.value)} disabled={exporting} placeholder="Până la" />
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={applyPeriod} disabled={exporting}>
                Aplică
              </Button>
              <Button variant="primary" className="flex-1" onClick={exportPdf} disabled={exporting}>
                {exporting ? "Export..." : "PDF"}
              </Button>
            </div>
          </Motion.div>
        </div>
      )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
        {/* Transactions List - Mobile Card View */}
        <div className="card p-4 sm:p-5 agri-pattern">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="text-sm font-bold">Tranzacții</div>
            <Badge>{items.length}</Badge>
          </div>

          {busy ? (
            <div className="muted">Se încarcă…</div>
          ) : items.length === 0 ? (
            <div className="muted text-center py-8">Nu există tranzacții încă.</div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-auto">
              {items.map((t, index) => (
                <Motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className="card-soft p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "REVENUE" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                      {t.type === "REVENUE" ? (
                        <ArrowUpRight size={18} className="text-green-500" />
                      ) : (
                        <ArrowDownRight size={18} className="text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate text-sm">{t.description}</div>
                      <div className="muted text-xs flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(t.occurredAt || t.createdAt || Date.now()).toLocaleDateString("ro-RO")}
                        {isAdmin && t?.owner && (
                          <span className="hidden sm:inline"> • {t.owner.name || t.owner.username || t.owner.email?.split("@")[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 pl-13 sm:pl-0">
                    <div className={`font-bold text-sm ${t.type === "REVENUE" ? "text-green-500" : "text-red-500"}`}>
                      {t.type === "REVENUE" ? "+" : "-"}{money(t.amount)}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(t.id)} className="text-destructive">
                      <X size={14} />
                    </Button>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Budget Forecast */}
          {forecast && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 agri-pattern"
            >
              <div className="flex items-center gap-2 mb-4">
                <ChartLine size={16} className="text-primary" />
                <div className="text-sm font-bold">Previziuni</div>
                <Badge variant="outline" className="text-xs">{forecast.monthsAnalyzed} luni</Badge>
              </div>

              <div className="space-y-3">
                <div className="card-soft p-3">
                  <div className="flex items-center justify-between">
                    <span className="muted text-xs">Venit mediu/lună</span>
                    <span className={`text-xs ${forecast.revenueTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {forecast.revenueTrend >= 0 ? "↑" : "↓"} {Math.abs(forecast.revenueTrend).toFixed(0)}%
                    </span>
                  </div>
                  <div className="font-bold text-green-500">{money(forecast.avgRevenue)}</div>
                </div>

                <div className="card-soft p-3">
                  <div className="flex items-center justify-between">
                    <span className="muted text-xs">Cheltuieli medii/lună</span>
                    <span className={`text-xs ${forecast.expenseTrend <= 0 ? "text-green-500" : "text-red-500"}`}>
                      {forecast.expenseTrend >= 0 ? "↑" : "↓"} {Math.abs(forecast.expenseTrend).toFixed(0)}%
                    </span>
                  </div>
                  <div className="font-bold text-red-500">{money(forecast.avgExpenses)}</div>
                </div>

                <div className="card-soft p-3 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-primary" />
                    <span className="muted text-xs">Estimare luna viitoare</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-xs muted">Venit</div>
                      <div className="font-bold text-sm text-green-500">{money(forecast.nextMonthEstimate.revenue)}</div>
                    </div>
                    <div>
                      <div className="text-xs muted">Cheltuieli</div>
                      <div className="font-bold text-sm text-red-500">{money(forecast.nextMonthEstimate.expenses)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          {/* Add Transaction Form */}
          {!isAdmin && (
            <div className="card p-5 space-y-4 agri-pattern">
              <div className="text-sm font-bold">Adaugă tranzacție</div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="tab"
                  className={type === "EXPENSE" ? "is-active" : ""}
                  onClick={() => setType("EXPENSE")}
                >
                  Cheltuială
                </Button>
                <Button
                  variant="tab"
                  className={type === "REVENUE" ? "is-active" : ""}
                  onClick={() => setType("REVENUE")}
                >
                  Venit
                </Button>
              </div>

              <div>
                <div className="muted text-xs mb-1">Descriere</div>
                <input className="input" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="ex: Motorină, Semințe..." />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="muted text-xs mb-1">Data</div>
                  <input type="date" className="input" value={occurredDate} onChange={(e) => setOccurredDate(e.target.value)} />
                </div>
                <div>
                  <div className="muted text-xs mb-1">Sumă (RON)</div>
                  <input className="input" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="250" />
                </div>
              </div>

              <Button onClick={onAdd} variant="primary" className="w-full">
                Adaugă
              </Button>
            </div>
          )}

          {isAdmin && (
            <div className="card p-5 space-y-3 agri-pattern">
              <div className="text-sm font-bold">Mod admin</div>
              <div className="muted text-sm">
                Vezi economia globală a tuturor utilizatorilor.
              </div>
              <div className="text-xs muted">
                Total tranzacții: {summary.count || items.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
