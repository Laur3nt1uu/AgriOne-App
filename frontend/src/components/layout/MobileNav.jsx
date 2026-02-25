import { NavLink } from "react-router-dom";

const Tab = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex-1 text-center py-3 rounded-2xl mx-1 transition border
       ${isActive ? "bg-[hsl(var(--primary)/0.10)] border-[hsl(var(--primary)/0.20)] text-slate-900" : "border-transparent text-slate-700 hover:bg-slate-900/5"}`
    }
  >
    {label}
  </NavLink>
);

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="glass rounded-2xl p-2 flex">
        <Tab to="/lands" label="Terenuri" />
        <Tab to="/sensors" label="Senzori" />
        <Tab to="/analytics" label="Analize" />
        <Tab to="/profile" label="Profil" />
      </div>
    </div>
  );
}