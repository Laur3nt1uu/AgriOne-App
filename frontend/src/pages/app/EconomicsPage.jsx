import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowDownRight, ArrowUpRight, ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useConfirm } from "../../components/confirm/ConfirmProvider";

function money(x) {
  const n = Number(x || 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "RON" });
}

export default function EconomicsPage() {
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  const confirm = useConfirm();

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0, count: 0 });
  const [busy, setBusy] = useState(true);

  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  async function load() {
    setBusy(true);
    try {
      const s = await api.economics.summary().catch(() => null);
      if (s) {
        setSummary({
          revenue: Number(s.revenue || 0),
          expenses: Number((s.expenses ?? s.expense) || 0),
          profit: Number(s.profit || 0),
          count: Number(s.count || 0),
        });
      }

      const data = await api.economics.list();
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setItems(arr);
    } catch (e) {
      toastError(e, "Nu pot încărca economia.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  const calc = useMemo(() => {
    const revenue = items.filter(x => x.type === "REVENUE").reduce((a,b)=>a+Number(b.amount||0),0);
    const expenses = items.filter(x => x.type === "EXPENSE").reduce((a,b)=>a+Number(b.amount||0),0);
    return { revenue, expenses, profit: revenue - expenses };
  }, [items]);

  async function onAdd() {
    const a = Number(amount);
    if (!desc.trim()) { toast.error("Completează descrierea."); return; }
    if (!a || a <= 0) { toast.error("Introdu o sumă validă."); return; }

    try {
      await api.economics.create({
        type,
        amount: a,
        description: desc.trim(),
        category: "General",
        occurredAt: new Date().toISOString(),
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

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Economie</div>
          <div className="muted text-sm">
            {isAdmin ? "Tranzacții globale (toți utilizatorii)" : "Tranzacțiile tale"} • venituri/cheltuieli • profit
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={load} variant="ghost">Actualizează</Button>
          <span className="icon-chip hidden sm:inline-flex" title="Economie">
            <Wallet size={20} className="text-muted-foreground" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="card p-5 agri-pattern">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold">Tranzacții</div>
              <div className="muted text-sm mt-1">Istoric venituri/cheltuieli</div>
            </div>
            <Badge>Total: {items.length}</Badge>
          </div>

          {busy ? (
            <div className="muted mt-3">Se încarcă…</div>
          ) : items.length === 0 ? (
            <div className="muted mt-3">Nu există tranzacții încă.</div>
          ) : (
            <div className="mt-4 space-y-2 max-h-[620px] overflow-auto">
              {items.map((t) => (
                <div key={t.id} className="list-row flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{t.description}</div>
                    <div className="muted text-xs">
                      {new Date(t.occurredAt || t.createdAt || t.created_at || Date.now()).toLocaleString()}
                      {isAdmin ? (
                        <>
                          {t?.owner ? (() => {
                            const owner = t.owner;
                            const ownerLabel = owner?.username || (owner?.email ? String(owner.email).split("@")[0] : "") || owner?.email || "";
                            return ownerLabel ? ` • ${ownerLabel}` : "";
                          })() : ""}
                          {t?.land?.name ? ` • ${t.land.name}` : ""}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.type === "REVENUE" ? "success" : "danger"}>
                      {t.type} • {money(t.amount)}
                    </Badge>
                    <span className="icon-chip hidden sm:inline-flex" title={t.type === "REVENUE" ? "Venit" : "Cheltuială"}>
                      {t.type === "REVENUE" ? (
                        <ArrowUpRight size={18} className="text-muted-foreground" />
                      ) : (
                        <ArrowDownRight size={18} className="text-muted-foreground" />
                      )}
                    </span>
                    <Button variant="ghost" onClick={() => onDelete(t.id)}>Șterge</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5 agri-pattern">
            <div className="text-sm font-bold">Rezumat</div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="card-soft p-4 agri-pattern">
                <div className="flex items-center justify-between gap-3">
                  <div className="muted text-xs">Venituri</div>
                  <span className="icon-chip w-10 h-10 rounded-2xl"><TrendingUp size={18} className="text-muted-foreground" /></span>
                </div>
                <div className="text-2xl font-extrabold mt-2">{money(s.revenue)}</div>
              </div>
              <div className="card-soft p-4 agri-pattern">
                <div className="flex items-center justify-between gap-3">
                  <div className="muted text-xs">Cheltuieli</div>
                  <span className="icon-chip w-10 h-10 rounded-2xl"><TrendingDown size={18} className="text-muted-foreground" /></span>
                </div>
                <div className="text-2xl font-extrabold mt-2">{money(s.expenses)}</div>
              </div>
              <div className="card-soft p-4 agri-pattern">
                <div className="flex items-center justify-between gap-3">
                  <div className="muted text-xs">Profit</div>
                  <span className="icon-chip w-10 h-10 rounded-2xl"><ReceiptText size={18} className="text-muted-foreground" /></span>
                </div>
                <div className="text-2xl font-extrabold mt-2">{money(s.profit)}</div>
                <div className="muted text-xs mt-2">
                  {isAdmin ? `Total tranzacții: ${Number(summary.count || items.length)}` : "pregătit pentru demo (licență)"}
                </div>
              </div>
            </div>
          </div>

          {isAdmin ? (
            <div className="card p-5 space-y-3 agri-pattern">
              <div className="text-sm font-bold">Mod admin</div>
              <div className="muted text-sm">
                Aici vezi economia globală. Adăugarea tranzacțiilor rămâne o acțiune din conturile utilizatorilor (per fermă/teren).
              </div>
            </div>
          ) : (
            <div className="card p-5 space-y-4 agri-pattern">
              <div className="text-sm font-bold">Adaugă tranzacție</div>

              <div className="flex gap-2">
                <Button
                  variant="tab"
                  className={`flex-1 ${type === "EXPENSE" ? "is-active" : ""}`}
                  onClick={() => setType("EXPENSE")}
                >
                  Cheltuială
                </Button>
                <Button
                  variant="tab"
                  className={`flex-1 ${type === "REVENUE" ? "is-active" : ""}`}
                  onClick={() => setType("REVENUE")}
                >
                  Venit
                </Button>
              </div>

              <div>
                <div className="muted text-xs mb-1">Descriere</div>
                <input className="input" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="ex: Motorină, Semințe, Muncă..." />
              </div>

              <div>
                <div className="muted text-xs mb-1">Sumă (RON)</div>
                <input className="input" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="ex: 250" />
              </div>

              <Button onClick={onAdd} variant="primary" fullWidth>
                Adaugă
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}