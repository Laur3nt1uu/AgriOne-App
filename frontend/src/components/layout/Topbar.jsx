import { useLocation, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { Badge } from "../../ui/badge";

const titleMap = {
  "/dashboard": "Dashboard",
  "/lands": "Terenurile mele",
  "/sensors": "Monitorizare senzori",
  "/economics": "Economie",
  "/alerts": "Alerte",
  "/analytics": "Analize",
  "/profile": "Profil",
};

export default function Topbar() {
  const loc = useLocation();
  const nav = useNavigate();

  const base = "/" + (loc.pathname.split("/")[1] || "dashboard");
  const title = titleMap[base] || "AgriOne";

  const user = authStore.getUser();
  const initial = (user?.email || "U")[0]?.toUpperCase?.() || "U";

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/15">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <div className="text-xl md:text-2xl font-extrabold">{title}</div>
          <div className="text-xs md:text-sm muted">Agricultură inteligentă</div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">
            <span className="dot dot-online" />
            <span>Online</span>
          </Badge>

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
                  {user?.email || "Cont"}
                </span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="glass p-2 w-[240px] shadow-xl"
              >
                <div className="px-3 py-2">
                  <div className="text-xs muted">Conectat ca</div>
                  <div className="text-sm font-extrabold truncate">{user?.email || "—"}</div>
                </div>

                <div className="my-2 border-t border-border/10" />

                <DropdownMenu.Item
                  onSelect={() => nav("/profile")}
                  className="px-3 py-2 rounded-2xl cursor-pointer outline-none hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 flex items-center gap-2"
                >
                  <UserIcon size={16} className="text-muted-foreground" />
                  <span className="text-sm font-semibold">Profil</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={() => {
                    authStore.logout();
                    nav("/login", { replace: true });
                  }}
                  className="px-3 py-2 rounded-2xl cursor-pointer outline-none hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 flex items-center gap-2"
                >
                  <LogOut size={16} className="text-muted-foreground" />
                  <span className="text-sm font-semibold">Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}