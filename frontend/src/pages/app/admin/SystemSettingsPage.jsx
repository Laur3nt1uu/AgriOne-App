import { useEffect, useState } from "react";
import { api } from "../../../api/endpoints";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Button } from "../../../ui/button";
import { Cpu, Database, Download, Leaf, RefreshCcw, Users } from "lucide-react";

export default function SystemSettingsPage() {
  const [stats, setStats] = useState(null);
  const [backing, setBacking] = useState(false);

  async function load() {
    try {
      const data = await api.admin.getStats();
      setStats(data);
    } catch (e) {
      toastError(e, "Nu pot încărca statisticile.");
    }
  }

  useEffect(() => { load(); }, []);

  async function doBackup() {
    if (!confirm("Faci backup la baza de date?")) return;
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
    </div>
  );
}
