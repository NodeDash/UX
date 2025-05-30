import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "./ui/loading-spinner";

/**
 * ProtectedRoute component that verifies authentication status
 * before rendering child routes.
 *
 * Redirects to login if the user is not authenticated.
 * Shows a loading spinner while authentication state is being determined.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication status is being checked
  if (isLoading) {
    return (
      <LoadingSpinner
        fullPage={true}
        size="lg"
        message="Verifying authentication..."
      />
    );
  }

  // If not authenticated, redirect to login with the current path in the redirect parameter
  if (!isAuthenticated) {
    const redirectPath = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}
