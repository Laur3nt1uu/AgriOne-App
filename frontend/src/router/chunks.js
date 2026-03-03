// Centralized dynamic imports for route-level code splitting.
// Keeps router + UI components free from circular dependencies.

export const loadLoginPage = () => import("../pages/auth/LoginPage");
export const loadRegisterPage = () => import("../pages/auth/RegisterPage");
export const loadForgotPasswordPage = () => import("../pages/auth/ForgotPasswordPage");
export const loadResetPasswordPage = () => import("../pages/auth/ResetPasswordPage");

export const loadDashboardPage = () => import("../pages/app/DashboardPage");
export const loadLandsPage = () => import("../pages/app/LandsPage");
export const loadLandDetailsPage = () => import("../pages/app/LandDetailsPage");
export const loadSensorsPage = () => import("../pages/app/SensorsPage");
export const loadEconomicsPage = () => import("../pages/app/EconomicsPage");
export const loadAlertsPage = () => import("../pages/app/AlertsPage");
export const loadAnalyticsPage = () => import("../pages/app/AnalyticsPage");
export const loadProfilePage = () => import("../pages/app/ProfilePage");
export const loadAddLandPage = () => import("../pages/app/AddLandPage");
export const loadUsersManagementPage = () => import("../pages/app/admin/UsersManagementPage");
export const loadSystemSettingsPage = () => import("../pages/app/admin/SystemSettingsPage");

function safePrefetch(loader) {
  try {
    const p = loader?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    // ignore
  }
}

export function prefetchByPath(path) {
  const p = String(path || "");

  if (p.startsWith("/login")) return safePrefetch(loadLoginPage);
  if (p.startsWith("/register")) return safePrefetch(loadRegisterPage);
  if (p.startsWith("/forgot-password")) return safePrefetch(loadForgotPasswordPage);
  if (p.startsWith("/reset-password")) return safePrefetch(loadResetPasswordPage);

  if (p === "/" || p.startsWith("/dashboard")) return safePrefetch(loadDashboardPage);
  if (p.startsWith("/lands/new")) return safePrefetch(loadAddLandPage);
  if (p.startsWith("/lands/")) return safePrefetch(loadLandDetailsPage);
  if (p.startsWith("/lands")) return safePrefetch(loadLandsPage);
  if (p.startsWith("/sensors")) return safePrefetch(loadSensorsPage);
  if (p.startsWith("/economics")) return safePrefetch(loadEconomicsPage);
  if (p.startsWith("/alerts")) return safePrefetch(loadAlertsPage);
  if (p.startsWith("/analytics")) return safePrefetch(loadAnalyticsPage);
  if (p.startsWith("/profile")) return safePrefetch(loadProfilePage);
  if (p.startsWith("/admin/users")) return safePrefetch(loadUsersManagementPage);
  if (p.startsWith("/admin/settings")) return safePrefetch(loadSystemSettingsPage);
}

export function prefetchCommonAppRoutes() {
  // Prefetch the most-used pages so first navigation is instant.
  // Intentionally exclude heavier/rarer routes (maps/admin) from eager prefetch.
  [
    loadDashboardPage,
    loadLandsPage,
    loadSensorsPage,
    loadAlertsPage,
    loadAnalyticsPage,
    loadProfilePage,
  ].forEach(safePrefetch);
}
