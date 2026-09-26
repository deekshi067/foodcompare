// src/components/ProtectedRoute.jsx
// ------------------------------------------------------------------
// Wraps a page and redirects to /login if nobody is signed in.
// Usage:  <ProtectedRoute><Favorites /></ProtectedRoute>
// ------------------------------------------------------------------

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While we're still checking localStorage for a saved session, show
  // a loader instead of immediately redirecting (avoids a flash-redirect).
  if (loading) return <Loader />;

  if (!isAuthenticated) {
    // "state" lets the Login page know where to send the user back to
    // after they successfully log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
