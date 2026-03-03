import { Outlet, useLocation } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";

export default function AuthRouteLayout() {
  const loc = useLocation();
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 1 } : { opacity: 0 };
  const animate = { opacity: 1 };
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.12, ease: [0.22, 1, 0.36, 1] };

  return (
    <Motion.div
      key={loc.pathname}
      style={{ willChange: "opacity" }}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <Outlet />
    </Motion.div>
  );
}
