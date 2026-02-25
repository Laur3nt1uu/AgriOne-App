import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import RequireAdmin from "../auth/RequireAdmin";
import AppShell from "../components/layout/AppShell";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import DashboardPage from "../pages/app/DashboardPage";
import LandsPage from "../pages/app/LandsPage";
import LandDetailsPage from "../pages/app/LandDetailsPage";
import SensorsPage from "../pages/app/SensorsPage";
import EconomicsPage from "../pages/app/EconomicsPage";
import AlertsPage from "../pages/app/AlertsPage";
import AnalyticsPage from "../pages/app/AnalyticsPage";
import ProfilePage from "../pages/app/ProfilePage";
import AddLandPage from "../pages/app/AddLandPage";
import UsersManagementPage from "../pages/app/admin/UsersManagementPage";
import SystemSettingsPage from "../pages/app/admin/SystemSettingsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "lands", element: <LandsPage /> },
      { path: "lands/:id", element: <LandDetailsPage /> },
      { path: "sensors", element: <SensorsPage /> },
      { path: "economics", element: <EconomicsPage /> },
      { path: "alerts", element: <AlertsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "lands/new", element: <AddLandPage /> },
      { path: "sensors", element: <SensorsPage /> },
      { 
        path: "admin/users", 
        element: <RequireAdmin><UsersManagementPage /></RequireAdmin> 
      },
      { 
        path: "admin/settings", 
        element: <RequireAdmin><SystemSettingsPage /></RequireAdmin> 
      },
    ],
  },
]);