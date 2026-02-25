import { Navigate } from "react-router-dom";
import { authStore } from "./auth.store";

export default function RequireAdmin({ children }) {
  const user = authStore.getUser();
  
  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
