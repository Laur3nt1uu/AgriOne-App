import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import RequireAdmin from "../auth/RequireAdmin";
import AppShell from "../components/layout/AppShell";
import AuthRouteLayout from "../pages/auth/AuthRouteLayout";
import {
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
} from "./chunks";

const LoginPage = lazy(loadLoginPage);
const RegisterPage = lazy(loadRegisterPage);
const ForgotPasswordPage = lazy(loadForgotPasswordPage);
const ResetPasswordPage = lazy(loadResetPasswordPage);

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

function suspense(el) {
  return (
    <Suspense fallback={<div className="py-10 text-sm muted">Se încarcă…</div>}>
      {el}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRouteLayout />,
    children: [
      { path: "login", element: suspense(<LoginPage />) },
      { path: "register", element: suspense(<RegisterPage />) },
      { path: "forgot-password", element: suspense(<ForgotPasswordPage />) },
      { path: "reset-password", element: suspense(<ResetPasswordPage />) },
    ],
  },

  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: suspense(<DashboardPage />) },
      { path: "lands", element: suspense(<LandsPage />) },
      { path: "lands/:id", element: suspense(<LandDetailsPage />) },
      { path: "sensors", element: suspense(<SensorsPage />) },
      { path: "economics", element: suspense(<EconomicsPage />) },
      { path: "alerts", element: suspense(<AlertsPage />) },
      { path: "analytics", element: suspense(<AnalyticsPage />) },
      { path: "profile", element: suspense(<ProfilePage />) },
      { path: "lands/new", element: suspense(<AddLandPage />) },
      { 
        path: "admin/users", 
        element: <RequireAdmin>{suspense(<UsersManagementPage />)}</RequireAdmin> 
      },
      { 
        path: "admin/settings", 
        element: <RequireAdmin>{suspense(<SystemSettingsPage />)}</RequireAdmin> 
      },
    ],
  },
]);