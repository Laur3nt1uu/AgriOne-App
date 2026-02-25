import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import AuthVideoLayout from "./AuthVideoLayout";

export default function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.auth.register({ email, password, role });
      toastSuccess("Cont creat. Te poți autentifica acum.");
      nav("/login", { replace: true });
    } catch (e2) {
      toastError(e2, "Înregistrare eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthVideoLayout
      title="Creează cont"
      subtitle="AgriOne"
      footer={
        <div className="text-sm muted">
          Ai deja un cont?{" "}
          <Link className="text-[hsl(var(--primary))] hover:opacity-90 font-semibold" to="/login">
            Autentificare
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="text-xs muted mb-1">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="text-xs muted mb-1">Parolă</div>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <div className="text-xs muted mb-1">Rol</div>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">Utilizator</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <Button type="submit" disabled={busy} variant="primary" className="rounded-2xl py-3">
          {busy ? "Se creează..." : "Creează cont"}
        </Button>
      </form>
    </AuthVideoLayout>
  );
}