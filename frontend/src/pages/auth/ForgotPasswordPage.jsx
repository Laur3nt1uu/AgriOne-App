import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import AuthVideoLayout from "./AuthVideoLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(false);
    setBusy(true);
    try {
      await api.auth.forgotPassword({ email });
      setOk(true);
      toastSuccess("Dacă emailul există, am trimis un link de resetare.");
    } catch (e2) {
      toastError(e2, "Cerere eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthVideoLayout
      title="Ai uitat parola"
      subtitle="Îți trimitem un link de resetare"
      footer={
        <div className="text-sm muted">
          Înapoi la{" "}
          <Link className="text-[hsl(var(--primary))] hover:opacity-90 font-semibold" to="/login">
            autentificare
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="text-xs muted mb-1">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {ok && (
          <div className="card-soft p-3 border border-[hsl(var(--primary)/0.18)] text-sm">
            Dacă emailul există, a fost trimis un link de resetare.
          </div>
        )}

        <Button type="submit" disabled={busy} variant="primary" className="rounded-2xl py-3">
          {busy ? "Se trimite..." : "Trimite link de resetare"}
        </Button>
      </form>
    </AuthVideoLayout>
  );
}
