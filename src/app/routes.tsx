import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Layout from "@/shared/components/layout/Layout";
import { DashboardPage } from "@/features/dashboard";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import TwoStepVerificationPage from "@/features/auth/pages/TwoStepVerificationPage";
import Users from "@/pages/users/Users";
import ExamsManagement from "@/pages/exams/ExamsManagement";
import Subscriptions from "@/pages/subscriptions/Subscriptions";
import Coupon from "@/pages/coupon/Coupon";
import DailyVideo from "@/pages/dailyVideo/DailyVideo";
import Support from "@/pages/support/Support";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";
import CMS from "@/pages/cms/CMS";
import Master from "@/pages/master/Master";
import Languages from "@/pages/master/Languages";
import States from "@/pages/master/States";
import Countries from "@/pages/master/Countries";
import Categories from "@/pages/master/Categories";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/two-step-verification",
    element: <TwoStepVerificationPage />,
  },
  {
    path: "/users",
    element: <Navigate to="/home/users" replace />,
  },
  {
    path: "/exams",
    element: <Navigate to="/home/exams-management" replace />,
  },
  {
    path: "/exams-management",
    element: <Navigate to="/home/exams-management" replace />,
  },
  {
    path: "/cms",
    element: <Navigate to="/home/cms" replace />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <Users /> },
      { path: "exams-management", element: <ExamsManagement /> },
      { path: "subscriptions", element: <Subscriptions /> },
      { path: "coupon", element: <Coupon /> },
      { path: "daily-video", element: <DailyVideo /> },
      { path: "support", element: <Support /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "cms", element: <CMS /> },
      { 
        path: "master", 
        element: <Master />,
        children: [
          { path: "languages", element: <Languages /> },
          { path: "states", element: <States /> },
          { path: "countries", element: <Countries /> },
          { path: "categories", element: <Categories /> }
        ]
      },
    ],
  },
]);
