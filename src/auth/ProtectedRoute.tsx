import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

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

  // Allow access to dashboard without strict permission checks for now
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
