/* eslint-disable */
import { Navigate, useLocation } from "react-router-dom";
import { RouteName } from "../../constants/routes";
import { getCookie } from "../../helper/getCookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = getCookie("token");

  if (!token) {
    // Redirect to login page but save the attempted location
    return <Navigate to={RouteName.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 