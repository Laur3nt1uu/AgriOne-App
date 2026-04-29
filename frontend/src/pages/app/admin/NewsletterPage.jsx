import { useEffect, useState } from "react";
import { api } from "../../../api/endpoints";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Mail, Send, Users, RefreshCcw, Loader2 } from "lucide-react";
import { useConfirm } from "../../../components/confirm/ConfirmProvider";
import { motion as Motion } from "framer-motion";

export default function NewsletterPage() {
  const confirm = useConfirm();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [campRes, statsRes] = await Promise.all([
        api.newsletter.getCampaigns("ro"),
        api.newsletter.getStats(),
      ]);
      setCampaigns(campRes.campaigns || []);
      setStats(statsRes.stats || null);
    } catch (e) {
      toastError(e, "Nu pot încărca datele newsletter.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSend(campaign) {
    const ok = await confirm({
      title: "Trimite newsletter",
      message: `Trimiți "${campaign.name}" către toți cei ${stats?.subscribed || 0} abonați activi?`,
      confirmText: "Trimite",
      cancelText: "Renunță",
      destructive: false,
    });
    if (!ok) return;

    setSending(campaign.key);
    try {
      const result = await api.newsletter.sendCampaign(campaign.key);
      toastSuccess(`Newsletter trimis! ${result.sent} emailuri trimise, ${result.failed} eșuate.`);
    } catch (e) {
      toastError(e, "Nu am putut trimite newsletterul.");
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Newsletter</div>
          <div className="muted text-sm">Trimite campanii email către abonați</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={load} variant="ghost" disabled={loading}>
            <RefreshCcw size={16} /> Actualizează
          </Button>
          <span className="icon-chip hidden sm:inline-flex" title="Newsletter">
            <Mail size={20} className="text-muted-foreground" />
          </span>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4 text-center">
            <div className="text-2xl font-bold">{stats.subscribed}</div>
            <div className="text-sm muted flex items-center justify-center gap-1"><Users size={14} /> Abonați activi</div>
          </Motion.div>
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-4 text-center">
            <div className="text-2xl font-bold">{stats.unsubscribed}</div>
            <div className="text-sm muted">Dezabonați</div>
          </Motion.div>
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm muted">Total înregistrări</div>
          </Motion.div>
        </div>
      )}

      {/* Campaign templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Campanii disponibile</h2>
        {loading ? (
          <div className="flex items-center gap-2 muted py-8 justify-center">
            <Loader2 size={18} className="animate-spin" /> Se încarcă...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center muted py-8">Nu sunt campanii disponibile.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c, i) => (
              <Motion.div
                key={c.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="card p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm muted">{c.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    Email
                  </Badge>
                </div>
                <div className="text-xs muted border-t pt-2">
                  <span className="font-medium">Subiect:</span> {c.subject}
                </div>
                <Button
                  onClick={() => handleSend(c)}
                  disabled={sending !== null || !stats?.subscribed}
                  className="w-full mt-1"
                  size="sm"
                >
                  {sending === c.key ? (
                    <><Loader2 size={14} className="animate-spin mr-1" /> Se trimite...</>
                  ) : (
                    <><Send size={14} className="mr-1" /> Trimite către {stats?.subscribed || 0} abonați</>
                  )}
                </Button>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
