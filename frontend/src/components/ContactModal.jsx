import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Send, Building2, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authStore } from "../auth/auth.store";

export default function ContactModal({ open, onClose }) {
  const user = authStore.getUser();
  const [form, setForm] = useState({
    name: user?.name || user?.username || "",
    email: user?.email || "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    // Simulate sending — no real backend endpoint needed for demo
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setSent(false);
      setForm((prev) => ({ ...prev, message: "" }));
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !sending && handleClose()}
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="card p-0 max-w-lg w-full relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Contactează-ne
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Planul Enterprise — personalizat pentru tine
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={sending}
                className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6">
              {sent ? (
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    Mesaj trimis!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Te vom contacta în cel mai scurt timp posibil.
                  </p>
                  <Button variant="primary" onClick={handleClose}>
                    Închide
                  </Button>
                </Motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Nume
                    </label>
                    <Input
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Numele tău sau al companiei"
                      required
                      disabled={sending}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="email@exemplu.ro"
                      required
                      disabled={sending}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Mesaj
                    </label>
                    <textarea
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder="Spune-ne mai multe despre ferma ta, suprafața, nevoile tale..."
                      required
                      disabled={sending}
                      rows={4}
                      className="flex w-full min-w-0 rounded-xl border border-input/15 backdrop-blur-xl bg-card/40 px-4 py-3 text-sm text-foreground font-light placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-ring/40 focus:ring-2 focus:ring-ring/20 hover:border-primary/40 hover:bg-card/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button
                      variant="ghost"
                      onClick={handleClose}
                      disabled={sending}
                    >
                      Anulează
                    </Button>
                    <Button type="submit" variant="primary" disabled={sending}>
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <Motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Se trimite...
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Trimite mesajul
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
