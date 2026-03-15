import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { BellRing, Droplets, Thermometer, Settings2, Plus, Trash2, Check, X } from "lucide-react";

export default function AlertRulesModal({ open, onClose, lands = [], onRulesSaved }) {
  const [rules, setRules] = useState([]);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for new/edit rule
  const [editingLandId, setEditingLandId] = useState(null);
  const [formData, setFormData] = useState({
    enabled: true,
    tempMin: "",
    tempMax: "",
    humMin: "",
    humMax: "",
  });

  async function loadRules() {
    setBusy(true);
    try {
      const data = await api.alerts.getRules();
      setRules(Array.isArray(data) ? data : []);
    } catch (e) {
      toastError(e, "Nu pot incarca regulile.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (open) loadRules();
  }, [open]);

  function startEdit(landId) {
    const existing = rules.find(r => r.landId === landId);
    setEditingLandId(landId);
    setFormData({
      enabled: existing?.enabled ?? true,
      tempMin: existing?.tempMin ?? "",
      tempMax: existing?.tempMax ?? "",
      humMin: existing?.humMin ?? "",
      humMax: existing?.humMax ?? "",
    });
  }

  function cancelEdit() {
    setEditingLandId(null);
    setFormData({ enabled: true, tempMin: "", tempMax: "", humMin: "", humMax: "" });
  }

  async function saveRule() {
    if (!editingLandId) return;
    setSaving(true);
    try {
      const payload = {
        landId: editingLandId,
        enabled: formData.enabled,
        tempMin: formData.tempMin !== "" ? Number(formData.tempMin) : null,
        tempMax: formData.tempMax !== "" ? Number(formData.tempMax) : null,
        humMin: formData.humMin !== "" ? Number(formData.humMin) : null,
        humMax: formData.humMax !== "" ? Number(formData.humMax) : null,
      };
      await api.alerts.upsertRule(payload);
      toastSuccess("Regula a fost salvata!");
      cancelEdit();
      await loadRules();
      onRulesSaved?.();
    } catch (e) {
      toastError(e, "Nu pot salva regula.");
    } finally {
      setSaving(false);
    }
  }

  async function disableRule(landId) {
    setSaving(true);
    try {
      await api.alerts.upsertRule({ landId, enabled: false });
      toastSuccess("Regula a fost dezactivata.");
      await loadRules();
      onRulesSaved?.();
    } catch (e) {
      toastError(e, "Nu pot dezactiva regula.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const landsWithRules = lands.map(land => {
    const rule = rules.find(r => r.landId === land.id);
    return { ...land, rule };
  });

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !saving) onClose();
        }}
      >
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        />
        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl card p-5 max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="icon-chip">
                <Settings2 size={20} className="text-primary" />
              </span>
              <div>
                <div className="text-lg font-extrabold">Reguli Alerte</div>
                <div className="muted text-sm">Configureaza pragurile pentru generare automata de alerte</div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} disabled={saving} title="Inchide">
              <X size={18} />
            </Button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto space-y-3">
            {busy ? (
              <div className="muted py-8 text-center">Se incarca...</div>
            ) : lands.length === 0 ? (
              <div className="muted py-8 text-center">Nu ai terenuri. Adauga un teren pentru a configura reguli.</div>
            ) : (
              landsWithRules.map((land, index) => (
                <Motion.div
                  key={land.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-soft p-4 border border-border/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold truncate">{land.name}</span>
                        {land.rule?.enabled ? (
                          <Badge variant="success">Activa</Badge>
                        ) : land.rule ? (
                          <Badge variant="outline">Dezactivata</Badge>
                        ) : (
                          <Badge variant="outline">Fara regula</Badge>
                        )}
                      </div>
                      {land.rule && land.rule.enabled && (
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Thermometer size={12} className="text-muted-foreground" />
                            <span className="muted">Min:</span>
                            <span>{land.rule.tempMin ?? "-"}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Thermometer size={12} className="text-muted-foreground" />
                            <span className="muted">Max:</span>
                            <span>{land.rule.tempMax ?? "-"}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets size={12} className="text-muted-foreground" />
                            <span className="muted">Min:</span>
                            <span>{land.rule.humMin ?? "-"}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets size={12} className="text-muted-foreground" />
                            <span className="muted">Max:</span>
                            <span>{land.rule.humMax ?? "-"}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingLandId === land.id ? (
                        <>
                          <Button variant="ghost" onClick={cancelEdit} disabled={saving} size="sm">
                            <X size={16} />
                          </Button>
                          <Button variant="primary" onClick={saveRule} disabled={saving} size="sm">
                            <Check size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" onClick={() => startEdit(land.id)} disabled={saving} size="sm">
                            Editeaza
                          </Button>
                          {land.rule?.enabled && (
                            <Button
                              variant="ghost"
                              onClick={() => disableRule(land.id)}
                              disabled={saving}
                              size="sm"
                              className="text-destructive"
                            >
                              Dezactiveaza
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Edit form */}
                  <AnimatePresence>
                    {editingLandId === land.id && (
                      <Motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border/20 space-y-4">
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.enabled}
                                onChange={(e) => setFormData(f => ({ ...f, enabled: e.target.checked }))}
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-sm">Regula activa</span>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <Thermometer size={16} className="text-primary" />
                                Temperatura (°C)
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="muted text-xs mb-1">Minima</div>
                                  <input
                                    type="number"
                                    className="input"
                                    placeholder="ex: 5"
                                    value={formData.tempMin}
                                    onChange={(e) => setFormData(f => ({ ...f, tempMin: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <div className="muted text-xs mb-1">Maxima</div>
                                  <input
                                    type="number"
                                    className="input"
                                    placeholder="ex: 35"
                                    value={formData.tempMax}
                                    onChange={(e) => setFormData(f => ({ ...f, tempMax: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <Droplets size={16} className="text-primary" />
                                Umiditate (%)
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="muted text-xs mb-1">Minima</div>
                                  <input
                                    type="number"
                                    className="input"
                                    placeholder="ex: 20"
                                    value={formData.humMin}
                                    onChange={(e) => setFormData(f => ({ ...f, humMin: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <div className="muted text-xs mb-1">Maxima</div>
                                  <input
                                    type="number"
                                    className="input"
                                    placeholder="ex: 80"
                                    value={formData.humMax}
                                    onChange={(e) => setFormData(f => ({ ...f, humMax: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs muted">
                            Lasa campurile goale pentru a nu verifica acel prag. Alertele se genereaza automat cand senzorul trimite date in afara pragurilor.
                          </div>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/20 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={saving}>
              Inchide
            </Button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}
