import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "./auth.store";

export default function RequireAuth({ children }) {
  const loc = useLocation();

  // Check both authentication and session expiry
  if (!authStore.isAuthed() || authStore.isExpired()) {
    if (authStore.isExpired()) {
      authStore.logout(); // Clean up expired session
    }
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: { pathname: loc.pathname, search: loc.search, hash: loc.hash } }}
      />
    );
  }
  return children;
}