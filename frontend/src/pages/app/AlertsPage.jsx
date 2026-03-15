import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { api, pick } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { AlertsSkeleton } from "../../ui/skeleton";
import { BellRing, CheckCircle2, Settings2, ShieldAlert, TriangleAlert, Calendar, Clock, Filter, X } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useConfirm } from "../../components/confirm/ConfirmProvider";
import AlertRulesModal from "../../components/alerts/AlertRulesModal";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [lands, setLands] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Timeline view state
  const [viewMode, setViewMode] = useState("list"); // list | timeline
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterLand, setFilterLand] = useState("ALL");

  const confirm = useConfirm();

  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  async function load() {
    try {
      const [alertsData, landsData] = await Promise.all([
        api.alerts.list(),
        api.lands.list(),
      ]);
      setAlerts(Array.isArray(alertsData) ? alertsData : (alertsData.items || alertsData.alerts || []));
      setLands(Array.isArray(landsData) ? landsData : (landsData.items || []));
    } catch (e) {
      toastError(e, "Nu pot încărca alertele.");
    } finally {
      setInitialLoading(false);
    }
  }

  async function removeAlert(alert) {
    const id = pick(alert, ["id", "uuid"], "");
    if (!id) return;

    const ok = await confirm({
      title: "Ștergere alertă",
      message: "Ștergi această alertă?",
      confirmText: "Șterge",
      cancelText: "Renunță",
      destructive: true,
    });
    if (!ok) return;

    try {
      await api.alerts.remove(id);
      toastSuccess("Alerta a fost ștearsă.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot șterge alerta.");
    }
  }

  async function clearAllAlerts() {
    const ok = await confirm({
      title: "Șterge toate alertele",
      message: `Ești sigur că vrei să ștergi toate ${filteredAlerts.length} alertele?`,
      confirmText: "Șterge toate",
      cancelText: "Renunță",
      destructive: true,
    });
    if (!ok) return;

    try {
      for (const alert of filteredAlerts) {
        const id = pick(alert, ["id", "uuid"], "");
        if (id) await api.alerts.remove(id);
      }
      toastSuccess("Toate alertele au fost șterse.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot șterge alertele.");
    }
  }

  useEffect(() => { load(); }, []);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const sev = (pick(a, ["severity", "level"], "WARNING") || "WARNING").toUpperCase();
      const landId = a.landId || a.land?.id;

      if (filterSeverity !== "ALL" && sev !== filterSeverity) return false;
      if (filterLand !== "ALL" && landId !== filterLand) return false;

      return true;
    });
  }, [alerts, filterSeverity, filterLand]);

  // Group alerts by date for timeline view
  const alertsByDate = useMemo(() => {
    const groups = {};
    filteredAlerts.forEach(a => {
      const ts = pick(a, ["createdAt", "ts", "created_at"], "");
      const date = ts ? new Date(ts).toLocaleDateString("ro-RO") : "Necunoscut";
      if (!groups[date]) groups[date] = [];
      groups[date].push(a);
    });
    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[1][0]?.createdAt || a[1][0]?.ts || 0);
      const dateB = new Date(b[1][0]?.createdAt || b[1][0]?.ts || 0);
      return dateB - dateA;
    });
  }, [filteredAlerts]);

  // Stats
  const stats = useMemo(() => {
    const critical = alerts.filter(a => (pick(a, ["severity", "level"], "") || "").toUpperCase() === "CRITICAL").length;
    const warning = alerts.filter(a => (pick(a, ["severity", "level"], "") || "").toUpperCase() === "WARNING").length;
    const today = alerts.filter(a => {
      const ts = pick(a, ["createdAt", "ts", "created_at"], "");
      if (!ts) return false;
      const d = new Date(ts);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;
    return { critical, warning, today, total: alerts.length };
  }, [alerts]);

  if (initialLoading) {
    return <AlertsSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card p-6 agri-pattern">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="page-title">Alerte</div>
            <div className="muted text-sm">
              {isAdmin ? "Alerte globale (toți utilizatorii)" : "Alertele tale"} • generate din reguli / declanșări
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge as="div">Total: {alerts.length}</Badge>
            <Button onClick={load} variant="ghost" size="sm">Actualizează</Button>
            <Button onClick={() => setRulesOpen(true)} variant="ghost" size="sm" title="Configurează regulile de alerte">
              <Settings2 size={16} className="mr-1" />
              Reguli
            </Button>
            <span className="icon-chip hidden sm:inline-flex" title="Alerte">
              <BellRing size={20} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-4 text-center"
        >
          <div className="text-2xl font-extrabold text-destructive">{stats.critical}</div>
          <div className="muted text-xs mt-1">Critice</div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-soft p-4 text-center"
        >
          <div className="text-2xl font-extrabold text-warn">{stats.warning}</div>
          <div className="muted text-xs mt-1">Avertismente</div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft p-4 text-center"
        >
          <div className="text-2xl font-extrabold text-primary">{stats.today}</div>
          <div className="muted text-xs mt-1">Azi</div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-soft p-4 text-center"
        >
          <div className="text-2xl font-extrabold">{stats.total}</div>
          <div className="muted text-xs mt-1">Total</div>
        </Motion.div>
      </div>

      {/* Filters & View Toggle */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-muted-foreground" />
          <select
            className="input text-sm py-1.5 px-3"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="ALL">Toate severitățile</option>
            <option value="CRITICAL">Critice</option>
            <option value="WARNING">Avertismente</option>
          </select>
          <select
            className="input text-sm py-1.5 px-3"
            value={filterLand}
            onChange={(e) => setFilterLand(e.target.value)}
          >
            <option value="ALL">Toate terenurile</option>
            {lands.map(land => (
              <option key={land.id} value={land.id}>{land.name}</option>
            ))}
          </select>
          {filteredAlerts.length > 0 && filteredAlerts.length < alerts.length && (
            <Badge>{filteredAlerts.length} din {alerts.length}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="tab"
            size="sm"
            className={viewMode === "list" ? "is-active" : ""}
            onClick={() => setViewMode("list")}
          >
            Listă
          </Button>
          <Button
            variant="tab"
            size="sm"
            className={viewMode === "timeline" ? "is-active" : ""}
            onClick={() => setViewMode("timeline")}
          >
            <Calendar size={14} className="mr-1" />
            Timeline
          </Button>
          {filteredAlerts.length > 0 && (
            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearAllAlerts}>
              Șterge toate
            </Button>
          )}
        </div>
      </div>

      {/* Alerts Content */}
      <div className="card p-5 agri-pattern">
        {viewMode === "list" ? (
          // List View
          <div className="space-y-3">
            {filteredAlerts.map((a, index) => (
              <AlertCard key={pick(a, ["id", "uuid"], index)} alert={a} index={index} isAdmin={isAdmin} onRemove={removeAlert} />
            ))}
            {!filteredAlerts.length && (
              <div className="text-center py-8 muted">
                {alerts.length > 0 ? "Nu există alerte care să corespundă filtrelor." : "Nu există alerte."}
              </div>
            )}
          </div>
        ) : (
          // Timeline View
          <div className="space-y-6">
            {alertsByDate.map(([date, dateAlerts], groupIndex) => (
              <Motion.div
                key={date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="font-bold">{date}</div>
                  <Badge variant="outline">{dateAlerts.length} alerte</Badge>
                </div>
                <div className="ml-6 border-l-2 border-border/30 pl-4 space-y-3">
                  {dateAlerts.map((a, index) => (
                    <AlertCard
                      key={pick(a, ["id", "uuid"], index)}
                      alert={a}
                      index={index}
                      isAdmin={isAdmin}
                      onRemove={removeAlert}
                      compact
                    />
                  ))}
                </div>
              </Motion.div>
            ))}
            {!alertsByDate.length && (
              <div className="text-center py-8 muted">Nu există alerte.</div>
            )}
          </div>
        )}
      </div>

      {/* Alert Rules Modal */}
      <AlertRulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        lands={lands}
        onRulesSaved={load}
      />
    </div>
  );
}

function AlertCard({ alert: a, index, isAdmin, onRemove, compact = false }) {
  const _id = pick(a, ["id", "uuid"], "");
  const sev = (pick(a, ["severity", "level"], "WARNING") || "WARNING").toUpperCase();
  const title = pick(a, ["title", "message"], "Alert");
  const landName = pick(a, ["landName"], "") || a?.land?.name || a?.Land?.name || "";
  const ownerName = a?.owner?.name || a?.owner?.username || a?.owner?.email || a?.User?.name || a?.User?.username || a?.User?.email || "";
  const isAck = !!pick(a, ["acknowledged", "isAcknowledged"], false);
  const timestamp = pick(a, ["createdAt", "ts", "created_at"], "");

  const severityClasses = sev === "CRITICAL"
    ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
    : sev === "WARNING"
      ? "bg-gradient-to-br from-warn/10 to-warn/5 border-warn/30"
      : "border-border/25";
  const badgeVariant = sev === "CRITICAL" ? "danger" : "warn";
  const SevIcon = sev === "CRITICAL" ? ShieldAlert : TriangleAlert;
  const iconColor = sev === "CRITICAL" ? "text-destructive" : "text-warn";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`card-soft ${compact ? "p-3" : "p-4"} border ${severityClasses} card-hover agri-pattern relative overflow-hidden group cursor-pointer transition-all duration-300`}
      onMouseEnter={(e) => {
        if (sev === "CRITICAL") {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(220, 38, 38, 0.15)";
        } else if (sev === "WARNING") {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className={`flex ${compact ? "flex-col sm:flex-row" : ""} items-start justify-between gap-3`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={badgeVariant}>{sev}</Badge>
            {landName && <Badge>{landName}</Badge>}
            {isAdmin && ownerName && <Badge>{ownerName}</Badge>}
            {isAck && (
              <Badge>
                <CheckCircle2 size={14} className="text-muted-foreground" /> Confirmată
              </Badge>
            )}
          </div>
          <div className={`${compact ? "mt-1 text-sm" : "mt-2"} font-extrabold truncate`}>{title}</div>
        </div>
        <div className={`flex items-center gap-2 ${compact ? "w-full sm:w-auto justify-between sm:justify-end" : ""}`}>
          <div className="flex items-center gap-1 text-xs muted whitespace-nowrap">
            <Clock size={12} />
            {timestamp ? new Date(timestamp).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : ""}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(a);
            }}
            title="Șterge alertă"
          >
            <X size={14} />
          </Button>
          <span className="icon-chip hidden sm:inline-flex" title={sev}>
            <SevIcon size={16} className={iconColor} />
          </span>
        </div>
      </div>
    </Motion.div>
  );
}
