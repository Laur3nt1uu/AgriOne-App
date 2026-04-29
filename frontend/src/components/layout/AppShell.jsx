import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNavigation";
import NexusAtmosphere from "./NexusAtmosphere";
import { ConfirmProvider } from "../confirm/ConfirmProvider";
import LoadingScreen from "../LoadingScreen";
import { AIChatWidget } from "../ai/AIChatWidget";

export default function AppShell() {
  const loc = useLocation();
  const navigationType = useNavigationType();
  const reduceMotion = useReducedMotion();
  const scrollPositionsRef = useRef(new Map());
  const mainRef = useRef(null);
  const lenisRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Lenis smooth scroll on the main scrollable area
  useEffect(() => {
    const el = mainRef.current;
    if (!el || reduceMotion) return;

    const lenis = new Lenis({
      wrapper: el,
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [showSplash, reduceMotion]);

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
        const pos = typeof y === "number" ? y : 0;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(pos, { immediate: true });
        } else {
          el.scrollTo(0, pos);
        }
      } else {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          el.scrollTo(0, 0);
        }
      }
    } catch {
      // ignore
    }
  }, [loc.key, navigationType]);

  const initial = reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

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

          <main ref={mainRef} className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-[1600px] mx-auto w-full">
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

        {/* AI Chat Widget */}
        <AIChatWidget />
      </div>
    </ConfirmProvider>
  );
}
