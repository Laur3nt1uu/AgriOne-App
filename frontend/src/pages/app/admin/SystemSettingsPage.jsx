import { useEffect, useState } from "react";
import { api } from "../../../api/endpoints";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Cpu, Database, Download, Leaf, RefreshCcw, Thermometer, Users } from "lucide-react";
import { useConfirm } from "../../../components/confirm/ConfirmProvider";

function isOnline(lastAt) {
  if (!lastAt) return false;
  const t = new Date(lastAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 15 * 60 * 1000;
}

export default function SystemSettingsPage() {
  const confirm = useConfirm();
  const [stats, setStats] = useState(null);
  const [backing, setBacking] = useState(false);

  const [sensors, setSensors] = useState([]);
  const [sensorsBusy, setSensorsBusy] = useState(true);

  const [lands, setLands] = useState([]);

  const [pairSensorCode, setPairSensorCode] = useState("");
  const [pairLandId, setPairLandId] = useState("");
  const [pairing, setPairing] = useState(false);

  const [calOpen, setCalOpen] = useState(false);
  const [calSaving, setCalSaving] = useState(false);
  const [calSensor, setCalSensor] = useState(null);
  const [calTemp, setCalTemp] = useState("0");
  const [calHum, setCalHum] = useState("0");

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
    } catch (e) {
      toastError(e, "Nu pot încărca datele de sistem.");
      setSensors([]);
      setLands([]);
    } finally {
      setSensorsBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

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
      toastSuccess("Calibrarea a fost salvată.");
      setCalOpen(false);
      setCalSensor(null);
      await load();
    } catch (e) {
      toastError(e, "Nu pot salva calibrarea.");
    } finally {
      setCalSaving(false);
    }
  }

  async function unpair(sensor) {
    const code = sensor?.sensorCode;
    if (!code) return;
    const ok = await confirm({
      title: "Dezasociere senzor",
      message: `Dezasociezi senzorul ${code} de pe teren?`,
      confirmText: "Dezasociază",
      cancelText: "Renunță",
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
    if (!landId) return toastError(null, "Selectează un teren.");

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
      title: "Backup bază de date",
      message: "Faci backup la baza de date?",
      confirmText: "Generează",
      cancelText: "Renunță",
      destructive: false,
    });
    if (!ok) return;
    setBacking(true);
    try {
      const blob = await api.admin.backup();
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/sql" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${new Date().toISOString()}.sql`;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toastSuccess("Backup descărcat cu succes!");
    } catch (e) {
      toastError(e, "Backup eșuat.");
    } finally {
      setBacking(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Setări sistem</div>
          <div className="muted text-sm">Configurări și statistici sistem</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={load} variant="ghost">
            <RefreshCcw size={16} /> Actualizează
          </Button>
          <span className="icon-chip hidden sm:inline-flex" title="Sistem">
            <Database size={20} className="text-muted-foreground" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 agri-pattern">
            <div className="flex items-center justify-between gap-3">
              <div className="muted text-sm">Total utilizatori</div>
              <span className="icon-chip w-10 h-10 rounded-2xl"><Users size={18} className="text-muted-foreground" /></span>
            </div>
            <div className="text-3xl font-extrabold mt-2">{stats?.totalUsers || 0}</div>
          </div>
          <div className="card p-5 agri-pattern">
            <div className="flex items-center justify-between gap-3">
              <div className="muted text-sm">Total terenuri</div>
              <span className="icon-chip w-10 h-10 rounded-2xl"><Leaf size={18} className="text-muted-foreground" /></span>
            </div>
            <div className="text-3xl font-extrabold mt-2">{stats?.totalLands || 0}</div>
          </div>
          <div className="card p-5 agri-pattern">
            <div className="flex items-center justify-between gap-3">
              <div className="muted text-sm">Total senzori</div>
              <span className="icon-chip w-10 h-10 rounded-2xl"><Cpu size={18} className="text-muted-foreground" /></span>
            </div>
            <div className="text-3xl font-extrabold mt-2">{stats?.totalSensors || 0}</div>
          </div>
          </div>

          <div className="card p-5 agri-pattern">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Senzori</div>
                <div className="muted text-sm mt-1">Listă globală (admin) • calibrare • dezasociere</div>
              </div>
              <Button onClick={load} variant="ghost" disabled={sensorsBusy}>Actualizează</Button>
            </div>

            <div className="mt-4 card-soft p-4">
              <div className="text-sm font-bold">Asociere (pair)</div>
              <div className="muted text-sm mt-1">Leagă un senzor existent de un teren.</div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pairSensor">Cod senzor</Label>
                  <Input
                    id="pairSensor"
                    placeholder="ex: AGRI-SENSOR-001"
                    value={pairSensorCode}
                    onChange={(e) => setPairSensorCode(e.target.value)}
                    disabled={sensorsBusy || pairing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pairLand">Teren</Label>
                  <select
                    id="pairLand"
                    className="flex h-11 w-full rounded-xl border border-input/15 bg-[rgb(var(--input-background)/1)] px-4 py-3 text-sm text-foreground outline-none focus:border-ring/40 focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                    value={pairLandId}
                    onChange={(e) => setPairLandId(e.target.value)}
                    disabled={sensorsBusy || pairing || !lands.length}
                  >
                    <option value="">{lands.length ? "Selectează teren" : "Nu există terenuri"}</option>
                    {lands.slice(0, 200).map((l) => (
                      <option key={l.id} value={l.id}>
                        {(() => {
                          const owner = l?.owner;
                          const ownerLabel = owner?.username || (owner?.email ? String(owner.email).split("@")[0] : "") || owner?.email || "";
                          return ownerLabel ? `${ownerLabel} • ` : "";
                        })()}
                        {l.name}
                      </option>
                    ))}
                  </select>
                  {lands.length > 200 ? (
                    <div className="muted text-xs">Se afișează primele 200 terenuri.</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex gap-2 justify-end">
                <Button variant="primary" onClick={submitPair} disabled={sensorsBusy || pairing}>
                  {pairing ? "Se asociază..." : "Asociază"}
                </Button>
              </div>
            </div>

            {sensorsBusy ? (
              <div className="mt-4 muted">Se încarcă…</div>
            ) : sensors?.length ? (
              <div className="mt-4 space-y-3">
                {sensors.slice(0, 50).map((s) => {
                  const online = isOnline(s.lastReadingAt);
                  return (
                    <div key={s.id || s.sensorCode} className="card-soft p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold truncate">{s.sensorCode}</div>
                          <div className="muted text-sm mt-1 truncate">
                            {s?.owner ? (() => {
                              const owner = s.owner;
                              const ownerLabel = owner?.username || (owner?.email ? String(owner.email).split("@")[0] : "") || owner?.email || "";
                              return ownerLabel ? `Owner: ${ownerLabel}` : "Owner: —";
                            })() : "Owner: —"}
                            {s?.land?.name ? ` • Teren: ${s.land.name}` : " • Teren: Neasociat"}
                          </div>

                          <div className="mt-2 flex gap-2 flex-wrap">
                            <Badge>
                              <span className={`dot ${online ? "dot-online" : "dot-offline"}`} />
                              {online ? "Online" : "Offline"}
                            </Badge>
                            <Badge>Temp offset: {Number(s.calibrationTempOffsetC ?? 0).toFixed(2)}°C</Badge>
                            <Badge>Hum offset: {Number(s.calibrationHumidityOffsetPct ?? 0).toFixed(1)}%</Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-end">
                          <Button variant="ghost" onClick={() => openCalibrate(s)} disabled={calSaving}>
                            <Thermometer size={16} /> Calibrează
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => unpair(s)}
                            disabled={!s.landId}
                            className="border border-destructive/25 text-destructive hover:bg-destructive/10"
                            title={!s.landId ? "Senzorul nu e asociat" : "Dezasociază de pe teren"}
                          >
                            Dezasociază
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {sensors.length > 50 ? (
                  <div className="muted text-xs">Se afișează primele 50. (Pentru licență e suficient; dacă vrei, facem paginare.)</div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 muted">Nu există senzori.</div>
            )}
          </div>
        </div>

        <div className="card p-5 space-y-4 agri-pattern">
          <div className="flex items-center justify-between gap-3">
            <div className="font-bold text-lg">Baza de date</div>
            <span className="icon-chip w-10 h-10 rounded-2xl" title="Backup">
              <Download size={18} className="text-muted-foreground" />
            </span>
          </div>
          <div className="muted text-sm">Exportă un backup SQL pentru siguranță.</div>
          <div className="flex gap-3">
            <Button onClick={doBackup} disabled={backing} variant="primary">
              {backing ? "Se generează..." : "Descarcă backup"}
            </Button>
          </div>
        </div>
      </div>

      {calOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !calSaving) setCalOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Calibrare senzor</div>
                <div className="muted text-sm mt-1">{calSensor?.sensorCode || "—"}</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setCalOpen(false)} disabled={calSaving} title="Închide">
                ✕
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calTemp">Offset temperatură (°C)</Label>
                <Input id="calTemp" value={calTemp} onChange={(e) => setCalTemp(e.target.value)} disabled={calSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calHum">Offset umiditate (%)</Label>
                <Input id="calHum" value={calHum} onChange={(e) => setCalHum(e.target.value)} disabled={calSaving} />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setCalOpen(false)} disabled={calSaving}>
                  Renunță
                </Button>
                <Button type="button" variant="primary" onClick={submitCalibration} disabled={calSaving}>
                  {calSaving ? "Se salvează..." : "Salvează"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
