import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function onHashClick(e) {
      const href = e.target.closest("a[href^='#'], button[data-scroll-to]");
      if (!href) return;
      const target = href.getAttribute("href") || href.dataset.scrollTo;
      if (!target || !target.startsWith("#")) return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
    }
    document.addEventListener("click", onHashClick, { capture: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", onHashClick, { capture: true });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
