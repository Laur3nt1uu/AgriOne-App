import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/endpoints";
import { authStore } from "../../auth/auth.store";
import { toastError } from "../../utils/toast";
import { Button } from "../../ui/button";
import AuthVideoLayout from "./AuthVideoLayout";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from;
  const redirectTo =
    typeof from === "string"
      ? from
      : from?.pathname
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api.auth.login({ email, password });

      // acceptă orice format: {token,user} sau {accessToken,user} etc.
      const token = data.token || data.accessToken || data.jwt || data?.data?.token;
      const user = data.user || data.profile || data?.data?.user || { email };

      if (!token) throw new Error("Login response missing token.");

      authStore.setAuth({ token, user });
      nav(redirectTo, { replace: true });
    } catch (e2) {
      toastError(e2, "Autentificare eșuată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthVideoLayout
      title="Bine ai revenit"
      subtitle="Autentifică-te în AgriOne"
      footer={
        <div className="space-y-2 text-sm muted">
          <div>
            <Link className="text-[hsl(var(--primary))] hover:opacity-90 font-semibold" to="/forgot-password">
              Ai uitat parola?
            </Link>
          </div>
          <div>
            Nu ai cont?{" "}
            <Link className="text-[hsl(var(--primary))] hover:opacity-90 font-semibold" to="/register">
              Creează cont
            </Link>
          </div>
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

        <Button type="submit" disabled={busy} variant="primary" className="rounded-2xl py-3">
          {busy ? "Se autentifică..." : "Autentificare"}
        </Button>
      </form>
    </AuthVideoLayout>
  );
}