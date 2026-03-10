import { useEffect, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { BellRing, CheckCircle2, ShieldAlert, TriangleAlert } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useConfirm } from "../../components/confirm/ConfirmProvider";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  const confirm = useConfirm();

  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  async function load() {
    try {
      const data = await api.alerts.list();
      setAlerts(Array.isArray(data) ? data : (data.items || data.alerts || []));
    } catch (e) {
      toastError(e, "Nu pot încărca alertele.");
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
      await load();
    } catch (e) {
      toastError(e, "Nu pot șterge alerta.");
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);


  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-6 agri-pattern">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="page-title">Alerte</div>
            <div className="muted text-sm">
              {isAdmin ? "Alerte globale (toți utilizatorii)" : "Alertele tale"} • generate din reguli / declanșări
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge as="div">Total: {alerts.length}</Badge>
            <Button onClick={load} variant="ghost">Actualizează</Button>
            <span className="icon-chip hidden sm:inline-flex" title="Alerte">
              <BellRing size={20} className="text-muted-foreground" />
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((a) => {
            const id = pick(a, ["id","uuid"], "");
            const sev = (pick(a, ["severity","level"], "WARNING") || "WARNING").toUpperCase();
            const title = pick(a, ["title","message"], "Alert");
            const landName = pick(a, ["landName"], "") || a?.land?.name || a?.Land?.name || "";
            const ownerName = a?.owner?.username || a?.owner?.email || a?.User?.username || a?.User?.email || "";
            const isAck = !!pick(a, ["acknowledged","isAcknowledged"], false);

            const border = sev === "CRITICAL"
              ? "border-destructive/25"
              : "border-warn/25";
            const badgeVariant = sev === "CRITICAL" ? "danger" : "warn";
            const SevIcon = sev === "CRITICAL" ? ShieldAlert : TriangleAlert;
            const iconColor = sev === "CRITICAL" ? "text-destructive" : "text-warn";

            return (
              <div key={id || title} className={`card-soft p-4 border ${border} card-hover agri-pattern`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={badgeVariant}>{sev}</Badge>
                      {landName ? <Badge>{landName}</Badge> : null}
                      {isAdmin && ownerName ? <Badge>{ownerName}</Badge> : null}
                      {isAck ? (
                        <Badge>
                          <CheckCircle2 size={14} className="text-muted-foreground" /> Confirmată
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 font-extrabold truncate">{title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      className="text-xs text-destructive"
                      onClick={() => removeAlert(a)}
                      title="Șterge alertă"
                    >
                      Șterge
                    </Button>
                    <div className="text-xs muted whitespace-nowrap">
                      {pick(a, ["createdAt","ts"], "") ? new Date(pick(a, ["createdAt","ts"])).toLocaleString() : ""}
                    </div>
                    <span className="icon-chip hidden sm:inline-flex" title={sev}>
                      <SevIcon size={18} className={iconColor} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {!alerts.length && <div className="muted">Nu există alerte.</div>}
        </div>
      </div>
    </div>
  );
}