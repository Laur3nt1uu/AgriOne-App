import { useEffect, useState } from "react";
import { api } from "../../../api/endpoints";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { CheckCircle2, Cpu, Database, Download, FileUp, History, Leaf, RefreshCcw, Sliders, Thermometer, Upload, Users, X, Wifi, WifiOff } from "lucide-react";
import { useConfirm } from "../../../components/confirm/ConfirmProvider";
import { motion as Motion, AnimatePresence } from "framer-motion";

function isOnline(lastAt) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 15 * 60 * 1000;
}

// Export history in localStorage
const EXPORT_HISTORY_KEY = "agrione_export_history";
function getExportHistory() {
  try {
    return JSON.parse(localStorage.getItem(EXPORT_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
function addExportHistory(entry) {
  const history = getExportHistory();
  history.unshift({ ...entry, timestamp: new Date().toISOString() });
  localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history.slice(0, 20))); // Keep last 20
}

export default function SystemSettingsPage() {
  const confirm = useConfirm();
  const [stats, setStats] = useState(null);
  const [backing, setBacking] = useState(false);

  const [sensors, setSensors] = useState([]);
  const [sensorsBusy, setSensorsBusy] = useState(true);
  const [selectedSensors, setSelectedSensors] = useState(new Set());

  const [lands, setLands] = useState([]);

  const [pairSensorCode, setPairSensorCode] = useState("");
  const [pairLandId, setPairLandId] = useState("");
  const [pairing, setPairing] = useState(false);

  const [calOpen, setCalOpen] = useState(false);
  const [calSaving, setCalSaving] = useState(false);
  const [calSensor, setCalSensor] = useState(null);
  const [calTemp, setCalTemp] = useState("0");
  const [calHum, setCalHum] = useState("0");

  // Export history
  const [exportHistory, setExportHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Restore modal
  const [restoreOpen, setRestoreOpen] = useState(false);

  async function load() {
    setSensorsBusy(true);
    try {
      const [data, sens, landList] = await Promise.all([
        api.admin.getStats(),
        api.sensors.list().catch(() => []),
        api.lands.list().catch(() => []),
      ]);

      setStats(data);
      setSensors(Array.isArray(sens) ? sens : (sens?.items || []));
      setLands(Array.isArray(landList) ? landList : (landList?.items || []));
      setExportHistory(getExportHistory());
    } catch (e) {
      toastError(e, "Nu pot incarca datele de sistem.");
      setSensors([]);
      setLands([]);
    } finally {
      setSensorsBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Bulk operations
  function toggleSensorSelection(sensorId) {
    setSelectedSensors(prev => {
      const next = new Set(prev);
      if (next.has(sensorId)) next.delete(sensorId);
      else next.add(sensorId);
      return next;
    });
  }

  function selectAllSensors() {
    if (selectedSensors.size === sensors.length) {
      setSelectedSensors(new Set());
    } else {
      setSelectedSensors(new Set(sensors.map(s => s.id || s.sensorCode)));
    }
  }

  async function bulkUnpair() {
    if (selectedSensors.size === 0) return;

    const ok = await confirm({
      title: "Dezasociere in masa",
      message: `Dezasociezi ${selectedSensors.size} senzori de pe terenuri?`,
      confirmText: "Dezasociaza",
      cancelText: "Renunta",
      destructive: true,
    });
    if (!ok) return;

    try {
      const selected = sensors.filter(s => selectedSensors.has(s.id || s.sensorCode));
      for (const sensor of selected) {
        if (sensor.landId) {
          await api.sensors.unpair({ sensorCode: sensor.sensorCode });
        }
      }
      toastSuccess(`${selectedSensors.size} senzori dezasociati.`);
      setSelectedSensors(new Set());
      await load();
    } catch (e) {
      toastError(e, "Eroare la dezasociere.");
    }
  }

  function openCalibrate(sensor) {
    if (!sensor?.sensorCode) return;
    setCalSensor(sensor);
    setCalTemp(String(sensor.calibrationTempOffsetC ?? 0));
    setCalHum(String(sensor.calibrationHumidityOffsetPct ?? 0));
    setCalOpen(true);
  }

  async function submitCalibration() {
    if (!calSensor?.sensorCode || calSaving) return;

    const tempOffsetC = Number(calTemp);
    const humidityOffsetPct = Number(calHum);
    if (!Number.isFinite(tempOffsetC) || !Number.isFinite(humidityOffsetPct)) {
      toastError(null, "Offset-uri invalide.");
      return;
    }

    setCalSaving(true);
    try {
      await api.sensors.calibrate(calSensor.sensorCode, { tempOffsetC, humidityOffsetPct });
      toastSuccess("Calibrarea a fost salvata.");
      setCalOpen(false);
      setCalSensor(null);
      await load();
    } catch (e) {
      toastError(e, "Nu pot salva calibrarea.");
    } finally {
      setCalSaving(false);
    }
  }

  // Quick calibration presets
  async function quickCalibrate(sensor, preset) {
    const presets = {
      reset: { tempOffsetC: 0, humidityOffsetPct: 0 },
      standard: { tempOffsetC: -0.5, humidityOffsetPct: 2 },
    };
    const { tempOffsetC, humidityOffsetPct } = presets[preset] || presets.reset;

    try {
      await api.sensors.calibrate(sensor.sensorCode, { tempOffsetC, humidityOffsetPct });
      toastSuccess(`Calibrare ${preset} aplicata.`);
      await load();
    } catch (e) {
      toastError(e, "Eroare calibrare.");
    }
  }

  async function unpair(sensor) {
    const code = sensor?.sensorCode;
    if (!code) return;
    const ok = await confirm({
      title: "Dezasociere senzor",
      message: `Dezasociezi senzorul ${code} de pe teren?`,
      confirmText: "Dezasociaza",
      cancelText: "Renunta",
      destructive: true,
    });
    if (!ok) return;

    try {
      await api.sensors.unpair({ sensorCode: code });
      toastSuccess("Senzor dezasociat.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot dezasocia senzorul.");
    }
  }

  async function submitPair() {
    const sensorCode = String(pairSensorCode || "").trim();
    const landId = String(pairLandId || "").trim();
    if (!sensorCode) return toastError(null, "Introdu codul senzorului.");
    if (!landId) return toastError(null, "Selecteaza un teren.");

    setPairing(true);
    try {
      await api.sensors.pair({ sensorCode, landId });
      toastSuccess("Senzor asociat cu succes.");
      setPairSensorCode("");
      setPairLandId("");
      await load();
    } catch (e) {
      toastError(e, "Nu pot asocia senzorul.");
    } finally {
      setPairing(false);
    }
  }

  async function doBackup() {
    const ok = await confirm({
      title: "Backup baza de date",
      message: "Faci backup la baza de date?",
      confirmText: "Genereaza",
      cancelText: "Renunta",
      destructive: false,
    });
    if (!ok) return;
    setBacking(true);
    try {
      const blob = await api.admin.backup();
      const filename = `backup_${new Date().toISOString().split("T")[0]}.sql`;
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/sql" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toastSuccess("Backup descarcat cu succes!");

      // Add to history
      addExportHistory({ type: "backup", filename });
      setExportHistory(getExportHistory());
    } catch (e) {
      toastError(e, "Backup esuat.");
    } finally {
      setBacking(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card p-4 sm:p-6 agri-pattern">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <div className="page-title">Setari sistem</div>
            <div className="muted text-sm">Configurari, senzori si statistici</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={load} variant="ghost" size="sm">
              <RefreshCcw size={14} className={sensorsBusy ? "animate-spin" : ""} />
            </Button>
            <Button onClick={() => setShowHistory(!showHistory)} variant="ghost" size="sm">
              <History size={14} className="mr-1" />
              Istoric
            </Button>
            <span className="icon-chip hidden sm:inline-flex" title="Sistem">
              <Database size={20} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 sm:p-5 text-center agri-pattern">
          <Users size={20} className="mx-auto text-primary mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold">{stats?.totalUsers || 0}</div>
          <div className="muted text-xs sm:text-sm">Utilizatori</div>
        </Motion.div>
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-4 sm:p-5 text-center agri-pattern">
          <Leaf size={20} className="mx-auto text-green-500 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold">{stats?.totalLands || 0}</div>
          <div className="muted text-xs sm:text-sm">Terenuri</div>
        </Motion.div>
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4 sm:p-5 text-center agri-pattern">
          <Cpu size={20} className="mx-auto text-blue-500 mb-2" />
          <div className="text-2xl sm:text-3xl font-extrabold">{stats?.totalSensors || 0}</div>
          <div className="muted text-xs sm:text-sm">Senzori</div>
        </Motion.div>
      </div>

      {/* Export History Panel */}
      <AnimatePresence>
        {showHistory && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-5 agri-pattern">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-primary" />
                  <span className="font-bold">Istoric exporturi</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                  <X size={14} />
                </Button>
              </div>
              {exportHistory.length === 0 ? (
                <div className="muted text-sm">Nu exista exporturi recente.</div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-auto">
                  {exportHistory.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between text-sm card-soft p-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span>{entry.filename}</span>
                      </div>
                      <span className="muted text-xs">
                        {new Date(entry.timestamp).toLocaleString("ro-RO")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
        {/* Sensors Management */}
        <div className="card p-4 sm:p-5 agri-pattern">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <div className="text-sm font-bold">Senzori</div>
              <div className="muted text-xs">Gestionare si calibrare</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {sensors.length > 0 && (
                <>
                  <Button variant="ghost" size="sm" onClick={selectAllSensors}>
                    {selectedSensors.size === sensors.length ? "Deselecteaza" : "Selecteaza tot"}
                  </Button>
                  {selectedSensors.size > 0 && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={bulkUnpair}>
                      Dezasociaza ({selectedSensors.size})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Pair Form */}
          <div className="card-soft p-4 mb-4">
            <div className="text-sm font-bold mb-2">Asociaza senzor</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Cod senzor"
                value={pairSensorCode}
                onChange={(e) => setPairSensorCode(e.target.value)}
                disabled={pairing}
              />
              <select
                className="input"
                value={pairLandId}
                onChange={(e) => setPairLandId(e.target.value)}
                disabled={pairing || !lands.length}
              >
                <option value="">Selecteaza teren</option>
                {lands.slice(0, 100).map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <Button variant="primary" onClick={submitPair} disabled={pairing} className="w-full sm:w-auto">
                {pairing ? "..." : "Asociaza"}
              </Button>
            </div>
          </div>

          {/* Sensors List */}
          {sensorsBusy ? (
            <div className="muted py-8 text-center">Se incarca...</div>
          ) : sensors.length === 0 ? (
            <div className="muted py-8 text-center">Nu exista senzori.</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {sensors.slice(0, 50).map((s, index) => {
                const online = isOnline(s.lastReadingAt);
                const isSelected = selectedSensors.has(s.id || s.sensorCode);

                return (
                  <Motion.div
                    key={s.id || s.sensorCode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    className={`card-soft p-3 border-2 transition-colors ${isSelected ? "border-primary/50" : "border-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSensorSelection(s.id || s.sensorCode)}
                        className="w-4 h-4 rounded"
                      />
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${online ? "bg-green-500/10" : "bg-muted/50"}`}>
                        {online ? <Wifi size={14} className="text-green-500" /> : <WifiOff size={14} className="text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{s.sensorCode}</div>
                        <div className="muted text-xs truncate">
                          {s?.land?.name || "Neasociat"}
                          {s?.owner?.username && ` • ${s.owner.username}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => quickCalibrate(s, "reset")}
                          title="Reset calibrare"
                        >
                          <RefreshCcw size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCalibrate(s)}
                          title="Calibrare avansata"
                        >
                          <Sliders size={12} />
                        </Button>
                        {s.landId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => unpair(s)}
                            title="Dezasociaza"
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Database & Backup */}
        <div className="space-y-4">
          <div className="card p-5 agri-pattern">
            <div className="flex items-center gap-3 mb-4">
              <span className="icon-chip w-10 h-10 rounded-2xl">
                <Download size={18} className="text-primary" />
              </span>
              <div>
                <div className="font-bold">Backup</div>
                <div className="muted text-xs">Exporta baza de date</div>
              </div>
            </div>
            <Button onClick={doBackup} disabled={backing} variant="primary" className="w-full">
              {backing ? "Se genereaza..." : "Descarca backup SQL"}
            </Button>
          </div>

          <div className="card p-5 agri-pattern">
            <div className="flex items-center gap-3 mb-4">
              <span className="icon-chip w-10 h-10 rounded-2xl">
                <Upload size={18} className="text-warn" />
              </span>
              <div>
                <div className="font-bold">Restore</div>
                <div className="muted text-xs">Restaureaza din backup</div>
              </div>
            </div>
            <Button onClick={() => setRestoreOpen(true)} variant="ghost" className="w-full border border-warn/30 text-warn hover:bg-warn/10">
              <FileUp size={14} className="mr-2" />
              Restaureaza backup
            </Button>
          </div>

          {/* System Info */}
          <div className="card p-5 agri-pattern">
            <div className="font-bold mb-3">Info sistem</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="muted">Versiune</span>
                <span>1.0.0 (Licenta)</span>
              </div>
              <div className="flex justify-between">
                <span className="muted">Baza date</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="muted">API Status</span>
                <Badge variant="success">Online</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calibration Modal */}
      <AnimatePresence>
        {calOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !calSaving) setCalOpen(false);
            }}
          >
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-lg font-extrabold">Calibrare senzor</div>
                  <div className="muted text-sm">{calSensor?.sensorCode}</div>
                </div>
                <Button variant="ghost" onClick={() => setCalOpen(false)} disabled={calSaving}>
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Thermometer size={14} className="text-orange-500" />
                      Offset temp (°C)
                    </Label>
                    <Input className="mt-1" value={calTemp} onChange={(e) => setCalTemp(e.target.value)} disabled={calSaving} type="number" step="0.1" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Thermometer size={14} className="text-blue-500" />
                      Offset umiditate (%)
                    </Label>
                    <Input className="mt-1" value={calHum} onChange={(e) => setCalHum(e.target.value)} disabled={calSaving} type="number" step="0.5" />
                  </div>
                </div>

                <div className="text-xs muted p-3 card-soft">
                  Offset-ul se adauga la citirile brute ale senzorului. Ex: offset -0.5°C inseamna ca temperatura afisata va fi cu 0.5°C mai mica.
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1" onClick={() => setCalOpen(false)} disabled={calSaving}>
                    Renunta
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={submitCalibration} disabled={calSaving}>
                    {calSaving ? "Se salveaza..." : "Salveaza"}
                  </Button>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Restore Modal */}
      <AnimatePresence>
        {restoreOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setRestoreOpen(false);
            }}
          >
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-lg font-extrabold text-warn">Restaurare backup</div>
                  <div className="muted text-sm">Operatiune avansata</div>
                </div>
                <Button variant="ghost" onClick={() => setRestoreOpen(false)}>
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-warn/10 border border-warn/30 rounded-xl">
                  <div className="font-bold text-warn mb-2">Atentie!</div>
                  <div className="text-sm">
                    Restaurarea unui backup va inlocui TOATE datele curente. Aceasta operatiune este ireversibila.
                  </div>
                </div>

                <div className="text-sm muted">
                  Pentru a restaura un backup SQL:
                </div>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Opreste serverul backend</li>
                  <li>Conecteaza-te la PostgreSQL</li>
                  <li>Ruleaza: <code className="bg-muted/50 px-1 rounded">psql -U user -d agrione &lt; backup.sql</code></li>
                  <li>Reporneste serverul</li>
                </ol>

                <div className="text-xs muted">
                  Din motive de securitate, restaurarea automata din browser nu este disponibila. Contacteaza administratorul de sistem pentru asistenta.
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setRestoreOpen(false)}>
                  Am inteles
                </Button>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
