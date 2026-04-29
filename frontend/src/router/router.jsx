import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import RequireAdmin from "../auth/RequireAdmin";
import AppShell from "../components/layout/AppShell";
import AuthRouteLayout from "../pages/auth/AuthRouteLayout";
import {
  loadLandingPage,
  loadLoginPage,
  loadRegisterPage,
  loadForgotPasswordPage,
  loadResetPasswordPage,
  loadDashboardPage,
  loadLandsPage,
  loadLandDetailsPage,
  loadSensorsPage,
  loadEconomicsPage,
  loadAlertsPage,
  loadAnalyticsPage,
  loadProfilePage,
  loadAddLandPage,
  loadUsersManagementPage,
  loadSystemSettingsPage,
  loadNewsletterPage,
  loadApiaPage,
  loadPlanPage,
  loadNotFoundPage,
  loadDocumentationPage,
  loadBlogPage,
  loadHelpCenterPage,
  loadCommunityPage,
  loadUnsubscribePage,
  loadAuthCallbackPage,
  loadAuthRedirectPage,
  loadPrivacyPolicyPage,
  loadTermsPage,
  loadGdprPage,
} from "./chunks";

const LandingPage = lazy(loadLandingPage);
const LoginPage = lazy(loadLoginPage);
const RegisterPage = lazy(loadRegisterPage);
const ForgotPasswordPage = lazy(loadForgotPasswordPage);
const ResetPasswordPage = lazy(loadResetPasswordPage);
const AuthCallbackPage = lazy(loadAuthCallbackPage);
const AuthRedirectPage = lazy(loadAuthRedirectPage);

const DashboardPage = lazy(loadDashboardPage);
const LandsPage = lazy(loadLandsPage);
const LandDetailsPage = lazy(loadLandDetailsPage);
const SensorsPage = lazy(loadSensorsPage);
const EconomicsPage = lazy(loadEconomicsPage);
const AlertsPage = lazy(loadAlertsPage);
const AnalyticsPage = lazy(loadAnalyticsPage);
const ProfilePage = lazy(loadProfilePage);
const AddLandPage = lazy(loadAddLandPage);
const UsersManagementPage = lazy(loadUsersManagementPage);
const SystemSettingsPage = lazy(loadSystemSettingsPage);
const NewsletterPage = lazy(loadNewsletterPage);
const ApiaPage = lazy(loadApiaPage);
const PlanPage = lazy(loadPlanPage);
const NotFoundPage = lazy(loadNotFoundPage);

// Resource pages
const DocumentationPage = lazy(loadDocumentationPage);
const BlogPage = lazy(loadBlogPage);
const HelpCenterPage = lazy(loadHelpCenterPage);
const CommunityPage = lazy(loadCommunityPage);
const UnsubscribePage = lazy(loadUnsubscribePage);

// Legal pages
const PrivacyPolicyPage = lazy(loadPrivacyPolicyPage);
const TermsPage = lazy(loadTermsPage);
const GdprPage = lazy(loadGdprPage);

function suspense(el) {
  return (
    <Suspense fallback={<div className="py-10 text-sm muted">Se încarcă…</div>}>
      {el}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // Landing Page (Public Marketing)
  {
    path: "/",
    element: suspense(<LandingPage />),
  },

  // Auth Routes (Public Authentication)
  {
    path: "/auth",
    element: <AuthRouteLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: suspense(<LoginPage />) },
      { path: "register", element: suspense(<RegisterPage />) },
      { path: "forgot-password", element: suspense(<ForgotPasswordPage />) },
      { path: "reset-password", element: suspense(<ResetPasswordPage />) },
      { path: "callback", element: suspense(<AuthCallbackPage />) },
      { path: "redirect", element: suspense(<AuthRedirectPage />) },
    ],
  },

  // Resource Pages (Public)
  {
    path: "/docs",
    element: suspense(<DocumentationPage />),
  },
  {
    path: "/blog",
    element: suspense(<BlogPage />),
  },
  {
    path: "/help",
    element: suspense(<HelpCenterPage />),
  },
  {
    path: "/community",
    element: suspense(<CommunityPage />),
  },
  {
    path: "/newsletter/unsubscribe/:token",
    element: suspense(<UnsubscribePage />),
  },

  // Legal Pages (Public)
  {
    path: "/privacy",
    element: suspense(<PrivacyPolicyPage />),
  },
  {
    path: "/terms",
    element: suspense(<TermsPage />),
  },
  {
    path: "/gdpr",
    element: suspense(<GdprPage />),
  },

  // App Routes (Authenticated Application)
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: suspense(<DashboardPage />) },
      { path: "lands", element: suspense(<LandsPage />) },
      { path: "lands/new", element: suspense(<AddLandPage />) },
      { path: "lands/:id", element: suspense(<LandDetailsPage />) },
      { path: "sensors", element: suspense(<SensorsPage />) },
      { path: "economics", element: suspense(<EconomicsPage />) },
      { path: "alerts", element: suspense(<AlertsPage />) },
      { path: "analytics", element: suspense(<AnalyticsPage />) },
      { path: "apia", element: suspense(<ApiaPage />) },
      { path: "profile", element: suspense(<ProfilePage />) },
      { path: "plan", element: suspense(<PlanPage />) },
      {
        path: "admin/users",
        element: <RequireAdmin>{suspense(<UsersManagementPage />)}</RequireAdmin>
      },
      {
        path: "admin/settings",
        element: <RequireAdmin>{suspense(<SystemSettingsPage />)}</RequireAdmin>
      },
      {
        path: "admin/newsletter",
        element: <RequireAdmin>{suspense(<NewsletterPage />)}</RequireAdmin>
      },
    ],
  },

  // 404 Catch-all
  {
    path: "*",
    element: suspense(<NotFoundPage />),
  },
]);
