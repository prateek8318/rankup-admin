import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: [string, string];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requiredPermission }) => {
  const { auth, hasPermission } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRole && !requiredPermission) {
    return <>{children}</>;
  }

  if (requiredRole && auth.user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermission &&
    (!auth.user || !hasPermission(...requiredPermission))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
