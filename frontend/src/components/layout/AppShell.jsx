import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNavigation";
import NexusAtmosphere from "./NexusAtmosphere";
import { ConfirmProvider } from "../confirm/ConfirmProvider";
import LoadingScreen from "../LoadingScreen";

export default function AppShell() {
  const loc = useLocation();
  const navigationType = useNavigationType();
  const reduceMotion = useReducedMotion();
  const scrollPositionsRef = useRef(new Map());
  const mainRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useLayoutEffect(() => {
    const positions = scrollPositionsRef.current;
    const el = mainRef.current;
    return () => {
      try {
        positions.set(loc.key, el ? el.scrollTop : 0);
      } catch {
        // ignore
      }
    };
  }, [loc.key]);

  useLayoutEffect(() => {
    try {
      const el = mainRef.current;
      if (!el) return;
      if (navigationType === "POP") {
        const y = scrollPositionsRef.current.get(loc.key);
        el.scrollTo(0, typeof y === "number" ? y : 0);
      } else {
        el.scrollTo(0, 0);
      }
    } catch {
      // ignore
    }
  }, [loc.key, navigationType]);

  const initial = reduceMotion ? { opacity: 1 } : { opacity: 0 };
  const animate = { opacity: 1 };
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.12, ease: [0.22, 1, 0.36, 1] };

  if (showSplash) {
    return <LoadingScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <ConfirmProvider>
      <div className="flex h-screen overflow-hidden bg-background relative">
        {/* Animated Background */}
        <NexusAtmosphere className="z-0" />

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main ref={mainRef} className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <div className="p-4 md:p-8">
              <Motion.div
                key={loc.pathname}
                style={{ willChange: "opacity" }}
                initial={initial}
                animate={animate}
                transition={transition}
              >
                <Outlet />
              </Motion.div>
            </div>
          </main>
        </div>

        {/* Bottom Navigation - Mobile */}
        <MobileNav />
      </div>
    </ConfirmProvider>
  );
}
