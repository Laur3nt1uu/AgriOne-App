import { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Calculator,
  FileDown,
  MapPin,
  Sprout,
  Clock,
  Euro,
  Banknote,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Leaf,
  FileText,
} from "lucide-react";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useConfirm } from "../../components/confirm/ConfirmProvider";

const TABS = ["parcels", "calendar", "calculator", "export"];
const TAB_ICONS = {
  parcels: Layers,
  calendar: Calendar,
  calculator: Calculator,
  export: FileDown,
};

// ─── KPI Card ────────────────────────────────────────

function KPICard({ icon: Icon, label, value, sub, color = "primary", delay = 0 }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}/10 text-${color} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-xl font-bold text-foreground mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </Motion.div>
  );
}

// ─── Parcels Tab ─────────────────────────────────────

function ParcelsTab({ t, parcels, lands, onRefresh }) {
  const confirm = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getEmptyForm());
  const [saving, setSaving] = useState(false);

  function getEmptyForm() {
    return {
      landId: "",
      tarlaNumber: "",
      parcelNumber: "",
      sirutaCode: "",
      cadastralNumber: "",
      landCategory: "arabil",
      apiaAreaHa: "",
      isEcoScheme: false,
      ecoSchemeType: "",
      youngFarmer: false,
      notes: "",
    };
  }

  const landsWithout = lands.filter(
    (l) => !parcels.some((p) => (p.landId || p.land_id) === l.id)
  );

  function openNew() {
    setEditingId(null);
    setForm({ ...getEmptyForm(), landId: landsWithout[0]?.id || "" });
    setShowForm(true);
  }

  function openEdit(parcel) {
    setEditingId(parcel.id);
    setForm({
      landId: parcel.landId || parcel.land_id,
      tarlaNumber: parcel.tarlaNumber || parcel.tarla_number || "",
      parcelNumber: parcel.parcelNumber || parcel.parcel_number || "",
      sirutaCode: parcel.sirutaCode || parcel.siruta_code || "",
      cadastralNumber: parcel.cadastralNumber || parcel.cadastral_number || "",
      landCategory: parcel.landCategory || parcel.land_category || "arabil",
      apiaAreaHa: String(parcel.apiaAreaHa || parcel.apia_area_ha || ""),
      isEcoScheme: !!parcel.isEcoScheme || !!parcel.is_eco_scheme,
      ecoSchemeType: parcel.ecoSchemeType || parcel.eco_scheme_type || "",
      youngFarmer: !!parcel.youngFarmer || !!parcel.young_farmer,
      notes: parcel.notes || "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.landId && !editingId) return toastError(t("apia.parcels.form.selectLand"));
    if (!form.apiaAreaHa || Number(form.apiaAreaHa) <= 0) return toastError("Suprafata APIA invalida");

    setSaving(true);
    try {
      const payload = {
        ...form,
        apiaAreaHa: Number(form.apiaAreaHa),
        ecoSchemeType: form.isEcoScheme ? form.ecoSchemeType || null : null,
      };

      if (editingId) {
        const { landId, ...updateData } = payload;
        await api.apia.updateParcel(editingId, updateData);
        toastSuccess(t("apia.parcels.edit") + " OK");
      } else {
        await api.apia.createParcel(payload);
        toastSuccess(t("apia.parcels.addNew") + " OK");
      }
      setShowForm(false);
      onRefresh();
    } catch (e) {
      toastError(e?.response?.data?.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = await confirm({
      title: t("apia.parcels.delete"),
      message: t("apia.parcels.confirmDelete"),
      confirmText: t("apia.parcels.delete"),
      variant: "danger",
    });
    if (!ok) return;

    try {
      await api.apia.deleteParcel(id);
      toastSuccess("OK");
      onRefresh();
    } catch (e) {
      toastError(e?.response?.data?.message || "Error");
    }
  }

  const totalArea = parcels.reduce((s, p) => s + Number(p.apiaAreaHa || p.apia_area_ha || 0), 0);
  const ecoCount = parcels.filter((p) => p.isEcoScheme || p.is_eco_scheme).length;

  const categories = ["arabil", "pasune", "faneata", "livada", "vie", "legume"];
  const ecoTypes = ["biodiversitate", "reducere_pesticide", "pajisti", "conversia_eco", "rotatie_culturi"];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard icon={Layers} label={t("apia.parcels.title")} value={parcels.length} sub={t("apia.parcels.registered")} delay={0.05} />
        <KPICard icon={MapPin} label={t("apia.parcels.totalArea")} value={`${totalArea.toFixed(2)} ha`} delay={0.1} />
        <KPICard icon={Leaf} label={t("apia.parcels.withEco")} value={ecoCount} delay={0.15} />
      </div>

      {/* Add button */}
      {landsWithout.length > 0 && (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Button onClick={openNew} variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("apia.parcels.addNew")}
          </Button>
        </Motion.div>
      )}

      {/* Parcels list */}
      {parcels.length === 0 ? (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-10 text-center">
          <Landmark className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{t("apia.parcels.empty")}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("apia.parcels.emptyDesc")}</p>
        </Motion.div>
      ) : (
        <div className="space-y-3">
          {parcels.map((p, idx) => {
            const land = p.Land || {};
            const cat = p.landCategory || p.land_category;
            return (
              <Motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="glass p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{land.name || "—"}</h3>
                      <Badge variant="outline" className="text-[10px]">{t(`apia.parcels.categories.${cat}`) || cat}</Badge>
                      {(p.isEcoScheme || p.is_eco_scheme) && (
                        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">ECO</Badge>
                      )}
                      {(p.youngFarmer || p.young_farmer) && (
                        <Badge className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">TF</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>APIA: <strong className="text-foreground">{p.apiaAreaHa || p.apia_area_ha} ha</strong></span>
                      {(p.tarlaNumber || p.tarla_number) && <span>T: {p.tarlaNumber || p.tarla_number}</span>}
                      {(p.parcelNumber || p.parcel_number) && <span>P: {p.parcelNumber || p.parcel_number}</span>}
                      {(p.sirutaCode || p.siruta_code) && <span>SIRUTA: {p.sirutaCode || p.siruta_code}</span>}
                      {(p.cadastralNumber || p.cadastral_number) && <span>CF: {p.cadastralNumber || p.cadastral_number}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="gap-1.5 text-xs">
                      <Pencil className="w-3.5 h-3.5" /> {t("apia.parcels.edit")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="gap-1.5 text-xs text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg card p-6 space-y-4 my-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">{t("apia.parcels.form.title")}</h2>
                  <p className="muted text-sm mt-0.5">{editingId ? t("apia.parcels.edit") : t("apia.parcels.addNew")}</p>
                </div>
                <Button variant="ghost" onClick={() => setShowForm(false)} title="Închide">✕</Button>
              </div>

              {!editingId && (
                <div>
                  <div className="muted text-xs mb-1">{t("apia.parcels.form.selectLand")}</div>
                  <select value={form.landId} onChange={(e) => setForm({ ...form, landId: e.target.value })} className="input w-full">
                    {landsWithout.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.areaHa} ha)</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["tarlaNumber", "tarlaNumber"],
                  ["parcelNumber", "parcelNumber"],
                  ["sirutaCode", "sirutaCode"],
                  ["cadastralNumber", "cadastralNumber"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <div className="muted text-xs mb-1">{t(`apia.parcels.form.${label}`)}</div>
                    <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input w-full" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="muted text-xs mb-1">{t("apia.parcels.form.landCategory")}</div>
                  <select value={form.landCategory} onChange={(e) => setForm({ ...form, landCategory: e.target.value })} className="input w-full">
                    {categories.map((c) => <option key={c} value={c}>{t(`apia.parcels.categories.${c}`)}</option>)}
                  </select>
                </div>
                <div>
                  <div className="muted text-xs mb-1">{t("apia.parcels.form.apiaArea")}</div>
                  <input type="number" step="0.01" min="0" value={form.apiaAreaHa} onChange={(e) => setForm({ ...form, apiaAreaHa: e.target.value })} className="input w-full" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isEcoScheme} onChange={(e) => setForm({ ...form, isEcoScheme: e.target.checked })} className="rounded border-border accent-primary" />
                  <span className="text-sm text-foreground">{t("apia.parcels.form.ecoScheme")}</span>
                </label>
              </div>

              {form.isEcoScheme && (
                <div>
                  <div className="muted text-xs mb-1">{t("apia.parcels.form.ecoSchemeType")}</div>
                  <select value={form.ecoSchemeType} onChange={(e) => setForm({ ...form, ecoSchemeType: e.target.value })} className="input w-full">
                    <option value="">—</option>
                    {ecoTypes.map((et) => <option key={et} value={et}>{t(`apia.parcels.ecoTypes.${et}`)}</option>)}
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.youngFarmer} onChange={(e) => setForm({ ...form, youngFarmer: e.target.checked })} className="rounded border-border accent-primary" />
                <span className="text-sm text-foreground">{t("apia.parcels.form.youngFarmer")}</span>
              </label>

              <div>
                <div className="muted text-xs mb-1">{t("apia.parcels.form.notes")}</div>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input w-full resize-none" />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={() => setShowForm(false)} variant="ghost" className="flex-1">{t("apia.parcels.form.cancel")}</Button>
                <Button onClick={handleSave} variant="primary" className="flex-1" disabled={saving}>{saving ? "..." : t("apia.parcels.form.save")}</Button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Calendar Tab ────────────────────────────────────

function CalendarTab({ t, lang }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.apia.calendar().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="glass p-10 text-center text-muted-foreground">...</div>;

  const events = data?.events || [];
  const nextEvent = events.find((e) => !e.isPast);

  const priorityColor = { HIGH: "text-red-400 bg-red-500/10 border-red-500/20", MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", LOW: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  const categoryIcon = { SUBMISSION: FileText, PAYMENT: Banknote, CONTROL: AlertTriangle, PREPARATION: Clock };

  return (
    <div className="space-y-6">
      {/* Next deadline hero */}
      {nextEvent && (
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 border-l-4 border-primary">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{t("apia.calendar.upcoming")}</p>
          <h3 className="text-xl font-bold text-foreground">{lang === "ro" ? nextEvent.titleRo : nextEvent.titleEn}</h3>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ro" ? nextEvent.descRo : nextEvent.descEn}</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge className={`${priorityColor[nextEvent.priority]}`}>{t(`apia.calendar.priority.${nextEvent.priority}`)}</Badge>
            <span className="text-sm font-bold text-primary">
              {nextEvent.daysUntil === 0 ? t("apia.calendar.today") : `${nextEvent.daysUntil} ${t("apia.calendar.daysLeft")}`}
            </span>
          </div>
        </Motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/30" />
        <div className="space-y-1">
          {events.map((ev, idx) => {
            const CatIcon = categoryIcon[ev.category] || Clock;
            const isNext = nextEvent?.id === ev.id;
            return (
              <Motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`flex gap-4 p-3 rounded-xl transition-colors ${isNext ? "bg-primary/5 border border-primary/20" : ev.isPast ? "opacity-50" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isNext ? "bg-primary/20 text-primary" : ev.isPast ? "bg-secondary/30 text-muted-foreground" : "bg-secondary/50 text-foreground"}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{lang === "ro" ? ev.titleRo : ev.titleEn}</span>
                    <Badge className={`text-[10px] ${priorityColor[ev.priority]}`}>{t(`apia.calendar.priority.${ev.priority}`)}</Badge>
                    <Badge variant="outline" className="text-[10px]">{t(`apia.calendar.category.${ev.category}`)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{lang === "ro" ? ev.descRo : ev.descEn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground">{ev.date}{ev.endDate ? ` → ${ev.endDate}` : ""}</span>
                    <span className={`text-[11px] font-medium ${ev.isPast ? "text-muted-foreground" : "text-primary"}`}>
                      {ev.daysUntil === 0
                        ? t("apia.calendar.today")
                        : ev.isPast
                          ? `${Math.abs(ev.daysUntil)} ${t("apia.calendar.daysAgo")}`
                          : `${ev.daysUntil} ${t("apia.calendar.daysLeft")}`}
                    </span>
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Calculator Tab ──────────────────────────────────

function CalculatorTab({ t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.apia.calculate().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="glass p-10 text-center text-muted-foreground">...</div>;
  if (!data || !data.parcelsCount) {
    return (
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-10 text-center">
        <Calculator className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-sm text-muted-foreground">{t("apia.calculator.noParcels")}</p>
      </Motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Euro} label={t("apia.calculator.totalEur")} value={`${data.grandTotalEur.toLocaleString()} EUR`} delay={0.05} />
        <KPICard icon={Banknote} label={t("apia.calculator.totalRon")} value={`${data.grandTotalRon.toLocaleString()} RON`} delay={0.1} />
        <KPICard icon={Layers} label={t("apia.calculator.eligibleParcels")} value={data.parcelsCount} delay={0.15} />
        <KPICard icon={MapPin} label={t("apia.calculator.totalArea")} value={`${data.totalAreaHa} ha`} delay={0.2} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{t("apia.calculator.year")}: <strong className="text-foreground">{data.year}</strong></span>
        <span>{t("apia.calculator.exchangeRate")}: <strong className="text-foreground">{data.eurToRon}</strong></span>
      </div>

      {/* Per-parcel breakdown */}
      <div className="space-y-3">
        {data.parcels?.map((parcel, idx) => (
          <Motion.div
            key={parcel.parcelId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="glass p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">{parcel.landName}</h4>
                <Badge variant="outline" className="text-[10px]">{parcel.cropType}</Badge>
                <span className="text-xs text-muted-foreground">{parcel.apiaAreaHa} ha</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">{parcel.totalEur.toLocaleString()} EUR</span>
                <span className="text-xs text-muted-foreground ml-2">({parcel.totalRon.toLocaleString()} RON)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {parcel.breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{t(`apia.calculator.components.${b.type}`) || b.label}</span>
                    <span className="text-muted-foreground/60">{b.area} ha × {b.perHa} EUR{t("apia.calculator.perHa")}</span>
                  </div>
                  <span className="font-medium text-foreground">{b.eur.toLocaleString()} EUR</span>
                </div>
              ))}
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
        <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">{t("apia.calculator.disclaimer")}</p>
      </Motion.div>
    </div>
  );
}

// ─── Export Tab ───────────────────────────────────────

function ExportTab({ t, parcelsCount }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const blob = await api.apia.exportPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apia-report-${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toastSuccess("PDF OK");
    } catch (e) {
      toastError(e?.response?.data?.message || "Export failed");
    } finally {
      setDownloading(false);
    }
  }

  const items = [
    { key: "farmerData", icon: "user" },
    { key: "parcelDetails", icon: "list" },
    { key: "areas", icon: "map" },
    { key: "subsidyEstimate", icon: "calc" },
    { key: "totals", icon: "sum" },
  ];

  return (
    <div className="space-y-6">
      <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileDown className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">{t("apia.export.title")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("apia.export.desc")}</p>

            <div className="mt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("apia.export.includes")}</p>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <Motion.div key={item.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{t(`apia.export.includesList.${item.key}`)}</span>
                  </Motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handleDownload} variant="primary" className="gap-2" disabled={downloading || parcelsCount === 0}>
                <Download className="w-4 h-4" />
                {downloading ? t("apia.export.downloading") : t("apia.export.download")}
              </Button>
              {parcelsCount === 0 && (
                <p className="text-xs text-muted-foreground mt-2">{t("apia.calculator.noParcels")}</p>
              )}
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────

export default function ApiaPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("parcels");
  const [parcels, setParcels] = useState([]);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [parcelsData, landsData] = await Promise.all([
        api.apia.listParcels().catch(() => []),
        api.lands.list().catch(() => []),
      ]);
      setParcels(Array.isArray(parcelsData) ? parcelsData : []);
      const l = landsData?.lands || landsData || [];
      setLands(Array.isArray(l) ? l : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("apia.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("apia.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => {
          const TabIcon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn-tab flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-200 ${
                isActive
                  ? "is-active bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {t(`apia.tabs.${tab}`)}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="glass p-12 text-center text-muted-foreground animate-pulse">...</div>
      ) : (
        <AnimatePresence mode="wait">
          <Motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === "parcels" && <ParcelsTab t={t} parcels={parcels} lands={lands} onRefresh={loadData} />}
            {activeTab === "calendar" && <CalendarTab t={t} lang={language} />}
            {activeTab === "calculator" && <CalculatorTab t={t} />}
            {activeTab === "export" && <ExportTab t={t} parcelsCount={parcels.length} />}
          </Motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
