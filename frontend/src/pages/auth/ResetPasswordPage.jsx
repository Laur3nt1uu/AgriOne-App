import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import AuthVideoLayout from "./AuthVideoLayout";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(false);

    if (!token) {
      toastError(null, "Link invalid: lipsește token-ul de resetare.");
      return;
    }

    setBusy(true);
    try {
      await api.auth.resetPassword({ token, password });
      setOk(true);
      toastSuccess("Parola a fost actualizată.");
      setTimeout(() => nav("/login"), 900);
    } catch (e2) {
      toastError(e2, "Resetare eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthVideoLayout
      title="Resetează parola"
      subtitle="Setează o parolă nouă"
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
          <div className="text-xs muted mb-1">Parolă nouă</div>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {ok && (
          <div className="card-soft p-3 border border-[hsl(var(--primary)/0.18)] text-sm">
            Parola a fost actualizată. Redirecționare către autentificare...
          </div>
        )}

        <Button type="submit" disabled={busy} variant="primary" className="rounded-2xl py-3">
          {busy ? "Se actualizează..." : "Actualizează parola"}
        </Button>
      </form>
    </AuthVideoLayout>
  );
}
