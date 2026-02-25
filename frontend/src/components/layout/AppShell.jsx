import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

export default function AppShell() {
  const loc = useLocation();

  return (
    <div className="min-h-screen text-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="p-4 md:p-8 pb-24 md:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <Motion.div
                key={loc.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Outlet />
              </Motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}