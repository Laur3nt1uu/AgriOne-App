// Centralized dynamic imports for route-level code splitting.
// Keeps router + UI components free from circular dependencies.

export const loadLandingPage = () => import("../pages/LandingPage");

export const loadLoginPage = () => import("../pages/auth/LoginPage");
export const loadRegisterPage = () => import("../pages/auth/RegisterPage");
export const loadForgotPasswordPage = () => import("../pages/auth/ForgotPasswordPage");
export const loadResetPasswordPage = () => import("../pages/auth/ResetPasswordPage");
export const loadAuthCallbackPage = () => import("../pages/auth/AuthCallbackPage");
export const loadAuthRedirectPage = () => import("../pages/auth/AuthRedirectPage");

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
export const loadNewsletterPage = () => import("../pages/app/admin/NewsletterPage");
export const loadApiaPage = () => import("../pages/app/ApiaPage");
export const loadPlanPage = () => import("../pages/app/PlanPage");
export const loadNotFoundPage = () => import("../pages/NotFoundPage");

// Resource pages (public)
export const loadDocumentationPage = () => import("../pages/resources/DocumentationPage");
export const loadBlogPage = () => import("../pages/resources/BlogPage");
export const loadHelpCenterPage = () => import("../pages/resources/HelpCenterPage");
export const loadCommunityPage = () => import("../pages/resources/CommunityPage");
export const loadUnsubscribePage = () => import("../pages/newsletter/UnsubscribePage");

// Legal pages (public)
export const loadPrivacyPolicyPage = () => import("../pages/legal/PrivacyPolicyPage");
export const loadTermsPage = () => import("../pages/legal/TermsPage");
export const loadGdprPage = () => import("../pages/legal/GdprPage");

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

  // Landing page
  if (p === "/") return safePrefetch(loadLandingPage);

  // Auth routes
  if (p.startsWith("/auth/login")) return safePrefetch(loadLoginPage);
  if (p.startsWith("/auth/register")) return safePrefetch(loadRegisterPage);
  if (p.startsWith("/auth/forgot-password")) return safePrefetch(loadForgotPasswordPage);
  if (p.startsWith("/auth/reset-password")) return safePrefetch(loadResetPasswordPage);
  if (p.startsWith("/auth/callback")) return safePrefetch(loadAuthCallbackPage);
  if (p.startsWith("/auth/redirect")) return safePrefetch(loadAuthRedirectPage);

  // App routes
  if (p.startsWith("/app/dashboard") || p === "/app") return safePrefetch(loadDashboardPage);
  if (p.startsWith("/app/lands/new")) return safePrefetch(loadAddLandPage);
  if (p.startsWith("/app/lands/")) return safePrefetch(loadLandDetailsPage);
  if (p.startsWith("/app/lands")) return safePrefetch(loadLandsPage);
  if (p.startsWith("/app/sensors")) return safePrefetch(loadSensorsPage);
  if (p.startsWith("/app/economics")) return safePrefetch(loadEconomicsPage);
  if (p.startsWith("/app/alerts")) return safePrefetch(loadAlertsPage);
  if (p.startsWith("/app/analytics")) return safePrefetch(loadAnalyticsPage);
  if (p.startsWith("/app/apia")) return safePrefetch(loadApiaPage);
  if (p.startsWith("/app/profile")) return safePrefetch(loadProfilePage);
  if (p.startsWith("/app/plan")) return safePrefetch(loadPlanPage);
  if (p.startsWith("/app/admin/users")) return safePrefetch(loadUsersManagementPage);
  if (p.startsWith("/app/admin/settings")) return safePrefetch(loadSystemSettingsPage);
  if (p.startsWith("/app/admin/newsletter")) return safePrefetch(loadNewsletterPage);

  // Resource pages
  if (p.startsWith("/docs")) return safePrefetch(loadDocumentationPage);
  if (p.startsWith("/blog")) return safePrefetch(loadBlogPage);
  if (p.startsWith("/help")) return safePrefetch(loadHelpCenterPage);
  if (p.startsWith("/community")) return safePrefetch(loadCommunityPage);
  if (p.startsWith("/newsletter/unsubscribe")) return safePrefetch(loadUnsubscribePage);

  // Legacy paths support (for gradual migration)
  if (p.startsWith("/login")) return safePrefetch(loadLoginPage);
  if (p.startsWith("/register")) return safePrefetch(loadRegisterPage);
  if (p.startsWith("/forgot-password")) return safePrefetch(loadForgotPasswordPage);
  if (p.startsWith("/reset-password")) return safePrefetch(loadResetPasswordPage);
  if (p.startsWith("/dashboard")) return safePrefetch(loadDashboardPage);
  if (p.startsWith("/lands")) return safePrefetch(loadLandsPage);
  if (p.startsWith("/sensors")) return safePrefetch(loadSensorsPage);
  if (p.startsWith("/economics")) return safePrefetch(loadEconomicsPage);
  if (p.startsWith("/alerts")) return safePrefetch(loadAlertsPage);
  if (p.startsWith("/analytics")) return safePrefetch(loadAnalyticsPage);
  if (p.startsWith("/profile")) return safePrefetch(loadProfilePage);
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
