import { NavLink } from "react-router-dom";
import { authStore } from "../../auth/auth.store";
import logo from "../../assets/agrione.png";

const Item = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-2xl transition
       ${isActive ? "bg-[hsl(var(--primary)/0.10)] border border-[hsl(var(--primary)/0.20)]" : "hover:bg-slate-900/5 border border-transparent"}
      `
    }
  >
    <span className="text-slate-900/90 font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="hidden md:block w-[260px] p-4">
      <div className="glass rounded-2xl p-4 sticky top-4">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="AgriOne" className="w-10 h-10 rounded-2xl" />
          <div>
            <div className="font-extrabold text-lg leading-none">AgriOne</div>
            <div className="text-xs muted">Agricultură inteligentă</div>
          </div>
        </div>

        <nav className="space-y-2">
          <Item to="/dashboard" label="Dashboard" />
          <Item to="/lands" label="Terenuri" />
          <Item to="/sensors" label="Senzori" />
          <Item to="/economics" label="Economie" />
          <Item to="/alerts" label="Alerte" />
          <Item to="/analytics" label="Analize" />
          
          {isAdmin && (
            <>
              <div className="my-3 border-t border-slate-900/10"></div>
              <div className="px-4 py-2 text-xs muted font-semibold uppercase">Admin</div>
              <Item to="/admin/users" label="Utilizatori" />
              <Item to="/admin/settings" label="Setări sistem" />
            </>
          )}
          
          <div className="my-3 border-t border-slate-900/10"></div>
          <Item to="/profile" label="Profil" />
        </nav>

        <div className="mt-6 card-soft p-4">
          <div className="text-xs muted">Versiune</div>
          <div className="font-semibold text-[hsl(var(--primary))]">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
}