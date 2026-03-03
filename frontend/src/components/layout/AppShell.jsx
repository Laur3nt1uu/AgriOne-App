import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";
import NexusAtmosphere from "./NexusAtmosphere";

export default function AppShell() {
  const loc = useLocation();
  const navigationType = useNavigationType();
  const reduceMotion = useReducedMotion();
  const scrollPositionsRef = useRef(new Map());

  useLayoutEffect(() => {
    // Save scroll position for the current location before it changes.
    return () => {
      try {
        scrollPositionsRef.current.set(loc.key, window.scrollY || 0);
      } catch {
        // ignore
      }
    };
  }, [loc.key]);

  useLayoutEffect(() => {
    // On normal navigation, start at top.
    // On back/forward, restore the previous scroll position if available.
    try {
      if (navigationType === "POP") {
        const y = scrollPositionsRef.current.get(loc.key);
        window.scrollTo(0, typeof y === "number" ? y : 0);
      } else {
        window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen text-foreground relative">
      <NexusAtmosphere className="-z-10" />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="p-4 md:p-8 pb-24 md:pb-8">
            <Motion.div
              key={loc.pathname}
              style={{ willChange: "opacity" }}
              initial={initial}
              animate={animate}
              transition={transition}
            >
              <Outlet />
            </Motion.div>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}