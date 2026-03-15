import { NavLink, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  Wheat,
  Bell,
  BarChart3,
  Landmark,
} from "lucide-react";
import { prefetchByPath } from "../../router/chunks";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/lands", label: "Terenuri", icon: Tractor },
  { to: "/app/sensors", label: "Senzori", icon: Sprout },
  { to: "/app/economics", label: "Economie", icon: Wheat },
  { to: "/app/alerts", label: "Alerte", icon: Bell },
  { to: "/app/analytics", label: "Analize", icon: BarChart3 },
  { to: "/app/apia", label: "APIA", icon: Landmark },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <Motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-2xl border-t border-border/50 md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Shimmer effect */}
      <Motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
      />

      <div className="flex items-center justify-around px-2 py-2 relative z-10">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => prefetchByPath(item.to)}
              onFocus={() => prefetchByPath(item.to)}
            >
              <Motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 min-w-[44px] relative ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive ? (
                  <>
                    <Motion.div
                      layoutId="bottomNav"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <Motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.2)",
                          "0 0 20px rgba(34, 197, 94, 0.3)",
                          "0 0 10px rgba(34, 197, 94, 0.2)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                ) : null}
                <Motion.div
                  animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <Icon className="w-5 h-5" />
                </Motion.div>
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </Motion.div>
            </NavLink>
          );
        })}
      </div>
    </Motion.nav>
  );
}
