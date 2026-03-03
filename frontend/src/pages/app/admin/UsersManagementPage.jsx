import { useEffect, useState } from "react";
import { api } from "../../../api/endpoints";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { RefreshCcw, Users } from "lucide-react";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(true);

  async function load() {
    setBusy(true);
    try {
      const data = await api.admin.listUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (e) {
      toastError(e, "Nu pot încărca utilizatorii.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function deleteUser(id) {
    if (!confirm("Ștergi acest utilizator?")) return;
    try {
      await api.admin.deleteUser(id);
      toastSuccess("Utilizator șters.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot șterge utilizatorul.");
    }
  }

  async function toggleRole(user) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Schimbi rolul la ${newRole}?`)) return;
    try {
      await api.admin.updateUser(user.id, { role: newRole });
      toastSuccess("Rol actualizat.");
      await load();
    } catch (e) {
      toastError(e, "Nu pot schimba rolul.");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="page-title">Administrare utilizatori</div>
          <div className="muted text-sm">Gestionează utilizatorii platformei</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={load} variant="ghost">
            <RefreshCcw size={16} /> Actualizează
          </Button>
          <span className="icon-chip hidden sm:inline-flex" title="Utilizatori">
            <Users size={20} className="text-muted-foreground" />
          </span>
        </div>
      </div>

      {busy && <div className="card p-6 muted">Se încarcă...</div>}

      {!busy && users.length === 0 && (
        <div className="card p-6 muted text-center">Nu există utilizatori.</div>
      )}

      {!busy && users.length > 0 && (
        <div className="card overflow-hidden agri-pattern">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Rol</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Creat</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/10 hover:bg-muted/30">
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.role === "ADMIN" ? "success" : "default"}>{u.role}</Badge>
                    </td>
                    <td className="p-4 muted text-sm">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button onClick={() => toggleRole(u)} variant="ghost" className="text-xs">
                          Schimbă rol
                        </Button>
                        <Button onClick={() => deleteUser(u.id)} variant="ghost" className="text-xs text-destructive">
                          Șterge
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
