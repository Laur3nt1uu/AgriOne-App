import { useState } from "react";
import { authStore } from "../../auth/auth.store";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export default function ProfilePage() {
  const nav = useNavigate();
  const [user] = useState(authStore.getUser());

  const displayName = user?.name || (user?.role === "ADMIN" ? "Administrator" : "Utilizator");

  function logout() {
    authStore.logout();
    nav("/login", { replace: true });
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="card p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary)/0.10)] border border-[hsl(var(--primary)/0.18)] flex items-center justify-center">
            <span className="text-slate-900 font-extrabold text-2xl">
              {(user?.email || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{displayName}</div>
            <div className="muted">{user?.email || "—"}</div>
            {user?.role && (
              <Badge className="inline-block mt-2" variant={user.role === "ADMIN" ? "success" : "default"}>
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-xl font-bold">Preferințe</div>
        <div className="mt-4 card-soft p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">Temă luminoasă</div>
            <div className="text-sm muted">Activată permanent</div>
          </div>
          <Badge as="div" variant="success">ON</Badge>
        </div>
      </div>

      <div className="card p-5">
        <Button onClick={logout} variant="ghost" fullWidth className="rounded-2xl py-3">
          Deconectare
        </Button>
      </div>
    </div>
  );
}