import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  Wheat,
  Bell,
  BarChart3,
  User,
  Users,
  Settings,
  Mail,
  X,
  Sparkles,
  Landmark,
  Globe,
} from "lucide-react";
import { authStore } from "../../auth/auth.store";
import logo from "../../assets/agrione.png";
import { prefetchByPath } from "../../router/chunks";
import { useLanguage } from "../../i18n/LanguageProvider";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/lands", label: "Terenuri", icon: Tractor },
  { to: "/app/sensors", label: "Senzori", icon: Sprout },
  { to: "/app/economics", label: "Economie", icon: Wheat },
  { to: "/app/alerts", label: "Alerte", icon: Bell },
  { to: "/app/analytics", label: "Analize", icon: BarChart3 },
  { to: "/app/apia", label: "APIA", icon: Landmark },
];

const adminItems = [
  { to: "/app/admin/users", label: "Utilizatori", icon: Users },
  { to: "/app/admin/settings", label: "Setări sistem", icon: Settings },
  { to: "/app/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sections = [
    { items: navItems },
    ...(isAdmin
      ? [{ label: "Admin", items: adminItems }]
      : []),
    { items: [{ to: "/app/profile", label: "Profil", icon: User }] },
  ];

  let itemIndex = 0;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 z-50 bg-card/80 backdrop-blur-2xl border-r border-border/50 shadow-[0_8px_64px_rgba(0,0,0,0.3)] md:relative md:z-auto md:shadow-none relative overflow-hidden"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-blue-500/5 opacity-40 pointer-events-none" />

        {/* Animated shimmer */}
        <Motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(135deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <Motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <Motion.div
                className="w-8 h-8 rounded-lg overflow-hidden relative"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(16, 185, 129, 0.3)",
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                    "0 0 0px rgba(16, 185, 129, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src={logo} alt="AgriOne" className="w-8 h-8 rounded-lg" />
              </Motion.div>
              <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                AgriOne
              </span>
            </Motion.div>
            <Motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all relative group"
            >
              <Motion.div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <X className="w-5 h-5 relative z-10" />
            </Motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                {sIdx > 0 && <div className="my-3 border-t border-border/10" />}
                {section.label && (
                  <div className="px-4 py-2 text-xs text-muted-foreground font-semibold uppercase">
                    {section.label}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const idx = itemIndex++;
                  const isActive =
                    location.pathname === item.to ||
                    (item.to !== "/profile" && location.pathname.startsWith(item.to + "/"));

                  return (
                    <Motion.div
                      key={item.to}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => { if (!isDesktop) onClose(); }}
                        onMouseEnter={() => prefetchByPath(item.to)}
                        onFocus={() => prefetchByPath(item.to)}
                        className="block"
                      >
                        <Motion.div
                          whileHover={{ x: 6, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl relative overflow-hidden transition-all duration-300 ${
                            isActive
                              ? "text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-primary/20"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Motion.div
                                layoutId="activeNav"
                                className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90 rounded-xl"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                              <Motion.div
                                className="absolute inset-0 rounded-xl"
                                animate={{
                                  boxShadow: [
                                    "0 0 20px rgba(34, 197, 94, 0.3)",
                                    "0 0 40px rgba(34, 197, 94, 0.5)",
                                    "0 0 20px rgba(34, 197, 94, 0.3)",
                                  ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <Motion.div
                                className="absolute inset-0"
                                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{
                                  background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.15), transparent)",
                                  backgroundSize: "200% 200%",
                                }}
                              />
                            </>
                          ) : null}
                          <Motion.div
                            animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="w-5 h-5 relative z-10" />
                          </Motion.div>
                          <span className="font-medium relative z-10">{item.label}</span>
                          {isActive ? (
                            <Motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="ml-auto relative z-10"
                            >
                              <Sparkles className="w-4 h-4" />
                            </Motion.div>
                          ) : null}
                        </Motion.div>
                      </NavLink>
                    </Motion.div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <Motion.div
            className="p-4 border-t border-border/50 space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Motion.a
              href="/"
              onClick={() => { if (!isDesktop) onClose(); }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{t('ui.navigation.landingPage')}</span>
            </Motion.a>
            <Motion.div
              whileHover={{ scale: 1.02 }}
              className="px-4 py-3 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm"
            >
              <p className="text-xs text-muted-foreground mb-1">Versiune</p>
              <p className="text-sm font-medium text-primary">v1.0.0</p>
            </Motion.div>
          </Motion.div>
        </div>
      </Motion.aside>
    </>
  );
}
