import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "./auth.store";

export default function RequireAuth({ children }) {
  const loc = useLocation();
  if (!authStore.isAuthed()) {
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