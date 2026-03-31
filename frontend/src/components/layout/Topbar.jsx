import { useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Menu, User as UserIcon, Sun, Moon, Globe, Crown } from "lucide-react";
import { api } from "../../api/endpoints";
import { authStore } from "../../auth/auth.store";
import { useTheme } from "../../theme/ThemeProvider";
import { Badge } from "../../ui/badge";
import { StatusBadge } from "../agri/StatusBadge";
import { useTranslation } from "react-i18next";

const titleMap = {
  "/app/dashboard": "Dashboard",
  "/app/lands": "Terenurile mele",
  "/app/sensors": "Monitorizare senzori",
  "/app/economics": "Economie",
  "/app/alerts": "Alerte",
  "/app/analytics": "Analize",
  "/app/apia": "APIA",
  "/app/profile": "Profil",
};

export default function Topbar({ onMenuClick }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const pathParts = loc.pathname.split("/");
  const base = pathParts.length >= 3 && pathParts[1] === "app" ?
    "/" + pathParts[1] + "/" + pathParts[2] :
    "/app/dashboard";
  const title = titleMap[base] || "AgriOne";

  const user = authStore.getUser();
  const displayName =
    user?.name ||
    user?.username ||
    (user?.email ? String(user.email).split("@")[0] : "") ||
    (user?.role === "ADMIN" ? "Administrator" : "Utilizator");
  const initial = (displayName || "U")[0]?.toUpperCase?.() || "U";

  const handleLogout = async () => {
    try {
      const refreshToken = authStore.getRefreshToken();
      if (refreshToken) {
        await api.auth.logout({ refreshToken }).catch(() => {});
      }
    } finally {
      authStore.logout();
      nav("/", { replace: true });
    }
  };

  return (
    <Motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-card/60 backdrop-blur-2xl border-b border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-50 pointer-events-none" />

      {/* Shimmer effect */}
      <Motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
      />

      <div className="px-4 md:px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all relative group"
          >
            <Motion.div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Menu className="w-6 h-6 relative z-10" />
          </Motion.button>
          <div>
            <Motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl font-extrabold"
            >
              {title}
            </Motion.div>
            <div className="text-xs md:text-sm muted">Agricultură inteligentă</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status="online" />

          <Motion.button
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-card/60 transition-colors"
            title={theme === 'light' ? t('ui.theme.switchToDark') : t('ui.theme.switchToLight')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </Motion.button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="h-10 inline-flex items-center gap-2 rounded-2xl bg-card/50 border border-border/15 px-3 hover:bg-card/60 transition"
                aria-label="User menu"
              >
                <span className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <span className="text-foreground font-extrabold text-sm">{initial}</span>
                </span>
                <span className="hidden sm:block text-sm font-semibold text-foreground/90 max-w-[160px] truncate">
                  {displayName}
                </span>
                {user?.role ? (
                  <span className="hidden md:inline-flex">
                    <Badge variant={user.role === "ADMIN" ? "success" : "default"}>{user.role}</Badge>
                  </span>
                ) : null}
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-50 w-64 max-w-[90vw] rounded-2xl border border-border/30 bg-card backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.25)] p-1.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
              >
                {/* User info header */}
                <div className="px-3.5 py-3 rounded-xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-extrabold text-sm">{initial}</span>
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-foreground truncate">{displayName}</div>
                      <div className="text-xs text-muted-foreground truncate">{user?.email || "—"}</div>
                    </div>
                  </div>
                  {user?.role || user?.plan ? (
                    <div className="mt-2.5 flex items-center gap-2">
                      {user?.role ? (
                        <Badge variant={user.role === "ADMIN" ? "success" : "default"}>{user.role}</Badge>
                      ) : null}
                      {user?.plan ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                          <Crown size={10} />
                          {user.plan}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="my-1.5" />

                <DropdownMenu.Item
                  onSelect={() => nav("/")}
                  className="px-3.5 py-2.5 rounded-xl cursor-pointer outline-none hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 flex items-center gap-3 transition-colors"
                >
                  <Globe size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{t('ui.navigation.landingPage')}</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => nav("/app/profile")}
                  className="px-3.5 py-2.5 rounded-xl cursor-pointer outline-none hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 flex items-center gap-3 transition-colors"
                >
                  <UserIcon size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Profil</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => nav("/app/plan")}
                  className="px-3.5 py-2.5 rounded-xl cursor-pointer outline-none hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 flex items-center gap-3 transition-colors"
                >
                  <Crown size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Schimbă planul</span>
                </DropdownMenu.Item>

                <div className="my-1.5 mx-2 border-t border-border/15" />

                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl cursor-pointer outline-none hover:bg-red-500/10 data-[highlighted]:bg-red-500/10 flex items-center gap-3 transition-colors group"
                >
                  <LogOut size={16} className="text-muted-foreground group-hover:text-red-400 group-data-[highlighted]:text-red-400 transition-colors" />
                  <span className="text-sm font-medium group-hover:text-red-400 group-data-[highlighted]:text-red-400 transition-colors">Deconectare</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </Motion.header>
  );
}
