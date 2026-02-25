import { useEffect, useState } from "react";
import { api, pick } from "../../api/endpoints";
import { toastError } from "../../utils/toast";
import { Badge } from "../../ui/badge";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  async function load() {
    try {
      const data = await api.alerts.list();
      setAlerts(Array.isArray(data) ? data : (data.items || data.alerts || []));
    } catch (e) {
      toastError(e, "Nu pot încărca alertele.");
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);


  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="page-title">Alerte</div>
            <div className="muted text-sm">Generate din reguli / declanșări (backend)</div>
          </div>
          <Badge as="div">Total: {alerts.length}</Badge>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((a) => {
            const id = pick(a, ["id","uuid"], "");
            const sev = (pick(a, ["severity","level"], "WARNING") || "WARNING").toUpperCase();
            const title = pick(a, ["title","message"], "Alert");
            const landName = pick(a, ["landName","land"], "");
            const isAck = !!pick(a, ["acknowledged","isAcknowledged"], false);

            const border = sev === "CRITICAL"
              ? "border-[hsl(var(--danger)/0.25)]"
              : "border-[hsl(var(--warn)/0.25)]";
            const badgeVariant = sev === "CRITICAL" ? "danger" : "warn";

            return (
              <div key={id || title} className={`card-soft p-4 border ${border} card-hover`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={badgeVariant}>{sev}</Badge>
                      {landName ? <Badge>{landName}</Badge> : null}
                      {isAck ? <Badge>Confirmată</Badge> : null}
                    </div>
                    <div className="mt-2 font-extrabold truncate">{title}</div>
                  </div>
                  <div className="text-xs muted whitespace-nowrap">
                    {pick(a, ["createdAt","ts"], "") ? new Date(pick(a, ["createdAt","ts"])).toLocaleString() : ""}
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