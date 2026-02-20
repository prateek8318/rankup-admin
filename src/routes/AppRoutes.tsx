import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard/Dashboard";
import LoginPage from "@/pages/Auth/LoginPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import TwoStepVerificationPage from "@/pages/Auth/TwoStepVerificationPage";
import Users from "@/pages/users/Users";
import ExamsManagement from "@/pages/exams/ExamsManagement";
import Subscriptions from "@/pages/subscriptions/Subscriptions";
import Coupon from "@/pages/coupon/Coupon";
import DailyVideo from "@/pages/dailyVideo/DailyVideo";
import Support from "@/pages/support/Support";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";
import CMSManagement from "@/pages/cms/CMSManagement";
import CMSDetailPage from "@/pages/cms/CMSDetailPage";
import Master from "@/pages/master/Master";
import Languages from "@/pages/master/Languages";
import States from "@/pages/master/States";
import Countries from "@/pages/master/Countries";
import Categories from "@/pages/master/Categories";
import Qualifications from "@/pages/master/Qualifications";
import Streams from "@/pages/master/Streams";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: "/two-step-verification",
    element: (
      <AuthLayout>
        <TwoStepVerificationPage />
      </AuthLayout>
    ),
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
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "exams-management", element: <ExamsManagement /> },
      { path: "subscriptions", element: <Subscriptions /> },
      { path: "coupon", element: <Coupon /> },
      { path: "daily-video", element: <DailyVideo /> },
      { path: "support", element: <Support /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "cms", element: <CMSManagement /> },
      { path: "cms/:id", element: <CMSDetailPage /> },
      { 
        path: "master", 
        element: <Master />,
        children: [
          { path: "languages", element: <Languages /> },
          { path: "states", element: <States /> },
          { path: "countries", element: <Countries /> },
          { path: "categories", element: <Categories /> },
          { path: "qualifications", element: <Qualifications /> },
          { path: "streams", element: <Streams /> }
        ]
      },
    ],
  },
]);

const AppRoutes = () => {
  return null; // Router is handled by RouterProvider in App.tsx
};

export default AppRoutes;
