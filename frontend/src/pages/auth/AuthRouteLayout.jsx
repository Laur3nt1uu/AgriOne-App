import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { authStore } from "../../auth/auth.store";

export default function AuthRouteLayout() {
  const loc = useLocation();
  const reduceMotion = useReducedMotion();

  // Redirect authenticated users away from login/register (but allow password reset flow)
  const isResetFlow = loc.pathname.includes("forgot-password") || loc.pathname.includes("reset-password");
  if (authStore.isAuthed() && !authStore.isExpired() && !isResetFlow) {
    return <Navigate to="/app/dashboard" replace />;
  }

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
